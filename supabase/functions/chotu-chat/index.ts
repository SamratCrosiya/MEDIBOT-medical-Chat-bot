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
    const { messages, module } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    
    switch (module) {
      case "general":
        systemPrompt = `You are CHOTU (Comprehensive Heuristic Operations & Technical Utility), an advanced AI assistant. You are friendly, helpful, witty, and intelligent. You help users with:
- Understanding and comparing different AI models
- Navigating through the CHOTU platform modules
- Answering questions about AI capabilities
- General AI and tech inquiries
Keep responses concise but informative. Use emojis occasionally to be friendly.`;
        break;
      
      case "hirewise":
        systemPrompt = `You are HireWise, an expert technical interview coach within the CHOTU platform. Your role is to:
- Conduct mock interviews based on the user's target role
- Ask ONE relevant interview question at a time
- Wait for the user's response before providing feedback
- Analyze responses based on: Clarity, Technical Accuracy, and STAR method (Situation, Task, Action, Result)
- Provide constructive feedback with a score (0-10) and specific improvements
- Then ask the next question
Be professional, encouraging, and help users improve their interview skills.`;
        break;
      
      case "screensage":
        systemPrompt = `You are ScreenSage, a specialist in UI/UX design and Code Analysis within the CHOTU platform. Your expertise includes:
- Analyzing screenshots and images for UI/UX issues
- Identifying code bugs and suggesting optimizations
- Critiquing layouts, color schemes, and accessibility
- Providing actionable feedback with specific recommendations
Use bullet points and bold text for key findings. Be thorough but concise.`;
        break;
      
      default:
        systemPrompt = "You are CHOTU, a helpful AI assistant.";
    }

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
