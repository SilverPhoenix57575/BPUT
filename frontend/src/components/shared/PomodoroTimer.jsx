import { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Settings, X, Timer } from 'lucide-react'
import usePomodoroStore from '../../stores/pomodoroStore'
import useUserStore from '../../stores/userStore'

export default function PomodoroTimer() {
  const [showSettings, setShowSettings] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)
  const { user } = useUserStore()
  const { 
    settings, stats, timeLeft, isRunning, mode, currentSession,
    loadSettings, saveSettings, loadStats, start, pause, reset, tick, complete, skipToWork 
  } = usePomodoroStore()

  useEffect(() => {
    const userId = user?.data?.userId || user?.id || user?.email
    if (userId) {
      loadSettings(userId)
      loadStats(userId)
    }
  }, [user, loadSettings, loadStats])

  useEffect(() => {
    const interval = setInterval(() => {
      if (isRunning) {
        tick()
        const userId = user?.data?.userId || user?.id || user?.email
        if (timeLeft === 1 && userId) {
          complete(userId)
          new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHAU2jdXvzn0pBSh+zPDajzsKElyx6OyrWBUIQ5zd8sFuJAUuhM/z24k2CBhku+zooVARC0yl4fG5ZRwFNo3V7859KQUofsz=').play().catch(() => {})
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const progress = mode === 'work' 
    ? ((settings.workDuration * 60 - timeLeft) / (settings.workDuration * 60)) * 100
    : mode === 'shortBreak'
    ? ((settings.shortBreak * 60 - timeLeft) / (settings.shortBreak * 60)) * 100
    : ((settings.longBreak * 60 - timeLeft) / (settings.longBreak * 60)) * 100

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-4 py-3 rounded-full shadow-lg"
          style={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border-primary)', borderWidth: '1px' }}
        >
          <Timer size={20} style={{ color: 'var(--color-text-primary)' }} />
          <span className="font-mono font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {formatTime(timeLeft)}
          </span>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-80 rounded-2xl shadow-2xl p-6" style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--color-border-primary)',
      borderWidth: '1px'
    }}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold" style={{ color: 'var(--color-text-primary)' }}>Pomodoro Timer</h3>
        <div className="flex gap-2">
          <button onClick={() => setShowSettings(!showSettings)} className="p-1 hover:opacity-70">
            <Settings size={18} style={{ color: 'var(--color-text-secondary)' }} />
          </button>
          <button onClick={() => setIsMinimized(true)} className="p-1 hover:opacity-70">
            <X size={18} style={{ color: 'var(--color-text-secondary)' }} />
          </button>
        </div>
      </div>

      {showSettings ? (
        <PomodoroSettings 
          settings={settings} 
          onSave={(newSettings) => {
            const userId = user?.data?.userId || user?.id || user?.email
            saveSettings(userId, newSettings)
            setShowSettings(false)
          }}
          onClose={() => setShowSettings(false)}
        />
      ) : (
        <>
          <div className="text-center mb-6">
            <div className="inline-block px-4 py-1 rounded-full mb-4" style={{
              backgroundColor: mode === 'work' ? '#ef4444' : '#10b981',
              color: 'white'
            }}>
              {mode === 'work' ? '🎯 Focus Time' : mode === 'shortBreak' ? '☕ Short Break' : '🌟 Long Break'}
            </div>
            
            <div className="relative w-48 h-48 mx-auto mb-4">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle cx="96" cy="96" r="88" stroke="var(--color-border-primary)" strokeWidth="8" fill="none" />
                <circle 
                  cx="96" cy="96" r="88" 
                  stroke={mode === 'work' ? '#ef4444' : '#10b981'}
                  strokeWidth="8" 
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-mono font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-3 mb-4">
              <button
                onClick={isRunning ? pause : start}
                className="p-3 rounded-full hover:opacity-80 transition"
                style={{ backgroundColor: mode === 'work' ? '#ef4444' : '#10b981', color: 'white' }}
              >
                {isRunning ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button
                onClick={reset}
                className="p-3 rounded-full hover:opacity-80 transition"
                style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)' }}
              >
                <RotateCcw size={24} />
              </button>
              {mode !== 'work' && (
                <button
                  onClick={skipToWork}
                  className="px-4 py-3 rounded-full hover:opacity-80 transition text-sm font-medium"
                  style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)' }}
                >
                  Skip
                </button>
              )}
            </div>

            <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Session {currentSession + 1} • {stats.todayCount} completed today
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4" style={{ borderTopWidth: '1px', borderColor: 'var(--color-border-primary)' }}>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{stats.todayCount}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{stats.weekCount}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>This Week</div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function PomodoroSettings({ settings, onSave, onClose }) {
  const [form, setForm] = useState(settings)

  const handleSave = () => {
    onSave(form)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>Work Duration (min)</label>
        <input
          type="number"
          value={form.workDuration}
          onChange={(e) => setForm({ ...form, workDuration: parseInt(e.target.value) })}
          className="w-full px-3 py-2 rounded-lg"
          style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', borderColor: 'var(--color-border-primary)', borderWidth: '1px' }}
          min="1"
          max="60"
        />
      </div>
      <div>
        <label className="block text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>Short Break (min)</label>
        <input
          type="number"
          value={form.shortBreak}
          onChange={(e) => setForm({ ...form, shortBreak: parseInt(e.target.value) })}
          className="w-full px-3 py-2 rounded-lg"
          style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', borderColor: 'var(--color-border-primary)', borderWidth: '1px' }}
          min="1"
          max="30"
        />
      </div>
      <div>
        <label className="block text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>Long Break (min)</label>
        <input
          type="number"
          value={form.longBreak}
          onChange={(e) => setForm({ ...form, longBreak: parseInt(e.target.value) })}
          className="w-full px-3 py-2 rounded-lg"
          style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', borderColor: 'var(--color-border-primary)', borderWidth: '1px' }}
          min="1"
          max="60"
        />
      </div>
      <div>
        <label className="block text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>Sessions Until Long Break</label>
        <input
          type="number"
          value={form.sessionsUntilLongBreak}
          onChange={(e) => setForm({ ...form, sessionsUntilLongBreak: parseInt(e.target.value) })}
          className="w-full px-3 py-2 rounded-lg"
          style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', borderColor: 'var(--color-border-primary)', borderWidth: '1px' }}
          min="1"
          max="10"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.autoStartBreaks}
          onChange={(e) => setForm({ ...form, autoStartBreaks: e.target.checked })}
          className="rounded"
        />
        <label className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Auto-start breaks</label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.autoStartPomodoros}
          onChange={(e) => setForm({ ...form, autoStartPomodoros: e.target.checked })}
          className="rounded"
        />
        <label className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Auto-start pomodoros</label>
      </div>
      <div className="flex gap-2 pt-2">
        <button
          onClick={handleSave}
          className="flex-1 py-2 rounded-lg font-medium"
          style={{ backgroundColor: '#3b82f6', color: 'white' }}
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-2 rounded-lg font-medium"
          style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)' }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
