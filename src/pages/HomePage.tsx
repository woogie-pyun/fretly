import { useNavigate } from 'react-router-dom'
import { Mic, Eye } from 'lucide-react'
import { useGameStore } from '@/store/useGameStore'
import type { GameMode } from '@/types'

/**
 * HomePage - Settings & Mode Selection
 * Main screen where users configure their practice session
 */
export function HomePage() {
  const navigate = useNavigate()
  const { settings, bestStreak, startGame } = useGameStore()

  const handleStartGame = (mode: GameMode) => {
    startGame(mode)
    navigate('/game')
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-100">Fretly</h1>
          <p className="text-slate-400 mt-2">Master your fretboard</p>
        </div>

        {/* Settings Card */}
        <div className="bg-slate-800 rounded-xl p-6 space-y-6">
          {/* String Selection */}
          <div>
            <label className="text-sm text-slate-400 block mb-3">Strings</label>
            {/* TODO: String toggle buttons */}
            <div className="flex gap-2 justify-center">
              {[6, 5, 4, 3, 2, 1].map((string) => (
                <button
                  key={string}
                  className={`w-10 h-10 rounded-full border-2 font-bold transition-all ${
                    settings.selectedStrings.includes(string as 1 | 2 | 3 | 4 | 5 | 6)
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-600 text-slate-400'
                  }`}
                >
                  {string}
                </button>
              ))}
            </div>
          </div>

          {/* Accidentals Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-slate-400">Include sharps/flats</label>
            {/* TODO: Switch component */}
            <button
              className={`w-12 h-6 rounded-full transition-all ${
                settings.includeAccidentals ? 'bg-indigo-600' : 'bg-slate-600'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.includeAccidentals ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Timer Slider */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <label className="text-slate-400">Timer</label>
              <span className="text-slate-100">{settings.timerDuration}s</span>
            </div>
            {/* TODO: Slider component */}
            <input
              type="range"
              min={2}
              max={15}
              value={settings.timerDuration}
              className="w-full"
            />
          </div>
        </div>

        {/* Mode Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleStartGame('listening')}
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-semibold flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <Mic className="w-5 h-5" />
            Start Listening Challenge
          </button>
          <button
            onClick={() => handleStartGame('image')}
            className="w-full py-4 px-6 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-semibold flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <Eye className="w-5 h-5" />
            Start Image Training
          </button>
        </div>

        {/* Best Streak */}
        {bestStreak > 0 && (
          <div className="text-center text-amber-400">
            <span className="text-2xl">🔥</span>
            <span className="ml-2">Best Streak: {bestStreak}</span>
          </div>
        )}
      </div>
    </div>
  )
}
