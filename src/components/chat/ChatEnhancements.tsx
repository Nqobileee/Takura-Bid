'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { messageService, QUICK_REPLIES, type QuickReplyCategory } from '@/services/messageService'

interface QuickRepliesProps {
  userType: 'driver' | 'client'
  onSelect: (text: string) => void
}

export function QuickRepliesPanel({ userType, onSelect }: QuickRepliesProps) {
  const [selectedCategory, setSelectedCategory] = useState<QuickReplyCategory | 'all'>('all')
  const [isExpanded, setIsExpanded] = useState(false)

  const categories: { id: QuickReplyCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'status', label: 'Status', icon: '🚛' },
    { id: 'delay', label: 'Delays', icon: '⚠️' },
    { id: 'help', label: 'Help', icon: '❓' },
    { id: 'payment', label: 'Payment', icon: '💰' },
    { id: 'general', label: 'General', icon: '💬' }
  ]

  const replies = QUICK_REPLIES[userType]
  const filteredReplies = selectedCategory === 'all' 
    ? replies 
    : replies.filter(r => r.category === selectedCategory)

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span>Quick Replies</span>
      </button>
    )
  }

  return (
    <div className="bg-gray-50 rounded-xl p-3 mb-3 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-700 flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Quick Replies</span>
        </h4>
        <button 
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-1 mb-3 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center space-x-1 px-2.5 py-1.5 text-xs rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Quick Reply Buttons */}
      <div className="flex flex-wrap gap-2">
        {filteredReplies.map((reply) => (
          <button
            key={reply.id}
            onClick={() => {
              onSelect(reply.text)
              setIsExpanded(false)
            }}
            className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-full hover:bg-gray-100 hover:border-gray-300 transition-colors"
          >
            {reply.text}
          </button>
        ))}
      </div>
    </div>
  )
}

// Typing Indicator Component
interface TypingIndicatorProps {
  userName: string
}

export function TypingIndicator({ userName }: TypingIndicatorProps) {
  return (
    <div className="flex items-center space-x-2 text-gray-500 text-sm py-2">
      <div className="flex space-x-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span>{userName} is typing...</span>
    </div>
  )
}

// Read Receipt Icons
interface ReadReceiptProps {
  status: 'sending' | 'sent' | 'delivered' | 'read'
  isOwn: boolean
}

export function ReadReceipt({ status, isOwn }: ReadReceiptProps) {
  if (!isOwn) return null

  const icons = {
    sending: (
      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth={2} className="opacity-25" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
      </svg>
    ),
    sent: (
      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    delivered: (
      <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13l4 4L23 7" opacity="0.5" />
      </svg>
    ),
    read: (
      <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13l4 4L23 7" />
      </svg>
    )
  }

  return (
    <div className="flex items-center mt-1" title={status.charAt(0).toUpperCase() + status.slice(1)}>
      {icons[status]}
    </div>
  )
}

// Hook for typing indicator
export function useTypingIndicator(conversationId: string, userId: string) {
  const [isOtherTyping, setIsOtherTyping] = useState(false)
  const [typingUserName, setTypingUserName] = useState('')
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  const lastTypingRef = useRef<number>(0)

  // Subscribe to typing events
  useEffect(() => {
    if (!conversationId) return

    const unsubscribe = messageService.subscribeToTyping(
      conversationId,
      (typingUserId, isTyping) => {
        if (typingUserId !== userId) {
          setIsOtherTyping(isTyping)
          if (isTyping) {
            // Auto-clear after 3 seconds of no updates
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current)
            }
            typingTimeoutRef.current = setTimeout(() => {
              setIsOtherTyping(false)
            }, 3000)
          }
        }
      }
    )

    return () => {
      unsubscribe()
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [conversationId, userId])

  // Function to send typing indicator (debounced)
  const sendTyping = useCallback((isTyping: boolean) => {
    const now = Date.now()
    // Only send every 2 seconds to avoid spam
    if (now - lastTypingRef.current > 2000 || !isTyping) {
      lastTypingRef.current = now
      messageService.sendTypingIndicator(conversationId, userId, isTyping)
    }
  }, [conversationId, userId])

  return { isOtherTyping, typingUserName, sendTyping }
}

// Enhanced Message Input with typing detection
interface EnhancedMessageInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onTyping: (isTyping: boolean) => void
  disabled?: boolean
  placeholder?: string
}

export function EnhancedMessageInput({
  value,
  onChange,
  onSend,
  onTyping,
  disabled,
  placeholder = 'Type your message...'
}: EnhancedMessageInputProps) {
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    
    // Notify typing started
    if (newValue.length > 0) {
      onTyping(true)
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      
      // Set timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false)
      }, 2000)
    } else {
      onTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
      onTyping(false)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="flex items-center space-x-3">
      <div className="relative flex-1">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white transition-all disabled:opacity-50"
        />
        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// Message Bubble with read receipts
interface MessageBubbleProps {
  content: string
  timestamp: string
  isOwn: boolean
  status: 'sending' | 'sent' | 'delivered' | 'read'
  senderName?: string
  senderAvatar?: string
}

export function MessageBubble({ 
  content, 
  timestamp, 
  isOwn, 
  status,
  senderName,
  senderAvatar
}: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`flex items-end space-x-2 max-w-[75%] ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {!isOwn && senderAvatar && (
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
            {senderAvatar}
          </div>
        )}
        <div>
          {!isOwn && senderName && (
            <p className="text-xs text-gray-500 mb-1 ml-1">{senderName}</p>
          )}
          <div
            className={`px-4 py-2.5 rounded-2xl ${
              isOwn
                ? 'bg-gray-900 text-white rounded-br-md'
                : 'bg-gray-100 text-gray-900 rounded-bl-md'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{content}</p>
          </div>
          <div className={`flex items-center space-x-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <span className={`text-xs ${isOwn ? 'text-gray-400' : 'text-gray-500'}`}>
              {timestamp}
            </span>
            <ReadReceipt status={status} isOwn={isOwn} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickRepliesPanel
