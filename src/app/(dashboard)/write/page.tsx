"use client"

import React, { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { EmailForm } from "@/components/workspace/EmailForm"
import { EmailPreview } from "@/components/workspace/EmailPreview"
import { EmailGenerationFormValues } from "@/lib/validations/email"
import { RefineAction } from "@/types/email"

function WriteStudio() {
  const searchParams = useSearchParams()
  const initialEmailId = searchParams.get("id")

  const [generatedContent, setGeneratedContent] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [isRefining, setIsRefining] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedEmailId, setSavedEmailId] = useState<string | null>(initialEmailId)
  const [lastParams, setLastParams] = useState<EmailGenerationFormValues | null>(null)
  const [remainingCredits, setRemainingCredits] = useState<number | undefined>(undefined)

  const abortControllerRef = useRef<AbortController | null>(null)

  // Load email if opened from history
  useEffect(() => {
    if (initialEmailId) {
      fetch(`/api/emails/${initialEmailId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.email) {
            const fullText = `Subject: ${data.email.subject}\n\n${data.email.body}`
            setGeneratedContent(fullText)
            setSavedEmailId(data.email.id)
          }
        })
        .catch((err) => console.error("Error loading email:", err))
    }
  }, [initialEmailId])

  const handleGenerate = async (values: EmailGenerationFormValues) => {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      setIsStreaming(true)
      setGeneratedContent("")
      setSavedEmailId(null)
      setLastParams(values)

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Generation failed (${response.status})`)
      }

      const creditsHeader = response.headers.get("x-remaining-credits")
      if (creditsHeader) {
        setRemainingCredits(parseInt(creditsHeader, 10))
      }

      if (!response.body) {
        throw new Error("No readable stream received from server")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        accumulated += chunk
        setGeneratedContent(accumulated)
      }

      toast.success("Email generated successfully!")
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        return
      }
      const message = err instanceof Error ? err.message : "Failed to generate email"
      toast.error(message)
    } finally {
      setIsStreaming(false)
    }
  }

  const handleRefine = async (action: RefineAction) => {
    if (!generatedContent.trim()) return

    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      setIsRefining(true)

      const response = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentEmail: generatedContent,
          action,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Refinement failed (${response.status})`)
      }

      if (!response.body) {
        throw new Error("No readable stream received from server")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        accumulated += chunk
        setGeneratedContent(accumulated)
      }

      toast.success(`Email refined: ${action.replace("_", " ")}`)
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        return
      }
      const message = err instanceof Error ? err.message : "Refinement failed"
      toast.error(message)
    } finally {
      setIsRefining(false)
    }
  }

  const handleSaveDraft = async (isDraft: boolean) => {
    if (!generatedContent.trim()) {
      toast.error("No email content to save")
      return
    }

    try {
      setIsSaving(true)

      const lines = generatedContent.split("\n")
      let subject = "Untitled Email"
      let body = generatedContent

      if (lines.length > 0 && lines[0].toLowerCase().startsWith("subject:")) {
        subject = lines[0].replace(/^subject:\s*/i, "").trim()
        body = lines.slice(1).join("\n").replace(/^\n+/, "")
      }

      const payload = {
        id: savedEmailId || undefined,
        subject,
        body,
        recipient: lastParams?.recipient || "",
        purpose: lastParams?.purpose || "",
        context: lastParams?.context || "",
        key_points: lastParams?.keyPoints || [],
        tone: lastParams?.tone || "professional",
        email_type: lastParams?.emailType || "general",
        length: lastParams?.length || "medium",
        is_draft: isDraft,
      }

      const response = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to save")
      }

      if (data.email) {
        setSavedEmailId(data.email.id)
      }

      toast.success(isDraft ? "Saved as draft" : "Saved to email history")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save email"
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleRegenerate = () => {
    if (lastParams) {
      handleGenerate(lastParams)
    } else {
      toast.info("Please fill in the form and click Generate")
    }
  }

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Email Studio
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure parameters on the left and inspect, refine, or copy the generated result on the right.
        </p>
      </div>

      {/* Split-pane Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Pane (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-y-auto max-h-[calc(100vh-180px)]">
          <EmailForm
            onGenerate={handleGenerate}
            isLoading={isStreaming}
            remainingCredits={remainingCredits}
          />
        </div>

        {/* Right Preview Pane (7 cols on lg) */}
        <div className="lg:col-span-7 h-full min-h-[550px] lg:min-h-[calc(100vh-180px)]">
          <EmailPreview
            content={generatedContent}
            isStreaming={isStreaming}
            isRefining={isRefining}
            onContentChange={setGeneratedContent}
            onRegenerate={handleRegenerate}
            onRefine={handleRefine}
            onSaveDraft={handleSaveDraft}
            isSaving={isSaving}
            savedEmailId={savedEmailId}
          />
        </div>
      </div>
    </div>
  )
}

export default function WritePage() {
  return (
    <Suspense fallback={<div className="flex-1 p-8 text-center text-xs text-slate-400">Loading Email Studio...</div>}>
      <WriteStudio />
    </Suspense>
  )
}
