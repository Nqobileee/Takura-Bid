import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fsloinrsdnpvgsswbbzz.supabase.co'
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzbG9pbnJzZG5wdmdzc3diYnp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NTY1MzYsImV4cCI6MjA4NzUzMjUzNn0.euXZ1T4VIDdwzmmGSNLgjj1lLEF9sMw4Ddb-qKu4Cvo'

// Use service role key when available — bypasses RLS and permission grants.
// Fall back to anon key (works if GRANTs have been applied to the schema).
function getAdminClient() {
  return createSupabaseClient(supabaseUrl, serviceRoleKey ?? anonKey, {
    auth: { persistSession: false },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, name, role } = body as {
      email: string
      password: string
      name: string
      role: 'CLIENT' | 'DRIVER'
    }

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['CLIENT', 'DRIVER'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const supabase = getAdminClient()

    // Check if email is already taken
    const { data: existing, error: lookupError } = await supabase
      .from('users')
      .select('user_id')
      .eq('email', email)
      .maybeSingle()

    if (lookupError) {
      return NextResponse.json({ error: lookupError.message }, { status: 500 })
    }

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    const user_id = crypto.randomUUID()

    const { error: insertError } = await supabase.from('users').insert({
      user_id,
      email,
      password,
      name,
      role,
      account_status: 'Active',
    })

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Insert a welcome notification for the new user
    void Promise.resolve(
      supabase.from('notifications').insert({
        user_id,
        title: 'Welcome to TakuraBid',
        body: role === 'DRIVER'
          ? 'Start browsing available loads and place your first bid.'
          : 'Post your first load and connect with drivers.',
        type: 'info',
      })
    ).catch(() => {})

    return NextResponse.json({ user_id, email, name, role }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
