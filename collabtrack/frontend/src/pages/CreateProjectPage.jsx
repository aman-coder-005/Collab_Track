import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../Components/FormInput';
import FormTextarea from '../Components/FormTextarea';
import { useProjects } from '../Context/ProjectContext'; // 1. To update the UI
import { useAuth } from '../Context/AuthContext';       // 2. To get the user's token
import { projectService } from '../services/projectService'; // 3. To make the API call

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const { addProject } = useProjects(); // From ProjectContext
  const { user } = useAuth(); // From AuthContext
  
  const [formData, setFormData] = useState({ title: '', description: '', skills: '' });
  const [isLoading, setIsLoading] = useState(false);  
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user || !user.token) {
      setError("You must be logged in to create a project.");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 1. Prepare the data for the API
      const projectData = {
        title: formData.title,
        description: formData.description,
        requiredSkills: formData.skills.split(',').map(skill => skill.trim()),
      };

     
      const newProject = await projectService.createProject(projectData, user.token);
      
      // 3. Add the new project to our global state (for instant UI update)
      addProject(newProject);
      
      // 4. Navigate to the projects page
      navigate('/projects');

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create a New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
            {error}
          </div>
        )}
        <FormInput id="title" label="Project Title" type="text" placeholder="e.g., AI-Powered Chatbot" value={formData.title} onChange={handleChange} />
        <FormTextarea id="description" label="Project Description" placeholder="Describe your project in detail..." value={formData.description} onChange={handleChange} />
        <FormInput id="skills" label="Required Skills (comma-separated)" type="text" placeholder="e.g., React, Python, UI/UX Design" value={formData.skills} onChange={handleChange} />
        <div>
          <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400">
            {isLoading ? 'Posting...' : 'Post Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectPage;