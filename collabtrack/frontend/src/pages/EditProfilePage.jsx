// src/pages/EditProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- 1. IMPORT useNavigate
import { useAuth } from '../Context/AuthContext';
import { userService } from '../services/userService.js';

const EditProfilePage = () => {
  const navigate = useNavigate(); // <-- 2. INITIALIZE useNavigate
  const { user, setUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    github: '',
    skills: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      
      try {
        const data = await userService.getMyProfile(user.token);
        
        setFormData({
          name: data.name,
          email: data.email,
          bio: data.bio || '',
          github: data.github || '',
          skills: data.skills ? data.skills.join(', ') : '',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const skillsArray = formData.skills.split(',')
        .map(skill => skill.trim())
        .filter(Boolean);
      
      const profileData = {
        ...formData,
        skills: skillsArray,
      };

      const updatedUser = await userService.updateUserProfile(profileData, user.token);
      
      if (typeof setUser === 'function') {
        setUser(updatedUser);
      }

      setFormData({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        bio: updatedUser.bio || '',
        github: updatedUser.github || '',
        skills: Array.isArray(updatedUser.skills) ? updatedUser.skills.join(', ') : '',
      });
      
      setSuccess('Profile updated successfully!');

      // --- 3. THIS IS THE FIX FOR REQUEST #1 ---
      // Wait 1 second to show the success message, then redirect
      setTimeout(() => {
        navigate('/profile'); // Redirects to your main profile page
      }, 1000);
      // --- END OF FIX ---
      
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  // ... (The form JSX is the same as before, no changes needed there)
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Your Profile</h1>
      
      {error && <div className="my-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
      {success && <div className="my-4 p-3 bg-green-100 text-green-700 rounded-lg">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
          <input type="text" id="name" className="w-full p-3 border border-gray-300 rounded-lg"
            value={formData.name} onChange={handleChange} />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
          <input type="email" id="email" className="w-full p-3 border border-gray-300 rounded-lg"
            value={formData.email} onChange={handleChange} />
        </div>
        
        <div>
          <label htmlFor="bio" className="block text-gray-700 font-semibold mb-2">Bio</label>
          <textarea id="bio" rows="4" className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Tell us a bit about yourself"
            value={formData.bio} onChange={handleChange} />
        </div>
        
        <div>
          <label htmlFor="github" className="block text-gray-700 font-semibold mb-2">GitHub Username</label>
          <input type="text" id="github" className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="e.g., your-username"
            value={formData.github} onChange={handleChange} />
        </div>
        
        <div>
          <label htmlFor="skills" className="block text-gray-700 font-semibold mb-2">Skills</label>
          <input type="text" id="skills" className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="e.g., React, Node.js, Python"
            value={formData.skills} onChange={handleChange} />
          <p className="text-sm text-gray-500 mt-1">Please enter skills separated by commas.</p>
        </div>
        
        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;