import { create } from 'zustand'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const usePomodoroStore = create((set, get) => ({
  settings: {
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsUntilLongBreak: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false
  },
  stats: {
    todayCount: 0,
    todayMinutes: 0,
    weekCount: 0,
    weekMinutes: 0
  },
  currentSession: 0,
  isRunning: false,
  timeLeft: 25 * 60,
  mode: 'work',

  loadSettings: async (userId) => {
    if (!userId) return
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/pomodoro/settings/${userId}`)
      if (data.success) {
        set({ settings: data.data, timeLeft: data.data.workDuration * 60 })
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  },

  saveSettings: async (userId, newSettings) => {
    const { mode } = get()
    const duration = mode === 'work' ? newSettings.workDuration : 
                     mode === 'shortBreak' ? newSettings.shortBreak : newSettings.longBreak
    set({ 
      settings: newSettings, 
      timeLeft: duration * 60,
      isRunning: false
    })
    
    if (!userId) return
    
    try {
      await axios.post(`${API_URL}/api/v1/pomodoro/settings`, { userId, ...newSettings })
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  },

  loadStats: async (userId) => {
    if (!userId) return
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/pomodoro/stats/${userId}`)
      if (data.success) {
        set({ stats: data.data })
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  },

  saveSession: async (userId, duration, completed) => {
    try {
      await axios.post(`${API_URL}/api/v1/pomodoro/session`, { userId, duration, completed })
    } catch (error) {
      console.error('Failed to save session:', error)
    }
  },

  start: () => set({ isRunning: true }),
  pause: () => set({ isRunning: false }),
  
  reset: () => {
    const { settings, mode } = get()
    const duration = mode === 'work' ? settings.workDuration : 
                     mode === 'shortBreak' ? settings.shortBreak : settings.longBreak
    set({ timeLeft: duration * 60, isRunning: false })
  },

  tick: () => {
    const { timeLeft, isRunning } = get()
    if (isRunning && timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 })
    }
  },

  complete: async (userId) => {
    const { mode, settings, currentSession } = get()
    
    if (mode === 'work') {
      await get().saveSession(userId, settings.workDuration, true)
      const newSession = currentSession + 1
      const nextMode = newSession % settings.sessionsUntilLongBreak === 0 ? 'longBreak' : 'shortBreak'
      const nextDuration = nextMode === 'longBreak' ? settings.longBreak : settings.shortBreak
      
      set({ 
        currentSession: newSession,
        mode: nextMode,
        timeLeft: nextDuration * 60,
        isRunning: settings.autoStartBreaks
      })
    } else {
      set({ 
        mode: 'work',
        timeLeft: settings.workDuration * 60,
        isRunning: settings.autoStartPomodoros
      })
    }
    
    await get().loadStats(userId)
  },

  skipToWork: () => {
    const { settings } = get()
    set({ mode: 'work', timeLeft: settings.workDuration * 60, isRunning: false })
  }
}))

export default usePomodoroStore
