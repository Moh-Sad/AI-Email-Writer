import { NextResponse } from "next/server"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { saveDraftSchema } from "@/lib/validations/email"


export async function GET(req: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ emails: [] })
    }

    const supabase = (await createClient()) as any
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const filter = url.searchParams.get("filter") // 'all', 'drafts', 'generated'
    const search = url.searchParams.get("search")

    let query = supabase
      .from("emails")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (filter === "drafts") {
      query = query.eq("is_draft", true)
    } else if (filter === "generated") {
      query = query.eq("is_draft", false)
    }

    if (search && search.trim().length > 0) {
      query = query.or(`subject.ilike.%${search}%,body.ilike.%${search}%,recipient.ilike.%${search}%`)
    }

    const { data: emails, error } = await query

    if (error) {
      console.error("Error fetching emails:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ emails })
  } catch (err: unknown) {
    console.error("GET /api/emails error:", err)
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const parseResult = saveDraftSchema.safeParse(json)

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const input = parseResult.data

    if (!isSupabaseConfigured()) {
      // In demo mode without Supabase DB, echo back with simulated ID
      return NextResponse.json({
        email: {
          id: input.id || crypto.randomUUID(),
          user_id: "demo-user",
          ...input,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      })
    }

    const supabase = (await createClient()) as any
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (input.id) {
      // Update existing email
      const { data, error } = await supabase
        .from("emails")
        .update({
          subject: input.subject,
          body: input.body,
          recipient: input.recipient,
          purpose: input.purpose,
          context: input.context,
          key_points: input.key_points,
          tone: input.tone,
          email_type: input.email_type,
          length: input.length,
          is_draft: input.is_draft,
          updated_at: new Date().toISOString(),
        })
        .eq("id", input.id)
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ email: data })
    } else {
      // Insert new email
      const { data, error } = await supabase
        .from("emails")
        .insert({
          user_id: user.id,
          subject: input.subject,
          body: input.body,
          recipient: input.recipient,
          purpose: input.purpose,
          context: input.context,
          key_points: input.key_points,
          tone: input.tone,
          email_type: input.email_type,
          length: input.length,
          is_draft: input.is_draft,
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ email: data }, { status: 201 })
    }
  } catch (err: unknown) {
    console.error("POST /api/emails error:", err)
    return NextResponse.json({ error: "Failed to save email" }, { status: 500 })
  }
}
