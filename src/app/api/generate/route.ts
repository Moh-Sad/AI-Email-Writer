import { streamText } from "ai"
import { getAIModel, getActiveProviderInfo } from "@/lib/ai/provider"
import { buildEmailSystemPrompt, buildEmailUserPrompt } from "@/lib/ai/prompts"
import { emailGenerationSchema } from "@/lib/validations/email"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { checkAndRecordUsage } from "@/lib/usage"


export async function POST(req: Request) {
  try {
    const json = await req.json()
    const parseResult = emailGenerationSchema.safeParse(json)

    if (!parseResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid input",
          details: parseResult.error.flatten().fieldErrors,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const input = parseResult.data

    // Authenticate user if Supabase is enabled
    let userId = "demo-user"
    if (isSupabaseConfigured()) {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return new Response(
          JSON.stringify({ error: "Unauthorized. Please log in to generate emails." }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        )
      }
      userId = user.id
    }

    // Check usage limits
    const usage = await checkAndRecordUsage(userId, "generate")
    if (!usage.allowed) {
      return new Response(
        JSON.stringify({
          error: usage.error || "Monthly generation limit reached.",
          limit: usage.limit,
          used: usage.used,
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      )
    }

    // Get active AI model
    const providerInfo = getActiveProviderInfo()
    if (!providerInfo.isConfigured) {
      return new Response(
        JSON.stringify({
          error: `AI Provider (${providerInfo.providerDisplayName}) is not configured. Please add your GEMINI_API_KEY to .env or .env.local.`,
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      )
    }

    const { model, modelName } = getAIModel()

    const system = buildEmailSystemPrompt()
    const prompt = buildEmailUserPrompt(input)

    const result = streamText({
      model,
      system,
      prompt,
      temperature: 0.7,
    })

    return result.toTextStreamResponse({
      headers: {
        "x-model-name": modelName,
        "x-provider": providerInfo.provider,
        "x-remaining-credits": usage.remaining.toString(),
      },
    })
  } catch (error: unknown) {
    console.error("Email generation API error:", error)
    const message = error instanceof Error ? error.message : "Internal server error"
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
