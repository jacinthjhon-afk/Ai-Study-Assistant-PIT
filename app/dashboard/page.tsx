"use client"

import Link from "next/link"
import { 
  MessageSquare, 
  FileText, 
  Sparkles, 
  Upload,
  ArrowRight,
  BookOpen,
  Brain,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"

const quickActions = [
  {
    title: "AI Chat",
    description: "Get instant answers to your study questions",
    icon: MessageSquare,
    href: "/dashboard/chat",
    color: "bg-blue-500/10 text-blue-600"
  },
  {
    title: "Summaries",
    description: "Generate smart summaries from your documents",
    icon: FileText,
    href: "/dashboard/summaries",
    color: "bg-green-500/10 text-green-600"
  },
  {
    title: "Quiz Generator",
    description: "Create practice quizzes from any topic",
    icon: Sparkles,
    href: "/dashboard/quiz",
    color: "bg-primary/10 text-primary"
  },
  {
    title: "Upload Files",
    description: "Upload documents for AI-powered analysis",
    icon: Upload,
    href: "/dashboard/uploads",
    color: "bg-orange-500/10 text-orange-600"
  }
]

const recentActivity = [
  { type: "quiz", title: "Biology Quiz - Cell Structure", time: "2 hours ago", score: "8/10" },
  { type: "summary", title: "World War II Summary", time: "Yesterday" },
  { type: "chat", title: "Math Help - Calculus", time: "2 days ago" },
  { type: "quiz", title: "Chemistry Quiz - Periodic Table", time: "3 days ago", score: "9/10" }
]

const stats = [
  { label: "Study Sessions", value: "24", icon: BookOpen },
  { label: "Quizzes Completed", value: "12", icon: Brain },
  { label: "Hours Studied", value: "18", icon: Clock }
]

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back!</h1>
        <p className="text-muted-foreground">Continue your learning journey</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <stat.icon className="size-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="group bg-card rounded-xl border border-border p-5 hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div className={`size-12 rounded-xl ${action.color} flex items-center justify-center mb-4`}>
                <action.icon className="size-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
              <div className="flex items-center text-sm text-primary font-medium">
                Get started
                <ArrowRight className="size-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <Link href="/dashboard/history" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          {recentActivity.map((activity, index) => (
            <div key={index} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-lg flex items-center justify-center ${
                  activity.type === "quiz" ? "bg-primary/10 text-primary" :
                  activity.type === "summary" ? "bg-green-500/10 text-green-600" :
                  "bg-blue-500/10 text-blue-600"
                }`}>
                  {activity.type === "quiz" ? <Sparkles className="size-5" /> :
                   activity.type === "summary" ? <FileText className="size-5" /> :
                   <MessageSquare className="size-5" />}
                </div>
                <div>
                  <p className="font-medium text-foreground">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
              {activity.score && (
                <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-lg">
                  {activity.score}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Continue Learning CTA */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground">
        <h2 className="text-xl font-bold mb-2">Ready to study?</h2>
        <p className="text-primary-foreground/80 mb-4">
          Start a new study session or continue where you left off.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" asChild>
            <Link href="/dashboard/chat">Start AI Chat</Link>
          </Button>
          <Button variant="outline" className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10 text-primary-foreground hover:text-primary-foreground" asChild>
            <Link href="/dashboard/quiz">Take a Quiz</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
