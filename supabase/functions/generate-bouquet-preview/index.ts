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

    const promptParts: string[] = [];
    const colorCount = bouquetConfig.color ? bouquetConfig.color.split(",").map((c: string) => c.trim()).length : 1;
    const hasMix = colorCount >= 2;

    if (hasMix) {
      // When mixing colors, we send: text + base image + mix pattern reference
      promptParts.push(
        "I am providing TWO images.",
        "IMAGE 1 is the BASE PHOTO you must edit. It shows a woman holding a bouquet of roses.",
        "IMAGE 2 is a PATTERN REFERENCE — it shows HOW the colors should be distributed and mixed across the bouquet. IGNORE the specific colors in this pattern image. IGNORE the background, vase, paper, logo, and everything else. Use it ONLY to understand the mixing pattern: how different colored roses are interspersed and distributed evenly throughout the bouquet.",
        "You MUST keep the woman, her pose, clothes, hair, hands, background, and lighting from IMAGE 1 EXACTLY as they are.",
        "Change ONLY the rose petal colors and the wrapping paper color."
      );
    } else {
      promptParts.push(
        "Edit this photo. This is the BASE PHOTO you must modify.",
        "The photo shows a woman holding a bouquet of roses wrapped in paper.",
        "You MUST keep the woman, her pose, her clothes, her hair, her hands, the background, and the lighting EXACTLY as they are.",
        "You MUST keep the shape, structure, and size of the bouquet EXACTLY the same.",
        "Change ONLY these two things:",
        "1. The COLOR of the rose petals.",
        "2. The COLOR of the wrapping paper.",
        "Everything else must remain IDENTICAL to the original photo."
      );
    }

    if (bouquetConfig.color) {
      const colors = bouquetConfig.color.split(",").map((c: string) => c.trim());
      if (colors.length === 1) {
        promptParts.push(`Change ALL the roses to ${colors[0]} color.`);
      } else {
        promptParts.push(`Change the roses to a MIX of: ${colors.join(", ")}. Distribute the colors evenly and randomly across the entire bouquet, following the mixing pattern from IMAGE 2. Each rose should be one solid color, but alternate between the chosen colors throughout.`);
      }
    }

    if (bouquetConfig.paperColor) {
      promptParts.push(`Change the wrapping paper to ${bouquetConfig.paperColor} color.`);
    }

    if (bouquetConfig.glitter === "true") {
      promptParts.push("Add a subtle glittery, sparkly finish to the rose petals.");
    }

    if (bouquetConfig.specialText) {
      promptParts.push(`Include the text "${bouquetConfig.specialText}" made of decorative elements within the bouquet.`);
    }

    if (bouquetConfig.crown === "true") {
      promptParts.push("Add a small decorative crown on top of the bouquet.");
    }

    if (bouquetConfig.ribbon === "true" && bouquetConfig.ribbonText) {
      promptParts.push(`Add a ribbon around the bouquet that says "${bouquetConfig.ribbonText}".`);
    }

    promptParts.push(
      "CRITICAL: Do NOT generate a new person or new background. Edit the existing photo only.",
      "The result must look like a natural, photorealistic edit of the original photo."
    );

    const prompt = promptParts.join("\n");

    console.log("Generating preview with prompt:", prompt);

    // Build message content: base image first, then optionally mix pattern
    const messageContent: any[] = [{ type: "text", text: prompt }];
    if (hasBaseImage) {
      messageContent.push({ type: "image_url", image_url: { url: baseImageUrl } });
    }

    // Add mix pattern reference for multi-color bouquets
    if (hasMix) {
      const patternUrl = colorCount === 2
        ? "https://urcocghysdjfawmfitzj.supabase.co/storage/v1/object/public/bouquet-previews/patterns/mix-2colors.png"
        : "https://urcocghysdjfawmfitzj.supabase.co/storage/v1/object/public/bouquet-previews/patterns/mix-3colors.png";
      messageContent.push({ type: "image_url", image_url: { url: patternUrl } });
    }

    // Call Lovable AI to generate/edit the image using the higher quality model
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [{ role: "user", content: messageContent }],
        modalities: ["image", "text"],
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(
          JSON.stringify({
            error: "Demasiadas peticiones. Inténtalo de nuevo en unos segundos.",
            fallback: true,
            statusCode: 429,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (status === 402) {
        return new Response(
          JSON.stringify({
            error: "Preview no disponible en este momento.",
            fallback: true,
            statusCode: 402,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", status, errText);
      return new Response(
        JSON.stringify({
          error: "Preview no disponible en este momento.",
          fallback: true,
          statusCode: status,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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
      JSON.stringify({
        error: e instanceof Error ? e.message : "Error desconocido",
        fallback: true,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
