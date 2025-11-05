// src/Components/ApplicationModal.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { projectService } from '../services/projectService';
import { useAuth } from '../Context/AuthContext';

const ApplicationModal = ({ 
  isOpen, 
  onClose, 
  projectTitle, 
  projectId, 
  isProfileComplete, // <-- This prop now controls the content
  onApplySuccess
}) => {
  const { user } = useAuth(); // Get user for token and skills
  const [message, setMessage] = useState(''); // State for the description box
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // --- This is the function that submits the form ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isProfileComplete) return; // Should not happen, but a good check

    setIsSubmitting(true);
    setError('');
    
    try {
      // 1. Create the application data object
      const applicationData = {
        message: message, // From the description box
        skills: user.skills || [] // From the user's profile
      };
      
      // 2. Call the service (which calls your backend)
      await projectService.applyToProject(
        projectId, 
        applicationData, 
        user.token
      );
      
      // 3. Success!
      alert('Application submitted successfully!');
      onApplySuccess(); // Refresh the project page
      onClose(); // Close the modal

    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Apply to {projectTitle}</h2>
        
        {error && <div className="my-3 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        {/* --- HERE IS THE NEW CONDITIONAL LOGIC --- */}
        
        {!isProfileComplete ? (
          // STATE 1: If profile is incomplete
          <div>
            <p className="text-gray-700 mb-4">
              Please complete your profile (especially your skills) before applying. 
              This helps the project owner understand what you can contribute.
            </p>
            <Link 
              to="/profile/edit" // This is your "Go to Profile" button
              className="w-full text-center block bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700"
            >
              Update Your Profile
            </Link>
            <button 
              onClick={onClose} 
              className="w-full text-center mt-2 text-gray-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        ) : (
          // STATE 2: If profile is complete, show the form
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
                Your Message (Description)
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi, I'd be a great fit for this project because..."
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="4"
              />
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              You are applying as <span className="font-semibold">{user.name}</span>. Your current skills ({user.skills.join(', ')}) will be submitted with your application.
            </p>

            <div className="flex justify-end gap-4">
              <button 
                type="button" 
                onClick={onClose}
                className="text-gray-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
        {/* --- END OF CONDITIONAL LOGIC --- */}
        
      </div>
    </div>
  );
};

export default ApplicationModal;