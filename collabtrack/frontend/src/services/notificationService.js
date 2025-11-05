// src/services/notificationService.js

import axios from 'axios';

const API_URL = '/api/notifications'; // Your new notification API route

/**
 * Gets all unread notifications from the database
 * @param {string} token - The user's auth token
 */
const getMyNotifications = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // Calls GET /api/notifications
  const response = await axios.get(API_URL, config);
  return response.data;
};

/**
 * Marks all unread notifications as "read" in the database
 * @param {string} token - The user's auth token
 */
const markAsRead = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // Calls PUT /api/notifications/read
  const response = await axios.put(`${API_URL}/read`, {}, config);
  return response.data;
};

export const notificationService = {
  getMyNotifications,
  markAsRead,
};