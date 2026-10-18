"use client"

import React, { useState, useEffect } from "react"
import {
  User,
  ShieldCheck,
  Cpu,
  Database,
  Key,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.error("Settings load error:", err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex-1 max-w-4xl mx-auto w-full p-6 text-center text-xs text-slate-400">
        Loading settings...
      </div>
    )
  }

  const aiProvider = data?.aiProvider || {}
  const database = data?.database || {}
  const profile = data?.userProfile || {}

  const usagePercent = Math.min(
    100,
    Math.round(((profile.generations_used_this_month || 0) / (profile.monthly_generation_limit || 30)) * 100)
  )

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Account & Configuration
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review your subscription plan, AI provider integration, and security status.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Plan & Usage Card */}
        <Card className="border-slate-200/80 dark:border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Subscription & Monthly Usage Limits
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Server-enforced generation quotas for fair usage
                </CardDescription>
              </div>
              <Badge variant="secondary" className="capitalize text-xs font-semibold px-2.5 py-1">
                {profile.tier || "free"} Plan
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 font-medium mb-1.5">
                <span>Monthly Generations Used</span>
                <span>
                  {profile.generations_used_this_month || 0} / {profile.monthly_generation_limit || 30}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs">
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  Need unlimited emails & custom fine-tuned tones?
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  Pro plans include unlimited generation, team templates, and custom domain signatures.
                </div>
              </div>
              <Button size="sm" variant="gradient" className="shrink-0 text-xs">
                Upgrade to Pro <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Provider Status Card */}
        <Card className="border-slate-200/80 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-500" />
              AI Model Provider
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              All AI generations are executed securely server-side. Client never sees API keys.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Active Provider
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-2">
                  {aiProvider.displayName || "OpenAI"}
                  {aiProvider.isConfigured ? (
                    <Badge variant="success" className="text-[10px] py-0">
                      Configured
                    </Badge>
                  ) : (
                    <Badge variant="amber" className="text-[10px] py-0">
                      Demo / Default Key
                    </Badge>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Target Model
                </div>
                <div className="text-sm font-mono font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {aiProvider.modelName || "gpt-4o-mini"}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 text-xs text-blue-900 dark:text-blue-300">
              💡 You can switch the active provider anytime by setting <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900 font-mono text-[11px]">AI_PROVIDER=openai|google|anthropic</code> and the corresponding API key in your Vercel or local <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900 font-mono text-[11px]">.env</code>.
            </div>
          </CardContent>
        </Card>

        {/* Database & Security Card */}
        <Card className="border-slate-200/80 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Database & Row Level Security (RLS)
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              User data isolation and secure PostgreSQL configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    PostgreSQL Connection
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {database.mode}
                  </div>
                </div>
              </div>
              <Badge variant={database.isConfigured ? "success" : "secondary"}>
                {database.isConfigured ? "Connected" : "Demo Mode"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <Key className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Row Level Security (RLS)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Emails and profiles can only be queried by the authenticated user
                  </div>
                </div>
              </div>
              <Badge variant="success" className="text-xs">
                Enforced
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
