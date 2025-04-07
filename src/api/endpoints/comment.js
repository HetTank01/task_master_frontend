import api from '../axios';

const API_GROUP = '/comment';

export const commentAPI = {
  getAll: (params) => api.get(`${API_GROUP}/`, { params }),
  create: (data) => api.post(`${API_GROUP}/`, data),
  update: (id, data) => api.put(`${API_GROUP}/${id}`, data),
  delete: (id, params) =>
    api.delete(`${API_GROUP}/${id}`, {
      params,
    }),
  createReply: (data) => api.post(`${API_GROUP}/reply`, data),
};
