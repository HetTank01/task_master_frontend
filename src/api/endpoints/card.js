import api from '../axios';

const API_GROUP = '/card';

export const cardAPI = {
  getAll: (params) => api.get(`${API_GROUP}`, { params }),
  create: (data) => api.post(`${API_GROUP}`, data),
  update: (id, data) => api.patch(`${API_GROUP}/${id}`, data),
  delete: (id) => api.delete(`${API_GROUP}/${id}`),
  moveCard: (cardId, data) => api.put(`${API_GROUP}/${cardId}/move`, data),
};
