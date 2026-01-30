// src/api/index.js
import axios from 'axios';

// 1. Centralized Backend URL
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // This is crucial for sending/receiving cookies!
});



// 2. Organized API Endpoints
export const authAPI = {
    getMe: () => api.get('/auth/me'),
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
};

export const stockAPI = {
    getSearch: (query) => api.get(`/search?query=${query}`),
    getPrediction: (ticker) => api.get(`/stocks/${ticker}`),
};

export const wishlistAPI = {
    getWishlist: () => api.get('/wishlist'),
    toggle: (symbol) => api.post('/wishlist/toggle', { symbol }),
    getDetails: () => api.get('/wishlist/details'),
};

export default api;