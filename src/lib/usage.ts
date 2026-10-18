import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"

export interface UsageCheckResult {
  allowed: boolean
  remaining: number
  limit: number
  used: number
  tier: string
  error?: string
}

export async function checkAndRecordUsage(
  userId: string,
  action: string,
  modelUsed: string = "default"
): Promise<UsageCheckResult> {
  // If Supabase is not configured yet (e.g. initial setup preview), allow generation with demo stats
  if (!isSupabaseConfigured()) {
    return {
      allowed: true,
      remaining: 25,
      limit: 30,
      used: 5,
      tier: "free (demo)",
    }
  }

  try {
    const supabase = (await createClient()) as any

    // 1. Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (profileError || !profile) {
      console.warn("Could not find profile for user:", userId, profileError)
      return {
        allowed: true,
        remaining: 30,
        limit: 30,
        used: 0,
        tier: "free",
      }
    }

    // 2. Check if a month has elapsed since last reset
    const lastReset = new Date(profile.last_reset_date || new Date())
    const now = new Date()
    const isNewMonth =
      now.getFullYear() > lastReset.getFullYear() ||
      now.getMonth() > lastReset.getMonth()

    let used = profile.generations_used_this_month || 0
    if (isNewMonth) {
      used = 0
      await supabase
        .from("profiles")
        .update({
          generations_used_this_month: 0,
          last_reset_date: now.toISOString(),
        })
        .eq("id", userId)
    }

    const limit = profile.monthly_generation_limit || 30
    const remaining = Math.max(0, limit - used)

    if (used >= limit) {
      return {
        allowed: false,
        remaining: 0,
        limit,
        used,
        tier: profile.tier || "free",
        error: `Monthly limit of ${limit} email generations reached. Upgrade to Pro for unlimited generation.`,
      }
    }

    // 3. Increment usage
    const newUsed = used + 1
    await supabase
      .from("profiles")
      .update({
        generations_used_this_month: newUsed,
      })
      .eq("id", userId)

    // 4. Log usage in audit table
    await supabase.from("usage_logs").insert({
      user_id: userId,
      action,
      model_used: modelUsed,
    })

    return {
      allowed: true,
      remaining: Math.max(0, limit - newUsed),
      limit,
      used: newUsed,
      tier: profile.tier || "free",
    }
  } catch (err) {
    console.error("Usage check error:", err)
    return {
      allowed: true,
      remaining: 10,
      limit: 30,
      used: 20,
      tier: "free",
    }
  }
}

export async function getUserUsageStats(userId?: string): Promise<UsageCheckResult> {
  if (!isSupabaseConfigured() || !userId) {
    return {
      allowed: true,
      remaining: 25,
      limit: 30,
      used: 5,
      tier: "free",
    }
  }

  try {
    const supabase = (await createClient()) as any
    const { data: profile } = await supabase
      .from("profiles")
      .select("tier, monthly_generation_limit, generations_used_this_month")
      .eq("id", userId)
      .single()

    if (!profile) {
      return {
        allowed: true,
        remaining: 30,
        limit: 30,
        used: 0,
        tier: "free",
      }
    }

    const limit = profile.monthly_generation_limit || 30
    const used = profile.generations_used_this_month || 0

    return {
      allowed: used < limit,
      remaining: Math.max(0, limit - used),
      limit,
      used,
      tier: profile.tier || "free",
    }
  } catch {
    return {
      allowed: true,
      remaining: 25,
      limit: 30,
      used: 5,
      tier: "free",
    }
  }
}
