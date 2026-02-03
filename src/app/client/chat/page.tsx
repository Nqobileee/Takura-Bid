'use client'

import { useState, useEffect, useRef } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { supabase } from '@/lib/supabase'
import type { ChatMessage, Conversation } from '@/lib/supabase'

interface ConversationWithDetails extends Conversation {
  driverName: string
  driverAvatar: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isOnline: boolean
  messages: ChatMessage[]
}

function ConversationList({ conversations, selectedConversation, onSelectConversation }: {
  conversations: ConversationWithDetails[]
  selectedConversation: string | null
  onSelectConversation: (id: string) => void
}) {
  return (
    <div className="card h-full flex flex-col">
      <div className="card-header">
        <h2 className="card-title">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>No conversations yet</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversation === conversation.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white font-medium">
                    {conversation.driverAvatar}
                  </div>
                  {conversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {conversation.driverName}
                    </h4>
                    <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-gray-900 text-white text-xs rounded-full px-2 py-1 ml-2">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Job: {conversation.job_id}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function ChatWindow({ conversation, onSendMessage }: { 
  conversation: ConversationWithDetails | null
  onSendMessage: (message: string) => void
}) {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation?.messages])

  const handleSend = () => {
    if (inputValue.trim() && conversation) {
      onSendMessage(inputValue)
      setInputValue('')
    }
  }

  if (!conversation) {
    return (
      <div className="card h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-400 rounded-full"></div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
          <p className="text-gray-600">Choose a conversation to start messaging with drivers</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card h-full flex flex-col">
      {/* Chat Header */}
      <div className="card-header">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white font-medium">
              {conversation.driverAvatar}
            </div>
            {conversation.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{conversation.driverName}</h3>
            <p className="text-sm text-gray-600">
              {conversation.isOnline ? 'Online' : 'Offline'} • Job: {conversation.job_id}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          conversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_id === conversation.client_id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender_id === conversation.client_id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.sender_id === conversation.client_id ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {new Date(message.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="input-field flex-1"
          />
          <button onClick={handleSend} className="btn-primary px-4 py-2">
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ClientChat() {
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  
  // NOTE: Replace with actual user ID from auth system
  const currentUserId = 'client-user-id-here'

  useEffect(() => {
    fetchConversations()
    setupRealtimeListeners()
  }, [])

  const fetchConversations = async () => {
    try {
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')

      if (error) throw error

      const enrichedConversations: ConversationWithDetails[] = await Promise.all(
        (conversations || []).map(async (conv) => {
          // Fetch driver details
          const { data: driver } = await supabase
            .from('users')
            .select('*')
            .eq('id', conv.driver_id)
            .single()

          // Fetch messages
          const { data: messages } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: true })

          const lastMessage = messages?.[messages.length - 1]

          return {
            ...conv,
            driverName: driver?.name || 'Unknown Driver',
            driverAvatar: driver?.avatar || driver?.name?.substring(0, 2).toUpperCase() || 'XX',
            lastMessage: lastMessage?.content || 'No messages yet',
            lastMessageTime: lastMessage ? new Date(lastMessage.created_at).toLocaleTimeString() : '',
            unreadCount: messages?.filter(m => !m.read && m.sender_id !== currentUserId).length || 0,
            isOnline: true, // TODO: Implement online status tracking
            messages: messages || []
          }
        })
      )

      setConversations(enrichedConversations)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching conversations:', error)
      setLoading(false)
    }
  }

  const setupRealtimeListeners = () => {
    // Listen for new messages
    const messageSubscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          fetchConversations()
        }
      )
      .subscribe()

    return () => {
      messageSubscription.unsubscribe()
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || !content.trim()) return

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation,
          sender_id: currentUserId,
          content: content.trim(),
          read: false
        })

      if (error) throw error

      // Refresh conversations to show new message
      fetchConversations()
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const selectedConv = conversations.find(c => c.id === selectedConversation)

  if (loading) {
    return (
      <DashboardLayout userType="client">
        <div className="content-area">
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-500">Loading conversations...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="client">
      <div className="content-area">
        {/* Page Header */}
        <div className="page-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="page-title">Chat</h1>
              <p className="page-subtitle">Communicate with your drivers in real-time</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1 h-96 lg:h-[600px]">
            <ConversationList
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelectConversation={setSelectedConversation}
            />
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 h-96 lg:h-[600px]">
            <ChatWindow 
              conversation={selectedConv || null}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}