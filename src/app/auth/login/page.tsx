'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [userType, setUserType] = useState<'client' | 'driver'>('client')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('Starting auth process...', { isSignUp, userType, email })
      
      if (isSignUp) {
        console.log('Calling signUp...')
        await signUp(email, password, name, userType)
      } else {
        console.log('Calling signIn...')
        await signIn(email, password, userType)
      }
      
      console.log('Auth successful, waiting...')
      // Wait a moment for auth context to update
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect based on user type
      if (userType === 'driver') {
        window.location.href = '/driver/chat'
      } else {
        window.location.href = '/client/chat'
      }
    } catch (err: any) {
      console.error('Auth error:', err)
      setError(err.message || (isSignUp ? 'Sign up failed' : 'Login failed'))
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">TakuraBid</h1>
        <p className="text-center text-gray-600 mb-6">{isSignUp ? 'Create your account' : 'Welcome back'}</p>
        
        <form onSubmit={handleAuth} className="space-y-4">
          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">I am a:</label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="client"
                  checked={userType === 'client'}
                  onChange={(e) => setUserType(e.target.value as 'client')}
                  className="mr-2"
                />
                <span className="text-gray-700">Client</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="driver"
                  checked={userType === 'driver'}
                  onChange={(e) => setUserType(e.target.value as 'driver')}
                  className="mr-2"
                />
                <span className="text-gray-700">Driver</span>
              </label>
            </div>
          </div>

          {/* Name (Sign Up Only) */}
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required={isSignUp}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (isSignUp ? 'Creating account...' : 'Logging in...') : (isSignUp ? 'Sign Up' : 'Log In')}
          </button>

          {/* Toggle Sign Up / Sign In */}
          <div className="text-center text-sm text-gray-600">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
              }}
              className="text-gray-900 font-semibold hover:underline"
            >
              {isSignUp ? 'Log In' : 'Sign Up'}
            </button>
          </div>
        </form>

        {/* Test Credentials */}
        {!isSignUp && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600">
            <p className="font-semibold mb-2">Test Credentials:</p>
            <p>📧 <code className="bg-white px-2 py-1 rounded">client@test.com</code></p>
            <p>🔑 <code className="bg-white px-2 py-1 rounded">Test123!</code></p>
          </div>
        )}
      </div>
    </div>
  )
}
