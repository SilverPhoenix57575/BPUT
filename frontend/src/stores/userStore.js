import { create } from 'zustand'

const useUserStore = create((set) => ({
  user: null,
  role: 'student',
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  logout: () => set({ user: null })
}))

export default useUserStore
