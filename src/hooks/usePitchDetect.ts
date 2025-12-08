import { useState, useCallback, useRef, useEffect } from 'react'
import type { Note } from '@/types'
import { frequencyToNote } from '@/lib/music-theory'

interface UsePitchDetectOptions {
  analyser: AnalyserNode | null
  isEnabled: boolean
  onNoteDetected?: (note: Note, frequency: number) => void
}

interface UsePitchDetectReturn {
  detectedNote: Note | null
  detectedFrequency: number | null
  confidence: number
}

/**
 * Hook for pitch detection using Pitchfinder library
 * Integrates with Web Audio API analyser node
 */
export function usePitchDetect({
  analyser,
  isEnabled,
  onNoteDetected,
}: UsePitchDetectOptions): UsePitchDetectReturn {
  const [detectedNote, setDetectedNote] = useState<Note | null>(null)
  const [detectedFrequency, setDetectedFrequency] = useState<number | null>(null)
  const [confidence, setConfidence] = useState(0)

  const rafRef = useRef<number | null>(null)
  const bufferRef = useRef<Float32Array | null>(null)

  const detectPitch = useCallback(() => {
    if (!analyser || !isEnabled) return

    // Initialize buffer if needed
    if (!bufferRef.current || bufferRef.current.length !== analyser.fftSize) {
      bufferRef.current = new Float32Array(analyser.fftSize)
    }

    // Get time domain data
    analyser.getFloatTimeDomainData(bufferRef.current)

    // TODO: Integrate Pitchfinder YIN algorithm here
    // For now, this is a skeleton that will be implemented later
    // const detectPitchYIN = Pitchfinder.YIN({ sampleRate: analyser.context.sampleRate })
    // const pitch = detectPitchYIN(bufferRef.current)

    // Placeholder: will be replaced with actual pitch detection
    const pitch = null as number | null

    if (pitch && pitch > 0) {
      const note = frequencyToNote(pitch)
      setDetectedFrequency(pitch)
      setDetectedNote(note)
      setConfidence(0.9) // Placeholder confidence
      onNoteDetected?.(note, pitch)
    }

    // Continue detection loop
    rafRef.current = requestAnimationFrame(detectPitch)
  }, [analyser, isEnabled, onNoteDetected])

  useEffect(() => {
    if (isEnabled && analyser) {
      rafRef.current = requestAnimationFrame(detectPitch)
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [isEnabled, analyser, detectPitch])

  // Reset when disabled
  useEffect(() => {
    if (!isEnabled) {
      setDetectedNote(null)
      setDetectedFrequency(null)
      setConfidence(0)
    }
  }, [isEnabled])

  return {
    detectedNote,
    detectedFrequency,
    confidence,
  }
}
