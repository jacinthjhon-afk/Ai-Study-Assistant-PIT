"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  MessageSquare, 
  FileText, 
  Sparkles,
  Clock,
  Search,
  Filter,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface HistoryItem {
  id: string
  type: "chat" | "quiz" | "summary"
  title: string
  description: string
  date: Date
  metadata?: {
    score?: string
    messages?: number
    words?: number
  }
}

const mockHistory: HistoryItem[] = [
  { 
    id: "1", 
    type: "quiz", 
    title: "Biology Quiz - Cell Structure", 
    description: "10 questions about cell biology and organelles",
    date: new Date(Date.now() - 7200000),
    metadata: { score: "8/10" }
  },
  { 
    id: "2", 
    type: "summary", 
    title: "World War II Summary", 
    description: "Comprehensive summary of key events and impacts",
    date: new Date(Date.now() - 86400000),
    metadata: { words: 450 }
  },
  { 
    id: "3", 
    type: "chat", 
    title: "Math Help - Calculus", 
    description: "Discussed derivatives and integration techniques",
    date: new Date(Date.now() - 172800000),
    metadata: { messages: 12 }
  },
  { 
    id: "4", 
    type: "quiz", 
    title: "Chemistry Quiz - Periodic Table", 
    description: "Elements, groups, and periodic trends",
    date: new Date(Date.now() - 259200000),
    metadata: { score: "9/10" }
  },
  { 
    id: "5", 
    type: "chat", 
    title: "Essay Writing Help", 
    description: "Structure and thesis development for argumentative essays",
    date: new Date(Date.now() - 345600000),
    metadata: { messages: 8 }
  },
  { 
    id: "6", 
    type: "summary", 
    title: "Quantum Physics Basics", 
    description: "Introduction to quantum mechanics concepts",
    date: new Date(Date.now() - 432000000),
    metadata: { words: 320 }
  },
  { 
    id: "7", 
    type: "quiz", 
    title: "English Literature - Shakespeare", 
    description: "Quiz on major works and themes",
    date: new Date(Date.now() - 518400000),
    metadata: { score: "7/10" }
  }
]

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>(mockHistory)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "chat" | "quiz" | "summary">("all")

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "chat": return MessageSquare
      case "quiz": return Sparkles
      case "summary": return FileText
      default: return Clock
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "chat": return "bg-blue-500/10 text-blue-600"
      case "quiz": return "bg-primary/10 text-primary"
      case "summary": return "bg-green-500/10 text-green-600"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getTypeHref = (type: string) => {
    switch (type) {
      case "chat": return "/dashboard/chat"
      case "quiz": return "/dashboard/quiz"
      case "summary": return "/dashboard/summaries"
      default: return "/dashboard"
    }
  }

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === "all" || item.type === filter
    return matchesSearch && matchesFilter
  })

  const handleDelete = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">History</h1>
        <p className="text-muted-foreground">View your past study sessions and activities</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "chat", "quiz", "summary"] as const).map((type) => (
            <Button
              key={type}
              variant={filter === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(type)}
              className="capitalize"
            >
              {type === "all" ? "All" : type}
            </Button>
          ))}
        </div>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <div className="size-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Clock className="size-7 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">No history found</h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery ? "Try a different search term" : "Start studying to build your history"}
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          {filteredHistory.map((item) => {
            const TypeIcon = getTypeIcon(item.type)
            return (
              <div key={item.id} className="p-4 flex items-start gap-4">
                <div className={cn(
                  "size-10 rounded-lg flex items-center justify-center shrink-0",
                  getTypeColor(item.type)
                )}>
                  <TypeIcon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={getTypeHref(item.type)} className="font-medium text-foreground hover:text-primary transition-colors">
                    {item.title}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{formatDate(item.date)}</span>
                    {item.metadata?.score && (
                      <span className="text-primary font-medium">Score: {item.metadata.score}</span>
                    )}
                    {item.metadata?.messages && (
                      <span>{item.metadata.messages} messages</span>
                    )}
                    {item.metadata?.words && (
                      <span>{item.metadata.words} words</span>
                    )}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="size-8 text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
