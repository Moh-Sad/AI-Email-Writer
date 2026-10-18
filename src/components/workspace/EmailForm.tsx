"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Sparkles, Wand2, RefreshCw, User, FileText, Send, Building } from "lucide-react"
import { EmailGenerationFormValues, emailGenerationSchema } from "@/lib/validations/email"
import { EmailTone, EmailType, EmailLength } from "@/types/email"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ToneSelector } from "./ToneSelector"
import { EmailTypeSelector } from "./EmailTypeSelector"
import { LengthSelector } from "./LengthSelector"
import { KeyPointsInput } from "./KeyPointsInput"

interface EmailFormProps {
  onGenerate: (data: EmailGenerationFormValues) => void
  isLoading: boolean
  remainingCredits?: number
}

const TEMPLATE_PRESETS = [
  {
    title: "Cold Pitch",
    purpose: "Introduce our AI workspace productivity tool to a VP of Sales",
    type: "cold_outreach" as EmailType,
    tone: "persuasive" as EmailTone,
    length: "short" as EmailLength,
    recipient: "VP of Sales",
    context: "Looking to help their 20-person sales team reduce email drafting time by 60%",
    keyPoints: ["Cut email reply time from 15 mins to 2 mins", "SOC-2 Type II compliant", "14-day free pilot"],
  },
  {
    title: "Meeting Follow-up",
    purpose: "Recap our demo discussion from yesterday and confirm next steps",
    type: "follow_up" as EmailType,
    tone: "professional" as EmailTone,
    length: "medium" as EmailLength,
    recipient: "Alex Chen",
    context: "Great meeting yesterday discussing the enterprise security integration",
    keyPoints: ["Attached the requested architecture diagram", "Targeting technical kickoff next Tuesday"],
  },
  {
    title: "Project Update",
    purpose: "Bi-weekly executive project status report and milestones",
    type: "project_update" as EmailType,
    tone: "direct" as EmailTone,
    length: "medium" as EmailLength,
    recipient: "Leadership Team",
    context: "Sprint 42 concluded on schedule with zero blocker bugs",
    keyPoints: ["All core API endpoints deployed", "Beta user testing begins Monday", "On track for Q3 launch"],
  },
  {
    title: "Thank You Note",
    purpose: "Express gratitude following the final interview round",
    type: "thank_you" as EmailType,
    tone: "friendly" as EmailTone,
    length: "short" as EmailLength,
    recipient: "Hiring Manager",
    context: "Discussed the product roadmap and engineering culture",
    keyPoints: ["Appreciated the thoughtful discussion", "Excited about the engineering mission"],
  },
]

export function EmailForm({ onGenerate, isLoading, remainingCredits }: EmailFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmailGenerationFormValues>({
    resolver: zodResolver(emailGenerationSchema) as any,
    defaultValues: {
      purpose: "",
      recipient: "",
      senderName: "",
      context: "",
      keyPoints: [],
      tone: "professional",
      emailType: "general",
      length: "medium",
    },
  })

  const currentTone = watch("tone")
  const currentType = watch("emailType")
  const currentLength = watch("length")
  const currentKeyPoints = watch("keyPoints") || []

  const applyPreset = (preset: typeof TEMPLATE_PRESETS[0]) => {
    setValue("purpose", preset.purpose, { shouldValidate: true })
    setValue("emailType", preset.type)
    setValue("tone", preset.tone)
    setValue("length", preset.length)
    setValue("recipient", preset.recipient)
    setValue("context", preset.context)
    setValue("keyPoints", preset.keyPoints)
  }

  // Handle Ctrl+Enter shortcut
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      handleSubmit(onGenerate)()
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onGenerate)}
      onKeyDown={handleKeyDown}
      className="flex flex-col h-full space-y-5"
    >
      {/* Quick Starter Templates */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Quick Starters
          </span>
          <span className="text-[11px] text-slate-400">Click to autofill</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TEMPLATE_PRESETS.map((t) => (
            <button
              key={t.title}
              type="button"
              onClick={() => applyPreset(t)}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 border border-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-blue-950/40 dark:hover:text-blue-300 dark:text-slate-300 dark:border-slate-700/60 transition-all cursor-pointer"
            >
              ⚡ {t.title}
            </button>
          ))}
        </div>
      </div>

      {/* Email Purpose */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span>
            Email Purpose <span className="text-red-500">*</span>
          </span>
          <span className="text-[11px] text-slate-400 font-normal">What is the core objective?</span>
        </label>
        <Textarea
          placeholder="e.g. Follow up on our meeting yesterday and propose a kickoff session next Tuesday"
          rows={2}
          {...register("purpose")}
          className="text-sm resize-none"
        />
        {errors.purpose && (
          <p className="text-xs text-red-500">{errors.purpose.message}</p>
        )}
      </div>

      {/* Recipient & Sender Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            Recipient Info
          </label>
          <Input
            placeholder="e.g. Sarah Jenkins (VP of Sales)"
            {...register("recipient")}
            className="text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            Your Name / Signature
          </label>
          <Input
            placeholder="e.g. Alex Rivera, Head of Growth"
            {...register("senderName")}
            className="text-xs"
          />
        </div>
      </div>

      {/* Context & Background */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            Background Context (Optional)
          </span>
          <span className="text-[11px] text-slate-400 font-normal">Relevant history or constraints</span>
        </label>
        <Textarea
          placeholder="e.g. She requested a 15% discount for a 2-year contract. We can offer 10% plus dedicated onboarding."
          rows={2}
          {...register("context")}
          className="text-xs resize-none"
        />
      </div>

      {/* Key Points */}
      <KeyPointsInput
        keyPoints={currentKeyPoints}
        onChange={(pts) => setValue("keyPoints", pts)}
      />

      {/* Tone of Voice */}
      <ToneSelector
        value={currentTone}
        onChange={(tone) => setValue("tone", tone)}
      />

      {/* Email Type */}
      <EmailTypeSelector
        value={currentType}
        onChange={(type) => setValue("emailType", type)}
      />

      {/* Length */}
      <LengthSelector
        value={currentLength}
        onChange={(len) => setValue("length", len)}
      />

      {/* Submit Button & Shortcut hint */}
      <div className="pt-2 sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm py-3 border-t border-slate-200/60 dark:border-slate-800/60">
        <Button
          type="submit"
          variant="gradient"
          size="lg"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 font-semibold shadow-lg shadow-blue-500/25"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Crafting Email...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Email</span>
            </>
          )}
        </Button>
        <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
          <span>
            Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">Ctrl+Enter</kbd>
          </span>
          {remainingCredits !== undefined && (
            <span>
              Generations remaining: <strong className="text-slate-700 dark:text-slate-200">{remainingCredits}</strong>
            </span>
          )}
        </div>
      </div>
    </form>
  )
}
