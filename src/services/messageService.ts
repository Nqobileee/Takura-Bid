import { supabase } from '@/lib/supabase'
import type { ChatMessage, Conversation } from '@/lib/supabase'

export interface ConversationWithDetails extends Conversation {
  otherUserName: string
  otherUserAvatar: string
  otherUserId: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isOnline: boolean
  messages: ChatMessage[]
}

export const messageService = {
  // Fetch all conversations for a user
  async fetchConversations(userId: string): Promise<ConversationWithDetails[]> {
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`client_id.eq.${userId},driver_id.eq.${userId}`)

    if (error) throw error

    const enriched = await Promise.all(
      (conversations || []).map(async (conv) => {
        const isDriver = conv.driver_id === userId
        const otherUserId = isDriver ? conv.client_id : conv.driver_id

        // Fetch other user details
        const { data: otherUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', otherUserId)
          .single()

        // Fetch messages
        const { data: messages } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: true })

        const lastMessage = messages?.[messages.length - 1]
        const unreadCount = messages?.filter(m => !m.read && m.sender_id !== userId).length || 0

        return {
          ...conv,
          otherUserName: otherUser?.name || 'Unknown',
          otherUserAvatar: otherUser?.avatar || 'XX',
          otherUserId: otherUserId,
          lastMessage: lastMessage?.content || 'No messages yet',
          lastMessageTime: lastMessage ? new Date(lastMessage.created_at).toLocaleTimeString() : '',
          unreadCount,
          isOnline: true, // TODO: Track with presence
          messages: messages || []
        }
      })
    )

    return enriched
  },

  // Fetch messages for a specific conversation
  async fetchMessages(conversationId: string): Promise<ChatMessage[]> {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return messages || []
  },

  // Send a message
  async sendMessage(conversationId: string, senderId: string, content: string): Promise<ChatMessage> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content: content.trim(),
        read: false
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Mark messages as read
  async markAsRead(conversationId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)

    if (error) throw error
  },

  // Subscribe to new messages in a conversation
  subscribeToMessages(conversationId: string, callback: (message: ChatMessage) => void): () => void {
    const subscription = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          callback(payload.new as ChatMessage)
        }
      )
      .subscribe()

    return () => {
      void subscription.unsubscribe()
    }
  },

  // Subscribe to message updates (read status changes)
  subscribeToMessageUpdates(conversationId: string, callback: (message: ChatMessage) => void): () => void {
    const subscription = supabase
      .channel(`message-updates-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          callback(payload.new as ChatMessage)
        }
      )
      .subscribe()

    return () => {
      void subscription.unsubscribe()
    }
  },

  // Create or get a conversation
  async getOrCreateConversation(clientId: string, driverId: string, jobId: string): Promise<Conversation> {
    // Validate inputs
    if (!clientId || !driverId || !jobId) {
      throw new Error(`Missing required fields: clientId=${clientId}, driverId=${driverId}, jobId=${jobId}`)
    }

    // Check if conversation already exists
    const { data: existing, error: fetchError } = await supabase
      .from('conversations')
      .select('*')
      .eq('client_id', clientId)
      .eq('driver_id', driverId)
      .eq('job_id', jobId)
      .maybeSingle()

    if (fetchError) {
      console.error('Error fetching conversation:', fetchError)
      throw new Error(`Failed to fetch conversation: ${fetchError.message}`)
    }

    if (existing) return existing

    // Create new conversation
    const { data: newConv, error } = await supabase
      .from('conversations')
      .insert({
        client_id: clientId,
        driver_id: driverId,
        job_id: jobId
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating conversation:', error)
      throw new Error(`Failed to create conversation: ${error.message || JSON.stringify(error)}`)
    }
    return newConv
  },

  // ============================================
  // TYPING INDICATORS
  // ============================================

  // Send typing indicator
  async sendTypingIndicator(conversationId: string, userId: string, isTyping: boolean): Promise<void> {
    const channel = supabase.channel(`typing:${conversationId}`)
    await channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId, isTyping, timestamp: new Date().toISOString() }
    })
  },

  // Subscribe to typing indicators
  subscribeToTyping(
    conversationId: string, 
    callback: (userId: string, isTyping: boolean) => void
  ): () => void {
    const channel = supabase
      .channel(`typing:${conversationId}`)
      .on('broadcast', { event: 'typing' }, (payload) => {
        const { userId, isTyping } = payload.payload as { userId: string; isTyping: boolean }
        callback(userId, isTyping)
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  },

  // ============================================
  // READ RECEIPTS
  // ============================================

  // Mark message as delivered
  async markAsDelivered(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ 
        delivered: true,
        delivered_at: new Date().toISOString()
      })
      .eq('id', messageId)

    if (error) throw error
  },

  // Mark message as seen with timestamp
  async markAsSeen(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ 
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', messageId)

    if (error) throw error
  },

  // Get message status (sent, delivered, read)
  getMessageStatus(message: ChatMessage & { delivered?: boolean; delivered_at?: string; read_at?: string }): 'sending' | 'sent' | 'delivered' | 'read' {
    if (message.read && message.read_at) return 'read'
    if (message.delivered) return 'delivered'
    if (message.id) return 'sent'
    return 'sending'
  }
}

// ============================================
// QUICK REPLIES - Pre-defined messages for fast communication
// ============================================

export const QUICK_REPLIES = {
  driver: [
    { id: 'on_way', text: "🚛 I'm on my way to pickup", category: 'status' },
    { id: 'arrived_pickup', text: '📍 Arrived at pickup location', category: 'status' },
    { id: 'loading', text: '📦 Loading in progress', category: 'status' },
    { id: 'departed', text: '🚀 Departed, heading to destination', category: 'status' },
    { id: 'arrived_dest', text: '✅ Arrived at destination', category: 'status' },
    { id: 'delivered', text: '🎉 Delivery completed successfully!', category: 'status' },
    { id: 'delayed_traffic', text: '⚠️ Running late due to traffic', category: 'delay' },
    { id: 'delayed_weather', text: '🌧️ Delayed due to weather conditions', category: 'delay' },
    { id: 'need_directions', text: '🗺️ Need directions to exact location', category: 'help' },
    { id: 'contact_receiver', text: '📞 Please share receiver contact', category: 'help' },
    { id: 'thanks', text: '🙏 Thank you for the job!', category: 'general' }
  ],
  client: [
    { id: 'confirm_pickup', text: '✅ Pickup address confirmed', category: 'confirm' },
    { id: 'ready_load', text: '📦 Load is ready for pickup', category: 'status' },
    { id: 'receiver_notified', text: '📞 Receiver has been notified', category: 'status' },
    { id: 'send_location', text: '📍 Sending exact GPS location now', category: 'help' },
    { id: 'contact_shared', text: '📱 Contact details sent', category: 'help' },
    { id: 'payment_ready', text: '💰 Payment will be ready on delivery', category: 'payment' },
    { id: 'paid_ecocash', text: '✅ Paid via EcoCash', category: 'payment' },
    { id: 'good_job', text: '⭐ Great job, thank you!', category: 'general' },
    { id: 'call_me', text: '📞 Please call me', category: 'general' }
  ]
}

export type QuickReplyCategory = 'status' | 'delay' | 'help' | 'payment' | 'confirm' | 'general'

export function getQuickReplies(userType: 'driver' | 'client', category?: QuickReplyCategory) {
  const replies = QUICK_REPLIES[userType]
  if (category) {
    return replies.filter(r => r.category === category)
  }
  return replies
}
