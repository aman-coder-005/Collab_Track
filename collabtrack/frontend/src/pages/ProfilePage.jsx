// src/pages/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService.js';
import { useAuth } from '../Context/AuthContext';

const ProfilePage = () => {
  const { userId } = useParams(); 
  const { user: authUser } = useAuth(); 
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const idToLoad = userId || authUser?._id;

    const loadProfile = async (id) => {
      try {
        setLoading(true);
        setError('');
        const data = await userService.getPublicProfileById(id);
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile. This user may not exist.');
      } finally {
        setLoading(false);
      }
    };

    if (idToLoad) {
      loadProfile(idToLoad);
    } else {
      setError('No profile to display. Please log in.');
      setLoading(false);
      navigate('/login');
    }
  }, [userId, authUser, navigate]);

  if (loading) {
    return <div className="text-center p-8">Loading profile...</div>;
  }
  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }
  if (!profile) {
    return <div className="text-center p-8">User profile not found.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{profile.name}</h1>
          <p className="text-lg text-gray-600 mt-2">{profile.email}</p>

          {/* --- THIS IS THE FIX FOR REQUEST #2 --- */}
          {/* Check if the github field exists and is not empty */}
          {profile.github && (
            <a 
              href={`https://github.com/${profile.github}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-lg text-gray-600 mt-2 hover:text-indigo-600 hover:underline"
            >
              {/* You can add a GitHub SVG icon here if you want */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.43-.98-2.43-.98-.36-.92-.89-1.17-.89-1.17-.72-.49.05-.48.05-.48.79.06 1.21.82 1.21.82.7 1.2 1.84.86 2.3.66.07-.51.28-.86.51-1.06-1.76-.2-3.61-.88-3.61-3.92 0-.87.31-1.58.82-2.14-.08-.2-.36-1.02.08-2.11 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.09.16 1.91.08 2.11.51.56.82 1.27.82 2.14 0 3.05-1.86 3.72-3.62 3.92.28.24.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
              </svg>
              {profile.github}
            </a>
          )}
          {/* --- END OF FIX --- */}

        </div>
        
        {authUser?._id === profile._id && (
          <Link
            to="/profile/edit"
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700"
          >
            Edit Profile
          </Link>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">About</h2>
        <p className="text-gray-700 leading-relaxed">
          {profile.bio || 'This user has not written a bio yet.'}
        </p>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {profile.skills && profile.skills.length > 0 ? (
            profile.skills.map((skill, index) => (
              <span key={index} className="bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
            ))
          ) : (
            <p className="text-gray-600">This user has not listed any skills.</p>
          )}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {profile.name}'s Projects
        </h2>
        
        {profile.projects && profile.projects.length > 0 ? (
          <ul className="space-y-3">
            {profile.projects.map(project => (
              <li key={project._id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                <Link 
                  to={`/projects/${project._id}`}
                  className="font-semibold text-indigo-600 hover:underline"
                >
                  {project.title}
                </Link>
                {project.description && (
                  <p className="text-sm text-gray-600 mt-1">{project.description.substring(0, 100)}...</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">{profile.name} is not on any projects yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;