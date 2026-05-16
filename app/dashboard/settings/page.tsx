"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Save,
  Camera
} from "lucide-react"
import { cn } from "@/lib/utils"

type TabType = "profile" | "notifications" | "privacy" | "appearance"

const tabs: { id: TabType; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette }
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile")
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    school: "Stanford University",
    grade: "Junior"
  })
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    studyReminders: true,
    weeklyReport: false
  })
  const [privacy, setPrivacy] = useState({
    shareProgress: true,
    publicProfile: false,
    dataCollection: true
  })

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        {/* Tabs */}
        <div className="bg-card rounded-xl border border-border p-2">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <tab.icon className="size-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-card rounded-xl border border-border p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
                
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="size-20">
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Camera className="size-4 mr-2" />
                    Change Photo
                  </Button>
                </div>

                {/* Form */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school">School/University</Label>
                    <Input
                      id="school"
                      value={profile.school}
                      onChange={(e) => setProfile(p => ({ ...p, school: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade/Year</Label>
                    <Input
                      id="grade"
                      value={profile.grade}
                      onChange={(e) => setProfile(p => ({ ...p, grade: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <Button>
                <Save className="size-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications(n => ({ ...n, email: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                  </div>
                  <Switch 
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications(n => ({ ...n, push: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Study Reminders</p>
                    <p className="text-sm text-muted-foreground">Get reminded to study daily</p>
                  </div>
                  <Switch 
                    checked={notifications.studyReminders}
                    onCheckedChange={(checked) => setNotifications(n => ({ ...n, studyReminders: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">Weekly Progress Report</p>
                    <p className="text-sm text-muted-foreground">Receive a weekly summary of your progress</p>
                  </div>
                  <Switch 
                    checked={notifications.weeklyReport}
                    onCheckedChange={(checked) => setNotifications(n => ({ ...n, weeklyReport: checked }))}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Privacy Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Share Study Progress</p>
                    <p className="text-sm text-muted-foreground">Allow friends to see your study stats</p>
                  </div>
                  <Switch 
                    checked={privacy.shareProgress}
                    onCheckedChange={(checked) => setPrivacy(p => ({ ...p, shareProgress: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Public Profile</p>
                    <p className="text-sm text-muted-foreground">Make your profile visible to others</p>
                  </div>
                  <Switch 
                    checked={privacy.publicProfile}
                    onCheckedChange={(checked) => setPrivacy(p => ({ ...p, publicProfile: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">Data Collection</p>
                    <p className="text-sm text-muted-foreground">Help improve AI by sharing anonymous usage data</p>
                  </div>
                  <Switch 
                    checked={privacy.dataCollection}
                    onCheckedChange={(checked) => setPrivacy(p => ({ ...p, dataCollection: checked }))}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button variant="destructive">Delete Account</Button>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Appearance</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-foreground mb-3">Theme</p>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="p-4 rounded-lg border-2 border-primary bg-white text-center">
                      <div className="size-8 rounded-full bg-gray-100 mx-auto mb-2" />
                      <span className="text-sm font-medium">Light</span>
                    </button>
                    <button className="p-4 rounded-lg border border-border bg-card text-center hover:border-primary/50 transition-colors">
                      <div className="size-8 rounded-full bg-gray-800 mx-auto mb-2" />
                      <span className="text-sm font-medium">Dark</span>
                    </button>
                    <button className="p-4 rounded-lg border border-border bg-card text-center hover:border-primary/50 transition-colors">
                      <div className="size-8 rounded-full bg-gradient-to-b from-gray-100 to-gray-800 mx-auto mb-2" />
                      <span className="text-sm font-medium">System</span>
                    </button>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-foreground mb-3">Accent Color</p>
                  <div className="flex gap-3">
                    <button className="size-10 rounded-full bg-violet-600 ring-2 ring-offset-2 ring-violet-600" />
                    <button className="size-10 rounded-full bg-blue-600 hover:ring-2 hover:ring-offset-2 hover:ring-blue-600 transition-all" />
                    <button className="size-10 rounded-full bg-green-600 hover:ring-2 hover:ring-offset-2 hover:ring-green-600 transition-all" />
                    <button className="size-10 rounded-full bg-orange-600 hover:ring-2 hover:ring-offset-2 hover:ring-orange-600 transition-all" />
                    <button className="size-10 rounded-full bg-pink-600 hover:ring-2 hover:ring-offset-2 hover:ring-pink-600 transition-all" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
