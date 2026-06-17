// Gemini AI Service for FitTrack
// Uses Google Gemini API (free tier: gemini-2.0-flash)

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const FITNESS_SYSTEM_PROMPT = `You are FitTrack AI Coach, an expert fitness trainer and nutritionist. You provide personalized, evidence-based advice.

Guidelines:
- Be encouraging, motivational, and professional
- Provide specific, actionable recommendations
- Consider the user's goals, experience level, and current stats when giving advice
- For workout plans, specify exercises, sets, reps, rest periods, and progression
- For nutrition plans, specify meals, portions, macros, and timing
- Use metric units (kg, cm) unless the user specifies otherwise
- Always prioritize safety — recommend proper form and appropriate intensity
- If asked about injuries or medical conditions, recommend consulting a healthcare professional
- Format responses with clear headers, bullet points, and sections using markdown
- Keep responses focused and practical`;

export async function chatWithGemini(apiKey, model, messages, userContext = '') {
  const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`;
  
  // Build conversation content
  const contents = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  const body = {
    contents,
    systemInstruction: {
      parts: [{ text: FITNESS_SYSTEM_PROMPT + (userContext ? `\n\nUser Profile:\n${userContext}` : '') }]
    },
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 2048
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (response.status === 401 || response.status === 403) {
      throw new Error('Invalid API key. Please check your Gemini API key in Settings.');
    }
    if (response.status === 429) {
      throw new Error('Rate limit reached. Please wait a moment and try again.');
    }
    throw new Error(error.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No response generated. Please try again.');
  return text;
}

export async function streamChatWithGemini(apiKey, model, messages, userContext, onChunk) {
  const url = `${GEMINI_API_BASE}/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;
  
  const contents = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  const body = {
    contents,
    systemInstruction: {
      parts: [{ text: FITNESS_SYSTEM_PROMPT + (userContext ? `\n\nUser Profile:\n${userContext}` : '') }]
    },
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 2048
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (response.status === 401 || response.status === 403) throw new Error('Invalid API key.');
    if (response.status === 429) throw new Error('Rate limit reached. Please wait.');
    throw new Error(error.error?.message || `API error: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const json = JSON.parse(line.slice(6));
          const chunk = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
          fullText += chunk;
          onChunk(fullText);
        } catch (e) { /* skip parse errors for SSE */ }
      }
    }
  }

  return fullText;
}

export function buildUserContext(user, stats) {
  if (!user) return '';
  const lines = [];
  if (user.name) lines.push(`Name: ${user.name}`);
  if (user.age) lines.push(`Age: ${user.age}`);
  if (user.gender) lines.push(`Gender: ${user.gender}`);
  if (user.weight) lines.push(`Weight: ${user.weight} kg`);
  if (user.height) lines.push(`Height: ${user.height} cm`);
  if (user.goal) lines.push(`Goal: ${user.goal}`);
  if (user.experience) lines.push(`Experience: ${user.experience}`);
  if (user.activityLevel) lines.push(`Activity Level: ${user.activityLevel}`);
  if (stats) {
    if (stats.bmr) lines.push(`BMR: ${stats.bmr} kcal`);
    if (stats.tdee) lines.push(`TDEE: ${stats.tdee} kcal`);
    if (stats.targetCalories) lines.push(`Target Calories: ${stats.targetCalories} kcal/day`);
    if (stats.bmi) lines.push(`BMI: ${stats.bmi}`);
    if (stats.macros) {
      lines.push(`Macro Targets: Protein ${stats.macros.protein}g, Carbs ${stats.macros.carbs}g, Fats ${stats.macros.fats}g`);
    }
  }
  return lines.join('\n');
}

export async function testConnection(apiKey, model) {
  try {
    const result = await chatWithGemini(apiKey, model, 
      [{ role: 'user', content: 'Say "Connected successfully!" in exactly those words.' }], 
      ''
    );
    return { success: true, message: result };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
