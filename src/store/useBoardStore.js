import { create } from 'zustand';
import { boardAPI } from '../api/endpoints/board';

const user = JSON.parse(localStorage.getItem('user-storage'))?.state?.user;

export const useBoardStore = create((set, get) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),

  editingData: null,
  setEditingData: (editingData) => set({ editingData }),

  boards: [],
  sharedWithYou: [],

  selectedBoard: null,
  setSelectedBoard: (selectedBoard) => set({ selectedBoard }),

  fetchBoards: async () => {
    try {
      const response = await boardAPI.getAll({ userId: user?.id });
      set({ boards: response.data });
    } catch (error) {
      console.log('error', error);
    }
  },

  fetchBoardsSharedWithYou: async () => {
    try {
      const response = await boardAPI.sharedWithYou({ UserMasterId: user?.id });
      set({ sharedWithYou: response.data });
    } catch (error) {
      console.log('error', error);
    }
  },

  handleCreateBoard: async (values) => {
    const formattedValues = {
      ...values,
      UserMasterId: user?.id,
    };

    set({ loading: true });
    try {
      await boardAPI.create(formattedValues);
      get().fetchBoards();
    } catch (error) {
      console.log('error', error);
    } finally {
      set({ loading: false });
    }
  },

  handleUpdateBoard: async (id, values) => {
    set({ loading: true });
    try {
      await boardAPI.update(id, values);
      get().fetchBoards();
    } catch (error) {
      console.log('Update error:', error);
    } finally {
      set({ loading: false });
    }
  },

  handleDeleteBoard: async (boardId) => {
    set({ loading: true });
    try {
      await boardAPI.delete(boardId, user.id);
      get().fetchBoards();
    } catch (error) {
      console.log('Delete error:', error);
    } finally {
      set({ loading: false });
    }
  },

  handleShareBoard: async (board) => {
    set({ loading: true });
    try {
      const response = await boardAPI.shareBoard(board);
      return response;
    } catch (error) {
      console.log('err', error);
      set({ loading: false });
    } finally {
      set({ loading: false });
    }
  },
}));
