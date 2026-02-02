'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface DashboardStats {
  totalConversations: number
  unreadMessages: number
  totalMessages: number
  activeDrivers: number
  activeLoads: number
  completedLoads: number
  totalSpent: number
}

export default function ClientDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalConversations: 0,
    unreadMessages: 0,
    totalMessages: 0,
    activeDrivers: 0,
    activeLoads: 0,
    completedLoads: 0,
    totalSpent: 0
  })
  const [greeting, setGreeting] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const hour = currentTime.getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [currentTime])

  useEffect(() => {
    if (user) {
      loadDashboardStats()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const loadDashboardStats = async () => {
    if (!user) return

    try {
      // Get conversations count
      const { count: convCount } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', user.id)

      // Get messages count
      const { count: msgCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('sender_id', user.id)

      // Get unread messages
      const { data: conversations } = await supabase
        .from('conversations')
        .select('id')
        .eq('client_id', user.id)

      let unreadCount = 0
      if (conversations && conversations.length > 0) {
        const convIds = conversations.map(c => c.id)
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .in('conversation_id', convIds)
          .neq('sender_id', user.id)
          .eq('read', false)
        unreadCount = count || 0
      }

      // Get active drivers count
      const { count: driverCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'driver')

      // Get active loads (posted by this client)
      const { count: activeLoadsCount } = await supabase
        .from('loads')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', user.id)
        .in('status', ['pending', 'in_transit'])

      // Get completed loads
      const { count: completedLoadsCount } = await supabase
        .from('loads')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', user.id)
        .eq('status', 'delivered')

      // Get total spent (payments)
      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('payer_id', user.id)
        .eq('status', 'completed')

      const totalSpent = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

      setStats({
        totalConversations: convCount || 0,
        unreadMessages: unreadCount,
        totalMessages: msgCount || 0,
        activeDrivers: driverCount || 0,
        activeLoads: activeLoadsCount || 0,
        completedLoads: completedLoadsCount || 0,
        totalSpent
      })
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  // Show loading state or redirect loading
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout userType="client">
      <div className="content-area space-y-6">
        {/* Welcome Header with Gradient */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-neutral-900 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-orange-300 text-sm mb-1">{greeting} 🌟</p>
                <h1 className="text-3xl font-bold">
                  {user?.name || 'Client'}
                </h1>
                <p className="text-stone-300 mt-2 max-w-lg">
                  Manage your shipments and connect with trusted drivers. Your logistics dashboard is ready.
                </p>
              </div>
              <div className="mt-6 lg:mt-0 flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-orange-400">{stats.activeLoads}</p>
                  <p className="text-stone-400 text-sm">Active Loads</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-green-400">{formatCurrency(stats.totalSpent)}</p>
                  <p className="text-stone-400 text-sm">Total Spent</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-500">Active Chats</p>
                <p className="text-3xl font-bold text-stone-900 mt-1">{stats.totalConversations}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <Link href="/client/chat" className="text-sm text-orange-600 hover:text-orange-700 mt-4 inline-flex items-center font-medium">
              View all chats
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-500">Unread Messages</p>
                <p className="text-3xl font-bold text-stone-900 mt-1">{stats.unreadMessages}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            {stats.unreadMessages > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 mt-4">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
                Needs attention
              </span>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-500">Completed Loads</p>
                <p className="text-3xl font-bold text-stone-900 mt-1">{stats.completedLoads}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <Link href="/client/analytics" className="text-sm text-green-600 hover:text-green-700 mt-4 inline-flex items-center font-medium">
              View analytics
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-500">Available Drivers</p>
                <p className="text-3xl font-bold text-stone-900 mt-1">{stats.activeDrivers}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <Link href="/client/chat" className="text-sm text-amber-600 hover:text-amber-700 mt-4 inline-flex items-center font-medium">
              Connect with drivers
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
            <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Link 
                href="/client/chat"
                className="group flex flex-col items-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-stone-700">Messages</span>
              </Link>
              <Link 
                href="/client/post-load"
                className="group flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-stone-700">Post Load</span>
              </Link>
              <Link 
                href="/client/analytics"
                className="group flex flex-col items-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl hover:from-amber-100 hover:to-amber-200 transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-stone-700">Analytics</span>
              </Link>
              <Link 
                href="/client/profile"
                className="group flex flex-col items-center p-4 bg-gradient-to-br from-stone-50 to-stone-100 rounded-xl hover:from-stone-100 hover:to-stone-200 transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-stone-600 to-stone-700 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-stone-700">My Profile</span>
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-stone-800 via-stone-900 to-neutral-900 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-orange-500/30 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold">Post a New Load!</h2>
              </div>
              <p className="text-stone-300 mb-4 leading-relaxed">
                Get competitive quotes from verified drivers. Fast, secure, and reliable transportation for your cargo.
              </p>
              <Link 
                href="/client/post-load"
                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all hover:shadow-lg"
              >
                Post a Load Now
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}