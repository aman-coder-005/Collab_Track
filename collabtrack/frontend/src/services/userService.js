// src/services/userService.js

import axios from 'axios';

const API_URL = '/api/users'; // Our proxied API path

// --- 1. Get *CURRENT* user profile (Private Route) ---
// Used for your "Edit Profile" page
const getMyProfile = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // This calls GET /api/users/profile
  const response = await axios.get(`${API_URL}/profile`, config);
  return response.data;
};

// --- 2. Update *CURRENT* user profile (Private Route) ---
// Used for your "Edit Profile" page
const updateUserProfile = async (profileData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // This calls PUT /api/users/profile
  const response = await axios.put(`${API_URL}/profile`, profileData, config);
  return response.data;
};

// --- 3. Get *PUBLIC* user profile (Public Route) ---
// Used for your "Public Profile" page (the one with the error)
const getPublicProfileById = async (userId) => {
  // This calls GET /api/users/profile/:id
  const response = await axios.get(`${API_URL}/profile/${userId}`);
  return response.data;
};

// --- 4. Your Auth Functions (for completeness) ---
const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data; // This data includes the token
};

const register = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/register`, { name, email, password });
  return response.data; // This data includes the token
};


export const userService = {
  login,
  register,
  getMyProfile,
  updateUserProfile,
  getPublicProfileById, // <-- The missing public function
};