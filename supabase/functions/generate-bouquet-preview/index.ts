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
    const hasBaseImage = baseImageUrl && baseImageUrl.startsWith("http");

    const promptParts: string[] = hasBaseImage
      ? [
          "I am providing multiple images. The FIRST image is the base photo to edit. The subsequent images are EXACT color references for the roses.",
          "Edit the FIRST photo. The person is holding a bouquet of roses.",
          "Replace ONLY the color of the roses and the color of the wrapping paper.",
          "Do NOT change the person, their clothes, pose, hair, hands, the background, or the lighting. Keep the original structure of the bouquet.",
          "The new bouquet should have:",
        ]
      : [
          "I am providing reference images for the EXACT colors of the roses.",
          "Generate a photorealistic image of a person elegantly holding a bouquet of roses.",
          "The roses must match the colors in the provided reference images exactly.",
          "The bouquet should be:",
        ];

    if (bouquetConfig.color) {
      promptParts.push(`The roses must be exactly ${bouquetConfig.color} colored, matching the provided reference images.`);
    }

    if (bouquetConfig.paperColor) {
      promptParts.push(`The wrapping paper MUST BE ${bouquetConfig.paperColor} colored.`);
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

    if (hasBaseImage) {
      promptParts.push(
        "IMPORTANT: Keep the person, their pose, clothes, the background, and lighting EXACTLY the same.",
        "Change the roses colors and the wrapping paper color to match the instructions. Make the result look natural and photorealistic."
      );
    } else {
      promptParts.push(
        "The person should be elegantly dressed, holding the bouquet in front of them.",
        "Use soft, warm studio lighting. Make it look natural and photorealistic.",
        "The background should be a soft, blurred neutral tone."
      );
    }

    const prompt = promptParts.join(" ");

    console.log("Generating preview with prompt:", prompt);

    // Build message content: with or without base image
    const messageContent: any[] = [{ type: "text", text: prompt }];
    if (hasBaseImage) {
      messageContent.push({ type: "image_url", image_url: { url: baseImageUrl } });
    }

    const colorImageMap: Record<string, string> = {
      "rojo": "rojo",
      "hot pink": "hot-pink",
      "naranja": "naranja",
      "pink": "pink",
      "verde": "verde",
      "blanco": "blanco",
      "negro": "negro",
      "azul": "azul",
      "amarillo": "amarillo",
      "morado": "morado",
    };

    const selectedColors = bouquetConfig.color ? bouquetConfig.color.split(",").map((c: string) => c.trim().toLowerCase()) : [];
    if (selectedColors.length > 0) {
      for (const color of selectedColors) {
        // Handle "y" if present (e.g. "rojo y blanco")
        const cleanColor = color.replace(/^y\s+/, "");
        const imageName = colorImageMap[cleanColor];
        if (imageName) {
          const colorUrl = `https://urcocghysdjfawmfitzj.supabase.co/storage/v1/object/public/bouquet-previews/colors/${imageName}.png`;
          messageContent.push({ type: "image_url", image_url: { url: colorUrl } });
        }
      }
    }

    // Call Lovable AI to generate/edit the image
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: messageContent }],
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
