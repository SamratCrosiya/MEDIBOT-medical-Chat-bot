import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Emergency keywords that bypass AI for immediate response
const EMERGENCY_KEYWORDS = [
  'chest pain', 'heart attack', 'stroke', 'can\'t breathe', 'difficulty breathing',
  'unconscious', 'severe bleeding', 'suicide', 'overdose', 'poisoning',
  'seizure', 'anaphylaxis', 'choking', 'drowning', 'severe burn'
];

// High priority symptoms
const HIGH_PRIORITY_KEYWORDS = [
  'fever', 'high temperature', 'severe headache', 'blood in', 'sharp pain',
  'vomiting blood', 'fainting', 'numbness', 'confusion', 'severe allergic'
];

function detectUrgency(message: string): { isEmergency: boolean; isHighPriority: boolean } {
  const lowerMessage = message.toLowerCase();
  
  const isEmergency = EMERGENCY_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
  const isHighPriority = HIGH_PRIORITY_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
  
  return { isEmergency, isHighPriority };
}

function getEmergencyResponse(): string {
  return `🚨 **EMERGENCY DETECTED** 🚨

**CALL EMERGENCY SERVICES IMMEDIATELY: 911 (US) or your local emergency number**

While waiting for help:
- Stay calm and don't move unless in danger
- If conscious, sit or lie in a comfortable position
- Loosen any tight clothing
- If someone is with you, have them stay by your side

**This is a medical emergency. Professional help is needed RIGHT NOW.**

_MediBot cannot replace emergency medical care. Please seek immediate professional help._`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Check for emergencies first - bypass AI for speed
    const { isEmergency, isHighPriority } = detectUrgency(message);
    
    if (isEmergency) {
      console.log("Emergency detected:", message);
      return new Response(JSON.stringify({ 
        response: getEmergencyResponse(),
        urgency: 'emergency'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build system prompt based on mode
    let systemPrompt = "";
    
    switch (mode) {
      case "symptom":
        systemPrompt = `You are MediBot, a compassionate AI medical assistant specializing in symptom analysis. Your role is to:

1. Listen carefully to the user's symptoms
2. Ask clarifying questions if needed (one at a time)
3. Suggest possible common causes (NOT diagnoses)
4. Recommend appropriate next steps (home care, see doctor, urgent care)
5. Provide general wellness tips

IMPORTANT RULES:
- Always use simple, non-medical language (explain like you're talking to a 5th grader)
- Never provide definitive diagnoses - only possibilities
- Always recommend seeing a healthcare provider for serious or persistent symptoms
- Flag any concerning symptoms that need urgent attention
- Be empathetic and reassuring
- Use bullet points and emojis for readability

${isHighPriority ? "⚠️ HIGH PRIORITY SYMPTOMS DETECTED - Recommend medical consultation within 24 hours." : ""}

DISCLAIMER: Always end with a brief reminder that this is not professional medical advice.`;
        break;
        
      case "report":
        systemPrompt = `You are MediBot, an AI assistant that simplifies medical reports. Your role is to:

1. Read and understand the medical report/lab results
2. Translate ALL medical jargon into simple everyday language
3. Explain what each value means and whether it's normal
4. Highlight any abnormal values in a non-alarming way
5. Suggest questions to ask the doctor

FORMAT YOUR RESPONSE AS:
📋 **Report Summary**
[Brief overview in 1-2 sentences]

📊 **Key Findings**
[Bullet points of important values, explained simply]

⚠️ **Values to Discuss with Your Doctor**
[Any abnormal values that need attention]

💡 **What This Means**
[Simple explanation of the overall health picture]

❓ **Questions to Ask Your Doctor**
[2-3 relevant questions]

Use analogies and simple comparisons. Avoid causing unnecessary alarm.`;
        break;
        
      case "drug":
        systemPrompt = `You are MediBot, an AI assistant providing medication information. Your role is to:

1. Provide clear, accurate information about medications
2. Explain uses, dosages, and how the medicine works
3. List common side effects (don't list rare ones unless asked)
4. Highlight important warnings and interactions
5. Note who should avoid this medication

FORMAT YOUR RESPONSE AS:
💊 **[Drug Name]**

**What It's For:**
[Simple explanation of uses]

**How It Works:**
[Brief mechanism in simple terms]

**Common Side Effects:**
[List 3-5 most common, with likelihood]

⚠️ **Important Warnings:**
[Key safety information]

🚫 **Who Should Avoid:**
[Contraindications in simple terms]

💡 **Tips:**
[Practical advice for taking the medication]

Always recommend consulting a pharmacist or doctor for personalized advice.`;
        break;
        
      default:
        systemPrompt = `You are MediBot, a friendly and knowledgeable AI health assistant. You help users with:

- Understanding their symptoms (without diagnosing)
- Simplifying medical reports and lab results
- Providing medication information
- General health and wellness tips
- Answering health-related questions

PERSONALITY:
- Warm, empathetic, and reassuring
- Uses simple language (5th-grade reading level)
- Uses emojis and bullet points for readability
- Never causes unnecessary alarm
- Always recommends professional consultation for serious concerns

IMPORTANT:
- You are NOT a replacement for doctors
- Never provide definitive diagnoses
- Always include appropriate disclaimers
- Flag emergencies immediately

Start by greeting the user warmly and asking how you can help with their health questions today.`;
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
          { role: "user", content: message },
        ],
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
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error("AI service error");
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process your request.";

    return new Response(JSON.stringify({ 
      response: aiResponse,
      urgency: isHighPriority ? 'high' : 'normal'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("MediBot error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
