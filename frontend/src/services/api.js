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

// Log connection to backend
console.log('🌍 GlobeTrotter Frontend: Connected to server');

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
  (response) => {
    console.log('API Response:', response.data);
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      // Don't redirect for auth endpoints (login/signup)
      if (!error.config.url.includes('/auth/')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

/**
 * Cities endpoints
 */
export const citiesAPI = {
  getPopular: () =>
    api.get('/cities/popular')
};

/**
 * Auth endpoints
 */
export const authAPI = {
  getCurrentUser: () =>
    api.get('/auth/me'),
  signup: (email, password, firstName, lastName, phone, city, country) =>
    api.post('/auth/signup', { email, password, firstName, lastName, phone, city, country }),
  login: (email, password) =>
    api.post('/auth/login', { email, password })
};

/**
 * Profile endpoints
 */
export const profileAPI = {
  get: () =>
    api.get('/profile'),
  update: (profileData) =>
    api.put('/profile', profileData)
};

/**
 * Dashboard endpoints
 */
export const dashboardAPI = {
  getSummary: () =>
    api.get('/dashboard')
};

/**
 * Regions endpoints
 */
export const regionsAPI = {
  getAll: () =>
    api.get('/regions')
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
  create: (tripId, totalCost) =>
    api.post(`/trips/${tripId}/budget`, { total_cost: totalCost }),
  update: (tripId, totalCost) =>
    api.put(`/trips/${tripId}/budget`, { total_cost: totalCost }),
  recalculate: (tripId) =>
    api.post(`/trips/${tripId}/budget/recalculate`)
};

export default api;