"use client"

import { createClient } from "@/lib/supabase/client"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Send, 
  Sparkles, 
  User, 
  Plus,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  MessageSquare
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface Chat {
  id: string
  title: string
  messages: Message[]
}

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const currentChat = chats.find(c => c.id === activeChat)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [currentChat?.messages])

  const handleNewChat = () => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: []
    }
    setChats(prev => [newChat, ...prev])
    setActiveChat(newChat.id)
  }

  const handleDeleteChat = (chatId: string) => {
    setChats(prev => prev.filter(c => c.id !== chatId))
    if (activeChat === chatId) {
      setActiveChat(null)
    }
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

const handleSend = async () => {
  if (!input.trim() || isLoading) return

  const content = input.trim()
  setInput("")
  setIsLoading(true)

  // Resize textarea back
  if (textareaRef.current) {
    textareaRef.current.style.height = "auto"
  }

  let chatId = activeChat

  if (!chatId) {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
      messages: []
    }
    setChats(prev => [newChat, ...prev])
    chatId = newChat.id
    setActiveChat(chatId)
  }

  const userMessage: Message = {
    id: crypto.randomUUID(),
    role: "user",
    content,
    timestamp: new Date()
  }

  setChats(prev => prev.map(chat => 
    chat.id === chatId 
      ? { ...chat, messages: [...chat.messages, userMessage] }
      : chat
  ))

  // 🔹 CHANGED: Call real AI API instead of simulation
  try {
    const currentChatMessages = currentChat?.messages || []
    const conversationHistory = currentChatMessages.map(m => ({
      role: m.role,
      content: m.content
    }))

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: content,
        conversationHistory: conversationHistory
      })
    })

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error)
    }

    const aiMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: data.reply, // 🔹 CHANGED: Use real AI response
      timestamp: new Date()
    }

    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { 
            ...chat, 
            messages: [...chat.messages, aiMessage],
            title: chat.messages.length === 0 ? content.slice(0, 30) + (content.length > 30 ? "..." : "") : chat.title
          }
        : chat
    ))

  } catch (error: any) {
    // Show error in chat if AI fails
    const errorMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: `Error: ${error.message || "Failed to get AI response. Make sure Ollama is running."}`,
      timestamp: new Date()
    }
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, messages: [...chat.messages, errorMessage] }
        : chat
    ))
  }

  setIsLoading(false)
}

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const suggestions = [
    "Explain quantum physics in simple terms",
    "Help me write an essay about climate change",
    "What are the key events of World War II?",
    "Solve this math problem step by step"
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Chat list sidebar */}
        <div className="bg-card rounded-xl border border-border p-4">
          <Button onClick={handleNewChat} className="w-full mb-4">
            <Plus className="size-4 mr-2" />
            New Chat
          </Button>

          <div className="space-y-2">
            {chats.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No chats yet. Start a new conversation!
              </p>
            ) : (
              chats.map(chat => (
                <div
                  key={chat.id}
                  className={cn(
                    "group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors",
                    activeChat === chat.id 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-muted"
                  )}
                  onClick={() => setActiveChat(chat.id)}
                >
                  <MessageSquare className="size-4 shrink-0" />
                  <span className="flex-1 truncate text-sm">{chat.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteChat(chat.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all"
                  >
                    <Trash2 className="size-3 text-destructive" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="bg-card rounded-xl border border-border flex flex-col h-[calc(100vh-180px)] min-h-[500px]">
          {currentChat ? (
            <>
              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-auto p-4">
                <div className="space-y-6">
                  {currentChat.messages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <Avatar className="size-8 shrink-0">
                        <AvatarFallback className={cn(
                          "text-xs",
                          message.role === "assistant" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted"
                        )}>
                          {message.role === "assistant" ? (
                            <Sparkles className="size-4" />
                          ) : (
                            <User className="size-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {message.role === "assistant" ? "AI Assistant" : "You"}
                          </span>
                        </div>
                        <div className="prose prose-sm max-w-none text-foreground">
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                        {message.role === "assistant" && (
                          <div className="flex items-center gap-1 mt-2">
                            <button
                              onClick={() => handleCopy(message.content, message.id)}
                              className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            >
                              {copiedId === message.id ? (
                                <Check className="size-3.5" />
                              ) : (
                                <Copy className="size-3.5" />
                              )}
                            </button>
                            <button className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                              <ThumbsUp className="size-3.5" />
                            </button>
                            <button className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                              <ThumbsDown className="size-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <Avatar className="size-8 shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          <Sparkles className="size-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-1 py-2">
                        <div className="size-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="size-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="size-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value)
                      e.target.style.height = "auto"
                      e.target.style.height = Math.min(e.target.scrollHeight, 150) + "px"
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    className="min-h-[44px] max-h-[150px] resize-none"
                    rows={1}
                  />
                  <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
                    <Send className="size-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="size-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">AI Chat Tutor</h2>
              <p className="text-muted-foreground text-center mb-8 max-w-md">
                Get instant answers to your questions. Start a conversation or try one of the suggestions below.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 w-full max-w-lg">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      handleNewChat()
                      setInput(suggestion)
                    }}
                    className="p-3 text-left text-sm rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

