// src/services/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getAllBeekeepers = async () => {
  const response = await api.get(`/beekeepers`);
  return response.data;
};

export const createBeekeeper = async (beekeeper) => {
  const response = await api.post(`/beekeepers`, beekeeper);
  return response.data;
};

export const getBeekeeperById = async (id) => {
  const response = await api.get(`/beekeepers/${id}`);
  return response.data;
};

export const updateBeekeeper = async (id, beekeeper) => {
  const response = await api.put(`/beekeepers/${id}`, beekeeper);
  return response.data;
};

export const deleteBeekeeper = async (id) => {
  await api.delete(`/beekeepers/${id}`);
};

export const getHivesByBeekeeper = async (beekeeperId) => {
  const response = await api.get(`/beekeepers/${beekeeperId}/hives`);
  return response.data;
};
export const getALLBackup = async () => (await api.get(`/backup`)).data;

export const getAllBeeSpecies = async () => (await api.get(`/beespecies`)).data;

export const getHivesBySpecies = async (speciesId) => (await api.get(`/hives/species/${speciesId}`)).data;

export const getAllHives = async () => (await api.get(`/hives`)).data;

export const getAllEnvironmentData = async () => (await api.get(`/environment`)).data;

export const getAllPlants = async () => (await api.get(`/plants`)).data;

export const getAllHoneyProduction = async () => {
  const response = await api.get(`/honey`);
  return response.data;
};

// User management API functions
export const registerUser = async (userData) => {
  const response = await api.post(`/users/register`, userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post(`/users/login`, credentials);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get(`/users`);
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post(`/users`, userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const updateUserPassword = async (id, passwordData) => {
  const response = await api.put(`/users/${id}/password`, passwordData);
  return response.data;
};

export const deleteUser = async (id) => {
  await api.delete(`/users/${id}`);
};

export const getAllPermissions = async () => {
  const response = await api.get(`/users/permissions`);
  return response.data;
};
