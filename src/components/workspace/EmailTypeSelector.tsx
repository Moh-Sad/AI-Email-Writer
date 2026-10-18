"use client"

import React from "react"
import { EmailType } from "@/types/email"
import { EMAIL_TYPE_LABELS, cn } from "@/lib/utils"

interface EmailTypeSelectorProps {
  value: EmailType
  onChange: (type: EmailType) => void
}

export function EmailTypeSelector({ value, onChange }: EmailTypeSelectorProps) {
  const types = Object.entries(EMAIL_TYPE_LABELS) as [EmailType, { label: string; placeholder: string }][]

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Email Type
      </label>
      <div className="flex flex-wrap gap-1.5">
        {types.map(([key, item]) => {
          const isSelected = value === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={cn(
                "px-2.5 py-1.5 rounded-lg border text-xs transition-all cursor-pointer font-medium select-none",
                isSelected
                  ? "border-blue-500 bg-blue-600 text-white shadow-sm dark:bg-blue-600"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800"
              )}
            >
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
