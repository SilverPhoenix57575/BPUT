import { create } from 'zustand'

const csCompetencyGraph = {
  subject: "Computer Science Fundamentals",
  nodes: [
    { id: "cs_001", name: "Variables and Data Types", prerequisites: [] },
    { id: "cs_002", name: "Control Flow", prerequisites: ["cs_001"] },
    { id: "cs_003", name: "Functions", prerequisites: ["cs_001", "cs_002"] },
    { id: "cs_004", name: "Recursion", prerequisites: ["cs_003"] },
    { id: "cs_005", name: "Arrays", prerequisites: ["cs_002", "cs_003"] }
  ]
}

const useCompetencyStore = create((set) => ({
  competencyGraph: csCompetencyGraph,
  setCompetencyGraph: (graph) => set({ competencyGraph: graph })
}))

export default useCompetencyStore
