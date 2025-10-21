import { create } from 'zustand'
import offlineStorage from '../services/pouchdb'

const useNotebookStore = create((set, get) => ({
  notebookItems: [],
  libraryItems: [],
  
  loadNotebook: async (userId) => {
    try {
      const notes = await offlineStorage.getNotes(userId)
      set({ notebookItems: notes.filter(n => n.destination === 'notebook') })
    } catch (err) {
      console.error('Failed to load notebook:', err)
    }
  },
  
  loadLibrary: async (userId) => {
    try {
      const notes = await offlineStorage.getNotes(userId)
      set({ libraryItems: notes.filter(n => n.destination === 'library') })
    } catch (err) {
      console.error('Failed to load library:', err)
    }
  },
  
  addToNotebook: async (item, userId) => {
    try {
      const saved = await offlineStorage.saveNote(userId, { ...item, destination: 'notebook' })
      set((state) => ({ notebookItems: [...state.notebookItems, saved] }))
      return saved
    } catch (err) {
      console.error('Failed to save to notebook:', err)
      throw err
    }
  },
  
  addToLibrary: async (item, userId) => {
    try {
      const saved = await offlineStorage.saveNote(userId, { ...item, destination: 'library' })
      set((state) => ({ libraryItems: [...state.libraryItems, saved] }))
      return saved
    } catch (err) {
      console.error('Failed to save to library:', err)
      throw err
    }
  },
  
  removeFromNotebook: (id) => set((state) => ({
    notebookItems: state.notebookItems.filter(item => item._id !== id)
  })),
  
  removeFromLibrary: (id) => set((state) => ({
    libraryItems: state.libraryItems.filter(item => item._id !== id)
  }))
}))

export default useNotebookStore
