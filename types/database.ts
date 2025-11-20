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
      user_profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string
          credits: number
          total_spent: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string
          credits?: number
          total_spent?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string
          credits?: number
          total_spent?: number
          created_at?: string
          updated_at?: string
        }
      }
      generations: {
        Row: {
          id: string
          user_id: string
          prompt: string
          model: string
          aspect_ratio: string
          resolution: string
          mode: string
          status: 'generating' | 'success' | 'error'
          video_url: string | null
          error_message: string | null
          reference_image_url: string | null
          credits_used: number
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          prompt: string
          model?: string
          aspect_ratio?: string
          resolution?: string
          mode?: string
          status?: 'generating' | 'success' | 'error'
          video_url?: string | null
          error_message?: string | null
          reference_image_url?: string | null
          credits_used?: number
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          prompt?: string
          model?: string
          aspect_ratio?: string
          resolution?: string
          mode?: string
          status?: 'generating' | 'success' | 'error'
          video_url?: string | null
          error_message?: string | null
          reference_image_url?: string | null
          credits_used?: number
          created_at?: string
          completed_at?: string | null
        }
      }
      credit_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          transaction_type: 'purchase' | 'generation' | 'refund' | 'bonus'
          description: string
          generation_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          transaction_type: 'purchase' | 'generation' | 'refund' | 'bonus'
          description: string
          generation_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          transaction_type?: 'purchase' | 'generation' | 'refund' | 'bonus'
          description?: string
          generation_id?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      pricing_tiers: {
        Row: {
          id: string
          name: string
          credits: number
          price: number
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          credits: number
          price: number
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          credits?: number
          price?: number
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
