// Game Mode Types
export type GameMode = 'listening' | 'image'

// Note Types
export type NaturalNote = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'
export type SharpNote = 'C#' | 'D#' | 'F#' | 'G#' | 'A#'
export type FlatNote = 'Db' | 'Eb' | 'Gb' | 'Ab' | 'Bb'
export type Note = NaturalNote | SharpNote

// Guitar String (1-6, where 1 is the thinnest/highest)
export type GuitarString = 1 | 2 | 3 | 4 | 5 | 6

// Fret number (0-12)
export type FretNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

// Question for the quiz
export interface Question {
  string: GuitarString
  note: Note
  fret: FretNumber
}

// Game Settings
export interface GameSettings {
  selectedStrings: GuitarString[]
  includeAccidentals: boolean
  timerDuration: number // in seconds (2-15)
}

// Game State
export type GameStatus = 'idle' | 'playing' | 'paused' | 'feedback' | 'finished'

export interface GameState {
  mode: GameMode | null
  status: GameStatus
  currentQuestion: Question | null
  previousQuestion: Question | null
  streak: number
  bestStreak: number
  isCorrect: boolean | null
  timeRemaining: number
}

// Audio State
export interface AudioState {
  isListening: boolean
  detectedNote: Note | null
  detectedFrequency: number | null
  hasPermission: boolean | null
}
