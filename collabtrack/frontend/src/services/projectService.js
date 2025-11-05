// src/services/projectService.js

import axios from 'axios';

const API_URL = '/api/projects';

// Get all projects
const getProjects = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Create a new project
const createProject = async (projectData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(API_URL, projectData, config);
  return response.data;
};

// Get a single project by ID
const getProjectById = async (projectId) => {
  const response = await axios.get(`${API_URL}/${projectId}`);
  return response.data;
};

// Apply to a project
const applyToProject = async (projectId, applicationData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(`${API_URL}/${projectId}/apply`, applicationData, config);
  return response.data;
};

// Accept a user's application
const acceptApplicant = async (projectId, applicationId, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(
    `${API_URL}/${projectId}/accept`, 
    { applicationId: applicationId }, 
    config
  );
  return response.data;
};

// Decline a user's application
const declineApplicant = async (projectId, applicationId, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(
    `${API_URL}/${projectId}/decline`, 
    { applicationId: applicationId }, 
    config
  );
  return response.data;
};

// Add a task to the Kanban board
const addTask = async (projectId, columnId, content, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const body = { columnId, content };
  const response = await axios.post(`${API_URL}/${projectId}/kanban/tasks`, body, config);
  return response.data;
};

// Move a task on the Kanban board
const moveTask = async (projectId, moveData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(`${API_URL}/${projectId}/kanban/tasks/move`, moveData, config);
  return response.data;
};

// --- NEW FUNCTION ---
/**
 * Deletes a task from a Kanban column
 * @param {string} projectId
 * @param {string} columnId - e.g., 'todo'
 * @param {string} taskId - The _id of the task to delete
 * @param {string} token
 */
const deleteTask = async (projectId, columnId, taskId, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
    data: { columnId, taskId } 
  };
  const response = await axios.delete(`${API_URL}/${projectId}/kanban/tasks`, config);
  return response.data;
};


// --- UPDATED EXPORT ---
export const projectService = {
  getProjects,
  createProject,
  getProjectById,
  applyToProject,
  acceptApplicant,
  declineApplicant,
  addTask,
  moveTask,
  deleteTask // <-- ADDED
};