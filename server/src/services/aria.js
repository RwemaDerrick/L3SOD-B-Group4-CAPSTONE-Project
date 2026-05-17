const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'self-harm', 'hurt myself',
  'want to die', 'no reason to live',
];

const ARIA_SYSTEM = `You are Aria, a warm, supportive wellness companion for Moodlink.
You use CBT-inspired and mindfulness techniques. You are NOT a therapist or doctor.
Keep responses concise (2-4 short paragraphs max). Validate feelings, ask gentle questions,
suggest grounding exercises when appropriate. Never diagnose. If someone is in crisis,
encourage contacting emergency services or 988 (US Suicide & Crisis Lifeline).
Be judgment-free, calm, and human.`;

const FALLBACK_REPLIES = [
  "I hear you, and what you're feeling matters. Can you tell me a little more about what's weighing on you right now?",
  "Thank you for sharing that with me. Let's take this one step at a time — what's one small thing that felt okay today, even briefly?",
  "It sounds like you're carrying a lot. A simple grounding exercise: name 3 things you can see, 2 you can hear, and 1 you can feel. How does that land for you?",
  "Your feelings are valid. I'm here to listen without judgment. What would feel most supportive for you in this moment — venting, reflection, or a calming exercise?",
];

function detectCrisis(text) {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((k) => lower.includes(k));
}

export function crisisResponse() {
  return {
    content: `I'm really glad you reached out. What you're describing sounds serious, and you deserve immediate support from a trained human.

**Please contact:**
- **988** — Suicide & Crisis Lifeline (US, call or text)
- **911** or your local emergency number if you're in immediate danger
- A trusted person nearby

I'm here for emotional support, but I can't replace professional crisis care. You matter, and help is available right now.`,
    crisis: true,
  };
}

export async function getAriaReply(userMessage, history = []) {
  if (detectCrisis(userMessage)) {
    return crisisResponse();
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const idx = Math.abs(hashCode(userMessage)) % FALLBACK_REPLIES.length;
    return { content: FALLBACK_REPLIES[idx], crisis: false };
  }

  try {
    const messages = [
      { role: 'system', content: ARIA_SYSTEM },
      ...history.slice(-10).map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage },
    ];

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      throw new Error('OpenAI request failed');
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error('Empty response');
    if (detectCrisis(content)) return crisisResponse();
    return { content, crisis: false };
  } catch {
    const idx = Math.abs(hashCode(userMessage)) % FALLBACK_REPLIES.length;
    return { content: FALLBACK_REPLIES[idx], crisis: false };
  }
}

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return h;
}
