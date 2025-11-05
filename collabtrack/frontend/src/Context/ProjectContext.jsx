import React, { createContext, useState, useContext, useEffect } from 'react';
import { projectService } from '../services/projectService';

// 1. Create the context
const ProjectContext = createContext();

// 2. Create the provider
export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 3. Fetch projects from the API when the app first loads
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await projectService.getProjects();
        setProjects(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []); // The empty array [] means this runs only once on mount

  // 4. The addProject function now just adds to the local state
  //    (We'll connect the create form to the service directly)
  const addProject = (newProject) => {
    setProjects((prevProjects) => [newProject, ...prevProjects]);
  };

  const value = {
    projects,
    isLoading,
    error,
    addProject, // We'll use this to instantly update the UI
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

// 5. Create a custom hook for easy access
export const useProjects = () => {
  return useContext(ProjectContext);
};