import { create } from 'zustand';
import { boardAPI } from '../api/endpoints/board';
import { useBoardStore } from './useBoardStore';

export const useInvitationStore = create((set) => ({
  invitationDetails: null,
  loading: false,
  error: null,

  validateInvite: async (token) => {
    try {
      const response = await boardAPI.validateInvite({ token });
      console.log('reso', response);
      if (response.status === 'success') {
        set({ invitationDetails: response.data });
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Invitation validation error', error);
      return null;
    }
  },

  acceptInvite: async (token) => {
    try {
      const response = await boardAPI.acceptInvite({ token });

      if (response.status === 200) {
        useBoardStore.getState().fetchBoards();
        useBoardStore.getState().fetchSharedBoards();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Invitation acceptance error', error);
      return false;
    }
  },
}));
