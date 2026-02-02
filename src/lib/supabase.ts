import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create Supabase client with lazy initialization for SSR/build compatibility
let _supabase: SupabaseClient | null = null

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    if (!_supabase) {
      if (!supabaseUrl || !supabaseAnonKey) {
        // During build time, return a dummy that won't crash
        if (typeof window === 'undefined') {
          _supabase = createClient('https://placeholder.supabase.co', 'placeholder')
        } else {
          throw new Error('Supabase environment variables are not configured')
        }
      } else {
        _supabase = createClient(supabaseUrl, supabaseAnonKey)
      }
    }
    return (_supabase as any)[prop]
  }
})

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
