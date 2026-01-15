import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from './useGameStore'

describe('useGameStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useGameStore.setState({
      settings: {
        selectedStrings: [1, 2, 3, 4, 5, 6],
        includeAccidentals: false,
        timerDuration: 5,
      },
      bestStreak: 0,
      game: {
        mode: null,
        status: 'idle',
        currentQuestion: null,
        previousQuestion: null,
        streak: 0,
        bestStreak: 0,
        isCorrect: null,
        timeRemaining: 0,
      },
    })
  })

  describe('Settings Actions', () => {
    it('should toggle string selection', () => {
      const { toggleString } = useGameStore.getState()

      // Remove string 1
      toggleString(1)
      expect(useGameStore.getState().settings.selectedStrings).not.toContain(1)
      expect(useGameStore.getState().settings.selectedStrings.length).toBe(5)

      // Add string 1 back
      toggleString(1)
      expect(useGameStore.getState().settings.selectedStrings).toContain(1)
    })

    it('should not allow removing the last string', () => {
      const { toggleString, setSelectedStrings } = useGameStore.getState()

      // Set to only one string
      setSelectedStrings([1])
      expect(useGameStore.getState().settings.selectedStrings).toEqual([1])

      // Try to remove the last string
      toggleString(1)
      expect(useGameStore.getState().settings.selectedStrings).toEqual([1])
    })

    it('should keep strings sorted after toggle', () => {
      const { toggleString, setSelectedStrings } = useGameStore.getState()

      setSelectedStrings([1, 3, 5])
      toggleString(2)
      expect(useGameStore.getState().settings.selectedStrings).toEqual([1, 2, 3, 5])

      toggleString(4)
      expect(useGameStore.getState().settings.selectedStrings).toEqual([1, 2, 3, 4, 5])
    })

    it('should set includeAccidentals', () => {
      const { setIncludeAccidentals } = useGameStore.getState()

      setIncludeAccidentals(true)
      expect(useGameStore.getState().settings.includeAccidentals).toBe(true)

      setIncludeAccidentals(false)
      expect(useGameStore.getState().settings.includeAccidentals).toBe(false)
    })

    it('should set timer duration', () => {
      const { setTimerDuration } = useGameStore.getState()

      setTimerDuration(10)
      expect(useGameStore.getState().settings.timerDuration).toBe(10)

      setTimerDuration(3)
      expect(useGameStore.getState().settings.timerDuration).toBe(3)
    })

    it('should reset settings to default', () => {
      const { setTimerDuration, setIncludeAccidentals, resetSettings } = useGameStore.getState()

      setTimerDuration(15)
      setIncludeAccidentals(true)
      resetSettings()

      const { settings } = useGameStore.getState()
      expect(settings.timerDuration).toBe(5)
      expect(settings.includeAccidentals).toBe(false)
      expect(settings.selectedStrings).toEqual([1, 2, 3, 4, 5, 6])
    })
  })

  describe('Game Actions', () => {
    it('should start game with correct mode', () => {
      const { startGame } = useGameStore.getState()

      startGame('listening')
      const { game } = useGameStore.getState()

      expect(game.mode).toBe('listening')
      expect(game.status).toBe('playing')
      expect(game.streak).toBe(0)
    })

    it('should set question and reset feedback state', () => {
      const { startGame, setQuestion } = useGameStore.getState()

      startGame('image')
      setQuestion({
        string: 1,
        note: 'E',
        correctFrets: [0, 12],
      })

      const { game } = useGameStore.getState()
      expect(game.currentQuestion?.note).toBe('E')
      expect(game.currentQuestion?.string).toBe(1)
      expect(game.isCorrect).toBeNull()
    })

    it('should increment streak on correct answer', () => {
      const { startGame, submitAnswer } = useGameStore.getState()

      startGame('listening')
      submitAnswer(true)
      expect(useGameStore.getState().game.streak).toBe(1)

      submitAnswer(true)
      expect(useGameStore.getState().game.streak).toBe(2)

      submitAnswer(true)
      expect(useGameStore.getState().game.streak).toBe(3)
    })

    it('should reset streak on incorrect answer', () => {
      const { startGame, submitAnswer } = useGameStore.getState()

      startGame('listening')
      submitAnswer(true)
      submitAnswer(true)
      expect(useGameStore.getState().game.streak).toBe(2)

      submitAnswer(false)
      expect(useGameStore.getState().game.streak).toBe(0)
    })

    it('should update best streak when current streak exceeds it', () => {
      const { startGame, submitAnswer } = useGameStore.getState()

      startGame('listening')
      submitAnswer(true)
      submitAnswer(true)
      submitAnswer(true)

      expect(useGameStore.getState().bestStreak).toBe(3)

      // Reset and get lower streak
      submitAnswer(false)
      submitAnswer(true)

      // Best streak should still be 3
      expect(useGameStore.getState().bestStreak).toBe(3)
    })

    it('should end game and preserve best streak', () => {
      const { startGame, submitAnswer, endGame } = useGameStore.getState()

      startGame('listening')
      submitAnswer(true)
      submitAnswer(true)
      endGame()

      expect(useGameStore.getState().game.status).toBe('finished')
      expect(useGameStore.getState().bestStreak).toBe(2)
    })

    it('should reset game state', () => {
      const { startGame, submitAnswer, resetGame } = useGameStore.getState()

      startGame('listening')
      submitAnswer(true)
      submitAnswer(true)
      resetGame()

      const { game } = useGameStore.getState()
      expect(game.status).toBe('idle')
      expect(game.mode).toBeNull()
      expect(game.streak).toBe(0)
      expect(game.currentQuestion).toBeNull()
    })

    it('should update time remaining', () => {
      const { startGame, updateTimeRemaining } = useGameStore.getState()

      startGame('image')
      updateTimeRemaining(3)

      expect(useGameStore.getState().game.timeRemaining).toBe(3)
    })

    it('should transition to next question', () => {
      const { startGame, submitAnswer, nextQuestion } = useGameStore.getState()

      startGame('listening')
      submitAnswer(true)
      expect(useGameStore.getState().game.status).toBe('feedback')

      nextQuestion()
      expect(useGameStore.getState().game.status).toBe('playing')
      expect(useGameStore.getState().game.isCorrect).toBeNull()
    })
  })
})
