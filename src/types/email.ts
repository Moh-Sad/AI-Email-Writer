export type EmailTone =
  | 'professional'
  | 'friendly'
  | 'formal'
  | 'persuasive'
  | 'direct'
  | 'urgent'
  | 'empathetic'
  | 'casual'

export type EmailType =
  | 'general'
  | 'cold_outreach'
  | 'follow_up'
  | 'meeting_request'
  | 'thank_you'
  | 'sales_pitch'
  | 'project_update'
  | 'apology'
  | 'proposal'

export type EmailLength = 'short' | 'medium' | 'long'

export type RefineAction =
  | 'shorten'
  | 'expand'
  | 'rewrite'
  | 'fix_grammar'
  | 'make_friendly'
  | 'make_formal'
  | 'make_persuasive'

export interface EmailGenerationInput {
  purpose: string
  recipient?: string
  context?: string
  keyPoints?: string[]
  tone: EmailTone
  emailType: EmailType
  length: EmailLength
  senderName?: string
}

export interface EmailRefineInput {
  currentEmail: string
  action: RefineAction
  instruction?: string
  targetTone?: EmailTone
  targetLength?: EmailLength
}

export interface EmailItem {
  id: string
  user_id: string
  subject: string
  body: string
  recipient: string
  purpose: string
  context: string
  key_points: string[]
  tone: EmailTone
  email_type: EmailType
  length: EmailLength
  is_draft: boolean
  version: number
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  tier: 'free' | 'pro' | 'enterprise'
  monthly_generation_limit: number
  generations_used_this_month: number
  last_reset_date: string
  preferred_tone: string | null
  created_at: string
  updated_at: string
}

export interface GenerationUsageStats {
  used: number
  limit: number
  remaining: number
  tier: string
}
