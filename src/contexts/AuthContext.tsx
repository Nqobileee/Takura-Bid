'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface AuthUser {
  id: string
  type: 'client' | 'driver'
  name: string
  avatar: string
  email?: string
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  signIn: (email: string, password: string, userType: 'client' | 'driver') => Promise<void>
  signUp: (email: string, password: string, name: string, userType: 'client' | 'driver') => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session with timeout
    const initializeAuth = async () => {
      // Set a timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        setIsLoading(false)
      }, 1500)

      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // Fetch user details from database
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', session.user.id)
            .single()

          if (userData) {
            setUser({
              id: userData.id,
              type: userData.type,
              name: userData.name,
              avatar: userData.avatar,
              email: session.user.email
            })
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        clearTimeout(timeout)
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', session.user.id)
            .single()

          if (userData) {
            setUser({
              id: userData.id,
              type: userData.type,
              name: userData.name,
              avatar: userData.avatar,
              email: session.user.email
            })
          }
        } catch (error) {
          console.error('Error fetching user:', error)
        }
      } else {
        setUser(null)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, name: string, userType: 'client' | 'driver') => {
    try {
      console.log('Calling signup API...')
      
      // Call server-side API endpoint that uses service role
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          userType,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Signup failed')
      }

      // Sign in with the newly created account
      console.log('Signing in...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Set user in state
      setUser({
        id: result.user.id,
        type: result.user.type,
        name: result.user.name,
        avatar: result.user.avatar,
        email: result.user.email,
      })

      console.log('Signup complete!')
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  const signIn = async (email: string, password: string, userType: 'client' | 'driver') => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Check if user exists in users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', data.user.id)
        .single()

      let userData = existingUser

      // If user doesn't exist in users table, create them
      if (!userData) {
        const name = email.split('@')[0]
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert({
            auth_id: data.user.id,
            type: userType,
            name: name.charAt(0).toUpperCase() + name.slice(1),
            avatar: name.substring(0, 2).toUpperCase(),
            email: email
          })
          .select()
          .single()

        if (userError) throw userError
        userData = newUser
      }

      if (userData) {
        setUser({
          id: userData.id,
          type: userData.type,
          name: userData.name,
          avatar: userData.avatar,
          email: userData.email
        })
      }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
