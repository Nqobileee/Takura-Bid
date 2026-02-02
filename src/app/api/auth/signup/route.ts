import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, userType } = body

    console.log('Signup API called:', { email, userType, name })

    // Validate environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
    }
    if (!serviceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
    }

    console.log('Creating Supabase client...')

    // Create Supabase client with service role (bypasses RLS)
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    console.log('Creating auth user...')

    // Step 1: Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    })

    if (authError) {
      console.error('Auth error:', authError)
      throw authError
    }
    if (!authData.user) {
      throw new Error('User creation failed: no user returned')
    }

    console.log('Auth user created:', authData.user.id)
    console.log('Creating database user record...')

    // Step 2: Create user record in database (service role bypasses RLS)
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        auth_id: authData.user.id,
        type: userType,
        name,
        avatar: name.substring(0, 2).toUpperCase(),
        email,
      })
      .select()
      .single()

    if (userError) {
      console.error('User record error:', userError)
      throw userError
    }

    console.log('User created successfully:', userData.id)

    return NextResponse.json(
      {
        success: true,
        user: userData,
        message: 'Account created successfully',
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Signup API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Signup failed',
        details: error.toString(),
      },
      { status: 400 }
    )
  }
}
