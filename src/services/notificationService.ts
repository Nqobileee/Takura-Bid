/**
 * TakuraBid Notification Service
 * Real-time notifications for the platform
 */

import { supabase } from '@/lib/supabase'

export interface Notification {
  id: string
  user_id: string
  type: 'message' | 'load' | 'payment' | 'system' | 'bid' | 'job'
  title: string
  body: string
  link?: string
  read: boolean
  created_at: string
  metadata?: Record<string, unknown>
}

export interface NotificationStats {
  total: number
  unread: number
  byType: Record<string, number>
}

export const notificationService = {
  /**
   * Get all notifications for a user
   */
  async getNotifications(userId: string, limit: number = 50): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching notifications:', error)
      return []
    }
    return data || []
  },

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) {
      console.error('Error fetching unread count:', error)
      return 0
    }
    return count || 0
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)

    if (error) {
      console.error('Error marking notification as read:', error)
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) {
      console.error('Error marking all as read:', error)
    }
  },

  /**
   * Create a notification
   */
  async createNotification(
    userId: string,
    type: Notification['type'],
    title: string,
    body: string,
    link?: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        body,
        link,
        read: false,
        metadata
      })

    if (error) {
      console.error('Error creating notification:', error)
    }
  },

  /**
   * Subscribe to real-time notifications
   */
  subscribeToNotifications(
    userId: string,
    onNotification: (notification: Notification) => void
  ) {
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          onNotification(payload.new as Notification)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  },

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)

    if (error) {
      console.error('Error deleting notification:', error)
    }
  },

  /**
   * Clear all notifications
   */
  async clearAll(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId)

    if (error) {
      console.error('Error clearing notifications:', error)
    }
  },

  /**
   * Get notification icon by type
   */
  getNotificationIcon(type: Notification['type']): string {
    const icons: Record<Notification['type'], string> = {
      message: '💬',
      load: '📦',
      payment: '💰',
      system: '⚙️',
      bid: '🔔',
      job: '🚛'
    }
    return icons[type] || '🔔'
  },

  /**
   * Get notification color by type
   */
  getNotificationColor(type: Notification['type']): string {
    const colors: Record<Notification['type'], string> = {
      message: 'bg-orange-100 text-orange-600',
      load: 'bg-amber-100 text-amber-600',
      payment: 'bg-green-100 text-green-600',
      system: 'bg-gray-100 text-gray-600',
      bid: 'bg-orange-100 text-orange-600',
      job: 'bg-amber-100 text-amber-600'
    }
    return colors[type] || 'bg-gray-100 text-gray-600'
  }
}
