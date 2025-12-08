import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Square } from 'lucide-react'
import { useGameStore } from '@/store/useGameStore'
import { useGameLogic, useWakeLock } from '@/hooks'

/**
 * GamePage - Active Game Interface
 * Shows current question, timer, and feedback
 */
export function GamePage() {
  const navigate = useNavigate()
  const { game, settings, endGame, nextQuestion } = useGameStore()
  const { startNewQuestion } = useGameLogic()
  const { request: requestWakeLock, release: releaseWakeLock } = useWakeLock()

  // Initialize game on mount
  useEffect(() => {
    if (game.status === 'idle' || !game.mode) {
      navigate('/')
      return
    }

    requestWakeLock()
    startNewQuestion()

    return () => {
      releaseWakeLock()
    }
  }, [])

  const handleStop = () => {
    endGame()
    navigate('/')
  }

  const handleNext = () => {
    nextQuestion()
    startNewQuestion()
  }

  // Calculate progress percentage
  const progressPercent = (game.timeRemaining / settings.timerDuration) * 100

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        game.isCorrect === true
          ? 'bg-emerald-500/20'
          : game.isCorrect === false
          ? 'bg-rose-500/20'
          : 'bg-slate-900'
      }`}
    >
      {/* Progress Bar */}
      <div className="h-1 bg-slate-800">
        <div
          className="h-full bg-indigo-600 transition-all duration-100"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center p-4">
        {/* Streak (Mode A only) */}
        {game.mode === 'listening' && (
          <div className="text-amber-400 font-bold">
            <span className="text-xl">🔥</span>
            <span className="ml-1">{game.streak}</span>
          </div>
        )}
        <div className="flex-1" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {game.currentQuestion && (
          <>
            {/* String indicator */}
            <p className="text-slate-400 text-lg mb-2">
              String {game.currentQuestion.string}
            </p>

            {/* Target Note */}
            <h1 className="text-7xl font-bold font-mono text-slate-100 tracking-tighter">
              {game.currentQuestion.note}
            </h1>

            {/* Status / Feedback */}
            <div className="mt-8 h-20 flex items-center justify-center">
              {game.status === 'playing' && (
                <p className="text-slate-400 text-lg animate-pulse">
                  {game.mode === 'listening' ? 'Listening...' : 'Think...'}
                </p>
              )}

              {game.status === 'feedback' && (
                <div className="text-center">
                  <p
                    className={`text-2xl font-bold ${
                      game.isCorrect ? 'text-emerald-400' : 'text-rose-500'
                    }`}
                  >
                    {game.isCorrect ? 'Correct!' : `Fret ${game.currentQuestion.fret}`}
                  </p>
                  {!game.isCorrect && game.mode === 'listening' && (
                    <button
                      onClick={handleNext}
                      className="mt-4 px-6 py-2 bg-slate-700 rounded-lg text-slate-100"
                    >
                      Next
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="p-4 flex justify-end">
        <button
          onClick={handleStop}
          className="p-3 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 transition-all"
        >
          <Square className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
