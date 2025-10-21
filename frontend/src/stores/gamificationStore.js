import { create } from 'zustand'

const useGamificationStore = create((set, get) => ({
  xp: 0,
  level: 1,
  streak: 0,
  lastActive: null,
  achievements: [
    { id: 'first_login', name: 'First Login', description: 'Welcome aboard!', earned: true, icon: '🎉' },
    { id: 'note_expert', name: 'Note Expert', description: 'Create 10 notes', progress: 0, target: 10, earned: false, icon: '📝' },
    { id: 'quiz_master', name: 'Quiz Master', description: 'Complete 5 quizzes', progress: 0, target: 5, earned: false, icon: '🎯' },
    { id: 'flashcard_pro', name: 'Flashcard Pro', description: 'Master 50 flashcards', progress: 0, target: 50, earned: false, icon: '🎴' },
    { id: 'streak_warrior', name: 'Streak Warrior', description: '7 day streak', progress: 0, target: 7, earned: false, icon: '🔥' }
  ],
  dailyQuests: [
    { id: 'daily_quiz', name: 'Complete a Quiz', xp: 50, completed: false },
    { id: 'daily_notes', name: 'Create 2 Notes', xp: 30, progress: 0, target: 2, completed: false },
    { id: 'daily_flashcards', name: 'Review 10 Flashcards', xp: 40, progress: 0, target: 10, completed: false }
  ],

  addXP: (amount) => {
    const { xp, level } = get()
    const newXP = xp + amount
    const xpForNextLevel = level * 100
    
    if (newXP >= xpForNextLevel) {
      set({ xp: newXP - xpForNextLevel, level: level + 1 })
    } else {
      set({ xp: newXP })
    }
  },

  updateStreak: () => {
    const { lastActive, streak } = get()
    const today = new Date().toDateString()
    
    if (lastActive === today) return
    
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (lastActive === yesterday.toDateString()) {
      set({ streak: streak + 1, lastActive: today })
    } else if (!lastActive) {
      set({ streak: 1, lastActive: today })
    } else {
      set({ streak: 1, lastActive: today })
    }
  },

  updateAchievement: (id, progress) => {
    set((state) => ({
      achievements: state.achievements.map(a => {
        if (a.id === id) {
          const newProgress = progress
          const earned = newProgress >= a.target
          return { ...a, progress: newProgress, earned }
        }
        return a
      })
    }))
  },

  completeQuest: (questId) => {
    const quest = get().dailyQuests.find(q => q.id === questId)
    if (quest && !quest.completed) {
      get().addXP(quest.xp)
      set((state) => ({
        dailyQuests: state.dailyQuests.map(q => 
          q.id === questId ? { ...q, completed: true } : q
        )
      }))
    }
  },

  updateQuestProgress: (questId, progress) => {
    set((state) => ({
      dailyQuests: state.dailyQuests.map(q => {
        if (q.id === questId && q.target) {
          const completed = progress >= q.target
          return { ...q, progress, completed }
        }
        return q
      })
    }))
  },

  resetDailyQuests: () => {
    set((state) => ({
      dailyQuests: state.dailyQuests.map(q => ({
        ...q,
        completed: false,
        progress: 0
      }))
    }))
  }
}))

export default useGamificationStore
