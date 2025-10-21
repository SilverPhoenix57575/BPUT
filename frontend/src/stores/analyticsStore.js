import { create } from 'zustand'

const useAnalyticsStore = create((set, get) => ({
  sessionStart: null,
  currentActivity: null,
  currentTopic: null,

  startSession: (activityType, topic) => {
    set({
      sessionStart: Date.now(),
      currentActivity: activityType,
      currentTopic: topic
    })
  },

  endSession: () => {
    const { sessionStart } = get()
    if (!sessionStart) return 0
    
    const duration = Math.floor((Date.now() - sessionStart) / 1000)
    set({ sessionStart: null, currentActivity: null, currentTopic: null })
    return duration
  },

  getSessionDuration: () => {
    const { sessionStart } = get()
    if (!sessionStart) return 0
    return Math.floor((Date.now() - sessionStart) / 1000)
  }
}))

export default useAnalyticsStore
