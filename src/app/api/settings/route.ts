import { NextResponse } from "next/server"
import { getActiveProviderInfo } from "@/lib/ai/provider"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"


export async function GET() {
  try {
    const providerInfo = getActiveProviderInfo()
    const supabaseConfigured = isSupabaseConfigured()

    let userProfile = null

    if (supabaseConfigured) {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        userProfile = profile || {
          id: user.id,
          email: user.email,
          tier: "free",
          monthly_generation_limit: 30,
          generations_used_this_month: 0,
        }
      }
    }

    return NextResponse.json({
      aiProvider: {
        provider: providerInfo.provider,
        displayName: providerInfo.providerDisplayName,
        modelName: providerInfo.modelName,
        isConfigured: providerInfo.isConfigured,
      },
      database: {
        isConfigured: supabaseConfigured,
        mode: supabaseConfigured ? "Supabase PostgreSQL with RLS" : "Local Development / Demo Mode",
      },
      userProfile: userProfile || {
        email: "demo@mailcraft.ai",
        tier: "free",
        monthly_generation_limit: 30,
        generations_used_this_month: 2,
      },
    })
  } catch (err: unknown) {
    console.error("Settings API error:", err)
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 })
  }
}
