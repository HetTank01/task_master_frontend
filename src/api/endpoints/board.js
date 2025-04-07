import api from '../axios';

const API_GROUP = '/board';

export const boardAPI = {
  getAll: (params) => api.get(`${API_GROUP}`, { params }),
  create: (data) => api.post(`${API_GROUP}`, data),
  update: (id, data) => api.put(`${API_GROUP}/${id}`, data),
  delete: (id, UserMasterId) =>
    api.delete(`${API_GROUP}/${id}`, { params: { UserMasterId } }),
  shareBoard: (data) => api.post(`${API_GROUP}/share`, data),

  validateInvite: (data) => api.post(`${API_GROUP}/validate`, data),
  acceptInvite: (data) => api.post(`${API_GROUP}/accept`, data),
  sharedWithYou: (params) =>
    api.get(`${API_GROUP}/shared-with-you`, { params }),
  updateListPosition: (boardId, data) =>
    api.put(`${API_GROUP}/${boardId}/lists/update-positions`, data),
};
