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
      messages: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          is_read?: boolean
          created_at?: string
        }
      }
      realisations: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string
          category: string
          stack: string[]
          live_url: string | null
          github_url: string | null
          is_confidential: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image_url: string
          category: string
          stack: string[]
          live_url?: string | null
          github_url?: string | null
          is_confidential?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image_url?: string
          category?: string
          stack?: string[]
          live_url?: string | null
          github_url?: string | null
          is_confidential?: boolean
          created_at?: string
        }
      }
      avis: {
        Row: {
          id: string
          client_name: string
          client_role: string
          content: string
          rating: number
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          client_name: string
          client_role: string
          content: string
          rating: number
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          client_name?: string
          client_role?: string
          content?: string
          rating?: number
          avatar_url?: string | null
          created_at?: string
        }
      }
      push_subscriptions: {
        Row: {
          id: string
          subscription: Json
          created_at: string
        }
        Insert: {
          id?: string
          subscription: Json
          created_at?: string
        }
        Update: {
          id?: string
          subscription?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
