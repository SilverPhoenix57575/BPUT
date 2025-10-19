import { create } from 'zustand'

const useContentStore = create((set) => ({
  contents: [],
  currentContent: null,
  setContents: (contents) => set({ contents }),
  setCurrentContent: (content) => set({ currentContent: content }),
  addContent: (content) => set((state) => ({ 
    contents: [...state.contents, content] 
  }))
}))

export default useContentStore
