import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Emergency keywords for immediate safety response
const EMERGENCY_KEYWORDS = [
  'suicide', 'kill myself', 'want to die', 'end my life',
  'chest pain', 'heart attack', 'can\'t breathe', 'stroke',
  'overdose', 'poisoning', 'severe bleeding', 'unconscious'
];

const EMERGENCY_RESPONSE = {
  response: "🚨 EMERGENCY DETECTED: If you are experiencing a medical emergency, please call emergency services immediately (911 in the US, 112 in EU, or your local emergency number). Do not wait - seek immediate professional medical help.",
  urgency: "emergency",
  isEmergency: true
};

function checkEmergency(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return EMERGENCY_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, mode = 'general', history = [] } = await req.json();
    
    // Check for emergency keywords first
    if (checkEmergency(message)) {
      return new Response(JSON.stringify(EMERGENCY_RESPONSE), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Medical-only system prompt
    const systemPrompt = `You are MediBot, a professional AI Health Assistant. You ONLY answer questions related to the medical and health domain.

STRICT RULES:
1. You MUST ONLY respond to questions about:
   - Diseases, symptoms, and conditions
   - Medications and drug information
   - Medical treatments and procedures
   - Anatomy and physiology
   - Nutrition and diet related to health
   - Mental health topics
   - First aid and emergency guidance
   - Medical test interpretations
   - General wellness and preventive care

2. If a question is NOT related to health or medicine, respond with:
   "I'm MediBot, a health assistant. I can only help with medical and health-related questions. Please ask me about symptoms, diseases, medications, treatments, or any health concerns you may have."

3. Always include a disclaimer that you're an AI and not a substitute for professional medical advice.

4. Be factual, helpful, and reassuring in your tone.

5. For symptom analysis, suggest possible causes but always recommend consulting a healthcare provider.

6. For medication questions, provide general information but advise consulting a pharmacist or doctor.

Current mode: ${mode}
${mode === 'symptom' ? 'Focus on symptom analysis and possible conditions.' : ''}
${mode === 'report' ? 'Focus on explaining medical reports in simple terms.' : ''}
${mode === 'drug' ? 'Focus on medication information, uses, side effects, and interactions.' : ''}

IMPORTANT: Keep responses concise but informative. Use bullet points for clarity when appropriate.`;

    // Build messages array with history
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map((h: { role: string; content: string }) => ({
        role: h.role,
        content: h.content
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Service temporarily unavailable.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

    // Determine urgency based on content
    let urgency = 'normal';
    const lowerResponse = aiResponse.toLowerCase();
    if (lowerResponse.includes('seek immediate') || lowerResponse.includes('emergency')) {
      urgency = 'high';
    } else if (lowerResponse.includes('consult a doctor') || lowerResponse.includes('see a healthcare')) {
      urgency = 'medium';
    }

    return new Response(JSON.stringify({
      response: aiResponse,
      urgency,
      isEmergency: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('MediBot error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
