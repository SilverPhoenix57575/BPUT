import { create } from 'zustand'

const useNotebookStore = create((set) => ({
  notebookItems: [],
  libraryItems: [],
  
  addToNotebook: (item) => set((state) => ({
    notebookItems: [...state.notebookItems, { ...item, id: Date.now(), createdAt: new Date().toISOString() }]
  })),
  
  addToLibrary: (item) => set((state) => ({
    libraryItems: [...state.libraryItems, { ...item, id: Date.now(), createdAt: new Date().toISOString() }]
  })),
  
  removeFromNotebook: (id) => set((state) => ({
    notebookItems: state.notebookItems.filter(item => item.id !== id)
  })),
  
  removeFromLibrary: (id) => set((state) => ({
    libraryItems: state.libraryItems.filter(item => item.id !== id)
  }))
}))

export default useNotebookStore
