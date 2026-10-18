"use client"

import React from "react"
import { EmailTone } from "@/types/email"
import { TONE_LABELS, cn } from "@/lib/utils"

interface ToneSelectorProps {
  value: EmailTone
  onChange: (tone: EmailTone) => void
}

export function ToneSelector({ value, onChange }: ToneSelectorProps) {
  const tones = Object.entries(TONE_LABELS) as [EmailTone, { label: string; description: string; emoji: string }][]

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Tone of Voice
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {tones.map(([key, item]) => {
          const isSelected = value === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border text-left text-xs transition-all cursor-pointer select-none",
                isSelected
                  ? "border-blue-500 bg-blue-50/70 text-blue-900 font-medium shadow-sm dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-200 ring-1 ring-blue-500"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800"
              )}
            >
              <span className="text-base">{item.emoji}</span>
              <div className="truncate">
                <div className="font-medium truncate">{item.label}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
