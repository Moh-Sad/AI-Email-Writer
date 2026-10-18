"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  PenTool,
  Sparkles,
  Mail,
  Clock,
  Zap,
  TrendingUp,
  ArrowRight,
  Copy,
  Check,
  Trash2,
  ExternalLink,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { copyToClipboard, formatRelativeTime, TONE_LABELS } from "@/lib/utils"
import { EmailItem } from "@/types/email"

export default function DashboardPage() {
  const [emails, setEmails] = useState<EmailItem[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/emails")
      .then((res) => res.json())
      .then((data) => {
        if (data.emails) {
          setEmails(data.emails)
        }
      })
      .catch((err) => console.error("Failed to load dashboard emails:", err))
      .finally(() => setLoading(false))
  }, [])

  const handleCopy = async (id: string, text: string) => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopiedId(id)
      toast.success("Email copied to clipboard")
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/emails/${id}`, { method: "DELETE" })
      if (res.ok) {
        setEmails((prev) => prev.filter((e) => e.id !== id))
        toast.success("Email removed")
      }
    } catch {
      toast.error("Failed to delete email")
    }
  }

  const draftsCount = emails.filter((e) => e.is_draft).length
  const completedCount = emails.filter((e) => !e.is_draft).length
  const hoursSaved = (emails.length * 0.25).toFixed(1)

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 md:p-8 text-white shadow-lg shadow-blue-500/15">
        <div className="relative z-10 max-w-2xl space-y-3">
          <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 text-xs backdrop-blur-md">
            ✨ AI Communications Suite
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Turn bullet points into executive-ready emails in seconds.
          </h1>
          <p className="text-sm text-blue-100 max-w-xl">
            Stream high-converting outreach, meeting notes, proposals, and responses with instant tone adjustments.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link href="/write">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-md">
                <PenTool className="w-4 h-4 mr-2" />
                Open Email Studio
              </Button>
            </Link>
            <Link href="/history">
              <Button size="lg" variant="outline" className="text-white border-white/40 hover:bg-white/10">
                View Past Drafts
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-32 top-0 -translate-y-12 w-48 h-48 rounded-full bg-purple-400/20 blur-xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Generated
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {completedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            Executive emails produced
          </div>
        </Card>

        <Card className="p-5 border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Saved Drafts
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {draftsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Available for quick editing
          </div>
        </Card>

        <Card className="p-5 border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Est. Time Saved
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            ~{hoursSaved} hrs
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Based on ~15 min per email
          </div>
        </Card>

        <Card className="p-5 border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Monthly Quota
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            30 <span className="text-xs text-slate-400 font-normal">/ month (Free)</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Resets automatically
          </div>
        </Card>
      </div>

      {/* Recent Emails Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Recent Email Activity
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review, edit, or copy your most recent drafts and messages
            </p>
          </div>
          <Link href="/history">
            <Button variant="ghost" size="sm" className="text-xs text-blue-600 dark:text-blue-400">
              View All History <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading your emails...</div>
        ) : emails.length === 0 ? (
          <Card className="p-8 text-center border-dashed border-slate-200 dark:border-slate-800">
            <Mail className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No emails generated yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Head over to the Studio to generate your first high-impact email using our customizable templates.
            </p>
            <Link href="/write">
              <Button size="sm" variant="gradient">
                <PenTool className="w-3.5 h-3.5 mr-1.5" />
                Create First Email
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {emails.slice(0, 6).map((email) => {
              const toneMeta = TONE_LABELS[email.tone] || { label: email.tone, emoji: "✉️" }
              const previewText = email.body.slice(0, 140) + "..."
              const fullText = `Subject: ${email.subject}\n\n${email.body}`

              return (
                <Card
                  key={email.id}
                  className="flex flex-col justify-between p-4 hover:shadow-md transition-all border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <span className="text-xs">{toneMeta.emoji}</span>
                        <Badge variant="secondary" className="text-[10px] px-2 py-0">
                          {toneMeta.label}
                        </Badge>
                        {email.is_draft && (
                          <Badge variant="amber" className="text-[10px] px-2 py-0">
                            Draft
                          </Badge>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {formatRelativeTime(email.created_at)}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {email.subject || "Untitled Email"}
                    </h4>

                    {email.recipient && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        To: {email.recipient}
                      </div>
                    )}

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {previewText}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleCopy(email.id, fullText)}
                        className="w-7 h-7 text-slate-500 hover:text-slate-900"
                        title="Copy to clipboard"
                      >
                        {copiedId === email.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(email.id)}
                        className="w-7 h-7 text-slate-400 hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <Link href={`/write?id=${email.id}`}>
                      <Button size="sm" variant="outline" className="text-xs h-7 px-2.5">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Open
                      </Button>
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
