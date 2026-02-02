'use client'

import { useState, useEffect, useRef } from 'react'
import { CallData, callService } from '@/services/callService'

interface CallModalProps {
  isOpen: boolean
  callData: CallData | null
  offer?: RTCSessionDescriptionInit
  isIncoming: boolean
  currentUserId: string
  otherUserName: string
  onClose: () => void
}

export function CallModal({ 
  isOpen, 
  callData, 
  offer,
  isIncoming, 
  currentUserId,
  otherUserName,
  onClose 
}: CallModalProps) {
  const [callStatus, setCallStatus] = useState<'ringing' | 'connecting' | 'connected' | 'ended'>('ringing')
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Set video streams
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  // Call duration timer
  useEffect(() => {
    if (callStatus === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [callStatus])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswer = async () => {
    if (!callData || !offer) return
    
    setCallStatus('connecting')
    try {
      const stream = await callService.answerCall(
        callData.id,
        currentUserId,
        callData.caller_id,
        callData.call_type,
        offer,
        (remote) => {
          setRemoteStream(remote)
          setCallStatus('connected')
        },
        handleCallEnded
      )
      setLocalStream(stream)
    } catch (error) {
      console.error('Error answering call:', error)
      handleCallEnded()
    }
  }

  const handleDecline = async () => {
    if (!callData) return
    await callService.endCall(currentUserId, callData.caller_id, 'declined')
    handleCallEnded()
  }

  const handleHangup = async () => {
    if (!callData) return
    const otherUserId = callData.caller_id === currentUserId ? callData.callee_id : callData.caller_id
    await callService.endCall(currentUserId, otherUserId, 'ended')
    handleCallEnded()
  }

  const handleCallEnded = () => {
    setCallStatus('ended')
    setTimeout(() => {
      onClose()
    }, 1000)
  }

  const toggleMute = () => {
    const muted = callService.toggleMute()
    setIsMuted(muted)
  }

  const toggleVideo = () => {
    const videoOff = callService.toggleVideo()
    setIsVideoOff(videoOff)
  }

  if (!isOpen || !callData) return null

  const isVideoCall = callData.call_type === 'video'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90"></div>

      {/* Call Container */}
      <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
        {/* Video Display (for video calls) */}
        {isVideoCall && callStatus === 'connected' && (
          <>
            {/* Remote Video (Full Screen) */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-32 h-44 md:w-48 md:h-64 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
              />
              {isVideoOff && (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Audio Call / Ringing UI */}
        {(!isVideoCall || callStatus !== 'connected') && (
          <div className="text-center text-white z-10">
            {/* Avatar */}
            <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${
              isVideoCall ? 'from-orange-500 to-amber-500' : 'from-green-500 to-emerald-500'
            } flex items-center justify-center mb-6 ${
              callStatus === 'ringing' ? 'animate-pulse' : ''
            }`}>
              <span className="text-5xl font-bold">
                {otherUserName.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Name */}
            <h2 className="text-2xl font-bold mb-2">{otherUserName}</h2>

            {/* Status */}
            <p className="text-gray-300 mb-8">
              {callStatus === 'ringing' && isIncoming && 'Incoming call...'}
              {callStatus === 'ringing' && !isIncoming && 'Calling...'}
              {callStatus === 'connecting' && 'Connecting...'}
              {callStatus === 'connected' && formatDuration(callDuration)}
              {callStatus === 'ended' && 'Call ended'}
            </p>

            {/* Call Type Indicator */}
            <div className="flex items-center justify-center gap-2 text-gray-400 mb-8">
              {isVideoCall ? (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Video Call</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Voice Call</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Call Controls */}
        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4 z-10">
          {/* Incoming call - Answer/Decline */}
          {isIncoming && callStatus === 'ringing' && (
            <>
              <button
                onClick={handleDecline}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all hover:scale-110 shadow-lg"
              >
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button
                onClick={handleAnswer}
                className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-all hover:scale-110 shadow-lg animate-bounce"
              >
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
            </>
          )}

          {/* Active call controls */}
          {(callStatus === 'connected' || callStatus === 'connecting' || (!isIncoming && callStatus === 'ringing')) && (
            <>
              {/* Mute Button */}
              <button
                onClick={toggleMute}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 ${
                  isMuted ? 'bg-white text-gray-900' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {isMuted ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                )}
              </button>

              {/* Video Toggle (for video calls) */}
              {isVideoCall && (
                <button
                  onClick={toggleVideo}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 ${
                    isVideoOff ? 'bg-white text-gray-900' : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {isVideoOff ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              )}

              {/* Hangup Button */}
              <button
                onClick={handleHangup}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all hover:scale-110 shadow-lg"
              >
                <svg className="w-8 h-8 text-white transform rotate-135" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Ringing Animation */}
        {callStatus === 'ringing' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-40 h-40 rounded-full border-4 border-white/20 animate-ping"></div>
          </div>
        )}
      </div>
    </div>
  )
}
