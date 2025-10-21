import { create } from 'zustand'

const useContentStore = create((set) => ({
  contents: [],
  currentContent: null,
  setContents: (contents) => set({ contents }),
  setCurrentContent: (content) => set({ currentContent: content }),
  addContent: (content) => set((state) => ({ 
    contents: [...state.contents, content] 
  })),
  removeContent: (id) => set((state) => ({
    contents: state.contents.filter(c => c.id !== id)
  }))
}))

export default useContentStore
