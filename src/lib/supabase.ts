import { createClient, SupabaseClient } from '@supabase/supabase-js'

// For build time, use placeholder values that will be replaced at runtime
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface User {
  id: string
  type: 'client' | 'driver'
  name: string
  avatar: string
  created_at: string
}

export interface Conversation {
  id: string
  client_id: string
  driver_id: string
  job_id: string
  created_at: string
}

export interface ChatMessage {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  read: boolean
  created_at: string
}
