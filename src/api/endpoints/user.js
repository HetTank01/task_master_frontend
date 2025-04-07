import api from '../axios';

const API_GROUP = '/user';

export const userAPI = {
  getAll: () => api.get(`${API_GROUP}`),
};
