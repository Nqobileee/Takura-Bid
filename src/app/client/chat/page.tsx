'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

interface ChatMessage {
  id: string
  sender: 'driver' | 'client'
  message: string
  timestamp: string
  read: boolean
}

interface Conversation {
  id: string
  driverName: string
  driverAvatar: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isOnline: boolean
  jobId: string
  messages: ChatMessage[]
}

const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    driverName: 'Tendai Mukamuri',
    driverAvatar: 'TM',
    lastMessage: 'I can pick up tomorrow morning at 8 AM',
    lastMessageTime: '10:35 AM',
    unreadCount: 1,
    isOnline: true,
    jobId: 'JOB001',
    messages: [
      {
        id: 'msg1',
        sender: 'client',
        message: 'Hello! I saw you placed a bid on our load from Harare to Bulawayo.',
        timestamp: '09:45 AM',
        read: true
      },
      {
        id: 'msg2',
        sender: 'driver',
        message: 'Hi! Yes, I\'m very interested in this job. I have experience with building materials transport.',
        timestamp: '09:48 AM',
        read: true
      },
      {
        id: 'msg3',
        sender: 'client',
        message: 'Great! Can you tell me more about your truck specifications?',
        timestamp: '10:15 AM',
        read: true
      },
      {
        id: 'msg4',
        sender: 'driver',
        message: 'I have a 10-ton capacity truck with all necessary equipment for safe transport.',
        timestamp: '10:18 AM',
        read: true
      },
      {
        id: 'msg5',
        sender: 'client',
        message: 'When can you pick up the load?',
        timestamp: '10:30 AM',
        read: true
      },
      {
        id: 'msg6',
        sender: 'driver',
        message: 'I can pick up tomorrow morning at 8 AM',
        timestamp: '10:35 AM',
        read: false
      }
    ]
  },
  {
    id: 'conv2',
    driverName: 'James Mwangi',
    driverAvatar: 'JM',
    lastMessage: 'Thank you for choosing our service!',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
    jobId: 'JOB002',
    messages: [
      {
        id: 'msg7',
        sender: 'client',
        message: 'The delivery was completed perfectly. Thank you for the excellent service!',
        timestamp: 'Yesterday 4:30 PM',
        read: true
      },
      {
        id: 'msg8',
        sender: 'driver',
        message: 'Thank you for choosing our service! It was a pleasure working with you.',
        timestamp: 'Yesterday 4:35 PM',
        read: true
      }
    ]
  }
]

function ConversationList({ conversations, selectedConversation, onSelectConversation }: {
  conversations: Conversation[]
  selectedConversation: string | null
  onSelectConversation: (id: string) => void
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
      </div>
      <div className="overflow-y-auto h-full">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedConversation === conversation.id ? 'bg-primary-50 border-primary-200' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-primary-900 rounded-full flex items-center justify-center text-white font-medium">
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
                    <span className="bg-primary-900 text-white text-xs rounded-full px-2 py-1 ml-2">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Job: {conversation.jobId}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChatWindow({ conversation }: { conversation: Conversation | null }) {
  if (!conversation) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 h-full flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
          <p className="text-gray-600">Choose a conversation to start messaging with drivers</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-primary-900 rounded-full flex items-center justify-center text-white font-medium">
              {conversation.driverAvatar}
            </div>
            {conversation.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{conversation.driverName}</h3>
            <p className="text-sm text-gray-600">
              {conversation.isOnline ? 'Online' : 'Offline'} • Job: {conversation.jobId}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'client'
                  ? 'bg-primary-900 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.message}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'client' ? 'text-primary-200' : 'text-gray-500'
              }`}>
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button className="btn-primary">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ClientChat() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const selectedConv = mockConversations.find(c => c.id === selectedConversation)

  return (
    <DashboardLayout userType="client">
      {/* Header */}
      <div className="top-header">
        <div>
          <h1 className="page-title">Chat</h1>
          <p className="text-gray-600 mt-1">Communicate with your drivers in real-time</p>
        </div>
      </div>

      {/* Content */}
      <div className="content-area">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <ConversationList
              conversations={mockConversations}
              selectedConversation={selectedConversation}
              onSelectConversation={setSelectedConversation}
            />
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            <ChatWindow conversation={selectedConv || null} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}