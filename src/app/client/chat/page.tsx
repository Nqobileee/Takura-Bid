'use client'

import dynamic from 'next/dynamic'
export const dynamicParams = true
export const revalidate = 0

import { useState, useEffect, useRef } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import { messageService, type ConversationWithDetails } from '@/services/messageService'
import { callService, type CallData } from '@/services/callService'
import { CallModal } from '@/components/call/CallModal'
import { supabase } from '@/lib/supabase'
import type { ChatMessage } from '@/lib/supabase'

// Helper function to generate UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

interface Driver {
  id: string
  name: string
  avatar: string
  email: string
}

function NewChatModal({ 
  isOpen, 
  onClose, 
  onStartChat 
}: { 
  isOpen: boolean
  onClose: () => void
  onStartChat: (driverId: string, jobId: string) => void 
}) {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [selectedDriver, setSelectedDriver] = useState<string>('')
  const [jobReference, setJobReference] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchDrivers()
    }
  }, [isOpen])

  const fetchDrivers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('users')
      .select('id, name, avatar, email')
      .eq('type', 'driver')

    if (!error && data) {
      setDrivers(data)
    }
    setLoading(false)
  }

  const filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = () => {
    if (selectedDriver && jobReference.trim()) {
      // Generate a proper UUID for the job_id
      const jobUUID = generateUUID()
      onStartChat(selectedDriver, jobUUID)
      setSelectedDriver('')
      setJobReference('')
      setSearchTerm('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Start New Chat</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Search Drivers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Drivers</label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full"
            />
          </div>

          {/* Driver Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Driver *</label>
            {loading ? (
              <div className="text-center py-4 text-gray-500">Loading drivers...</div>
            ) : (
              <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                {filteredDrivers.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No drivers found</div>
                ) : (
                  filteredDrivers.map(driver => (
                    <div
                      key={driver.id}
                      onClick={() => setSelectedDriver(driver.id)}
                      className={`p-3 flex items-center space-x-3 cursor-pointer hover:bg-orange-50 border-b border-stone-100 last:border-b-0 ${
                        selectedDriver === driver.id ? 'bg-orange-50 border-orange-200' : ''
                      }`}
                    >
                      <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white font-medium">
                        {driver.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{driver.name}</p>
                        <p className="text-sm text-gray-500">{driver.email}</p>
                      </div>
                      {selectedDriver === driver.id && (
                        <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Job ID / Reference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Reference *</label>
            <input
              type="text"
              placeholder="e.g., Harare to Bulawayo Load"
              value={jobReference}
              onChange={(e) => setJobReference(e.target.value)}
              className="input-field w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Enter a description for this conversation</p>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!selectedDriver || !jobReference.trim()}
            className="w-full btn-primary py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Conversation
          </button>
        </div>
      </div>
    </div>
  )
}

function ConversationList({ conversations, selectedConversation, onSelectConversation, onNewChat }: {
  conversations: ConversationWithDetails[]
  selectedConversation: string | null
  onSelectConversation: (id: string) => void
  onNewChat: () => void
}) {
  return (
    <div className="card h-full flex flex-col">
      <div className="card-header flex items-center justify-between">
        <h2 className="card-title">Messages</h2>
        <button 
          onClick={onNewChat}
          className="btn-primary px-3 py-1.5 text-sm flex items-center space-x-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Chat</span>
        </button>
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
              className={`p-4 border-b border-stone-100 cursor-pointer hover:bg-orange-50 transition-colors ${
                selectedConversation === conversation.id ? 'bg-orange-50 border-orange-200' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white font-medium">
                    {conversation.otherUserAvatar}
                  </div>
                  {conversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {conversation.otherUserName}
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

function ChatWindow({ conversation, onSendMessage, onStartCall }: { 
  conversation: ConversationWithDetails | null
  onSendMessage: (message: string) => void
  onStartCall: (callType: 'audio' | 'video') => void
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
      {/* Chat Header with Call Buttons */}
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white font-medium">
                {conversation.otherUserAvatar}
              </div>
              {conversation.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{conversation.otherUserName}</h3>
              <p className="text-sm text-gray-600">
                {conversation.isOnline ? 'Online' : 'Offline'} • Job: {conversation.job_id}
              </p>
            </div>
          </div>
          
          {/* Call Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onStartCall('audio')}
              className="p-2.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
              title="Voice Call"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            <button
              onClick={() => onStartCall('video')}
              className="p-2.5 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
              title="Video Call"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
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
  const { user, isLoading: authLoading } = useAuth()
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  
  // Call state
  const [showCallModal, setShowCallModal] = useState(false)
  const [currentCall, setCurrentCall] = useState<CallData | null>(null)
  const [currentOffer, setCurrentOffer] = useState<RTCSessionDescriptionInit | undefined>()
  const [isIncomingCall, setIsIncomingCall] = useState(false)
  const [callerName, setCallerName] = useState('')

  useEffect(() => {
    if (!user) return

    const loadConversations = async () => {
      try {
        const convs = await messageService.fetchConversations(user.id)
        setConversations(convs)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching conversations:', error)
        setLoading(false)
      }
    }

    loadConversations()
  }, [user])

  // Subscribe to incoming calls
  useEffect(() => {
    if (!user) return undefined

    const unsubscribe = callService.subscribeToIncomingCalls(
      user.id,
      async (call, offer) => {
        // Get caller name
        const { data: callerData } = await supabase
          .from('users')
          .select('name')
          .eq('id', call.caller_id)
          .single()
        
        setCallerName(callerData?.name || 'Unknown')
        setCurrentCall(call)
        setCurrentOffer(offer)
        setIsIncomingCall(true)
        setShowCallModal(true)
      }
    )

    return () => { unsubscribe() }
  }, [user])

  // Subscribe to real-time message updates
  useEffect(() => {
    if (!selectedConversation) return

    const unsubscribe = messageService.subscribeToMessages(
      selectedConversation,
      (newMessage: ChatMessage) => {
        setConversations(prev =>
          prev.map(conv => {
            if (conv.id === selectedConversation) {
              // Check if message already exists to avoid duplicates
              const messageExists = conv.messages.some(m => m.id === newMessage.id)
              if (messageExists) return conv
              
              return {
                ...conv,
                messages: [...conv.messages, newMessage],
                lastMessage: newMessage.content,
                lastMessageTime: new Date(newMessage.created_at).toLocaleTimeString()
              }
            }
            return conv
          })
        )
      }
    )

    // Mark messages as read
    messageService.markAsRead(selectedConversation, user!.id).catch(console.error)

    return () => unsubscribe()
  }, [selectedConversation, user])

  if (authLoading || !user) {
    return (
      <DashboardLayout userType="client">
        <div className="content-area">
          <div className="flex items-center justify-center h-96">
            {authLoading ? (
              <div className="text-center">
                <p className="text-gray-500 mb-4">Connecting to Supabase...</p>
                <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-700 font-semibold mb-4">Please log in to continue</p>
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
            <p className="text-gray-500">Loading conversations...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || !content.trim()) return

    try {
      console.log('Sending message:', { conversationId: selectedConversation, userId: user.id, content })
      const message = await messageService.sendMessage(selectedConversation, user.id, content)
      console.log('Message sent successfully:', message)

      // Optimistically update UI
      setConversations(prev =>
        prev.map(conv => {
          if (conv.id === selectedConversation) {
            // Check if message already exists (might have come via subscription)
            const messageExists = conv.messages.some(m => m.id === message.id)
            if (messageExists) {
              console.log('Message already exists in conversation')
              return conv
            }
            
            return {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: message.content,
              lastMessageTime: new Date(message.created_at).toLocaleTimeString()
            }
          }
          return conv
        })
      )
    } catch (error) {
      console.error('Error sending message:', error)
      alert(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const selectedConv = conversations.find(c => c.id === selectedConversation)

  const handleStartNewChat = async (driverId: string, jobId: string) => {
    try {
      if (!user?.id) {
        console.error('No user logged in')
        alert('Please log in to start a conversation')
        return
      }
      
      console.log('Starting chat with:', { clientId: user.id, driverId, jobId })
      const conversation = await messageService.getOrCreateConversation(user.id, driverId, jobId)
      
      // Refresh conversations list
      const convs = await messageService.fetchConversations(user.id)
      setConversations(convs)
      
      // Select the new conversation
      setSelectedConversation(conversation.id)
    } catch (error) {
      console.error('Error starting new chat:', error)
      alert(`Failed to start chat: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Handle starting a call
  const handleStartCall = async (callType: 'audio' | 'video') => {
    if (!selectedConv || !user) return

    try {
      const { callId } = await callService.initiateCall(
        user.id,
        selectedConv.driver_id,
        selectedConv.id,
        callType,
        () => {}, // onRemoteStream handled in modal
        () => {
          setShowCallModal(false)
          setCurrentCall(null)
        }
      )

      // Get call data
      const { data: callData } = await supabase
        .from('calls')
        .select('*')
        .eq('id', callId)
        .single()

      setCurrentCall(callData)
      setCallerName(selectedConv.otherUserName)
      setIsIncomingCall(false)
      setShowCallModal(true)
    } catch (error) {
      console.error('Error starting call:', error)
      alert('Failed to start call. Please check your microphone/camera permissions.')
    }
  }

  const handleCloseCallModal = () => {
    setShowCallModal(false)
    setCurrentCall(null)
    setCurrentOffer(undefined)
    setIsIncomingCall(false)
  }

  return (
    <DashboardLayout userType="client">
      <div className="content-area">
        {/* Call Modal */}
        <CallModal
          isOpen={showCallModal}
          callData={currentCall}
          offer={currentOffer}
          isIncoming={isIncomingCall}
          currentUserId={user?.id || ''}
          otherUserName={callerName || selectedConv?.otherUserName || 'Unknown'}
          onClose={handleCloseCallModal}
        />

        {/* New Chat Modal */}
        <NewChatModal 
          isOpen={showNewChatModal}
          onClose={() => setShowNewChatModal(false)}
          onStartChat={handleStartNewChat}
        />

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
              onNewChat={() => setShowNewChatModal(true)}
            />
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 h-96 lg:h-[600px]">
            <ChatWindow 
              conversation={selectedConv || null}
              onSendMessage={handleSendMessage}
              onStartCall={handleStartCall}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}