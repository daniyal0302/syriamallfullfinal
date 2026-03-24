import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { texts, targetLang = "ar" } = await req.json();

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return new Response(JSON.stringify({ error: "texts array required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `Translate the following texts to Arabic. Return ONLY a JSON array of translated strings in the same order. Do not add any explanation or formatting.

Texts to translate:
${JSON.stringify(texts)}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: "You are a professional English to Arabic translator. Always return valid JSON arrays only." },
          { role: "user", content: prompt },
        ],
        temperature: 0.1,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429 || aiResponse.status === 402) {
        // Rate limited - return original texts as fallback
        console.warn(`AI API rate limited (${aiResponse.status}), returning originals`);
        return new Response(JSON.stringify({ translations: texts }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content?.trim();
    
    // Parse the JSON array from the response
    let translations: string[];
    try {
      // Handle markdown code blocks
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      translations = JSON.parse(cleaned);
    } catch {
      // Fallback: try to extract strings between array brackets
      try {
        const match = content.match(/\[(.+)\]/s);
        if (match) {
          // Split by the pattern "," that separates array elements
          const inner = match[1].trim();
          // Remove leading/trailing quotes and use as single translation
          const items = inner.split(/",\s*"/).map((s: string) => 
            s.replace(/^["']|["']$/g, "").trim()
          );
          translations = items;
        } else {
          // Last resort: treat entire content as a single translation
          translations = [content.replace(/[\[\]"]/g, "").trim()];
        }
      } catch {
        // Ultimate fallback: return original texts
        translations = texts;
      }
    }

    return new Response(JSON.stringify({ translations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Translation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
