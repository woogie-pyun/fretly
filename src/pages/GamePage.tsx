import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Square } from 'lucide-react'
import { useGameStore } from '@/store/useGameStore'
import { useGameLogic, useWakeLock, useTimer } from '@/hooks'
import { FEEDBACK_DELAY_MS } from '@/lib/constants'

/**
 * GamePage - Active Game Interface
 * Shows current question, timer, and feedback
 */
export function GamePage() {
  const navigate = useNavigate()
  const { game, settings, endGame, nextQuestion, submitAnswer } = useGameStore()
  const { startNewQuestion } = useGameLogic()
  const { request: requestWakeLock, release: releaseWakeLock } = useWakeLock()
  const feedbackTimeoutRef = useRef<number | null>(null)

  // 타임아웃 핸들러 (Mode B: 정답 공개)
  const handleTimeout = useCallback(() => {
    if (game.mode === 'image') {
      submitAnswer(false)
    }
  }, [game.mode, submitAnswer])

  // 타이머 훅
  const { timeLeft, start: startTimer, reset: resetTimer } = useTimer(
    settings.timerDuration,
    { onTimeout: handleTimeout }
  )

  // Progress 계산 (settings.timerDuration 직접 사용)
  const progress = settings.timerDuration > 0 ? timeLeft / settings.timerDuration : 0

  // 다음 문제로 이동
  const goToNextQuestion = useCallback(() => {
    nextQuestion()
    startNewQuestion()
    startTimer(settings.timerDuration)
  }, [nextQuestion, startNewQuestion, startTimer, settings.timerDuration])

  // Initialize game on mount
  useEffect(() => {
    if (game.status === 'idle' || !game.mode) {
      navigate('/')
      return
    }

    requestWakeLock()
    startNewQuestion()

    // Mode B: 바로 타이머 시작
    if (game.mode === 'image') {
      startTimer(settings.timerDuration)
    }

    return () => {
      releaseWakeLock()
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Mode B: 피드백 후 자동으로 다음 문제
  useEffect(() => {
    if (game.mode === 'image' && game.status === 'feedback') {
      feedbackTimeoutRef.current = window.setTimeout(() => {
        goToNextQuestion()
      }, FEEDBACK_DELAY_MS)

      return () => {
        if (feedbackTimeoutRef.current) {
          clearTimeout(feedbackTimeoutRef.current)
        }
      }
    }
  }, [game.mode, game.status, goToNextQuestion])

  const handleStop = () => {
    resetTimer()
    endGame()
    navigate('/')
  }

  const handleNext = () => {
    goToNextQuestion()
  }

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
      {/* Progress Bar - 높이 고정으로 레이아웃 shift 방지 */}
      <div className="h-1.5 bg-slate-800 overflow-hidden">
        {/* Mode B: CSS animation */}
        {game.mode === 'image' && game.currentQuestion && (
          <div
            key={`${game.currentQuestion.note}-${game.currentQuestion.string}-${game.currentQuestion.fret}`}
            className="h-full bg-indigo-600 origin-left"
            style={{
              animation: game.status === 'playing'
                ? `shrinkBar ${settings.timerDuration}s linear forwards`
                : 'none',
              width: game.status === 'playing' ? undefined : '0%',
            }}
          />
        )}
        {/* Mode A: JavaScript 기반 */}
        {game.mode === 'listening' && (
          <div
            className={`h-full transition-all duration-200 ${
              progress > 0.3 ? 'bg-indigo-600' : 'bg-rose-500'
            }`}
            style={{ width: `${progress * 100}%` }}
          />
        )}
      </div>

      {/* Progress bar animation */}
      <style>{`
        @keyframes shrinkBar {
          from { width: 100%; background-color: rgb(79, 70, 229); }
          70% { background-color: rgb(79, 70, 229); }
          70.1% { background-color: rgb(244, 63, 94); }
          to { width: 0%; background-color: rgb(244, 63, 94); }
        }
      `}</style>

      {/* Header - 고정 높이로 레이아웃 shift 방지 */}
      <div className="flex justify-between items-center p-4 h-14">
        {/* Streak (Mode A only) */}
        {game.mode === 'listening' && (
          <div className="text-amber-400 font-bold">
            <span className="text-xl">🔥</span>
            <span className="ml-1">{game.streak}</span>
          </div>
        )}
        {/* Timer display for Mode B - 항상 렌더링, 투명도로 숨김 */}
        {game.mode === 'image' && (
          <div
            className={`text-slate-400 font-mono text-lg transition-opacity duration-200 ${
              game.status === 'playing' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {Math.ceil(timeLeft)}초
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
              {game.currentQuestion.string}번 줄
            </p>

            {/* Target Note */}
            <h1 className="text-7xl font-bold font-mono text-slate-100 tracking-tighter">
              {game.currentQuestion.note}
            </h1>

            {/* Status / Feedback */}
            <div className="mt-8 h-20 flex items-center justify-center">
              {game.status === 'playing' && (
                <p className="text-slate-400 text-lg animate-pulse">
                  {game.mode === 'listening' ? '듣는 중...' : '생각 중...'}
                </p>
              )}

              {game.status === 'feedback' && (
                <div className="text-center">
                  <p
                    className={`text-2xl font-bold ${
                      game.isCorrect ? 'text-emerald-400' : 'text-rose-500'
                    }`}
                  >
                    {game.isCorrect ? '정답!' : `${game.currentQuestion.fret}프렛`}
                  </p>
                  {/* Mode A: 오답 시 다음 버튼 표시 */}
                  {!game.isCorrect && game.mode === 'listening' && (
                    <button
                      onClick={handleNext}
                      className="mt-4 px-6 py-2 bg-slate-700 rounded-lg text-slate-100"
                    >
                      다음
                    </button>
                  )}
                  {/* Mode B: 자동 진행 안내 */}
                  {game.mode === 'image' && (
                    <p className="mt-2 text-slate-500 text-sm">
                      잠시 후 다음 문제...
                    </p>
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
