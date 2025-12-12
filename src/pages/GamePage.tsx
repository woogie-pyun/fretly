import { useEffect, useRef, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Square, Mic } from 'lucide-react'
import { useGameStore } from '@/store/useGameStore'
import { useGameLogic, useWakeLock, useTimer, useAudio, usePitchDetect, useSoundEffect } from '@/hooks'
import { FEEDBACK_DELAY_MS } from '@/lib/constants'
import { isSameNote } from '@/lib/music-theory'
import type { Note } from '@/types'

/**
 * GamePage - Active Game Interface
 * Shows current question, timer, and feedback
 */
export function GamePage() {
  const navigate = useNavigate()
  const { game, settings, endGame, nextQuestion, submitAnswer } = useGameStore()
  const { startNewQuestion } = useGameLogic()
  const { request: requestWakeLock, release: releaseWakeLock } = useWakeLock()
  const { play: playSoundEffect } = useSoundEffect()
  const feedbackTimeoutRef = useRef<number | null>(null)
  const [micError, setMicError] = useState<string | null>(null)

  // Audio hooks for Mode A
  const {
    isListening,
    error: audioError,
    startListening,
    stopListening,
    analyser,
  } = useAudio()

  // 정답 체크 핸들러
  const handleNoteDetected = useCallback(
    (detectedNote: Note) => {
      if (
        game.mode === 'listening' &&
        game.status === 'playing' &&
        game.currentQuestion
      ) {
        if (isSameNote(detectedNote, game.currentQuestion.note)) {
          // 정답!
          submitAnswer(true)
        }
      }
    },
    [game.mode, game.status, game.currentQuestion, submitAnswer]
  )

  // Pitch detection
  const { detectedNote } = usePitchDetect({
    analyser,
    isEnabled: isListening && game.mode === 'listening' && game.status === 'playing',
    onNoteDetected: handleNoteDetected,
  })

  // 타임아웃 핸들러
  const handleTimeout = useCallback(() => {
    // 이미 피드백 상태면 무시 (정답이 이미 처리됨)
    if (game.status !== 'playing') return

    if (game.mode === 'image') {
      submitAnswer(false)
    } else if (game.mode === 'listening') {
      // Mode A: 타임아웃 시 오답 처리
      submitAnswer(false)
    }
  }, [game.mode, game.status, submitAnswer])

  // 타이머 훅
  const { timeLeft, start: startTimer, reset: resetTimer } = useTimer(
    settings.timerDuration,
    { onTimeout: handleTimeout }
  )

  // Progress 계산
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

    // Start timer for both modes
    startTimer(settings.timerDuration)

    // Mode A: 마이크 시작
    if (game.mode === 'listening') {
      startListening().catch((err) => {
        setMicError(err.message || '마이크 접근 실패')
      })
    }

    return () => {
      releaseWakeLock()
      stopListening()
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Mode A: 정답 시 즉시 다음 문제
  useEffect(() => {
    if (game.mode === 'listening' && game.status === 'feedback' && game.isCorrect) {
      // 정답 시 짧은 딜레이 후 다음 문제
      feedbackTimeoutRef.current = window.setTimeout(() => {
        goToNextQuestion()
      }, 500)

      return () => {
        if (feedbackTimeoutRef.current) {
          clearTimeout(feedbackTimeoutRef.current)
        }
      }
    }
  }, [game.mode, game.status, game.isCorrect, goToNextQuestion])

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

  // 피드백 효과음 재생 (Mode A만)
  useEffect(() => {
    if (game.mode === 'listening' && game.status === 'feedback' && game.isCorrect !== null) {
      playSoundEffect(game.isCorrect ? 'correct' : 'incorrect')
    }
  }, [game.mode, game.status, game.isCorrect, playSoundEffect])

  const handleStop = () => {
    resetTimer()
    stopListening()
    endGame()
    navigate('/')
  }

  const handleNext = () => {
    goToNextQuestion()
  }

  // 마이크 에러 표시
  const showMicError = micError || audioError

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        game.mode === 'listening' && game.isCorrect === true
          ? 'bg-emerald-500/20'
          : game.mode === 'listening' && game.isCorrect === false
          ? 'bg-rose-500/20'
          : 'bg-slate-900'
      } ${game.mode === 'listening' && game.isCorrect === false ? 'animate-shake' : ''}`}
    >
      {/* Progress Bar */}
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
        @keyframes pulse-mic {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>

      {/* Header - 고정 높이로 레이아웃 shift 방지 */}
      <div className="flex justify-between items-center p-4 h-14">
        {/* Streak (Mode A only) */}
        {game.mode === 'listening' && (
          <div className="text-amber-400 font-bold flex items-center gap-1">
            <span className="text-xl">🔥</span>
            <span>{game.streak}</span>
          </div>
        )}
        {/* Timer display for Mode B */}
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
        {/* Mic indicator for Mode A */}
        {game.mode === 'listening' && game.status === 'playing' && (
          <div
            className="text-indigo-400"
            style={{ animation: 'pulse-mic 1.5s ease-in-out infinite' }}
          >
            <Mic className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Mic Error */}
        {showMicError && game.mode === 'listening' && (
          <div className="mb-8 p-4 bg-rose-500/20 rounded-lg text-rose-400 text-center">
            <p className="font-bold">마이크 오류</p>
            <p className="text-sm mt-1">{showMicError}</p>
          </div>
        )}

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

            {/* Detected Note (Mode A, playing) */}
            {game.mode === 'listening' && game.status === 'playing' && detectedNote && (
              <p className="mt-4 text-2xl text-slate-500 font-mono">
                {detectedNote}
              </p>
            )}

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
                      game.mode === 'image'
                        ? 'text-slate-100'
                        : game.isCorrect
                        ? 'text-emerald-400'
                        : 'text-rose-500'
                    }`}
                  >
                    {game.mode === 'listening' && game.isCorrect ? '정답!' : `${game.currentQuestion.fret}프렛`}
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
