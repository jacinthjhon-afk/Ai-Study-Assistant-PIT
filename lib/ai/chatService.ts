// Study.ai-frontend/lib/ai/chatService.ts

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are an AI Study Assistant, a helpful chatbot that teaches students about English, basic science, mathematics, and Philippine history.

Your role is to:
- Answer questions on these subjects in an educational and engaging way
- Explain concepts clearly with examples
- Encourage learning and ask follow-up questions
- Be patient and supportive
- Correct mistakes gently
- Provide practice exercises when appropriate

If a question is not related to these subjects, politely redirect to the topics you can help with.

Always maintain a friendly, teacher-like tone.`;

// ======================
// MAIN AI FUNCTION
// ======================
export async function getAIResponse(messages: ChatMessage[]): Promise<string> {

  // 1. Try Ollama locally
  console.log('🤖 Trying Ollama...');
  const ollamaResponse = await getOllamaResponse(messages);

  if (ollamaResponse) {
    console.log('✅ Ollama worked!');
    return ollamaResponse;
  }

console.log('🤖 Trying Groq...');
const groqResponse = await getGroqResponse(messages);

if (groqResponse) {
  console.log('✅ Groq worked!');
  return groqResponse;
}

  // 3. Fallback message
  console.error('❌ All AI services failed!');

  return 'Sorry, no AI services are currently available.';
}

// ======================
// OLLAMA LOCAL AI
// ======================
async function getOllamaResponse(
  messages: ChatMessage[]
): Promise<string | null> {

  try {
    console.log('📡 Sending request to Ollama...');

    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          ...messages,
        ],
        stream: false,
      }),
    });

    console.log('📡 Ollama response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Ollama error:', errorText);
      return null;
    }

    const data = await response.json();

    console.log('✅ Ollama raw response:', data);

    return data.message?.content || null;

  } catch (error) {
    console.log('❌ Ollama not available:', error);
    return null;
  }
}

async function getGroqResponse(
  messages: ChatMessage[]
): Promise<string | null> {

  try {

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.log('❌ No Groq API key found');
      return null;
    }

    console.log('📡 Sending request to Groq...');

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT,
            },
            ...messages,
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      }
    );

    console.log('📡 Groq response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Groq error:', errorText);
      return null;
    }

    const data = await response.json();

    console.log('✅ Groq raw response:', data);

    return data?.choices?.[0]?.message?.content || null;

  } catch (error) {
    console.log('❌ Groq failed:', error);
    return null;
  }
}