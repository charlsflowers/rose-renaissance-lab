import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function buildCacheKey(config: Record<string, string>): string {
  const parts = Object.entries(config)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}_${v}`)
    .join("--");
  return parts.replace(/[^a-zA-Z0-9_-]/g, "_");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase credentials not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { bouquetConfig, baseImageUrl } = await req.json();

    if (!bouquetConfig) {
      return new Response(
        JSON.stringify({ error: "bouquetConfig is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build cache key from configuration
    const cacheKey = buildCacheKey(bouquetConfig);
    const cachePath = `previews/${cacheKey}.png`;

    // Check if cached version exists
    const { data: existingFile } = await supabase.storage
      .from("bouquet-previews")
      .createSignedUrl(cachePath, 60);

    if (existingFile?.signedUrl) {
      // Verify file actually exists by checking the list
      const { data: fileList } = await supabase.storage
        .from("bouquet-previews")
        .list("previews", { search: `${cacheKey}.png` });

      if (fileList && fileList.length > 0) {
        const { data: publicUrl } = supabase.storage
          .from("bouquet-previews")
          .getPublicUrl(cachePath);

        console.log("Cache hit for:", cacheKey);
        return new Response(
          JSON.stringify({ imageUrl: publicUrl.publicUrl, cached: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Build the AI prompt from the configuration
    const promptParts: string[] = [
      "Edit this photo of a person holding a bouquet of roses.",
      "Replace ONLY the bouquet they are holding with the following bouquet:",
    ];

    if (bouquetConfig.bouquetType) {
      const typeMap: Record<string, string> = {
        classic: "a classic round bouquet",
        heart: "a heart-shaped bouquet",
        letters: "a bouquet with decorative letters",
        numbers: "a bouquet with decorative numbers",
      };
      promptParts.push(typeMap[bouquetConfig.bouquetType] || "a bouquet");
    }

    if (bouquetConfig.color) {
      promptParts.push(`The roses are ${bouquetConfig.color} colored.`);
    }

    if (bouquetConfig.roses) {
      promptParts.push(`The bouquet has approximately ${bouquetConfig.roses} roses.`);
    }

    if (bouquetConfig.glitter === "true") {
      promptParts.push("The roses have a glittery, sparkly finish.");
    }

    if (bouquetConfig.specialText) {
      promptParts.push(`The bouquet features the text "${bouquetConfig.specialText}" made of roses or decorative elements.`);
    }

    if (bouquetConfig.crown === "true") {
      promptParts.push("There is a small decorative crown on top of the bouquet.");
    }

    if (bouquetConfig.ribbon === "true" && bouquetConfig.ribbonText) {
      promptParts.push(`There is a ribbon around the bouquet that says "${bouquetConfig.ribbonText}".`);
    }

    promptParts.push(
      "Keep the person, their pose, the background, and lighting exactly the same.",
      "Only modify the bouquet. Make it look natural and realistic."
    );

    const prompt = promptParts.join(" ");

    // Use a placeholder base image if none provided
    // When user provides real photos, they will be stored and referenced here
    const imageUrl = baseImageUrl || "https://placehold.co/800x1000/ffefef/96103b?text=Base+Photo";

    console.log("Generating preview with prompt:", prompt);

    // Call Lovable AI to edit the image
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "Demasiadas peticiones. Inténtalo de nuevo en unos segundos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (status === 402) {
        return new Response(
          JSON.stringify({ error: "Preview no disponible en este momento." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", status, errText);
      throw new Error(`AI gateway error: ${status}`);
    }

    const aiData = await aiResponse.json();
    const generatedImage = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!generatedImage) {
      throw new Error("No image returned from AI");
    }

    // Extract base64 data and upload to storage for caching
    const base64Data = generatedImage.replace(/^data:image\/\w+;base64,/, "");
    const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    const { error: uploadError } = await supabase.storage
      .from("bouquet-previews")
      .upload(cachePath, imageBytes, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Cache upload error:", uploadError);
      // Still return the image even if caching fails
      return new Response(
        JSON.stringify({ imageUrl: generatedImage, cached: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: publicUrl } = supabase.storage
      .from("bouquet-previews")
      .getPublicUrl(cachePath);

    console.log("Generated and cached preview:", cacheKey);
    return new Response(
      JSON.stringify({ imageUrl: publicUrl.publicUrl, cached: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-bouquet-preview error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
