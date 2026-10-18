"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Mail,
  Sparkles,
  Zap,
  ShieldCheck,
  Check,
  ArrowRight,
  PenTool,
  Copy,
  Scissors,
  Maximize2,
  RotateCcw,
  Star,
  CheckCircle2,
  ChevronRight,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { copyToClipboard } from "@/lib/utils"
import { toast } from "sonner"

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"sales" | "exec" | "followup">("sales")
  const [copied, setCopied] = useState(false)

  const sampleEmails = {
    sales: {
      subject: "Boosting Acme's pipeline conversion by 35% with MailCraft AI",
      body: `Hi Sarah,\n\nI noticed Acme's recent expansion into the enterprise sector—congratulations on the stellar momentum.\n\nMost fast-growing sales teams face a hidden bottleneck: SDRs and account reps spend over 2.5 hours every day drafting follow-ups, contract recaps, and outreach pitches from scratch.\n\nMailCraft AI eliminates this drain by turning CRM signals into executive-ready, tone-perfect communications in under 10 seconds. Teams using our platform reported a 35% jump in reply rates during their first month.\n\nWould you be open to a brief 10-minute sync next Tuesday at 2 PM ET to see our interactive live benchmark?\n\nBest regards,\nAlex Rivera\nHead of Growth, MailCraft`,
    },
    exec: {
      subject: "Q3 Project Milestone Recap & Upcoming Beta Launch",
      body: `Executive Team,\n\nI am pleased to share that Sprint 42 has wrapped up on schedule with 100% of P0 deliverables cleared.\n\nKey Highlights:\n• Core server-side streaming API deployed with sub-80ms first-token latency.\n• Supabase Row Level Security audits passed with zero vulnerabilities.\n• Beta cohort onboarding kicks off this coming Monday with 50 pilot customers.\n\nNext Steps:\nWe will review initial user retention and conversion metrics during the weekly sync on Thursday.\n\nWarm regards,\nJordan Lee\nVP of Product Engineering`,
    },
    followup: {
      subject: "Follow-up: Architecture discussion & next steps",
      body: `Hi Marcus,\n\nThank you for the thoughtful discussion yesterday regarding our cloud security model.\n\nAs promised, I have attached the compliance overview covering our zero-retention policy and database encryption protocols. Our engineering lead is also prepared to join a technical deep-dive with your team next week.\n\nLet me know if Wednesday afternoon works for your calendar.\n\nBest,\nElena Rostova\nSolutions Architect`,
    },
  }

  const currentSample = sampleEmails[activeTab]

  const handleCopySample = async () => {
    const text = `Subject: ${currentSample.subject}\n\n${currentSample.body}`
    const success = await copyToClipboard(text)
    if (success) {
      setCopied(true)
      toast.success("Sample email copied!")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 selection:bg-blue-100 dark:selection:bg-blue-900/40">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-50">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight">
              MailCraft<span className="text-blue-600 dark:text-blue-400 font-semibold text-xs ml-1 px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60">AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
            <a href="#demo" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              Interactive Demo
            </a>
            <a href="#features" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              Capabilities
            </a>
            <a href="#pricing" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              Pricing
            </a>
            <a href="#security" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              Security
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="hidden sm:inline-block">
              <Button variant="ghost" size="sm" className="text-xs">
                Sign In
              </Button>
            </Link>
            <Link href="/write">
              <Button variant="gradient" size="sm" className="text-xs font-semibold shadow-md shadow-blue-500/20">
                <PenTool className="w-3.5 h-3.5 mr-1.5" />
                Open Studio
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden text-center px-4">
        {/* Subtle glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/10 to-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <Badge className="bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60 text-xs px-3 py-1 gap-1.5 font-medium shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Next-Gen Executive Email Studio
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            Turn rough notes into{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              high-converting emails
            </span>{" "}
            in seconds.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stop agonizing over the perfect wording. Craft compelling cold pitches, executive recaps, and follow-ups with instant server-side AI streaming and tone calibration.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link href="/write" className="w-full sm:w-auto">
              <Button size="lg" variant="gradient" className="w-full text-sm font-semibold shadow-lg shadow-blue-500/25 h-12 px-7">
                <Sparkles className="w-4 h-4 mr-2 text-amber-300" />
                Start Writing for Free
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full text-sm font-medium h-12 px-6 border-slate-300 dark:border-slate-700">
                Sign In to Dashboard
              </Button>
            </Link>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 30 free monthly generations
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero data training policy
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Split-Screen Live Demo */}
      <section id="demo" className="max-w-6xl mx-auto w-full px-4 pb-24">
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Experience the Split-Pane Studio
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Select a sample scenario below to see how raw context transforms into a polished response.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setActiveTab("sales")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activeTab === "sales"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              💼 Cold Outreach
            </button>
            <button
              onClick={() => setActiveTab("exec")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activeTab === "exec"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              📊 Executive Update
            </button>
            <button
              onClick={() => setActiveTab("followup")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activeTab === "followup"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              🤝 Meeting Follow-up
            </button>
          </div>
        </div>

        {/* Studio Window Mockup */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
          {/* Mock Window Titlebar */}
          <div className="h-10 px-4 bg-slate-100/90 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-amber-400/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
              <span className="ml-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                mailcraft.ai/write
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold">
                Live Studio Engine
              </Badge>
            </div>
          </div>

          {/* Split Pane Demo Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
            {/* Left Form Demo */}
            <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase text-slate-400">Email Objective</span>
                <div className="text-xs font-medium text-slate-800 dark:text-slate-200 p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {activeTab === "sales"
                    ? "Introduce AI email assistant to VP of Sales at Acme"
                    : activeTab === "exec"
                    ? "Deliver Sprint 42 milestones recap and beta kickoff announcement"
                    : "Follow up with Marcus on enterprise security architecture"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Selected Tone</div>
                  <div className="font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                    {activeTab === "sales" ? "🎯 Persuasive" : activeTab === "exec" ? "💼 Direct" : "🤝 Friendly"}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Length</div>
                  <div className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                    {activeTab === "sales" ? "Short (Punchy)" : "Medium (Balanced)"}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Key Bullet Points Included</div>
                <div className="space-y-1 text-xs">
                  <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 text-slate-600 dark:text-slate-300">
                    ✓ Reduced email creation time by 60%
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 text-slate-600 dark:text-slate-300">
                    ✓ Zero retention enterprise privacy
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/write">
                  <Button variant="gradient" className="w-full text-xs font-semibold h-10 shadow-md">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Open Studio & Generate Custom
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Preview Demo */}
            <div className="lg:col-span-7 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-mono">
                      ~150 words
                    </Badge>
                    <Badge variant="success" className="text-[10px]">
                      Ready to Send
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopySample}
                    className="text-xs h-7 px-2.5"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 mr-1 text-emerald-500" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" /> Copy Email
                      </>
                    )}
                  </Button>
                </div>

                {/* Subject */}
                <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Subject Line
                  </span>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {currentSample.subject}
                  </div>
                </div>

                {/* Body */}
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
                  {currentSample.body}
                </div>
              </div>

              {/* Bottom Quick Refine Bar */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-slate-400 text-[11px]">Instant transformations available:</span>
                <div className="flex items-center gap-1.5">
                  <Link href="/write">
                    <Button variant="secondary" size="sm" className="text-[11px] h-7 px-2">
                      <Scissors className="w-3 h-3 mr-1" /> Shorten
                    </Button>
                  </Link>
                  <Link href="/write">
                    <Button variant="secondary" size="sm" className="text-[11px] h-7 px-2">
                      <Maximize2 className="w-3 h-3 mr-1" /> Expand
                    </Button>
                  </Link>
                  <Link href="/write">
                    <Button variant="secondary" size="sm" className="text-[11px] h-7 px-2">
                      <RotateCcw className="w-3 h-3 mr-1" /> Rewrite
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Grid */}
      <section id="features" className="max-w-6xl mx-auto w-full px-4 py-16 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <Badge variant="outline" className="text-xs">
            Engineered for High-Stakes Email
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Everything you need to communicate like a Fortune 500 executive
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Built from the ground up for modern professionals, founders, and sales teams who demand precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Live Token Streaming
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Powered by Vercel AI SDK. See your email materialize in real-time with sub-100ms response latencies and zero sluggish waits.
            </p>
          </Card>

          <Card className="p-6 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Multi-Tone Calibration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Instantly toggle between Professional, Friendly, Formal, Persuasive, Direct, and Urgent tones with calibrated phrasing models.
            </p>
          </Card>

          <Card className="p-6 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Supabase Row Level Security
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Strict database isolation. Your drafts, contacts, and email history are protected by cryptographic PostgreSQL RLS policies.
            </p>
          </Card>

          <Card className="p-6 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Scissors className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              1-Click Refinement
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Make long emails punchy, expand short drafts with rich details, or fix grammar seamlessly with dedicated transformation pipelines.
            </p>
          </Card>

          <Card className="p-6 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Strict Server-Side AI
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              API keys and model calls are never exposed to the client browser. Enforced usage quotas prevent credit exhaustion.
            </p>
          </Card>

          <Card className="p-6 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <PenTool className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              History & Draft Sync
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Save in-progress drafts, revisit past emails, download as .eml / .txt, or export straight into your native email client.
            </p>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-5xl mx-auto w-full px-4 py-20 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <Badge variant="outline" className="text-xs">
            Simple, Transparent Pricing
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Start free, scale as you communicate
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            No unexpected billing. Upgrade anytime for higher quotas and custom team features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Tier */}
          <Card className="p-6 border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Starter Free</h3>
                <p className="text-xs text-slate-500 mt-1">Perfect for individuals and exploring AI email drafting</p>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                $0 <span className="text-xs text-slate-400 font-normal">/ month forever</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" /> 30 AI email generations per month
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" /> All 8 tones and 9 email types
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" /> Live response streaming
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" /> Unlimited drafts & history storage
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" /> 1-click refine and export
                </li>
              </ul>
            </div>
            <Link href="/write" className="w-full">
              <Button variant="outline" className="w-full text-xs font-semibold h-10">
                Get Started Free
              </Button>
            </Link>
          </Card>

          {/* Pro Tier */}
          <Card className="p-6 border-blue-500 dark:border-blue-500 bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-950/20 dark:to-slate-900 flex flex-col justify-between space-y-6 relative shadow-lg shadow-blue-500/10">
            <div className="absolute -top-3 right-6">
              <Badge variant="default" className="bg-blue-600 text-white text-[10px] uppercase font-bold tracking-wider">
                Recommended
              </Badge>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Professional</h3>
                <p className="text-xs text-slate-500 mt-1">For executives, founders, and power communicators</p>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                $19 <span className="text-xs text-slate-400 font-normal">/ month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2 font-medium text-slate-900 dark:text-slate-100">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" /> Unlimited AI email generation
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" /> Priority access to GPT-4o / Claude 3.5
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" /> Custom tone fine-tuning
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" /> Multiple team signatures & presets
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" /> Dedicated priority support
                </li>
              </ul>
            </div>
            <Link href="/signup" className="w-full">
              <Button variant="gradient" className="w-full text-xs font-semibold h-10 shadow-md">
                Upgrade to Pro
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              M
            </div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">MailCraft AI</span>
            <span>— Production AI Email SaaS</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/write" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              Studio
            </Link>
            <Link href="/dashboard" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              Dashboard
            </Link>
            <Link href="/history" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              History
            </Link>
            <Link href="/settings" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              Settings
            </Link>
          </div>

          <div>
            © 2026 MailCraft Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
