"use client"

import React from "react"
import { EmailLength } from "@/types/email"
import { cn } from "@/lib/utils"

interface LengthSelectorProps {
  value: EmailLength
  onChange: (length: EmailLength) => void
}

export function LengthSelector({ value, onChange }: LengthSelectorProps) {
  const options: { id: EmailLength; title: string; desc: string }[] = [
    { id: "short", title: "Short", desc: "1-2 paragraphs (~75w)" },
    { id: "medium", title: "Medium", desc: "3-4 paragraphs (~180w)" },
    { id: "long", title: "Detailed", desc: "Comprehensive (~300w+)" },
  ]

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Desired Length
      </label>
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => {
          const isSelected = value === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={cn(
                "px-3 py-2 rounded-lg border text-left transition-all cursor-pointer select-none",
                isSelected
                  ? "border-blue-500 bg-blue-50/70 text-blue-900 font-medium shadow-sm dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-200 ring-1 ring-blue-500"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-slate-700"
              )}
            >
              <div className="text-xs font-semibold">{opt.title}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{opt.desc}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
