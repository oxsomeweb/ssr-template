import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, mode } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const baseConstraint = 
      "CRITICAL RULES: You MUST output an image with the EXACT same pixel dimensions, framing, crop, angle, perspective, car position, car size, and background as the input photo. " +
      "Do NOT zoom in, zoom out, crop differently, shift the car, or change the aspect ratio in ANY way. " +
      "The output must be a 1:1 overlay match — if placed on top of the original, every body panel, wheel, and edge must align perfectly. " +
      "The ONLY difference should be cleanliness and shine. Do not add, remove, or reposition anything.";

    const prompts: Record<string, string> = {
      "full-detail": 
        baseConstraint + " " +
        "This car needs a premium full detail. Make the paint gleam with a deep mirror-like shine, remove all dirt, water spots, and swirl marks. " +
        "Make tires look perfectly dressed with a rich dark shine. Clean all glass to crystal clarity. Make chrome/trim sparkle. " +
        "The car should look showroom-clean while being the exact same photo composition.",
      "scratch-removal":
        baseConstraint + " " +
        "This car has scratches or paint imperfections. Remove all visible scratches, swirl marks, and paint defects. " +
        "Restore the paint to a smooth, flawless mirror finish. Only fix the paint surface — nothing else changes.",
      "ceramic-coating":
        baseConstraint + " " +
        "Show this car after receiving a professional ceramic coating. Give the paint an extremely deep, wet, glass-like shine with incredible depth and reflection. " +
        "The paint should look like liquid glass — hyper-glossy. Only enhance the paint's gloss and depth — nothing else changes.",
    };

    const selectedPrompt = prompts[mode] || prompts["full-detail"];

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3.1-flash-image-preview",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: selectedPrompt },
                {
                  type: "image_url",
                  image_url: { url: imageBase64 },
                },
              ],
            },
          ],
          modalities: ["image", "text"],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to process image. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const resultImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const resultText = data.choices?.[0]?.message?.content || "";

    if (!resultImage) {
      return new Response(
        JSON.stringify({ error: "Could not generate preview. Please try a different photo." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ image: resultImage, description: resultText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("ai-detailing-preview error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
