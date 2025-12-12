import { useState, useCallback, useRef } from 'react'

interface UseAudioReturn {
  isListening: boolean
  hasPermission: boolean | null
  error: string | null
  startListening: () => Promise<void>
  stopListening: () => void
  audioContext: AudioContext | null
  analyser: AnalyserNode | null
}

/**
 * Hook for managing Web Audio API and microphone permissions
 * Handles AudioContext creation and microphone stream
 */
export function useAudio(): UseAudioReturn {
  const [isListening, setIsListening] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)

  const streamRef = useRef<MediaStream | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)

  const startListening = useCallback(async () => {
    try {
      setError(null)

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      })

      setHasPermission(true)
      streamRef.current = stream

      // Create AudioContext
      const ctx = new AudioContext()
      setAudioContext(ctx)

      // Create analyser node
      const analyserNode = ctx.createAnalyser()
      analyserNode.fftSize = 2048
      analyserNode.smoothingTimeConstant = 0.8
      setAnalyser(analyserNode)

      // Connect microphone to analyser
      const source = ctx.createMediaStreamSource(stream)
      source.connect(analyserNode)
      sourceRef.current = source

      setIsListening(true)
    } catch (err) {
      setHasPermission(false)
      setError(err instanceof Error ? err.message : 'Failed to access microphone')
    }
  }, [])

  const stopListening = useCallback(() => {
    // Stop media stream tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    // Disconnect source
    if (sourceRef.current) {
      sourceRef.current.disconnect()
      sourceRef.current = null
    }

    // Close audio context
    setAudioContext((ctx) => {
      if (ctx && ctx.state !== 'closed') {
        ctx.close()
      }
      return null
    })

    setAnalyser(null)
    setIsListening(false)
  }, [])

  return {
    isListening,
    hasPermission,
    error,
    startListening,
    stopListening,
    audioContext,
    analyser,
  }
}
