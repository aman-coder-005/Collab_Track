// src/pages/ProjectDetailPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import SkillBadge from '../Components/SkillBadge';
import ApplicationModal from '../Components/ApplicationModal';
import { projectService } from '../services/projectService';
import { useAuth } from '../Context/AuthContext';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const { user } = useAuth(); 

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ... (fetchProject, handleAccept, handleDecline functions are all the same) ...
  const fetchProject = useCallback(async () => {
    if (!projectId) return;
    try {
      if (!project) setIsLoading(true);
      setError('');
      const data = await projectService.getProjectById(projectId);
      setProject(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load project');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, project]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleAccept = async (applicationId) => {
    try {
      await projectService.acceptApplicant(projectId, applicationId, user.token);
      fetchProject();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept applicant');
    }
  };

  const handleDecline = async (applicationId) => {
    try {
      await projectService.declineApplicant(projectId, applicationId, user.token);
      fetchProject();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to decline applicant');
    }
  };

  // --- THIS IS THE FINAL LOGIC BLOCK ---
  const isOwner = user?._id === project?.owner?._id;
  
  const isMember = project?.teamMembers?.some(member => member._id === user?._id);

  // NEW: Check if the user is in the 'applications' array
  // We use optional chaining (?.) in case user or project is null
  const hasApplied = project?.applications?.some(app => app.user?._id === user?._id);
  
  const canViewDashboard = isOwner || isMember;

  const isProfileComplete = user?.skills && user.skills.length > 0; 
  // --- END OF LOGIC BLOCK ---


  if (isLoading) {
    return <div className="text-center p-8">Loading project details...</div>;
  }
  if (error && !project) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }
  if (!project) {
    return <div className="text-center p-8">Project not found.</div>;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
        
        {error && <div className="my-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        {/* --- (All your other JSX: Header, Description, Skills, Admin Panel, Team List) --- */}
        {/* ... (This is all unchanged) ... */}
        
        <div className="border-b pb-4 mb-6">
          <h1 className="text-4xl font-bold text-gray-900">{project.title}</h1>
          <p className="text-gray-600 mt-2">
            Posted by <span className="font-semibold">{project.owner?.name || 'A User'}</span>
          </p>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Description</h2>
          <p className="text-gray-700 leading-relaxed">{project.description}</p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {project.requiredSkills.map(skill => <SkillBadge key={skill} skill={skill} />)}
          </div>
        </div>
        {isOwner && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Project Applicants
            </h2>
            {project.applications && project.applications.length > 0 ? (
              <ul className="space-y-4">
                {project.applications.map(app => (
                  <li key={app._id} className="flex flex-col sm:flex-row justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
                    <div className="flex-grow">
                      <Link 
                        to={`/profile/${app.user?._id}`} 
                        className="font-semibold text-gray-900 hover:text-indigo-600 hover:underline"
                      >
                        {app.user?.name || app.name}
                      </Link>
                      <p className="text-sm text-gray-600">{app.user?.email || '(email not available)'}</p>
                      {app.message && (
                        <p className="text-sm text-gray-700 mt-2 italic">"{app.message}"</p>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3 sm:mt-0 flex-shrink-0">
                      <button
                        onClick={() => handleAccept(app._id)}
                        className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 text-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDecline(app._id)}
                        className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 text-sm"
                      >
                        Decline
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No pending applications.</p>
            )}
          </div>
        )}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Project Team
          </h2>
          <ul className="space-y-3">
             {project.owner && (
                <li key={project.owner._id} className="p-3 bg-blue-50 rounded-lg">
                   <p className="font-semibold text-blue-900">{project.owner.name} (Owner)</p>
                   <p className="text-sm text-blue-700">{project.owner.email}</p>
                </li>
              )}
            {project.teamMembers && project.teamMembers.length > 0 ? (
              project.teamMembers.map(member => (
                member._id !== project.owner._id && (
                  <li key={member._id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </li>
                )
              ))
            ) : (
              <p className="text-gray-600 italic text-sm">No other members have joined yet.</p>
            )}
          </ul>
        </div>
        
        {/* --- THIS IS THE FINAL ACTION BUTTONS FIX --- */}
        <div className="space-y-4 mt-8">
          
          {/* STATE 1: Visitor (Not owner, Not member, Hasn't applied) */}
          {!isOwner && !isMember && !hasApplied && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700"
            >
              Apply to Join Project
            </button>
          )}

          {/* STATE 2: Applicant (Not owner, Not member, but HAS applied) */}
          {!isOwner && !isMember && hasApplied && (
            <div className="text-center w-full bg-gray-100 text-gray-700 font-bold py-3 px-6 rounded-lg">
              Request Pending...
            </div>
          )}

          {/* STATE 3 & 4: Owner or Member */}
          {canViewDashboard && (
            <Link
              to={`/projects/${projectId}/dashboard`}
              className="block text-center w-full bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800"
            >
              Go to Project Dashboard
            </Link>
          )}
        </div>
      </div>
      
      {/* --- MODAL (Unchanged) --- */}
      {project && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          projectTitle={project.title}
          projectId={project._id}
          isProfileComplete={isProfileComplete}
          onApplySuccess={fetchProject}
        />
      )}
    </>
  );
};

export default ProjectDetailPage;