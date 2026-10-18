import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

export function formatRelativeTime(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return formatDate(date)
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      const textArea = document.createElement("textarea")
      textArea.value = text
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      textArea.style.top = "-999999px"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const successful = document.execCommand("copy")
      textArea.remove()
      return successful
    }
  } catch (err) {
    console.error("Failed to copy:", err)
    return false
  }
}

export function getWordCount(text: string): number {
  if (!text) return 0
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function getReadingTime(text: string): string {
  const words = getWordCount(text)
  const minutes = Math.ceil(words / 200)
  return minutes <= 1 ? "< 1 min read" : `${minutes} min read`
}

export const TONE_LABELS: Record<string, { label: string; description: string; emoji: string }> = {
  professional: { label: "Professional", description: "Polite, clear, business-appropriate", emoji: "💼" },
  friendly: { label: "Friendly", description: "Warm, approachable, and encouraging", emoji: "😊" },
  formal: { label: "Formal", description: "Strictly respectful and traditional", emoji: "📜" },
  persuasive: { label: "Persuasive", description: "Compelling call-to-action and benefits", emoji: "🎯" },
  direct: { label: "Direct", description: "Straightforward, brief, and to the point", emoji: "⚡" },
  urgent: { label: "Urgent", description: "Prompt action needed with time sensitivity", emoji: "⏰" },
  empathetic: { label: "Empathetic", description: "Understanding, supportive, and kind", emoji: "🤝" },
  casual: { label: "Casual", description: "Relaxed, conversational, and natural", emoji: "☕" },
}

export const EMAIL_TYPE_LABELS: Record<string, { label: string; placeholder: string }> = {
  general: { label: "General", placeholder: "General communication or updates" },
  cold_outreach: { label: "Cold Outreach", placeholder: "Introducing yourself, your product, or pitch" },
  follow_up: { label: "Follow-up", placeholder: "Checking in on a previous thread or meeting" },
  meeting_request: { label: "Meeting Request", placeholder: "Scheduling a call, sync, or interview" },
  thank_you: { label: "Thank You", placeholder: "Expressing gratitude after an interview or favor" },
  sales_pitch: { label: "Sales Pitch", placeholder: "Pitching a client with value proposition" },
  project_update: { label: "Project Update", placeholder: "Status report with milestones and blockers" },
  apology: { label: "Apology", placeholder: "Sincere apology and solution to an issue" },
  proposal: { label: "Proposal", placeholder: "Project proposal, scope, or collaboration" },
}
