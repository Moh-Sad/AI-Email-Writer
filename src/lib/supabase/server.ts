import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Database } from "@/types/database.types"
import {
  isSupabaseConfigured,
  getSupabaseUrl,
  getSupabasePublishableKey,
} from "./client"

export async function createClient() {
  const cookieStore = await cookies()
  const url = getSupabaseUrl() || "https://placeholder-url.supabase.co"
  const anonKey = getSupabasePublishableKey() || "placeholder-anon-key"

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Can happen in Server Components, safe to ignore if middleware handles session refresh
        }
      },
    },
  })
}

export function getSupabaseSecretKey(): string {
  return (
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    ""
  )
}

export { isSupabaseConfigured, getSupabaseUrl, getSupabasePublishableKey }
