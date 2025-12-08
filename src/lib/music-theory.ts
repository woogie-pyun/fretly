import type { Note, GuitarString, FretNumber } from '@/types'
import { CHROMATIC_SCALE, FRETBOARD_MAP, NATURAL_NOTES } from './constants'

/**
 * Convert frequency to the nearest note
 */
export function frequencyToNote(frequency: number): Note {
  // A4 = 440Hz
  const A4 = 440
  const C0 = A4 * Math.pow(2, -4.75)
  const halfSteps = Math.round(12 * Math.log2(frequency / C0))
  const noteIndex = halfSteps % 12
  return CHROMATIC_SCALE[noteIndex]
}

/**
 * Get the frequency of a note (middle octave)
 */
export function noteToFrequency(note: Note, octave: number = 4): number {
  const A4 = 440
  const noteIndex = CHROMATIC_SCALE.indexOf(note)
  const A4Index = CHROMATIC_SCALE.indexOf('A')
  const halfSteps = noteIndex - A4Index + (octave - 4) * 12
  return A4 * Math.pow(2, halfSteps / 12)
}

/**
 * Check if two notes are the same (pitch class comparison, octave insensitive)
 */
export function isSameNote(note1: Note, note2: Note): boolean {
  return note1 === note2
}

/**
 * Check if a note is a natural note (no sharps/flats)
 */
export function isNaturalNote(note: Note): boolean {
  return NATURAL_NOTES.includes(note)
}

/**
 * Get the note at a specific fret on a specific string
 */
export function getNoteAtFret(string: GuitarString, fret: FretNumber): Note {
  return FRETBOARD_MAP[string][fret]
}

/**
 * Find all fret positions for a given note on a specific string (0-12)
 */
export function findFretForNote(string: GuitarString, note: Note): FretNumber[] {
  const frets: FretNumber[] = []
  for (let fret = 0; fret <= 12; fret++) {
    if (FRETBOARD_MAP[string][fret as FretNumber] === note) {
      frets.push(fret as FretNumber)
    }
  }
  return frets
}

/**
 * Get the display name for a note (handles enharmonic equivalents)
 */
export function getNoteDisplayName(note: Note): string {
  return note
}

/**
 * Calculate cents difference between two frequencies
 */
export function centsDifference(freq1: number, freq2: number): number {
  return 1200 * Math.log2(freq1 / freq2)
}
