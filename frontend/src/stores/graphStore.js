import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useGraphStore = create(
  persist(
    (set) => ({
      nodes: [],
      edges: [],
      isLocked: false,
      
      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),
      
      addNode: (node) => set((state) => ({
        nodes: [...state.nodes, { ...node, data: { ...node.data, isNew: true, timestamp: new Date().toISOString() } }]
      })),
      
      updateNode: (id, updates) => set((state) => ({
        nodes: state.nodes.map((n) => n.id === id ? { ...n, ...updates } : n)
      })),
      
      addEdge: (edge) => set((state) => ({
        edges: [...state.edges, edge]
      })),
      
      lockGraph: () => set({ isLocked: true }),
      unlockGraph: () => set({ isLocked: false }),
      
      clearGraph: () => set({ nodes: [], edges: [] })
    }),
    { name: 'knowledge-graph-storage' }
  )
)
