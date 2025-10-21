import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      role: 'student',
      setUser: (user) => set({ user, role: user?.role || 'student' }),
      setRole: (role) => set({ role }),
      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, role: 'student' })
      }
    }),
    {
      name: 'user-storage'
    }
  )
)

export default useUserStore
