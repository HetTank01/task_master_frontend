import { create } from 'zustand';
import { commentAPI } from '../api/endpoints/comment';

export const useCommentStore = create((set, get) => ({
  comments: [],
  setComments: (comments) => set({ comments }),

  editingData: null,
  setEditingData: (editingData) => set({ editingData }),

  fetchComments: async (cardId) => {
    try {
      const response = await commentAPI.getAll({ cardId });
      set({ comments: response.data });
    } catch (error) {
      console.log('Error', error);
    }
  },

  saveComment: async (commentId, data) => {
    const { editingData } = get();

    try {
      if (editingData) {
        await commentAPI.update(commentId, data);
        set({ editingData: null });
      } else {
        await commentAPI.create(data);
      }
    } catch (error) {
      console.log('Error', error);
    }
  },

  deleteComment: async (commentId, params) => {
    try {
      const response = await commentAPI.delete(commentId, params);
      return response;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  addReply: async (data) => {
    try {
      const response = await commentAPI.createReply(data);
      return response;
    } catch (error) {
      console.log('error', error);
    }
  },

  cancelEditing: () => {
    set({ editingData: null });
  },
}));
