// src/services/messageService.js

import axios from 'axios';

const API_URL = '/api/messages';

/**
 * Gets the entire message history for a project
 * @param {string} projectId - The ID of the project
 * @param {string} token - The user's auth token
 */
const getMessages = async (projectId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // This calls your GET /api/messages/:projectId route
  const response = await axios.get(`${API_URL}/${projectId}`, config);
  return response.data;
};

export const messageService = {
  getMessages,
};