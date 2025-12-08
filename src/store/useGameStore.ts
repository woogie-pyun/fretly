import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameMode, GameSettings, GameState, Question, GuitarString } from '@/types'
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '@/lib/constants'

interface GameStore {
  // Settings (persisted)
  settings: GameSettings
  bestStreak: number

  // Game State (not persisted)
  game: GameState

  // Settings Actions
  setSelectedStrings: (strings: GuitarString[]) => void
  toggleString: (string: GuitarString) => void
  setIncludeAccidentals: (include: boolean) => void
  setTimerDuration: (duration: number) => void
  resetSettings: () => void

  // Game Actions
  startGame: (mode: GameMode) => void
  endGame: () => void
  setQuestion: (question: Question) => void
  submitAnswer: (isCorrect: boolean) => void
  nextQuestion: () => void
  updateTimeRemaining: (time: number) => void
  resetGame: () => void
}

const initialGameState: GameState = {
  mode: null,
  status: 'idle',
  currentQuestion: null,
  previousQuestion: null,
  streak: 0,
  bestStreak: 0,
  isCorrect: null,
  timeRemaining: 0,
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      // Initial State
      settings: DEFAULT_SETTINGS,
      bestStreak: 0,
      game: initialGameState,

      // Settings Actions
      setSelectedStrings: (strings) =>
        set((state) => ({
          settings: { ...state.settings, selectedStrings: strings },
        })),

      toggleString: (string) =>
        set((state) => {
          const current = state.settings.selectedStrings
          const newStrings = current.includes(string)
            ? current.filter((s) => s !== string)
            : [...current, string].sort((a, b) => a - b)
          // Ensure at least one string is selected
          if (newStrings.length === 0) return state
          return {
            settings: { ...state.settings, selectedStrings: newStrings as GuitarString[] },
          }
        }),

      setIncludeAccidentals: (include) =>
        set((state) => ({
          settings: { ...state.settings, includeAccidentals: include },
        })),

      setTimerDuration: (duration) =>
        set((state) => ({
          settings: { ...state.settings, timerDuration: duration },
        })),

      resetSettings: () =>
        set(() => ({
          settings: DEFAULT_SETTINGS,
        })),

      // Game Actions
      startGame: (mode) =>
        set((state) => ({
          game: {
            ...initialGameState,
            mode,
            status: 'playing',
            bestStreak: state.bestStreak,
            timeRemaining: state.settings.timerDuration,
          },
        })),

      endGame: () =>
        set((state) => {
          const newBestStreak = Math.max(state.bestStreak, state.game.streak)
          return {
            game: { ...state.game, status: 'finished' },
            bestStreak: newBestStreak,
          }
        }),

      setQuestion: (question) =>
        set((state) => ({
          game: {
            ...state.game,
            previousQuestion: state.game.currentQuestion,
            currentQuestion: question,
            isCorrect: null,
            timeRemaining: state.settings.timerDuration,
          },
        })),

      submitAnswer: (isCorrect) =>
        set((state) => {
          const newStreak = isCorrect ? state.game.streak + 1 : 0
          const newBestStreak = Math.max(state.bestStreak, newStreak)
          return {
            game: {
              ...state.game,
              status: 'feedback',
              isCorrect,
              streak: newStreak,
              bestStreak: newBestStreak,
            },
            bestStreak: newBestStreak,
          }
        }),

      nextQuestion: () =>
        set((state) => ({
          game: {
            ...state.game,
            status: 'playing',
            isCorrect: null,
          },
        })),

      updateTimeRemaining: (time) =>
        set((state) => ({
          game: { ...state.game, timeRemaining: time },
        })),

      resetGame: () =>
        set(() => ({
          game: initialGameState,
        })),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      partialize: (state) => ({
        settings: state.settings,
        bestStreak: state.bestStreak,
      }),
    }
  )
)
