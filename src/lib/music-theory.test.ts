import { describe, it, expect } from 'vitest'
import {
  frequencyToNote,
  noteToFrequency,
  isSameNote,
  isNaturalNote,
  getNoteAtFret,
  findFretForNote,
  centsDifference,
} from './music-theory'

describe('music-theory', () => {
  describe('frequencyToNote', () => {
    it('should convert A4 (440Hz) to A', () => {
      expect(frequencyToNote(440)).toBe('A')
    })

    it('should convert E4 (329.63Hz) to E', () => {
      expect(frequencyToNote(329.63)).toBe('E')
    })

    it('should convert C4 (261.63Hz) to C', () => {
      expect(frequencyToNote(261.63)).toBe('C')
    })

    it('should convert low E2 (82.41Hz) to E', () => {
      expect(frequencyToNote(82.41)).toBe('E')
    })

    it('should handle frequencies near note boundaries', () => {
      expect(frequencyToNote(442)).toBe('A')
      expect(frequencyToNote(438)).toBe('A')
    })
  })

  describe('noteToFrequency', () => {
    it('should convert A4 to 440Hz', () => {
      expect(noteToFrequency('A', 4)).toBeCloseTo(440, 1)
    })

    it('should convert E4 to approximately 329.63Hz', () => {
      expect(noteToFrequency('E', 4)).toBeCloseTo(329.63, 0)
    })

    it('should convert C4 to approximately 261.63Hz', () => {
      expect(noteToFrequency('C', 4)).toBeCloseTo(261.63, 0)
    })

    it('should handle different octaves', () => {
      const a3 = noteToFrequency('A', 3)
      const a4 = noteToFrequency('A', 4)
      const a5 = noteToFrequency('A', 5)
      expect(a4 / a3).toBeCloseTo(2, 2)
      expect(a5 / a4).toBeCloseTo(2, 2)
    })
  })

  describe('isSameNote', () => {
    it('should return true for identical notes', () => {
      expect(isSameNote('A', 'A')).toBe(true)
      expect(isSameNote('C#', 'C#')).toBe(true)
    })

    it('should return false for different notes', () => {
      expect(isSameNote('A', 'B')).toBe(false)
      expect(isSameNote('C', 'C#')).toBe(false)
    })
  })

  describe('isNaturalNote', () => {
    it('should return true for natural notes', () => {
      expect(isNaturalNote('C')).toBe(true)
      expect(isNaturalNote('D')).toBe(true)
      expect(isNaturalNote('E')).toBe(true)
      expect(isNaturalNote('F')).toBe(true)
      expect(isNaturalNote('G')).toBe(true)
      expect(isNaturalNote('A')).toBe(true)
      expect(isNaturalNote('B')).toBe(true)
    })

    it('should return false for sharp notes', () => {
      expect(isNaturalNote('C#')).toBe(false)
      expect(isNaturalNote('D#')).toBe(false)
      expect(isNaturalNote('F#')).toBe(false)
      expect(isNaturalNote('G#')).toBe(false)
      expect(isNaturalNote('A#')).toBe(false)
    })
  })

  describe('getNoteAtFret', () => {
    it('should return correct notes for string 1 (high E)', () => {
      expect(getNoteAtFret(1, 0)).toBe('E')
      expect(getNoteAtFret(1, 1)).toBe('F')
      expect(getNoteAtFret(1, 5)).toBe('A')
      expect(getNoteAtFret(1, 12)).toBe('E')
    })

    it('should return correct notes for string 6 (low E)', () => {
      expect(getNoteAtFret(6, 0)).toBe('E')
      expect(getNoteAtFret(6, 3)).toBe('G')
      expect(getNoteAtFret(6, 5)).toBe('A')
      expect(getNoteAtFret(6, 12)).toBe('E')
    })

    it('should return correct notes for string 5 (A)', () => {
      expect(getNoteAtFret(5, 0)).toBe('A')
      expect(getNoteAtFret(5, 2)).toBe('B')
      expect(getNoteAtFret(5, 3)).toBe('C')
    })
  })

  describe('findFretForNote', () => {
    it('should find E on string 1 at frets 0 and 12', () => {
      const frets = findFretForNote(1, 'E')
      expect(frets).toContain(0)
      expect(frets).toContain(12)
      expect(frets.length).toBe(2)
    })

    it('should find A on string 5 at frets 0 and 12', () => {
      const frets = findFretForNote(5, 'A')
      expect(frets).toContain(0)
      expect(frets).toContain(12)
    })

    it('should find F on string 1 at fret 1', () => {
      const frets = findFretForNote(1, 'F')
      expect(frets).toContain(1)
    })

    it('should find C on string 2 at fret 1', () => {
      const frets = findFretForNote(2, 'C')
      expect(frets).toContain(1)
    })
  })

  describe('centsDifference', () => {
    it('should return 0 for identical frequencies', () => {
      expect(centsDifference(440, 440)).toBe(0)
    })

    it('should return approximately 100 cents for a semitone', () => {
      const semitone = 440 * Math.pow(2, 1 / 12)
      expect(centsDifference(semitone, 440)).toBeCloseTo(100, 0)
    })

    it('should return approximately 1200 cents for an octave', () => {
      expect(centsDifference(880, 440)).toBeCloseTo(1200, 0)
    })

    it('should return negative cents when first frequency is lower', () => {
      expect(centsDifference(220, 440)).toBeCloseTo(-1200, 0)
    })
  })
})
