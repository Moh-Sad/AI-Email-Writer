"use client"

import React, { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail, Lock, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ThemeToggle } from "@/components/ui/theme-toggle"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/dashboard"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Please enter email and password")
      return
    }

    try {
      setLoading(true)

      if (!isSupabaseConfigured()) {
        toast.success("Welcome back! (Demo Session Active)")
        router.push(redirectTo)
        return
      }

      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("Signed in successfully!")
      router.push(redirectTo)
      router.refresh()
    } catch {
      toast.error("An unexpected error occurred during sign in")
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    toast.success("Continuing in Demo Mode!")
    router.push("/write")
  }

  return (
    <Card className="border-slate-200/80 dark:border-slate-800 shadow-md">
      <CardContent className="pt-6 space-y-4">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 text-xs"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="gradient"
            className="w-full text-xs font-semibold h-10 shadow-md shadow-blue-500/20"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In with Email"}
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-900 px-2 text-slate-400 text-[10px]">
              Instant Test
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleDemoLogin}
          className="w-full text-xs h-9 border-dashed text-slate-700 dark:text-slate-300"
        >
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
          Continue as Guest (Demo Mode)
        </Button>
      </CardContent>

      <CardFooter className="flex flex-col border-t border-slate-100 dark:border-slate-800/80 pt-4 text-center">
        <p className="text-[11px] text-slate-400">
          Protected by Supabase Auth and Row-Level Security
        </p>
      </CardFooter>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-slate-50 dark:bg-[#090d16] relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-slate-900 dark:text-slate-50">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">MailCraft AI</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Sign in to your account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Or{" "}
            <Link href="/signup" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              create a free account
            </Link>{" "}
            to start writing emails
          </p>
        </div>

        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading form...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
