"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  PenTool,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Mail,
  Filter,
  FileEdit,
  Clock,
  Sparkles,
  Download,
} from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { copyToClipboard, formatDate, formatRelativeTime, TONE_LABELS, EMAIL_TYPE_LABELS, getWordCount } from "@/lib/utils"
import { EmailItem } from "@/types/email"

export default function HistoryPage() {
  const [emails, setEmails] = useState<EmailItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "drafts" | "completed">("all")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchEmails = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/emails")
      const data = await res.json()
      if (data.emails) {
        setEmails(data.emails)
      }
    } catch (err) {
      console.error("Failed to load history:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmails()
  }, [])

  const handleCopy = async (id: string, email: EmailItem) => {
    const fullText = `Subject: ${email.subject}\n\n${email.body}`
    const success = await copyToClipboard(fullText)
    if (success) {
      setCopiedId(id)
      toast.success("Copied to clipboard")
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/emails/${id}`, { method: "DELETE" })
      if (res.ok) {
        setEmails((prev) => prev.filter((e) => e.id !== id))
        toast.success("Email deleted")
      }
    } catch {
      toast.error("Failed to delete email")
    }
  }

  const handleDownload = (email: EmailItem) => {
    const fullText = `Subject: ${email.subject}\n\n${email.body}`
    const blob = new Blob([fullText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${(email.subject || "email").toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 30)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Filter & Search logic
  const filteredEmails = emails.filter((item) => {
    if (filter === "drafts" && !item.is_draft) return false
    if (filter === "completed" && item.is_draft) return false

    if (search.trim()) {
      const q = search.toLowerCase()
      const inSubject = item.subject?.toLowerCase().includes(q)
      const inBody = item.body?.toLowerCase().includes(q)
      const inRecipient = item.recipient?.toLowerCase().includes(q)
      return inSubject || inBody || inRecipient
    }

    return true
  })

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 space-y-6">
      {/* Page Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Email History & Drafts
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Search, filter, reopen in studio, or export all generated communications.
          </p>
        </div>
        <Link href="/write">
          <Button variant="gradient" size="sm" className="shadow-sm">
            <PenTool className="w-3.5 h-3.5 mr-1.5" />
            New Email
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by subject, recipient, keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs h-9 bg-slate-50 dark:bg-slate-800/40"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          <Button
            variant={filter === "all" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
            className="text-xs h-8 px-3"
          >
            All ({emails.length})
          </Button>
          <Button
            variant={filter === "completed" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter("completed")}
            className="text-xs h-8 px-3"
          >
            Generated ({emails.filter((e) => !e.is_draft).length})
          </Button>
          <Button
            variant={filter === "drafts" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter("drafts")}
            className="text-xs h-8 px-3"
          >
            Drafts ({emails.filter((e) => e.is_draft).length})
          </Button>
        </div>
      </div>

      {/* History Items List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading history records...</div>
      ) : filteredEmails.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-slate-200 dark:border-slate-800">
          <Mail className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {search ? "No emails match your search query" : "No emails found in this category"}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {search
              ? "Try clearing the search bar or filtering by a different criteria."
              : "Generate an email in the Studio and click Save to store it here."}
          </p>
          {search ? (
            <Button size="sm" variant="outline" onClick={() => setSearch("")} className="text-xs">
              Clear Search
            </Button>
          ) : (
            <Link href="/write">
              <Button size="sm" variant="gradient" className="text-xs">
                <PenTool className="w-3.5 h-3.5 mr-1.5" />
                Open Studio
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredEmails.map((email) => {
            const toneMeta = TONE_LABELS[email.tone] || { label: email.tone, emoji: "✉️" }
            const typeMeta = EMAIL_TYPE_LABELS[email.email_type] || { label: email.email_type }
            const words = getWordCount(email.body)

            return (
              <Card
                key={email.id}
                className="p-4 sm:p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="text-[11px] font-normal">
                        {toneMeta.emoji} {toneMeta.label}
                      </Badge>
                      <Badge variant="secondary" className="text-[11px] font-normal">
                        {typeMeta.label}
                      </Badge>
                      {email.is_draft ? (
                        <Badge variant="amber" className="text-[11px]">
                          Draft
                        </Badge>
                      ) : (
                        <Badge variant="success" className="text-[11px]">
                          Generated
                        </Badge>
                      )}
                      <span className="text-[11px] text-slate-400 font-mono">
                        {words} words
                      </span>
                      <span className="text-[11px] text-slate-400">
                        • {formatDate(email.created_at)} ({formatRelativeTime(email.created_at)})
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                      {email.subject || "Untitled Email"}
                    </h3>

                    {email.recipient && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        To: {email.recipient}
                      </div>
                    )}

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {email.body}
                    </p>
                  </div>

                  {/* Right side actions */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    <Link href={`/write?id=${email.id}`}>
                      <Button size="sm" variant="default" className="text-xs h-8 px-3 bg-blue-600 hover:bg-blue-700">
                        <FileEdit className="w-3.5 h-3.5 mr-1" />
                        Open in Studio
                      </Button>
                    </Link>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleCopy(email.id, email)}
                        className="w-8 h-8 text-slate-500 hover:text-slate-900"
                        title="Copy email"
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
                        onClick={() => handleDownload(email)}
                        className="w-8 h-8 text-slate-500 hover:text-slate-900"
                        title="Download text file"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(email.id)}
                        className="w-8 h-8 text-slate-400 hover:text-red-500"
                        title="Delete email"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
