'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import { analyticsService, type DriverAnalyticsData } from '@/services/analyticsService'
import { EarningsDashboard } from '@/components/analytics/EarningsDashboard'
import { FreightCalculator } from '@/components/freight/FreightCalculator'
import { 
  MessagesAreaChart, 
  MessagesBarChart, 
  WeeklyActivityChart,
  ResponseTimeGauge 
} from '@/components/charts/AnalyticsCharts'

type TabType = 'earnings' | 'communication' | 'calculator'

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

export default function DriverAnalytics() {
  const { user, isLoading: authLoading } = useAuth()
  const [analytics, setAnalytics] = useState<DriverAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('earnings')

  useEffect(() => {
    if (!user) return

    const loadAnalytics = async () => {
      try {
        const data = await analyticsService.getDriverAnalytics(user.id)
        setAnalytics(data)
      } catch (error) {
        console.error('Error loading analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [user])

  if (authLoading || loading) {
    return (
      <DashboardLayout userType="driver">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!user) {
    return (
      <DashboardLayout userType="driver">
        <div className="text-center py-12">
          <p className="text-gray-600">Please log in to view analytics.</p>
        </div>
      </DashboardLayout>
    )
  }

  const defaultAnalytics: DriverAnalyticsData = analytics || {
    totalConversations: 0,
    totalMessagesSent: 0,
    totalMessagesReceived: 0,
    avgResponseTime: 'N/A',
    profileViews: 0,
    profileClicks: 0,
    clickThroughRate: 0,
    dailyStats: [],
    recentActivity: []
  }

  // Transform dailyStats for charts
  const messageChartData = defaultAnalytics.dailyStats.slice(-7).map(stat => ({
    name: new Date(stat.stat_date).toLocaleDateString('en-US', { weekday: 'short' }),
    sent: stat.messages_sent,
    received: stat.messages_received
  }))

  const weeklyActivityData = defaultAnalytics.dailyStats.slice(-7).map(stat => ({
    name: new Date(stat.stat_date).toLocaleDateString('en-US', { weekday: 'short' }),
    messages: stat.messages_sent + stat.messages_received,
    conversations: stat.conversations_started
  }))

  // Parse response time for gauge
  const responseTimeMinutes = typeof defaultAnalytics.avgResponseTime === 'string' && defaultAnalytics.avgResponseTime !== 'N/A'
    ? parseInt(defaultAnalytics.avgResponseTime) || 15
    : 15

  return (
    <DashboardLayout userType="driver">
      <div className="content-area">
        {/* Header with Tabs */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Tools</h1>
          <p className="text-gray-600 mt-2">Track earnings, performance, and calculate freight costs</p>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-6 bg-gray-100 rounded-xl p-1 w-fit">
            <button
              onClick={() => setActiveTab('earnings')}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'earnings'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              💰 Earnings
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
        {activeTab === 'earnings' && (
          <EarningsDashboard userType="driver" />
        )}

        {activeTab === 'calculator' && (
          <FreightCalculator />
        )}

        {activeTab === 'communication' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            value={defaultAnalytics.totalConversations} 
            label="Total Conversations"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
          />
          <StatCard 
            value={defaultAnalytics.totalMessagesSent} 
            label="Messages Sent"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            }
          />
          <StatCard 
            value={defaultAnalytics.totalMessagesReceived} 
            label="Messages Received"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            }
          />
          <StatCard 
            value={`${defaultAnalytics.avgResponseTime}s`} 
            label="Avg Response Time"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Messages Over Time Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Messages Over Time</h2>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-600">Sent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Received</span>
                </div>
              </div>
            </div>
            <MessagesAreaChart data={messageChartData} />
          </div>

          {/* Weekly Activity Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Weekly Activity</h2>
            <WeeklyActivityChart data={weeklyActivityData} />
          </div>
        </div>

        {/* Profile Performance & Response Time */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Performance</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-900">{defaultAnalytics.profileViews}</div>
                <div className="text-sm text-orange-700">Profile Views</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-900">{defaultAnalytics.profileClicks}</div>
                <div className="text-sm text-green-700">Profile Clicks</div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Click-through Rate</span>
                  <span className="font-semibold">{defaultAnalytics.clickThroughRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(defaultAnalytics.clickThroughRate, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Message Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Message Distribution</h2>
            <MessagesBarChart 
              sent={defaultAnalytics.totalMessagesSent} 
              received={defaultAnalytics.totalMessagesReceived} 
            />
          </div>

          {/* Response Time Gauge */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Response Performance</h2>
            <div className="flex items-center justify-center h-48">
              <ResponseTimeGauge value={responseTimeMinutes} maxValue={60} />
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              Average: {defaultAnalytics.avgResponseTime}
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
          {defaultAnalytics.recentActivity.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>No recent activity yet. Start chatting to see your activity!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {defaultAnalytics.recentActivity.slice(0, 8).map((event, i) => (
                <div key={event.id || i} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    event.event_type === 'message_sent' ? 'bg-orange-100 text-orange-600' :
                    event.event_type === 'message_received' ? 'bg-green-100 text-green-600' :
                    event.event_type === 'profile_view' ? 'bg-amber-100 text-amber-600' :
                    event.event_type === 'conversation_started' ? 'bg-orange-100 text-orange-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {event.event_type === 'message_sent' && 'Message Sent'}
                      {event.event_type === 'message_received' && 'Message Received'}
                      {event.event_type === 'profile_view' && 'Profile Viewed'}
                      {event.event_type === 'conversation_started' && 'New Conversation'}
                    </p>
                    <p className="text-sm text-gray-500">
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