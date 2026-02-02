import { supabase } from '@/lib/supabase'

export interface UserStats {
  id: string
  user_id: string
  total_messages_sent: number
  total_messages_received: number
  total_conversations: number
  profile_views: number
  profile_clicks: number
  avg_response_time_seconds: number
  last_active_at: string
  created_at: string
  updated_at: string
}

export interface DailyStats {
  id: string
  user_id: string
  stat_date: string
  messages_sent: number
  messages_received: number
  conversations_started: number
  profile_views: number
  profile_clicks: number
  created_at: string
}

export interface AnalyticsEvent {
  id: string
  user_id: string
  event_type: string
  metadata: Record<string, unknown>
  created_at: string
}

export interface ClientAnalyticsData {
  totalConversations: number
  totalMessagesSent: number
  totalMessagesReceived: number
  activeDrivers: number
  responseRate: number
  avgResponseTime: string
  dailyStats: DailyStats[]
  recentActivity: AnalyticsEvent[]
}

export interface DriverAnalyticsData {
  totalConversations: number
  totalMessagesSent: number
  totalMessagesReceived: number
  profileViews: number
  profileClicks: number
  clickThroughRate: number
  avgResponseTime: string
  dailyStats: DailyStats[]
  recentActivity: AnalyticsEvent[]
}

export const analyticsService = {
  // Fetch user stats
  async fetchUserStats(userId: string): Promise<UserStats | null> {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching user stats:', error)
      return null
    }
    return data
  },

  // Fetch daily stats for the last N days
  async fetchDailyStats(userId: string, days: number = 30): Promise<DailyStats[]> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from('daily_stats')
      .select('*')
      .eq('user_id', userId)
      .gte('stat_date', startDate.toISOString().split('T')[0])
      .order('stat_date', { ascending: true })

    if (error) {
      console.error('Error fetching daily stats:', error)
      return []
    }
    return data || []
  },

  // Fetch recent analytics events
  async fetchRecentEvents(userId: string, limit: number = 20): Promise<AnalyticsEvent[]> {
    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching recent events:', error)
      return []
    }
    return data || []
  },

  // Track an analytics event
  async trackEvent(userId: string, eventType: string, metadata: Record<string, unknown> = {}): Promise<void> {
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        user_id: userId,
        event_type: eventType,
        metadata
      })

    if (error) {
      console.error('Error tracking event:', error)
    }
  },

  // Track profile view
  async trackProfileView(viewerId: string, profileOwnerId: string): Promise<void> {
    // Update profile owner's stats
    const { error: statsError } = await supabase
      .from('user_stats')
      .update({ 
        profile_views: supabase.rpc('increment_profile_views', { user_id: profileOwnerId }),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', profileOwnerId)

    // Update daily stats
    const today = new Date().toISOString().split('T')[0]
    const { error: dailyError } = await supabase
      .from('daily_stats')
      .upsert({
        user_id: profileOwnerId,
        stat_date: today,
        profile_views: 1
      }, {
        onConflict: 'user_id,stat_date'
      })

    if (statsError || dailyError) {
      console.error('Error tracking profile view:', statsError || dailyError)
    }
  },

  // Get comprehensive client analytics
  async getClientAnalytics(userId: string): Promise<ClientAnalyticsData> {
    const [stats, dailyStats, recentEvents] = await Promise.all([
      this.fetchUserStats(userId),
      this.fetchDailyStats(userId, 30),
      this.fetchRecentEvents(userId, 10)
    ])

    // Get unique drivers the client has talked to
    const { data: conversations } = await supabase
      .from('conversations')
      .select('driver_id')
      .eq('client_id', userId)

    const uniqueDrivers = new Set(conversations?.map(c => c.driver_id) || [])

    return {
      totalConversations: stats?.total_conversations || 0,
      totalMessagesSent: stats?.total_messages_sent || 0,
      totalMessagesReceived: stats?.total_messages_received || 0,
      activeDrivers: uniqueDrivers.size,
      responseRate: stats?.total_messages_received 
        ? Math.round((stats.total_messages_received / (stats.total_messages_sent || 1)) * 100)
        : 0,
      avgResponseTime: this.formatResponseTime(stats?.avg_response_time_seconds || 0),
      dailyStats,
      recentActivity: recentEvents
    }
  },

  // Get comprehensive driver analytics
  async getDriverAnalytics(userId: string): Promise<DriverAnalyticsData> {
    const [stats, dailyStats, recentEvents] = await Promise.all([
      this.fetchUserStats(userId),
      this.fetchDailyStats(userId, 30),
      this.fetchRecentEvents(userId, 10)
    ])

    const clickThroughRate = stats?.profile_views 
      ? Math.round((stats.profile_clicks / stats.profile_views) * 100) 
      : 0

    return {
      totalConversations: stats?.total_conversations || 0,
      totalMessagesSent: stats?.total_messages_sent || 0,
      totalMessagesReceived: stats?.total_messages_received || 0,
      profileViews: stats?.profile_views || 0,
      profileClicks: stats?.profile_clicks || 0,
      clickThroughRate,
      avgResponseTime: this.formatResponseTime(stats?.avg_response_time_seconds || 0),
      dailyStats,
      recentActivity: recentEvents
    }
  },

  // Helper to format response time
  formatResponseTime(seconds: number): string {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`
    return `${Math.round(seconds / 3600)}h`
  },

  // Get weekly summary data for charts
  async getWeeklySummary(userId: string, weeks: number = 4): Promise<{
    labels: string[]
    messagesSent: number[]
    messagesReceived: number[]
    conversations: number[]
  }> {
    const dailyStats = await this.fetchDailyStats(userId, weeks * 7)
    
    // Group by week
    const weeklyData: Map<string, { sent: number; received: number; convos: number }> = new Map()
    
    dailyStats.forEach(day => {
      const date = new Date(day.stat_date)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      const weekKey = weekStart.toISOString().split('T')[0]
      
      const existing = weeklyData.get(weekKey) || { sent: 0, received: 0, convos: 0 }
      weeklyData.set(weekKey, {
        sent: existing.sent + day.messages_sent,
        received: existing.received + day.messages_received,
        convos: existing.convos + day.conversations_started
      })
    })

    const sortedWeeks = Array.from(weeklyData.entries()).sort((a, b) => a[0].localeCompare(b[0]))

    return {
      labels: sortedWeeks.map(([date]) => {
        const d = new Date(date)
        return `Week ${Math.ceil(d.getDate() / 7)}`
      }),
      messagesSent: sortedWeeks.map(([, data]) => data.sent),
      messagesReceived: sortedWeeks.map(([, data]) => data.received),
      conversations: sortedWeeks.map(([, data]) => data.convos)
    }
  }
}
