import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../api';

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      register: async (data) => {
        try {
          const response = await authAPI.register(data);

          console.log('register response', response);

          set({
            user: response.data,
            token: response.data.token,
            isAuthenticated: true,
          });

          return response;
        } catch (error) {
          console.log('Error while registering', error);
        }
      },

      login: async (data) => {
        try {
          const response = await authAPI.login(data);

          console.log('login resposne', response);

          set({
            user: response.data,
            token: response.data.token,
            isAuthenticated: true,
          });

          return response;
        } catch (error) {
          console.log('Error while login', error);
        }
      },

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
