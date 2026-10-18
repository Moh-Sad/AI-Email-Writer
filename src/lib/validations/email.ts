import { z } from "zod"

export const emailToneSchema = z.enum([
  "professional",
  "friendly",
  "formal",
  "persuasive",
  "direct",
  "urgent",
  "empathetic",
  "casual",
])

export const emailTypeSchema = z.enum([
  "general",
  "cold_outreach",
  "follow_up",
  "meeting_request",
  "thank_you",
  "sales_pitch",
  "project_update",
  "apology",
  "proposal",
])

export const emailLengthSchema = z.enum(["short", "medium", "long"])

export const emailGenerationSchema = z.object({
  purpose: z
    .string()
    .min(3, "Please enter at least 3 characters for the purpose")
    .max(500, "Purpose must be under 500 characters"),
  recipient: z.string().max(200),
  context: z.string().max(1000),
  keyPoints: z.array(z.string()),
  tone: emailToneSchema,
  emailType: emailTypeSchema,
  length: emailLengthSchema,
  senderName: z.string().max(100),
})

export const refineActionSchema = z.enum([
  "shorten",
  "expand",
  "rewrite",
  "fix_grammar",
  "make_friendly",
  "make_formal",
  "make_persuasive",
])

export const emailRefineSchema = z.object({
  currentEmail: z.string().min(5, "Email content to refine is required"),
  action: refineActionSchema,
  instruction: z.string().max(300).optional(),
  targetTone: emailToneSchema.optional(),
  targetLength: emailLengthSchema.optional(),
})

export const saveDraftSchema = z.object({
  id: z.string().uuid().optional(),
  subject: z.string().max(255).default("Untitled Email"),
  body: z.string().min(1, "Email body cannot be empty"),
  recipient: z.string().optional().default(""),
  purpose: z.string().optional().default(""),
  context: z.string().optional().default(""),
  key_points: z.array(z.string()).optional().default([]),
  tone: emailToneSchema.default("professional"),
  email_type: emailTypeSchema.default("general"),
  length: emailLengthSchema.default("medium"),
  is_draft: z.boolean().default(false),
})

export type EmailGenerationFormValues = z.infer<typeof emailGenerationSchema>
export type EmailRefineValues = z.infer<typeof emailRefineSchema>
export type SaveDraftValues = z.infer<typeof saveDraftSchema>
