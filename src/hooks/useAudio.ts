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

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
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
      const audioContext = new AudioContext()
      audioContextRef.current = audioContext

      // Create analyser node
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 2048
      analyser.smoothingTimeConstant = 0.8
      analyserRef.current = analyser

      // Connect microphone to analyser
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      sourceRef.current = source

      setIsListening(true)
    } catch (err) {
      setHasPermission(false)
      setError(err instanceof Error ? err.message : 'Failed to access microphone')
      console.error('Audio error:', err)
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
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    analyserRef.current = null
    setIsListening(false)
  }, [])

  return {
    isListening,
    hasPermission,
    error,
    startListening,
    stopListening,
    audioContext: audioContextRef.current,
    analyser: analyserRef.current,
  }
}
