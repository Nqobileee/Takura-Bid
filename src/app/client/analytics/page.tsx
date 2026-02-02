'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import { analyticsService, type ClientAnalyticsData } from '@/services/analyticsService'
import { EarningsDashboard } from '@/components/analytics/EarningsDashboard'
import { FreightCalculator } from '@/components/freight/FreightCalculator'
import { 
  MessagesAreaChart, 
  MessagesBarChart, 
  WeeklyActivityChart,
  ResponseTimeGauge 
} from '@/components/charts/AnalyticsCharts'

type TabType = 'spending' | 'communication' | 'calculator'

function StatCard({ value, label, icon }: { 
  value: string | number
  label: string
  icon?: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        {icon && (
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

// Default analytics for initial display
const defaultAnalytics: ClientAnalyticsData = {
  totalConversations: 0,
  totalMessagesSent: 0,
  totalMessagesReceived: 0,
  activeDrivers: 0,
  responseRate: 0,
  avgResponseTime: 'N/A',
  dailyStats: [],
  recentActivity: []
}

export default function ClientAnalytics() {
  const { user, isLoading: authLoading } = useAuth()
  const [analytics, setAnalytics] = useState<ClientAnalyticsData>(defaultAnalytics)
  const [activeTab, setActiveTab] = useState<TabType>('spending')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const loadAnalytics = async () => {
      try {
        const data = await analyticsService.getClientAnalytics(user.id)
        setAnalytics(data)
      } catch (error) {
        console.error('Error loading analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [user])

  // Prepare chart data
  const messageChartData = analytics.dailyStats.slice(-7).map(stat => ({
    name: new Date(stat.stat_date).toLocaleDateString('en-US', { weekday: 'short' }),
    sent: stat.messages_sent,
    received: stat.messages_received
  }))

  const weeklyActivityData = analytics.dailyStats.slice(-7).map(stat => ({
    name: new Date(stat.stat_date).toLocaleDateString('en-US', { weekday: 'short' }),
    messages: stat.messages_sent + stat.messages_received,
    conversations: stat.conversations_started
  }))

  // Parse response time for gauge
  const responseTimeMinutes = analytics.avgResponseTime && analytics.avgResponseTime !== 'N/A'
    ? parseInt(analytics.avgResponseTime) || 15
    : 15

  if (authLoading || !user) {
    return (
      <DashboardLayout userType="client">
        <div className="content-area">
          <div className="flex items-center justify-center h-96">
            {authLoading ? (
              <div className="text-center">
                <p className="text-gray-500 mb-4">Loading...</p>
                <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-700 font-semibold mb-4">Please log in to view analytics</p>
                <button 
                  onClick={() => window.location.href = '/auth/login'}
                  className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800"
                >
                  Log in
                </button>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (loading) {
    return (
      <DashboardLayout userType="client">
        <div className="content-area">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-gray-500 mb-4">Loading analytics...</p>
              <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="client">
      <div className="content-area">
        {/* Page Header with Tabs */}
        <div className="page-header mb-8">
          <div>
            <h1 className="page-title">Analytics & Tools</h1>
            <p className="page-subtitle">Track spending, communication, and calculate freight costs</p>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-6 bg-gray-100 rounded-xl p-1 w-fit">
            <button
              onClick={() => setActiveTab('spending')}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'spending'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              💰 Spending
            </button>
            <button
              onClick={() => setActiveTab('communication')}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'communication'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              💬 Communication
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'calculator'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🧮 Calculator
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'spending' && (
          <EarningsDashboard userType="client" userId={user?.id} />
        )}

        {activeTab === 'calculator' && (
          <FreightCalculator />
        )}

        {activeTab === 'communication' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            value={analytics.totalConversations} 
            label="Total Conversations"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            }
          />
          <StatCard 
            value={analytics.totalMessagesSent} 
            label="Messages Sent"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            }
          />
          <StatCard 
            value={analytics.totalMessagesReceived} 
            label="Messages Received"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            }
          />
          <StatCard 
            value={analytics.activeDrivers} 
            label="Active Drivers"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Messages Over Time Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Messages Over Time</h3>
            <MessagesAreaChart data={messageChartData} />
          </div>

          {/* Weekly Activity Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
            <WeeklyActivityChart data={weeklyActivityData} />
          </div>
        </div>

        {/* Communication Performance Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Communication Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Response Rate</span>
                <span className="text-lg font-bold text-green-600">{analytics.responseRate}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Avg Response Time</span>
                <span className="text-lg font-bold text-orange-600">{analytics.avgResponseTime || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Messages This Week</span>
                <span className="text-lg font-bold text-amber-600">
                  {analytics.dailyStats.slice(-7).reduce((sum, d) => sum + d.messages_sent, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Active Conversations</span>
                <span className="text-lg font-bold text-orange-600">{analytics.totalConversations}</span>
              </div>
            </div>
          </div>

          {/* Message Distribution Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Distribution</h3>
            <MessagesBarChart 
              sent={analytics.totalMessagesSent} 
              received={analytics.totalMessagesReceived} 
            />
          </div>

          {/* Response Time Gauge */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time</h3>
            <ResponseTimeGauge value={responseTimeMinutes} maxValue={60} />
            <p className="text-center text-sm text-gray-600 mt-2">
              Average: {analytics.avgResponseTime || 'N/A'}
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          {analytics.recentActivity.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No recent activity. Start using the platform to see your activity!</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {analytics.recentActivity.slice(0, 6).map((event, i) => (
                <div key={event.id || i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    event.event_type === 'message_sent' ? 'bg-orange-100 text-orange-600' :
                    event.event_type === 'conversation_started' ? 'bg-green-100 text-green-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {event.event_type === 'message_sent' && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    )}
                    {event.event_type === 'conversation_started' && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                    {event.event_type === 'login' && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {event.event_type === 'message_sent' && 'Sent a message'}
                      {event.event_type === 'conversation_started' && 'Started a new conversation'}
                      {event.event_type === 'login' && 'Logged in'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}