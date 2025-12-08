import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageWrapperProps {
  children: ReactNode
  className?: string
}

/**
 * PageWrapper - Common wrapper for all pages
 * Handles safe area insets and base layout
 */
export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div
      className={cn(
        'min-h-screen bg-slate-900 text-slate-100',
        'safe-area-inset',
        className
      )}
    >
      {children}
    </div>
  )
}
