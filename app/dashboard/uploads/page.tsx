"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { 
  Upload, 
  FileText, 
  X, 
  File, 
  Image as ImageIcon, 
  FileVideo,
  Trash2,
  Download,
  MoreVertical,
  FolderOpen
} from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: Date
  status: "uploading" | "complete" | "error"
  progress?: number
}

const mockFiles: UploadedFile[] = [
  { id: "1", name: "Biology Notes Chapter 5.pdf", size: 2400000, type: "application/pdf", uploadedAt: new Date(Date.now() - 86400000), status: "complete" },
  { id: "2", name: "Math Formulas.docx", size: 540000, type: "application/docx", uploadedAt: new Date(Date.now() - 172800000), status: "complete" },
  { id: "3", name: "History Timeline.png", size: 1200000, type: "image/png", uploadedAt: new Date(Date.now() - 259200000), status: "complete" },
  { id: "4", name: "Chemistry Lab Report.pdf", size: 890000, type: "application/pdf", uploadedAt: new Date(Date.now() - 345600000), status: "complete" }
]

export default function UploadsPage() {
  const [files, setFiles] = useState<UploadedFile[]>(mockFiles)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

  const getFileIcon = (type: string) => {
    if (type.includes("image")) return ImageIcon
    if (type.includes("video")) return FileVideo
    if (type.includes("pdf")) return FileText
    return File
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    handleFiles(selectedFiles)
  }

  const handleFiles = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      status: "complete" as const
    }))
    setFiles(prev => [...uploadedFiles, ...prev])
  }

  const handleDelete = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Uploads</h1>
        <p className="text-muted-foreground">Upload documents for AI-powered analysis and summaries</p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
        />
        <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Upload className="size-7 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground mb-1">
          {isDragging ? "Drop files here" : "Upload files"}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          Supports PDF, DOC, DOCX, TXT, PNG, JPG (Max 10MB)
        </p>
      </div>

      {/* Files List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Your Files</h2>
          <span className="text-sm text-muted-foreground">{files.length} files</span>
        </div>

        {files.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <div className="size-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="size-7 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">No files yet</h3>
            <p className="text-sm text-muted-foreground">
              Upload your first document to get started
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            {files.map((file) => {
              const FileIcon = getFileIcon(file.type)
              return (
                <div key={file.id} className="p-4 flex items-center gap-4">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileIcon className="size-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="size-8">
                      <Download className="size-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="size-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(file.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
