import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, tone, length } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const toneText = tone ? `Use a ${tone} tone.` : "";
    const lengthText = length ? `Keep the response ${length}.` : "";

    const systemPrompt = `You are a Multi-Model Simulator. Your task is to generate 4 distinct responses to the user's prompt, each mimicking a different AI model's style.

Generate responses for these 4 AI models:
1. GPT (OpenAI): Analytical, formal, well-structured with clear reasoning
2. Claude (Anthropic): Empathetic, safety-focused, nuanced with ethical considerations
3. Gemini (Google): Factual, comprehensive, leveraging broad knowledge
4. Mistral: Direct, efficient, technically precise

${toneText} ${lengthText}

IMPORTANT: Return ONLY valid JSON with this exact structure:
{
  "gpt": "GPT's response here",
  "claude": "Claude's response here", 
  "gemini": "Gemini's response here",
  "mistral": "Mistral's response here"
}

Do not include any text outside the JSON object.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("Raw AI response:", content);
    
    let parsedResponses;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponses = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Parse error:", parseError);
      parsedResponses = {
        gpt: content,
        claude: "Response generation in progress...",
        gemini: "Response generation in progress...",
        mistral: "Response generation in progress...",
      };
    }

    return new Response(JSON.stringify(parsedResponses), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Prompt mirror error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
