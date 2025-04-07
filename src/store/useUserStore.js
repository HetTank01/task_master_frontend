import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('user-storage');
      },
    }),
    {
      name: 'user-storage',
      getStorage: () => localStorage,
    }
  )
);
