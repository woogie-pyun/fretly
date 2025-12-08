import type { GuitarString, FretNumber } from '@/types'
import { cn } from '@/lib/utils'

interface FretboardProps {
  highlightedFret?: FretNumber
  highlightedString?: GuitarString
  className?: string
}

/**
 * Fretboard - SVG visualization of guitar fretboard
 * Skeleton component - to be implemented with full SVG rendering
 */
export function Fretboard({ highlightedFret, highlightedString, className }: FretboardProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* TODO: Implement SVG fretboard visualization */}
      <div className="bg-slate-800 rounded-lg p-4 text-center text-slate-400">
        <p>Fretboard Visualization</p>
        {highlightedFret !== undefined && highlightedString !== undefined && (
          <p className="text-slate-100 mt-2">
            String {highlightedString}, Fret {highlightedFret}
          </p>
        )}
      </div>
    </div>
  )
}
