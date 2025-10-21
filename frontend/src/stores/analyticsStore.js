import { create } from 'zustand'

const useAnalyticsStore = create((set, get) => ({
  studyTime: { today: 0, thisWeek: 0 },
  activityStats: { notes: 0, flashcards: 0, quizzes: 0 },
  weeklyStudyTime: [0, 0, 0, 0, 0, 0, 0],
  topicAccuracy: {},
  sessionStart: null,

  startSession: () => set({ sessionStart: Date.now() }),

  endSession: () => {
    const { sessionStart, studyTime, weeklyStudyTime } = get()
    if (!sessionStart) return

    const duration = Math.floor((Date.now() - sessionStart) / 60000)
    const today = new Date().getDay()

    set({
      studyTime: {
        today: studyTime.today + duration,
        thisWeek: studyTime.thisWeek + duration
      },
      weeklyStudyTime: weeklyStudyTime.map((time, i) => i === today ? time + duration : time),
      sessionStart: null
    })
  },

  trackActivity: (type) => {
    set((state) => ({
      activityStats: {
        ...state.activityStats,
        [type]: state.activityStats[type] + 1
      }
    }))
  },

  updateTopicAccuracy: (topic, correct, total) => {
    set((state) => ({
      topicAccuracy: {
        ...state.topicAccuracy,
        [topic]: { correct, total, accuracy: Math.round((correct / total) * 100) }
      }
    }))
  },

  resetWeekly: () => set({ studyTime: { ...get().studyTime, thisWeek: 0 }, weeklyStudyTime: [0, 0, 0, 0, 0, 0, 0] })
}))

export default useAnalyticsStore
