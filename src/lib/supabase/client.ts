import { createBrowserClient } from "@supabase/ssr"
import { Database } from "@/types/database.types"

export function getSupabaseUrl(): string {
  return process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
}

export function getSupabasePublishableKey(): string {
  return (
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""
  )
}

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl()
  const key = getSupabasePublishableKey()
  return !!(url && key && !url.includes("your-project") && url.startsWith("http"))
}

export function createClient() {
  const url = getSupabaseUrl() || "https://placeholder-url.supabase.co"
  const anonKey = getSupabasePublishableKey() || "placeholder-anon-key"

  return createBrowserClient<Database>(url, anonKey)
}
