import { useState, useCallback, useEffect, useRef } from 'react'

interface UseWakeLockReturn {
  isSupported: boolean
  isActive: boolean
  request: () => Promise<void>
  release: () => Promise<void>
}

/**
 * Hook for Screen Wake Lock API
 * Prevents the screen from turning off during practice
 */
export function useWakeLock(): UseWakeLockReturn {
  const [isSupported] = useState(() => 'wakeLock' in navigator)
  const [isActive, setIsActive] = useState(false)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  const request = useCallback(async () => {
    if (!isSupported) return

    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen')
      setIsActive(true)

      wakeLockRef.current.addEventListener('release', () => {
        setIsActive(false)
      })
    } catch (err) {
      console.error('Wake Lock error:', err)
    }
  }, [isSupported])

  const release = useCallback(async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release()
      wakeLockRef.current = null
      setIsActive(false)
    }
  }, [])

  // Re-acquire wake lock when page becomes visible again
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && isActive && !wakeLockRef.current) {
        await request()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isActive, request])

  // Release on unmount
  useEffect(() => {
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release()
      }
    }
  }, [])

  return {
    isSupported,
    isActive,
    request,
    release,
  }
}
