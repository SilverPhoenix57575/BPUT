import { create } from 'zustand'

export const useMetricsStore = create((set) => ({
  facialExpression: null,
  vocalState: null,
  textFriction: { rephraseCount: 0, backspaceCount: 0 },
  frictionIntensity: 0,
  facialCandidates: undefined,
  vocalCandidates: undefined,
  setFacialExpression: (v) => set({ facialExpression: v }),
  setVocalState: (v) => set({ vocalState: v }),
  setTextFriction: (rephraseCount, backspaceCount) => set({ textFriction: { rephraseCount, backspaceCount } }),
  setFrictionIntensity: (value) => set({ frictionIntensity: Math.max(0, Math.min(1, value)) }),
  setFacialCandidates: (cands) => set({ facialCandidates: cands }),
  setVocalCandidates: (cands) => set({ vocalCandidates: cands })
}))

export const useCognitiveStore = create((set) => ({
  currentState: 'FOCUSED',
  events: [],
  setState: (state) => set({ currentState: state }),
  addEvent: (event) => set((state) => ({
    events: [...state.events, { ...event, id: `event_${Date.now()}`, timestamp: new Date().toISOString() }]
  })),
  clearEvents: () => set({ events: [] })
}))
