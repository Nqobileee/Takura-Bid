import { supabase } from '@/lib/supabase'

export interface CallData {
  id: string
  caller_id: string
  callee_id: string
  conversation_id: string
  call_type: 'audio' | 'video'
  status: 'ringing' | 'answered' | 'ended' | 'missed' | 'declined'
  started_at: string
  answered_at?: string
  ended_at?: string
  duration?: number
}

export interface CallSignal {
  id: string
  call_id: string
  from_user_id: string
  to_user_id: string
  signal_type: 'offer' | 'answer' | 'ice-candidate' | 'hangup'
  signal_data: string
  created_at: string
}

class CallService {
  private peerConnection: RTCPeerConnection | null = null
  private localStream: MediaStream | null = null
  private remoteStream: MediaStream | null = null
  private currentCallId: string | null = null
  private signalChannel: ReturnType<typeof supabase.channel> | null = null

  private iceServers: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ]

  // Initialize a call (caller side)
  async initiateCall(
    callerId: string,
    calleeId: string,
    conversationId: string,
    callType: 'audio' | 'video',
    onRemoteStream: (stream: MediaStream) => void,
    onCallEnded: () => void
  ): Promise<{ callId: string; localStream: MediaStream }> {
    try {
      // Get local media stream
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === 'video'
      })

      // Create call record in database
      const { data: callData, error: callError } = await supabase
        .from('calls')
        .insert({
          caller_id: callerId,
          callee_id: calleeId,
          conversation_id: conversationId,
          call_type: callType,
          status: 'ringing',
          started_at: new Date().toISOString()
        })
        .select()
        .single()

      if (callError) throw callError
      this.currentCallId = callData.id

      // Setup WebRTC
      await this.setupPeerConnection(onRemoteStream, onCallEnded)

      // Setup signaling channel
      await this.setupSignalingChannel(callerId, calleeId, callData.id)

      // Create and send offer
      const offer = await this.peerConnection!.createOffer()
      await this.peerConnection!.setLocalDescription(offer)

      await this.sendSignal(callData.id, callerId, calleeId, 'offer', JSON.stringify(offer))

      return { callId: callData.id, localStream: this.localStream }
    } catch (error) {
      this.cleanup()
      throw error
    }
  }

  // Answer an incoming call (callee side)
  async answerCall(
    callId: string,
    userId: string,
    callerId: string,
    callType: 'audio' | 'video',
    offerData: RTCSessionDescriptionInit,
    onRemoteStream: (stream: MediaStream) => void,
    onCallEnded: () => void
  ): Promise<MediaStream> {
    try {
      this.currentCallId = callId

      // Get local media stream
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === 'video'
      })

      // Setup WebRTC
      await this.setupPeerConnection(onRemoteStream, onCallEnded)

      // Setup signaling channel
      await this.setupSignalingChannel(userId, callerId, callId)

      // Set remote description (the offer)
      await this.peerConnection!.setRemoteDescription(new RTCSessionDescription(offerData))

      // Create and send answer
      const answer = await this.peerConnection!.createAnswer()
      await this.peerConnection!.setLocalDescription(answer)

      await this.sendSignal(callId, userId, callerId, 'answer', JSON.stringify(answer))

      // Update call status
      await supabase
        .from('calls')
        .update({ 
          status: 'answered',
          answered_at: new Date().toISOString()
        })
        .eq('id', callId)

      return this.localStream
    } catch (error) {
      this.cleanup()
      throw error
    }
  }

  // End the current call
  async endCall(userId: string, otherUserId: string, reason: 'ended' | 'declined' | 'missed' = 'ended') {
    if (this.currentCallId) {
      // Send hangup signal
      await this.sendSignal(this.currentCallId, userId, otherUserId, 'hangup', reason)

      // Update call status
      const { data: callData } = await supabase
        .from('calls')
        .select('started_at, answered_at')
        .eq('id', this.currentCallId)
        .single()

      const endedAt = new Date()
      let duration = 0
      if (callData?.answered_at) {
        duration = Math.floor((endedAt.getTime() - new Date(callData.answered_at).getTime()) / 1000)
      }

      await supabase
        .from('calls')
        .update({ 
          status: reason,
          ended_at: endedAt.toISOString(),
          duration
        })
        .eq('id', this.currentCallId)
    }

    this.cleanup()
  }

  // Subscribe to incoming calls
  subscribeToIncomingCalls(
    userId: string,
    onIncomingCall: (call: CallData, offer: RTCSessionDescriptionInit) => void | Promise<void>
  ): () => void {
    const channel = supabase
      .channel(`incoming-calls:${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'calls',
        filter: `callee_id=eq.${userId}`
      }, async (payload) => {
        const call = payload.new as CallData
        if (call.status === 'ringing') {
          // Get the offer signal
          const { data: signals } = await supabase
            .from('call_signals')
            .select('*')
            .eq('call_id', call.id)
            .eq('signal_type', 'offer')
            .single()

          if (signals) {
            onIncomingCall(call, JSON.parse(signals.signal_data))
          }
        }
      })
      .subscribe()

    // Return a cleanup function that doesn't return anything
    const cleanup = (): void => {
      channel.unsubscribe().catch(console.error)
    }
    return cleanup
  }

  // Get call history for a conversation
  async getCallHistory(conversationId: string): Promise<CallData[]> {
    const { data, error } = await supabase
      .from('calls')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('started_at', { ascending: false })
      .limit(50)

    if (error) throw error
    return data || []
  }

  // Private methods
  private async setupPeerConnection(
    onRemoteStream: (stream: MediaStream) => void,
    onCallEnded: () => void
  ) {
    this.peerConnection = new RTCPeerConnection({ iceServers: this.iceServers })
    this.remoteStream = new MediaStream()

    // Add local tracks to connection
    this.localStream?.getTracks().forEach(track => {
      this.peerConnection!.addTrack(track, this.localStream!)
    })

    // Handle incoming tracks
    this.peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        this.remoteStream!.addTrack(track)
      })
      onRemoteStream(this.remoteStream!)
    }

    // Handle ICE candidates
    this.peerConnection.onicecandidate = async (event) => {
      if (event.candidate && this.currentCallId) {
        // Get call info to know who to send to
        const { data: call } = await supabase
          .from('calls')
          .select('caller_id, callee_id')
          .eq('id', this.currentCallId)
          .single()

        if (call) {
          const fromId = this.localStream ? 
            (call.caller_id === this.currentCallId ? call.caller_id : call.callee_id) : ''
          const toId = fromId === call.caller_id ? call.callee_id : call.caller_id
          
          await this.sendSignal(
            this.currentCallId,
            fromId,
            toId,
            'ice-candidate',
            JSON.stringify(event.candidate)
          )
        }
      }
    }

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      if (this.peerConnection?.connectionState === 'disconnected' ||
          this.peerConnection?.connectionState === 'failed') {
        onCallEnded()
        this.cleanup()
      }
    }
  }

  private async setupSignalingChannel(userId: string, otherUserId: string, callId: string) {
    this.signalChannel = supabase
      .channel(`call-signals:${callId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'call_signals',
        filter: `call_id=eq.${callId}`
      }, async (payload) => {
        const signal = payload.new as CallSignal
        
        // Only process signals meant for us
        if (signal.to_user_id !== userId) return

        switch (signal.signal_type) {
          case 'answer':
            if (this.peerConnection) {
              await this.peerConnection.setRemoteDescription(
                new RTCSessionDescription(JSON.parse(signal.signal_data))
              )
            }
            break
          case 'ice-candidate':
            if (this.peerConnection) {
              await this.peerConnection.addIceCandidate(
                new RTCIceCandidate(JSON.parse(signal.signal_data))
              )
            }
            break
          case 'hangup':
            this.cleanup()
            break
        }
      })
      .subscribe()
  }

  private async sendSignal(
    callId: string,
    fromUserId: string,
    toUserId: string,
    signalType: 'offer' | 'answer' | 'ice-candidate' | 'hangup',
    signalData: string
  ) {
    await supabase
      .from('call_signals')
      .insert({
        call_id: callId,
        from_user_id: fromUserId,
        to_user_id: toUserId,
        signal_type: signalType,
        signal_data: signalData
      })
  }

  private cleanup() {
    // Stop local stream tracks
    this.localStream?.getTracks().forEach(track => track.stop())
    this.localStream = null

    // Close peer connection
    this.peerConnection?.close()
    this.peerConnection = null

    // Remove signaling channel
    if (this.signalChannel) {
      supabase.removeChannel(this.signalChannel)
      this.signalChannel = null
    }

    this.remoteStream = null
    this.currentCallId = null
  }

  // Toggle audio mute
  toggleMute(): boolean {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        return !audioTrack.enabled // Returns true if muted
      }
    }
    return false
  }

  // Toggle video
  toggleVideo(): boolean {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        return !videoTrack.enabled // Returns true if video off
      }
    }
    return false
  }
}

export const callService = new CallService()
