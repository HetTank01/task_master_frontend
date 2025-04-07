import { create } from 'zustand';
import { listAPI } from '../api/endpoints/list';

export const useListStore = create((set, get) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),

  editingData: null,
  setEditingData: (editingData) => set({ editingData }),

  lists: [],
  setLists: (lists) => set({ lists }),

  fetchLists: async (boardId) => {
    set({ loading: true });
    try {
      const response = await listAPI.getAll({ boardId });
      const sortedLists = response.data.sort((a, b) => a.position - b.position);
      set({
        lists: sortedLists,
        loading: false,
      });
    } catch (error) {
      console.log('error', error);
      set({ loading: false });
    }
  },

  createList: async (data) => {
    set({ loading: true });
    try {
      const response = await listAPI.create(data);
      await get().fetchLists(data.BoardMasterId);
      return response.data;
    } catch (error) {
      console.log('error', error);
    } finally {
      set({ loading: false });
    }
  },
}));
