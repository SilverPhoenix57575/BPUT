import { create } from 'zustand'

const useProgressStore = create((set) => ({
  masteryLevels: {},
  badges: [],
  quizzesTaken: 0,
  masteredCompetencies: 0,
  totalTimeSpent: 0,
  perfectScores: 0,
  setMasteryLevels: (levels) => set({ masteryLevels: levels }),
  updateMastery: (competencyId, level) => set((state) => ({
    masteryLevels: { ...state.masteryLevels, [competencyId]: level },
    masteredCompetencies: Object.values({ ...state.masteryLevels, [competencyId]: level }).filter(l => l >= 0.95).length
  })),
  addBadge: (badge) => set((state) => ({
    badges: [...state.badges, badge]
  })),
  incrementQuizzes: () => set((state) => ({ quizzesTaken: state.quizzesTaken + 1 })),
  addTimeSpent: (seconds) => set((state) => ({ totalTimeSpent: state.totalTimeSpent + seconds })),
  incrementPerfectScores: () => set((state) => ({ perfectScores: state.perfectScores + 1 }))
}))

export default useProgressStore
