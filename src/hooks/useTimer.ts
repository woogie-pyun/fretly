import { useState, useCallback, useRef, useEffect } from 'react'

interface UseTimerOptions {
  /** 타임아웃 시 호출되는 콜백 */
  onTimeout?: () => void
}

interface UseTimerReturn {
  /** 남은 시간 (초) */
  timeLeft: number
  /** 실행 중 여부 */
  isRunning: boolean
  /** 타이머 시작 */
  start: (duration?: number) => void
  /** 일시정지 */
  pause: () => void
  /** 재개 */
  resume: () => void
  /** 리셋 (지정된 duration으로) */
  reset: (duration?: number) => void
}

const TICK_INTERVAL = 100 // 100ms 간격으로 업데이트

/**
 * 카운트다운 타이머 훅
 * 게임에서 문제당 제한시간을 관리
 */
export function useTimer(
  initialDuration: number,
  options: UseTimerOptions = {}
): UseTimerReturn {
  const { onTimeout } = options

  const [timeLeft, setTimeLeft] = useState(initialDuration)
  const [isRunning, setIsRunning] = useState(false)

  const intervalRef = useRef<number | null>(null)
  const endTimeRef = useRef<number>(0)
  const onTimeoutRef = useRef(onTimeout)
  const durationRef = useRef(initialDuration)

  // 콜백 ref 업데이트 (stale closure 방지)
  useEffect(() => {
    onTimeoutRef.current = onTimeout
  }, [onTimeout])

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const tick = useCallback(() => {
    const remaining = Math.max(0, (endTimeRef.current - Date.now()) / 1000)
    setTimeLeft(remaining)

    if (remaining <= 0) {
      clearTimer()
      setIsRunning(false)
      onTimeoutRef.current?.()
    }
  }, [clearTimer])

  const start = useCallback(
    (duration?: number) => {
      clearTimer()
      const dur = duration ?? durationRef.current
      durationRef.current = dur
      endTimeRef.current = Date.now() + dur * 1000
      setTimeLeft(dur)
      setIsRunning(true)
      intervalRef.current = window.setInterval(tick, TICK_INTERVAL)
    },
    [clearTimer, tick]
  )

  const pause = useCallback(() => {
    if (!isRunning) return
    clearTimer()
    const remaining = Math.max(0, (endTimeRef.current - Date.now()) / 1000)
    setTimeLeft(remaining)
    durationRef.current = remaining
    setIsRunning(false)
  }, [isRunning, clearTimer])

  const resume = useCallback(() => {
    if (isRunning || durationRef.current <= 0) return
    endTimeRef.current = Date.now() + durationRef.current * 1000
    setIsRunning(true)
    intervalRef.current = window.setInterval(tick, TICK_INTERVAL)
  }, [isRunning, tick])

  const reset = useCallback(
    (duration?: number) => {
      clearTimer()
      const dur = duration ?? durationRef.current
      durationRef.current = dur
      setTimeLeft(dur)
      setIsRunning(false)
    },
    [clearTimer]
  )

  // 클린업
  useEffect(() => {
    return () => {
      clearTimer()
    }
  }, [clearTimer])

  return {
    timeLeft,
    isRunning,
    start,
    pause,
    resume,
    reset,
  }
}
