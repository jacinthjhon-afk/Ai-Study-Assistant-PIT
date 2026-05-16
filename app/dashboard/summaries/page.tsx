"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  FileText, 
  Upload, 
  Sparkles, 
  Copy, 
  Check,
  Download,
  Trash2,
  FileIcon,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Summary {
  id: string
  title: string
  originalText: string
  summary: string
  keyPoints: string[]
  createdAt: Date
}

export default function SummariesPage() {
  const [text, setText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [activeSummary, setActiveSummary] = useState<Summary | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      // Simulate reading file content
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setText(content.slice(0, 5000)) // Limit text length
      }
      reader.readAsText(file)
    }
  }

  const handleGenerate = async () => {
    if (!text.trim()) return
    
    setIsGenerating(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newSummary: Summary = {
      id: crypto.randomUUID(),
      title: uploadedFile?.name || text.slice(0, 30) + "...",
      originalText: text,
      summary: generateSummary(text),
      keyPoints: generateKeyPoints(text),
      createdAt: new Date()
    }
    
    setSummaries(prev => [newSummary, ...prev])
    setActiveSummary(newSummary)
    setIsGenerating(false)
    setText("")
    setUploadedFile(null)
  }

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = (id: string) => {
    setSummaries(prev => prev.filter(s => s.id !== id))
    if (activeSummary?.id === id) {
      setActiveSummary(null)
    }
  }

  const handleDownload = (summary: Summary) => {
    const content = `# ${summary.title}\n\n## Summary\n${summary.summary}\n\n## Key Points\n${summary.keyPoints.map(p => `- ${p}`).join("\n")}`
    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `summary-${summary.id.slice(0, 8)}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Input Section */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="size-5 text-primary" />
              </div>
              <div>
                <h1 className="font-semibold">Smart Summaries</h1>
                <p className="text-sm text-muted-foreground">
                  Paste text or upload a document to get an AI-powered summary
                </p>
              </div>
            </div>

            {/* File Upload */}
            <div 
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center mb-4 transition-colors cursor-pointer",
                uploadedFile ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.doc,.docx,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              {uploadedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <FileIcon className="size-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setUploadedFile(null)
                      setText("")
                    }}
                    className="p-1 hover:bg-muted rounded"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="size-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    TXT, MD, DOC, DOCX, PDF (max 10MB)
                  </p>
                </>
              )}
            </div>

            {/* Text Input */}
            <Textarea
              placeholder="Or paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px] mb-4"
            />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {text.length} characters
              </span>
              <Button 
                onClick={handleGenerate} 
                disabled={!text.trim() || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="size-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4 mr-2" />
                    Generate Summary
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Summary Display */}
          {activeSummary && (
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Summary</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(activeSummary.summary, activeSummary.id)}
                  >
                    {copiedId === activeSummary.id ? (
                      <Check className="size-4 mr-2" />
                    ) : (
                      <Copy className="size-4 mr-2" />
                    )}
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(activeSummary)}
                  >
                    <Download className="size-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              <div className="prose prose-sm max-w-none mb-6">
                <p className="text-foreground leading-relaxed">{activeSummary.summary}</p>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-medium mb-3">Key Points</h3>
                <ul className="space-y-2">
                  {activeSummary.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-primary">{index + 1}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Previous Summaries */}
        <div className="bg-card rounded-xl border border-border p-4 h-fit">
          <h3 className="font-semibold mb-4">Previous Summaries</h3>
          
          {summaries.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No summaries yet. Generate your first one!
            </p>
          ) : (
            <div className="space-y-2">
              {summaries.map(summary => (
                <div
                  key={summary.id}
                  className={cn(
                    "group p-3 rounded-lg cursor-pointer transition-colors",
                    activeSummary?.id === summary.id 
                      ? "bg-primary/10" 
                      : "hover:bg-muted"
                  )}
                  onClick={() => setActiveSummary(summary)}
                >
                  <div className="flex items-start gap-2">
                    <FileText className="size-4 shrink-0 mt-0.5 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{summary.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {summary.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(summary.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all"
                    >
                      <Trash2 className="size-3 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function generateSummary(text: string): string {
  // Simulate AI-generated summary
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  
  if (sentences.length <= 3) {
    return text
  }
  
  return `This document discusses key concepts and ideas related to the provided content. The main focus is on understanding the fundamental principles and their practical applications. The text covers several important topics that are essential for comprehensive understanding. Key themes include analysis of core concepts, examination of relevant examples, and discussion of practical implications. The document provides a structured approach to the subject matter, making it accessible for readers at various levels of expertise.`
}

function generateKeyPoints(text: string): string[] {
  // Simulate AI-generated key points
  return [
    "The main concept revolves around understanding fundamental principles",
    "Practical applications are emphasized throughout the content",
    "Multiple examples are provided to illustrate key ideas",
    "The structure follows a logical progression from basic to advanced topics",
    "Conclusions are supported by evidence presented in the text"
  ]
}
