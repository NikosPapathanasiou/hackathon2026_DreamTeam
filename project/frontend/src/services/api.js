/**
 * API Service - Backend Connection
 * Person 2: Frontend Developer
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
};

// Children API
export const childrenAPI = {
  getAll: () => api.get('/children'),
  getById: (id) => api.get(`/children/${id}`),
  create: (data) => api.post('/children', data),
  update: (id, data) => api.patch(`/children/${id}`, data),
  delete: (id) => api.delete(`/children/${id}`),
  getBalance: (id) => api.get(`/children/${id}/balance`),
};

// Transactions API
export const transactionsAPI = {
  create: (data) => api.post('/transactions', data),
  getByChild: (childId) => api.get(`/transactions/child/${childId}`),
  getPending: () => api.get('/transactions/pending'),
  approve: (id) => api.patch(`/transactions/${id}/approve`),
  reject: (id) => api.patch(`/transactions/${id}/reject`),
};

// Budgets API
export const budgetsAPI = {
  create: (data) => api.post('/budgets', data),
  getByChild: (childId) => api.get(`/budgets/child/${childId}`),
  update: (id, data) => api.patch(`/budgets/${id}`, data),
  delete: (id) => api.delete(`/budgets/${id}`),
  reset: (id) => api.post(`/budgets/${id}/reset`),
};

// Education API
export const educationAPI = {
  recordProgress: (data) => api.post('/education/progress', data),
  getProgress: (childId) => api.get(`/education/progress/child/${childId}`),
  getLessonProgress: (childId, lessonId) =>
    api.get(`/education/progress/child/${childId}/lesson/${lessonId}`),
};

export default api;
