"use client"

import React, { useState } from "react"
import { Plus, X, ListPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface KeyPointsInputProps {
  keyPoints: string[]
  onChange: (points: string[]) => void
}

export function KeyPointsInput({ keyPoints, onChange }: KeyPointsInputProps) {
  const [currentInput, setCurrentInput] = useState("")

  const handleAdd = () => {
    if (!currentInput.trim()) return
    onChange([...keyPoints, currentInput.trim()])
    setCurrentInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAdd()
    }
  }

  const handleRemove = (index: number) => {
    onChange(keyPoints.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <ListPlus className="w-3.5 h-3.5 text-blue-500" />
          Key Points to Cover (Optional)
        </label>
        <span className="text-[11px] text-slate-400">
          {keyPoints.length}/5 points
        </span>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="e.g. Highlight 30% latency reduction in v2.0"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="text-xs"
          disabled={keyPoints.length >= 5}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={!currentInput.trim() || keyPoints.length >= 5}
          className="shrink-0 text-xs px-3"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add
        </Button>
      </div>

      {keyPoints.length > 0 && (
        <div className="space-y-1.5 pt-1">
          {keyPoints.map((point, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 rounded-full w-4 h-4 flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="truncate">{point}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="text-slate-400 hover:text-red-500 transition-colors p-0.5 rounded cursor-pointer"
                title="Remove point"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
