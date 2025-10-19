import { create } from 'zustand'

const useProgressStore = create((set) => ({
  masteryLevels: {},
  badges: [],
  setMasteryLevels: (levels) => set({ masteryLevels: levels }),
  updateMastery: (competencyId, level) => set((state) => ({
    masteryLevels: { ...state.masteryLevels, [competencyId]: level }
  })),
  addBadge: (badge) => set((state) => ({
    badges: [...state.badges, badge]
  }))
}))

export default useProgressStore
