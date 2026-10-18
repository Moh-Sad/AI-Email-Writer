export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          tier?: 'free' | 'pro' | 'enterprise'
          monthly_generation_limit?: number
          generations_used_this_month?: number
          last_reset_date?: string
          preferred_tone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          tier?: 'free' | 'pro' | 'enterprise'
          monthly_generation_limit?: number
          generations_used_this_month?: number
          last_reset_date?: string
          preferred_tone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      emails: {
        Row: {
          id: string
          user_id: string
          subject: string
          body: string
          recipient: string
          purpose: string
          context: string
          key_points: string[]
          tone: string
          email_type: string
          length: string
          is_draft: boolean
          version: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject?: string
          body: string
          recipient?: string
          purpose?: string
          context?: string
          key_points?: string[]
          tone?: string
          email_type?: string
          length?: string
          is_draft?: boolean
          version?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject?: string
          body?: string
          recipient?: string
          purpose?: string
          context?: string
          key_points?: string[]
          tone?: string
          email_type?: string
          length?: string
          is_draft?: boolean
          version?: number
          created_at?: string
          updated_at?: string
        }
      }
      usage_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          prompt_tokens: number
          completion_tokens: number
          model_used: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          prompt_tokens?: number
          completion_tokens?: number
          model_used?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          prompt_tokens?: number
          completion_tokens?: number
          model_used?: string
          created_at?: string
        }
      }
    }
  }
}
