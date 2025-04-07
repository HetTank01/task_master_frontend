import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const api = axios.create({
  baseURL: API_URL,
  // timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const server = axios.create({
  baseURL: SERVER_URL,
  // timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const multipartRequest = axios.create({
  baseURL: API_URL,
  // timeout: 10000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Request interceptor for adding the access token
api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem('user-storage'))?.state?.user
      ?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle unauthorized access
    if (error.response?.status === 401) {
      localStorage.removeItem('user-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

multipartRequest.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem('user-storage'))?.state?.user
      ?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
