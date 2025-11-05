import React from 'react';
import ProjectCard from '../Components/ProjectCard';
import { useProjects } from '../Context/ProjectContext';

const ProjectListPage = () => {
  const { projects, isLoading, error } = useProjects();

  if (isLoading) {
    return <div className="text-center p-8">Loading projects...</div>;
  }
  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Explore Projects</h1>
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            // THE FIX: Use project._id for the key
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No projects found. Be the first to create one!</p>
      )}
    </div>
  );
};

export default ProjectListPage;