"use client"

import React, { useState, useEffect } from "react"
import {
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Download,
  Mail,
  Edit3,
  Eye,
  Bookmark,
  Scissors,
  Maximize2,
  Feather,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { copyToClipboard, getWordCount, getReadingTime } from "@/lib/utils"
import { RefineAction } from "@/types/email"

interface EmailPreviewProps {
  content: string
  isStreaming: boolean
  isRefining: boolean
  onContentChange: (newContent: string) => void
  onRegenerate: () => void
  onRefine: (action: RefineAction) => void
  onSaveDraft: (isDraft: boolean) => Promise<void>
  isSaving: boolean
  savedEmailId?: string | null
}

export function EmailPreview({
  content,
  isStreaming,
  isRefining,
  onContentChange,
  onRegenerate,
  onRefine,
  onSaveDraft,
  isSaving,
  savedEmailId,
}: EmailPreviewProps) {
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Parse subject and body
  const parseEmail = (raw: string) => {
    const lines = raw.split("\n")
    if (lines.length > 0 && lines[0].toLowerCase().startsWith("subject:")) {
      const subject = lines[0].replace(/^subject:\s*/i, "").trim()
      const body = lines.slice(1).join("\n").replace(/^\n+/, "")
      return { subject, body }
    }
    return { subject: "Email Draft", body: raw }
  }

  const { subject, body } = parseEmail(content)

  const handleCopy = async () => {
    if (!content) return
    const success = await copyToClipboard(content)
    if (success) {
      setCopied(true)
      toast.success("Email copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } else {
      toast.error("Failed to copy email")
    }
  }

  const handleDownload = (format: "txt" | "eml") => {
    if (!content) return
    const filename = `${subject.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 30) || "email"}.${format}`
    let blobContent = content
    let mimeType = "text/plain"

    if (format === "eml") {
      mimeType = "message/rfc822"
      blobContent = `Subject: ${subject}\r\nX-Unsent: 1\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${body}`
    }

    const blob = new Blob([blobContent], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Downloaded ${filename}`)
  }

  const handleOpenInClient = () => {
    if (!content) return
    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
  }

  const wordCount = getWordCount(body)
  const readingTime = getReadingTime(body)

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60 overflow-hidden">
      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 border-b border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono">
            {wordCount} words
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {readingTime}
          </Badge>
          {isStreaming && (
            <span className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium animate-pulse">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
              Streaming response...
            </span>
          )}
          {isRefining && (
            <span className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 font-medium animate-pulse">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              Refining email...
            </span>
          )}
          {savedEmailId && !isStreaming && !isRefining && (
            <Badge variant="success" className="text-xs flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Saved
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Edit Mode Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs h-8 px-2.5 text-slate-600 dark:text-slate-300"
            disabled={!content || isStreaming}
            title={isEditing ? "View formatted preview" : "Direct edit"}
          >
            {isEditing ? (
              <>
                <Eye className="w-3.5 h-3.5 mr-1" />
                Preview
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5 mr-1" />
                Edit
              </>
            )}
          </Button>

          {/* Quick Refine Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!content || isStreaming || isRefining}
                className="text-xs h-8 px-2.5 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-purple-500" />
                Refine
                <ChevronDown className="w-3 h-3 ml-1 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Quick Transformations</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onRefine("shorten")}>
                <Scissors className="w-4 h-4 mr-2 text-amber-500" />
                Make Short & Punchy
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRefine("expand")}>
                <Maximize2 className="w-4 h-4 mr-2 text-blue-500" />
                Expand with More Detail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRefine("rewrite")}>
                <RotateCcw className="w-4 h-4 mr-2 text-indigo-500" />
                Rewrite with Fresh Flow
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRefine("fix_grammar")}>
                <Feather className="w-4 h-4 mr-2 text-emerald-500" />
                Fix Grammar & Polish
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Tone Adjustments</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onRefine("make_friendly")}>
                <span className="mr-2">😊</span> Make More Friendly
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRefine("make_formal")}>
                <span className="mr-2">📜</span> Make More Formal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRefine("make_persuasive")}>
                <span className="mr-2">🎯</span> Make More Persuasive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Regenerate */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={!content || isStreaming || isRefining}
            className="text-xs h-8 px-2.5 text-slate-700 dark:text-slate-200"
            title="Regenerate this email"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1 text-slate-500" />
            Retry
          </Button>

          {/* Copy Button */}
          <Button
            type="button"
            variant={copied ? "secondary" : "default"}
            size="sm"
            onClick={handleCopy}
            disabled={!content || isStreaming}
            className="text-xs h-8 px-3 font-medium bg-blue-600 hover:bg-blue-700 text-white"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1" />
                Copy
              </>
            )}
          </Button>

          {/* Save Draft / Save History */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!content || isStreaming || isSaving}
                className="text-xs h-8 px-2.5"
              >
                <Bookmark className="w-3.5 h-3.5 mr-1 text-blue-500" />
                Save
                <ChevronDown className="w-3 h-3 ml-1 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onSaveDraft(false)}>
                Save to History
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSaveDraft(true)}>
                Save as Draft
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={!content || isStreaming}
                className="w-8 h-8 rounded-lg text-slate-500"
                title="Export options"
              >
                <Download className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleDownload("txt")}>
                <Download className="w-4 h-4 mr-2" /> Download .txt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload("eml")}>
                <Mail className="w-4 h-4 mr-2" /> Download .eml (Email)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpenInClient}>
                <ExternalLink className="w-4 h-4 mr-2" /> Open in Mail App
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Preview / Editor Area */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
        {!content ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl my-auto">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 shadow-sm">
              <Mail className="w-7 h-7" />
            </div>
            <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1">
              Your generated email will appear here
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
              Fill in your email purpose and context on the left, then click Generate. You will be able to edit, shorten, expand, and copy in one click.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg text-left">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">⚡ Instant Streaming</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Tokens stream live as the AI crafts your email.</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">🎯 Tone Calibration</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Match cold outreach, executive, or casual styles.</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">✂️ One-Click Refine</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Shorten or expand without retyping.</div>
              </div>
            </div>
          </div>
        ) : isEditing ? (
          /* Direct Textarea Editor */
          <div className="flex-1 flex flex-col space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Direct In-Place Editor</span>
              <span className="text-[11px] text-slate-400 font-normal">Changes update live</span>
            </div>
            <Textarea
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              className="flex-1 font-sans text-sm leading-relaxed p-4 resize-none border-slate-200 dark:border-slate-700 min-h-[400px]"
              placeholder="Edit email text..."
            />
          </div>
        ) : (
          /* Formatted Email Card */
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Subject Line Pill */}
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 p-3.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Subject Line
              </div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 selection:bg-blue-100">
                {subject}
              </div>
            </div>

            {/* Email Body */}
            <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans selection:bg-blue-100 dark:selection:bg-blue-900/40">
              {body}
              {isStreaming && (
                <span className="inline-block w-1.5 h-4 ml-1 bg-blue-600 animate-pulse align-middle" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
