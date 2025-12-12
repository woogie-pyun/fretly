import { useCallback, useRef } from 'react'

type SoundType = 'correct' | 'incorrect'

/**
 * useSoundEffect - Web Audio API 기반 효과음 훅
 * 외부 파일 없이 Web Audio API로 효과음을 직접 생성
 */
export function useSoundEffect() {
  const audioContextRef = useRef<AudioContext | null>(null)

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])

  /**
   * 정답 효과음 - "딩동댕" 스타일의 상승 멜로디
   */
  const playCorrectSound = useCallback(() => {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    // 3음 상승 멜로디 (C5 -> E5 -> G5)
    const notes = [523.25, 659.25, 783.99] // C5, E5, G5
    const duration = 0.12

    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.type = 'sine'
      oscillator.frequency.value = freq

      // Envelope
      gainNode.gain.setValueAtTime(0, now + i * duration)
      gainNode.gain.linearRampToValueAtTime(0.3, now + i * duration + 0.02)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * duration + duration)

      oscillator.start(now + i * duration)
      oscillator.stop(now + i * duration + duration)
    })
  }, [getAudioContext])

  /**
   * 오답 효과음 - "땡" 스타일의 buzzer 사운드
   */
  const playIncorrectSound = useCallback(() => {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    // 낮은 주파수의 buzzer 느낌
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = 'sawtooth'
    oscillator.frequency.value = 150

    // Short burst envelope
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.25, now + 0.02)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25)

    oscillator.start(now)
    oscillator.stop(now + 0.25)
  }, [getAudioContext])

  const play = useCallback((type: SoundType) => {
    if (type === 'correct') {
      playCorrectSound()
    } else {
      playIncorrectSound()
    }
  }, [playCorrectSound, playIncorrectSound])

  return { play, playCorrectSound, playIncorrectSound }
}
