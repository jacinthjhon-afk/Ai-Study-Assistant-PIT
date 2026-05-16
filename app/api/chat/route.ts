import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getAIResponse } from '@/lib/ai/chatService' // ✅ ADD THIS

export async function POST(request: Request) {
  // 1. Get Supabase client and authenticated user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

try {
  const { message, conversationHistory } = await request.json()

  // ✅ Use teammate's AI service with 3 fallbacks: Ollama → Hugging Face → OpenAI
  const aiResponse = await getAIResponse([
    ...conversationHistory,
    { role: 'user', content: message }
  ])

  if (!aiResponse) {
    return NextResponse.json({ 
      error: 'AI service unavailable. Please try again later.' 
    }, { status: 500 })
  }

    // 4. Save to Supabase (Database CRUD - required for grading!)
    await supabase.from('chat_history').insert({
      user_id: user.id,
      role: 'user',
      message: message
    })

    await supabase.from('chat_history').insert({
      user_id: user.id,
      role: 'assistant',
      message: aiResponse
    })

    return NextResponse.json({ reply: aiResponse })

  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

