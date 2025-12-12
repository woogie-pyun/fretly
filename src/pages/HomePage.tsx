import { useNavigate } from 'react-router-dom'
import { Mic, Eye, Flame } from 'lucide-react'
import { useGameStore } from '@/store/useGameStore'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { TIMER_MIN, TIMER_MAX } from '@/lib/constants'
import type { GameMode, GuitarString } from '@/types'
import { cn } from '@/lib/utils'

/**
 * HomePage - Settings & Mode Selection
 * Main screen where users configure their practice session
 */
export function HomePage() {
  const navigate = useNavigate()
  const {
    settings,
    bestStreak,
    startGame,
    toggleString,
    setIncludeAccidentals,
    setTimerDuration,
  } = useGameStore()

  const handleStartGame = (mode: GameMode) => {
    startGame(mode)
    navigate('/game')
  }

  const strings: GuitarString[] = [6, 5, 4, 3, 2, 1]

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-100">Fretly</h1>
          <p className="text-slate-400 mt-2">지판 마스터하기</p>
        </div>

        {/* Settings Card */}
        <div className="bg-slate-800 rounded-xl p-6 space-y-6">
          {/* String Selection */}
          <div>
            <label className="text-sm text-slate-400 block mb-3">줄 선택</label>
            <div className="flex gap-2 justify-center">
              {strings.map((string) => {
                const isSelected = settings.selectedStrings.includes(string)
                return (
                  <button
                    key={string}
                    onClick={() => toggleString(string)}
                    className={cn(
                      'w-11 h-11 rounded-full border-2 font-bold text-lg transition-all active:scale-95',
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'border-slate-600 text-slate-500 hover:border-slate-500 hover:text-slate-400'
                    )}
                    aria-label={`${string}번 줄 ${isSelected ? '선택됨' : '선택 안됨'}`}
                    aria-pressed={isSelected}
                  >
                    {string}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-slate-500 text-center mt-2">
              {settings.selectedStrings.length === 6
                ? '모든 줄'
                : `${settings.selectedStrings.length}개 줄 선택됨`}
            </p>
          </div>

          {/* Accidentals Toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <label className="text-sm text-slate-100 block">샵/플랫 포함</label>
              <p className="text-xs text-slate-500">#, ♭ 음표를 퀴즈에 추가</p>
            </div>
            <Switch
              checked={settings.includeAccidentals}
              onCheckedChange={setIncludeAccidentals}
            />
          </div>

          {/* Timer Slider */}
          <div>
            <div className="flex justify-between items-baseline mb-3">
              <label className="text-sm text-slate-100">문제당 제한시간</label>
              <span className="text-2xl font-bold text-indigo-400 tabular-nums">
                {settings.timerDuration}초
              </span>
            </div>
            <Slider
              min={TIMER_MIN}
              max={TIMER_MAX}
              step={1}
              value={settings.timerDuration}
              onValueChange={setTimerDuration}
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>{TIMER_MIN}초</span>
              <span>{TIMER_MAX}초</span>
            </div>
          </div>
        </div>

        {/* Mode Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleStartGame('listening')}
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-semibold flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20"
            aria-label="마이크를 사용한 리스닝 챌린지 시작"
          >
            <Mic className="w-5 h-5" aria-hidden="true" />
            리스닝 챌린지 시작
          </button>
          <button
            onClick={() => handleStartGame('image')}
            className="w-full py-4 px-6 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-semibold flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            aria-label="눈으로 학습하는 이미지 트레이닝 시작"
          >
            <Eye className="w-5 h-5" aria-hidden="true" />
            이미지 트레이닝 시작
          </button>
        </div>

        {/* Best Streak */}
        {bestStreak > 0 && (
          <div className="flex items-center justify-center gap-2 text-amber-400">
            <Flame className="w-6 h-6 fill-amber-400" />
            <span className="font-semibold">최고 연속 정답: {bestStreak}</span>
          </div>
        )}
      </div>
    </div>
  )
}
