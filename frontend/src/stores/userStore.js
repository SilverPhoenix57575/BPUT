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
      name: 'user-storage',
      // Add error handling for corrupted storage
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate user store:', error)
          // Clear corrupted storage
          localStorage.removeItem('user-storage')
          console.log('Cleared corrupted user storage')
        }
      }
    }
  )
)

export default useUserStore
