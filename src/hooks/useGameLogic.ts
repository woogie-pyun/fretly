import { useCallback, useMemo } from 'react'
import type { Question, Note, FretNumber } from '@/types'
import { useGameStore } from '@/store/useGameStore'
import { FRETBOARD_MAP, NATURAL_NOTES, CHROMATIC_SCALE } from '@/lib/constants'
import { isSameNote, isNaturalNote } from '@/lib/music-theory'

/**
 * Hook for game logic - quiz generation and answer validation
 */
export function useGameLogic() {
  const { settings, game, setQuestion, submitAnswer } = useGameStore()

  // Get available notes based on settings
  const availableNotes = useMemo(() => {
    return settings.includeAccidentals ? CHROMATIC_SCALE : NATURAL_NOTES
  }, [settings.includeAccidentals])

  // Generate a random question
  const generateQuestion = useCallback((): Question => {
    const { selectedStrings, includeAccidentals } = settings
    const previousQuestion = game.previousQuestion

    let question: Question | null = null
    let attempts = 0
    const maxAttempts = 100

    while (!question && attempts < maxAttempts) {
      attempts++

      // Random string from selected
      const randomStringIndex = Math.floor(Math.random() * selectedStrings.length)
      const string = selectedStrings[randomStringIndex]

      // Random fret (0-12)
      const fret = Math.floor(Math.random() * 13) as FretNumber

      // Get note at this position
      const note = FRETBOARD_MAP[string][fret]

      // Filter out accidentals if not included
      if (!includeAccidentals && !isNaturalNote(note)) {
        continue
      }

      // Avoid repeating the same question
      if (
        previousQuestion &&
        previousQuestion.string === string &&
        previousQuestion.note === note
      ) {
        continue
      }

      question = { string, note, fret }
    }

    // Fallback if we couldn't generate a unique question
    if (!question) {
      const string = selectedStrings[0]
      const fret = 0 as FretNumber
      const note = FRETBOARD_MAP[string][fret]
      question = { string, note, fret }
    }

    return question
  }, [settings, game.previousQuestion])

  // Start a new question
  const startNewQuestion = useCallback(() => {
    const question = generateQuestion()
    setQuestion(question)
  }, [generateQuestion, setQuestion])

  // Check if the detected note matches the target (octave insensitive)
  const checkAnswer = useCallback(
    (detectedNote: Note): boolean => {
      if (!game.currentQuestion) return false
      return isSameNote(detectedNote, game.currentQuestion.note)
    },
    [game.currentQuestion]
  )

  // Submit detected note as answer
  const submitDetectedNote = useCallback(
    (detectedNote: Note) => {
      const isCorrect = checkAnswer(detectedNote)
      submitAnswer(isCorrect)
    },
    [checkAnswer, submitAnswer]
  )

  // Handle timeout (for both modes)
  const handleTimeout = useCallback(() => {
    submitAnswer(false)
  }, [submitAnswer])

  // Find all valid fret positions for the current question's note on the current string
  const getValidFretPositions = useCallback((): FretNumber[] => {
    if (!game.currentQuestion) return []

    const { string, note } = game.currentQuestion
    const positions: FretNumber[] = []

    for (let fret = 0; fret <= 12; fret++) {
      if (FRETBOARD_MAP[string][fret as FretNumber] === note) {
        positions.push(fret as FretNumber)
      }
    }

    return positions
  }, [game.currentQuestion])

  return {
    availableNotes,
    generateQuestion,
    startNewQuestion,
    checkAnswer,
    submitDetectedNote,
    handleTimeout,
    getValidFretPositions,
  }
}
