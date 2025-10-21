import { create } from 'zustand'
import offlineStorage from '../services/pouchdb'

const useProgressStore = create((set, get) => ({
  masteryLevels: {},
  badges: [],
  quizzesTaken: 0,
  masteredCompetencies: 0,
  totalTimeSpent: 0,
  perfectScores: 0,
  
  loadProgress: async (userId) => {
    try {
      const progress = await offlineStorage.getProgress(userId)
      const masteryLevels = {}
      progress.forEach(p => {
        masteryLevels[p.competencyId] = p.masteryLevel || 0
      })
      set({ 
        masteryLevels,
        masteredCompetencies: Object.values(masteryLevels).filter(l => l >= 0.95).length
      })
    } catch (err) {
      console.error('Failed to load progress:', err)
    }
  },
  
  setMasteryLevels: (levels) => set({ masteryLevels: levels }),
  
  updateMastery: async (userId, competencyId, level, interactions = []) => {
    try {
      await offlineStorage.saveProgress(userId, competencyId, {
        masteryLevel: level,
        interactions
      })
      set((state) => ({
        masteryLevels: { ...state.masteryLevels, [competencyId]: level },
        masteredCompetencies: Object.values({ ...state.masteryLevels, [competencyId]: level }).filter(l => l >= 0.95).length
      }))
    } catch (err) {
      console.error('Failed to update mastery:', err)
    }
  },
  
  addBadge: (badge) => set((state) => ({
    badges: [...state.badges, badge]
  })),
  
  incrementQuizzes: () => set((state) => ({ quizzesTaken: state.quizzesTaken + 1 })),
  
  addTimeSpent: (seconds) => set((state) => ({ totalTimeSpent: state.totalTimeSpent + seconds })),
  
  incrementPerfectScores: () => set((state) => ({ perfectScores: state.perfectScores + 1 }))
}))

export default useProgressStore
