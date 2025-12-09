import { useState, useCallback, useRef, useEffect } from 'react'
import { YIN } from 'pitchfinder'
import type { Note } from '@/types'
import { frequencyToNote } from '@/lib/music-theory'
import { MIN_VOLUME_THRESHOLD, MIN_FREQUENCY, MAX_FREQUENCY } from '@/lib/constants'

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
 * Calculate RMS (Root Mean Square) volume from audio buffer
 */
function calculateRMS(buffer: Float32Array): number {
  let sum = 0
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i] * buffer[i]
  }
  return Math.sqrt(sum / buffer.length)
}

/**
 * Hook for pitch detection using Pitchfinder YIN algorithm
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
  const detectPitchRef = useRef<ReturnType<typeof YIN> | null>(null)
  const onNoteDetectedRef = useRef(onNoteDetected)

  // Update callback ref
  useEffect(() => {
    onNoteDetectedRef.current = onNoteDetected
  }, [onNoteDetected])

  // Initialize YIN detector when analyser changes
  useEffect(() => {
    if (analyser) {
      detectPitchRef.current = YIN({
        sampleRate: analyser.context.sampleRate,
        threshold: 0.1, // Lower = more sensitive, higher = more accurate
      })
    }
  }, [analyser])

  const detectPitch = useCallback(() => {
    if (!analyser || !isEnabled || !detectPitchRef.current) {
      rafRef.current = requestAnimationFrame(detectPitch)
      return
    }

    // Initialize buffer if needed
    if (!bufferRef.current || bufferRef.current.length !== analyser.fftSize) {
      bufferRef.current = new Float32Array(analyser.fftSize)
    }

    // Get time domain data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    analyser.getFloatTimeDomainData(bufferRef.current as any)

    // Check volume threshold (noise filtering)
    const rms = calculateRMS(bufferRef.current)

    if (rms < MIN_VOLUME_THRESHOLD) {
      // Too quiet, skip detection
      rafRef.current = requestAnimationFrame(detectPitch)
      return
    }

    // Detect pitch using YIN algorithm
    const pitch = detectPitchRef.current(bufferRef.current)

    if (pitch && pitch >= MIN_FREQUENCY && pitch <= MAX_FREQUENCY) {
      const note = frequencyToNote(pitch)
      setDetectedFrequency(pitch)
      setDetectedNote(note)
      setConfidence(rms) // Use volume as confidence indicator
      onNoteDetectedRef.current?.(note, pitch)
    }

    // Continue detection loop
    rafRef.current = requestAnimationFrame(detectPitch)
  }, [analyser, isEnabled])

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
