import { create } from 'zustand'
import offlineStorage from '../services/pouchdb'

const useContentStore = create((set, get) => ({
  contents: [],
  currentContent: null,
  
  loadContents: async (userId) => {
    try {
      const contents = await offlineStorage.getAllContent(userId)
      set({ contents })
    } catch (err) {
      console.error('Failed to load contents:', err)
    }
  },
  
  setContents: (contents) => set({ contents }),
  
  setCurrentContent: (content) => set({ currentContent: content }),
  
  addContent: async (content, userId) => {
    try {
      const saved = await offlineStorage.saveContent({ ...content, userId })
      set((state) => ({ contents: [...state.contents, saved] }))
      return saved
    } catch (err) {
      console.error('Failed to save content:', err)
      set((state) => ({ contents: [...state.contents, content] }))
      return content
    }
  },
  
  removeContent: (id) => set((state) => ({
    contents: state.contents.filter(c => c._id !== id && c.id !== id)
  }))
}))

export default useContentStore
