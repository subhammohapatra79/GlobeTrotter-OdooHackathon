/**
 * API service
 * Handles all HTTP requests to the backend
 */

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

/**
 * Auth endpoints
 */
export const authAPI = {
  signup: (email, password, firstName, lastName) =>
    api.post('/auth/signup', { email, password, firstName, lastName }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getCurrentUser: () =>
    api.get('/auth/me')
};

/**
 * Trip endpoints
 */
export const tripAPI = {
  getAll: () =>
    api.get('/trips'),
  getById: (tripId) =>
    api.get(`/trips/${tripId}`),
  create: (name, description, startDate, endDate) =>
    api.post('/trips', { name, description, startDate, endDate }),
  update: (tripId, name, description, startDate, endDate) =>
    api.put(`/trips/${tripId}`, { name, description, startDate, endDate }),
  delete: (tripId) =>
    api.delete(`/trips/${tripId}`)
};

/**
 * Trip Stop endpoints
 */
export const tripStopAPI = {
  getAll: (tripId) =>
    api.get(`/trips/${tripId}/stops`),
  getById: (tripId, stopId) =>
    api.get(`/trips/${tripId}/stops/${stopId}`),
  create: (tripId, city, country, startDate, endDate, notes) =>
    api.post(`/trips/${tripId}/stops`, { city, country, startDate, endDate, notes }),
  update: (tripId, stopId, city, country, startDate, endDate, notes) =>
    api.put(`/trips/${tripId}/stops/${stopId}`, { city, country, startDate, endDate, notes }),
  delete: (tripId, stopId) =>
    api.delete(`/trips/${tripId}/stops/${stopId}`)
};

/**
 * Activity endpoints
 */
export const activityAPI = {
  getAll: (tripId, stopId) =>
    api.get(`/trips/${tripId}/stops/${stopId}/activities`),
  getById: (tripId, stopId, activityId) =>
    api.get(`/trips/${tripId}/stops/${stopId}/activities/${activityId}`),
  create: (tripId, stopId, name, description, cost, durationHours, category) =>
    api.post(`/trips/${tripId}/stops/${stopId}/activities`, {
      name, description, cost, durationHours, category
    }),
  update: (tripId, stopId, activityId, name, description, cost, durationHours, category) =>
    api.put(`/trips/${tripId}/stops/${stopId}/activities/${activityId}`, {
      name, description, cost, durationHours, category
    }),
  delete: (tripId, stopId, activityId) =>
    api.delete(`/trips/${tripId}/stops/${stopId}/activities/${activityId}`)
};

/**
 * Budget endpoints
 */
export const budgetAPI = {
  getByTrip: (tripId) =>
    api.get(`/trips/${tripId}/budget`),
  recalculate: (tripId) =>
    api.post(`/trips/${tripId}/budget/recalculate`)
};

export default api;