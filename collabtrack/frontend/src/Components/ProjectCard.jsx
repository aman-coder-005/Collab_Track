import React from 'react';
import { Link } from 'react-router-dom';
import SkillBadge from './SkillBadge';

// 1. We now expect the full 'project' object
const ProjectCard = ({ project }) => {
  // 2. We de-structure the data, using '_id' from the database
  const { _id, title, description, requiredSkills } = project;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 flex-grow mb-4">{description}</p>
      
      <div className="mb-4">
        <h4 className="font-semibold text-sm text-gray-700 mb-2">Required Skills:</h4>
        <div className="flex flex-wrap gap-1">
          {requiredSkills.map((skill) => (
            <SkillBadge key={skill} skill={skill} />
          ))}
        </div>
      </div>
      
      {/* 3. THE FIX: The link now uses the correct '_id' variable */}
      <Link 
        to={`/projects/${_id}`} 
        className="mt-auto text-center w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
      >
        View Details
      </Link>
    </div>
  );
};

export default ProjectCard;