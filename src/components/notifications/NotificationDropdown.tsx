'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { notificationService, Notification } from '@/services/notificationService'

interface NotificationDropdownProps {
  userType: 'driver' | 'client'
}

export function NotificationDropdown({ userType }: NotificationDropdownProps) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) {
      loadNotifications()
      
      // Subscribe to real-time notifications
      const unsubscribe = notificationService.subscribeToNotifications(
        user.id,
        (newNotification) => {
          setNotifications(prev => [newNotification, ...prev])
          setUnreadCount(prev => prev + 1)
        }
      )

      return () => {
        unsubscribe()
      }
    }
  }, [user])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadNotifications = async () => {
    if (!user) return
    setLoading(true)
    
    try {
      const [notifs, count] = await Promise.all([
        notificationService.getNotifications(user.id, 10),
        notificationService.getUnreadCount(user.id)
      ])
      setNotifications(notifs)
      setUnreadCount(count)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAllRead = async () => {
    if (!user) return
    await notificationService.markAllAsRead(user.id)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const handleMarkAsRead = async (notification: Notification) => {
    if (!notification.read) {
      await notificationService.markAsRead(notification.id)
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <div>
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-gray-500">{unreadCount} unread</p>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔔</span>
                </div>
                <p className="text-gray-500 font-medium">No notifications yet</p>
                <p className="text-sm text-gray-400 mt-1">We&apos;ll notify you when something happens</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <Link
                    key={notification.id}
                    href={notification.link || '#'}
                    onClick={() => handleMarkAsRead(notification)}
                    className={`block p-4 hover:bg-orange-50 transition-colors ${
                      !notification.read ? 'bg-orange-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        notificationService.getNotificationColor(notification.type)
                      }`}>
                        <span className="text-lg">
                          {notificationService.getNotificationIcon(notification.type)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">
                          {notification.body}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTime(notification.created_at)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
              <Link
                href={`/${userType}/notifications`}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium text-center block"
                onClick={() => setIsOpen(false)}
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
