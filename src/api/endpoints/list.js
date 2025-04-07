import api from '../axios';

const API_GROUP = '/list';

export const listAPI = {
  getAll: (params) => api.get(`${API_GROUP}`, { params }),
  create: (data) => api.post(`${API_GROUP}`, data),
  update: (id, data) => api.put(`${API_GROUP}/${id}`, data),
  delete: (id) => api.delete(`${API_GROUP}/${id}`),
  updateCardPosition: (listId, data) =>
    api.put(`${API_GROUP}/${listId}/cards/update-positions`, data),
};
