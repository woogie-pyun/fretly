import type { GuitarString, Note, FretNumber } from '@/types'

// Standard tuning frequencies (Hz) for open strings
export const STRING_FREQUENCIES: Record<GuitarString, number> = {
  1: 329.63, // E4
  2: 246.94, // B3
  3: 196.00, // G3
  4: 146.83, // D3
  5: 110.00, // A2
  6: 82.41,  // E2
}

// Open string notes in standard tuning
export const OPEN_STRING_NOTES: Record<GuitarString, Note> = {
  1: 'E',
  2: 'B',
  3: 'G',
  4: 'D',
  5: 'A',
  6: 'E',
}

// Chromatic scale
export const CHROMATIC_SCALE: Note[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
]

// Natural notes only
export const NATURAL_NOTES: Note[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

// Fretboard mapping: [string][fret] -> Note
export const FRETBOARD_MAP: Record<GuitarString, Record<FretNumber, Note>> = {
  1: { 0: 'E', 1: 'F', 2: 'F#', 3: 'G', 4: 'G#', 5: 'A', 6: 'A#', 7: 'B', 8: 'C', 9: 'C#', 10: 'D', 11: 'D#', 12: 'E' },
  2: { 0: 'B', 1: 'C', 2: 'C#', 3: 'D', 4: 'D#', 5: 'E', 6: 'F', 7: 'F#', 8: 'G', 9: 'G#', 10: 'A', 11: 'A#', 12: 'B' },
  3: { 0: 'G', 1: 'G#', 2: 'A', 3: 'A#', 4: 'B', 5: 'C', 6: 'C#', 7: 'D', 8: 'D#', 9: 'E', 10: 'F', 11: 'F#', 12: 'G' },
  4: { 0: 'D', 1: 'D#', 2: 'E', 3: 'F', 4: 'F#', 5: 'G', 6: 'G#', 7: 'A', 8: 'A#', 9: 'B', 10: 'C', 11: 'C#', 12: 'D' },
  5: { 0: 'A', 1: 'A#', 2: 'B', 3: 'C', 4: 'C#', 5: 'D', 6: 'D#', 7: 'E', 8: 'F', 9: 'F#', 10: 'G', 11: 'G#', 12: 'A' },
  6: { 0: 'E', 1: 'F', 2: 'F#', 3: 'G', 4: 'G#', 5: 'A', 6: 'A#', 7: 'B', 8: 'C', 9: 'C#', 10: 'D', 11: 'D#', 12: 'E' },
}

// Default game settings
export const DEFAULT_SETTINGS = {
  selectedStrings: [1, 2, 3, 4, 5, 6] as GuitarString[],
  includeAccidentals: false,
  timerDuration: 5,
}

// Timer range
export const TIMER_MIN = 2
export const TIMER_MAX = 15

// Feedback display duration (ms) before auto-next in Image mode
export const FEEDBACK_DELAY_MS = 1500

// localStorage keys
export const STORAGE_KEYS = {
  SETTINGS: 'guitar_trainer_settings',
  BEST_STREAK: 'guitar_trainer_best_streak',
} as const

// Pitch detection tolerance (in cents)
export const PITCH_TOLERANCE_CENTS = 50

// Minimum RMS volume threshold for pitch detection (0-1)
export const MIN_VOLUME_THRESHOLD = 0.01

// Minimum frequency for guitar (low E ~82Hz, with some margin)
export const MIN_FREQUENCY = 70

// Maximum frequency for guitar (high E 12th fret ~660Hz, with margin)
export const MAX_FREQUENCY = 1200
