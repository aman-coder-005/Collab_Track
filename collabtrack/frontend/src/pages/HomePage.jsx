import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const HomePage = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero Section (No changes here) */}
      <div className="text-center py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 rounded-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          Turn Your Ideas into Reality with <span className="text-indigo-600">CollabTrack</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
          The ultimate platform for students and developers to connect, collaborate, and create amazing projects together. Stop juggling apps—start building.
        </p>
        <div className="mt-8 flex justify-center gap-x-4">
          <Link
            to="/projects"
            className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-indigo-700"
          >
            Find a Project
          </Link>
          {!isLoggedIn && (
            <Link
              to="/signup"
              className="inline-block bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-md hover:bg-gray-300"
            >
              Create an Account
            </Link>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Everything You Need in One Place</h2>
            <p className="mt-2 text-md text-gray-600">All the tools for successful collaboration, seamlessly integrated.</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            
            {/* --- CSS CHANGE 1: Added hover effects and transitions to the card container --- */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              {/* --- CSS CHANGE 2: Styled the icon for better visual appeal --- */}
              <div className="flex items-center gap-4 mb-4">
                <span className="flex items-center justify-center h-12 w-12 bg-indigo-100 rounded-full text-2xl">📄</span>
                <h3 className="text-lg font-medium text-gray-900">Project Discovery</h3>
              </div>
              <p className="text-base text-gray-500">Post your ideas and find projects that match your skills and interests.</p>
            </div>
            
            {/* Feature 2 (with same new styles) */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <span className="flex items-center justify-center h-12 w-12 bg-indigo-100 rounded-full text-2xl">📊</span>
                <h3 className="text-lg font-medium text-gray-900">Task Management</h3>
              </div>
              <p className="text-base text-gray-500">Organize your workflow with our interactive Kanban board. Drag, drop, and get things done.</p>
            </div>
            
            {/* Feature 3 (with same new styles) */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <span className="flex items-center justify-center h-12 w-12 bg-indigo-100 rounded-full text-2xl">💬</span>
                <h3 className="text-lg font-medium text-gray-900">Team Chat</h3>
              </div>
              <p className="text-base text-gray-500">Communicate with your team in real-time without ever leaving the dashboard.</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;