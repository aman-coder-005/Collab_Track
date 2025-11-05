// src/Components/Header.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

// 1. We will receive notifications and a 'clear' function as props
const Header = ({ newNotifications, clearNotifications }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          CollabTrack
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* --- 2. THE NOTIFICATION BELL --- */}
              <button 
                onClick={clearNotifications} 
                className="relative text-gray-600 hover:text-indigo-600"
              >
                {/* Bell Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4 4 0 0 0 4.646 6H4v2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V6h-.646a4 4 0 0 0-2.557-3.921L8 1.918zM14.22 12c.223.447.481.801.78 1.114V14H1v-1.886c.299-.313.557-.667.78-1.114l.223-.447a.5.5 0 0 0-.41-.753H1V9h.08a.5.5 0 0 0 .41-.753l-.223-.447C1.48 7.39 1.222 7.036 1 6.723V5a3 3 0 0 1 3-3c.027 0 .054.002.08.006l.548.098a.5.5 0 0 0 .416-.023L8 1l2.92.599a.5.5 0 0 0 .416.023l.548-.098C11.946 2.002 11.973 2 12 2a3 3 0 0 1 3 3v1.723c-.222.313-.48.667-.78 1.114l-.223.447a.5.5 0 0 0 .41.753H15v1h-.08a.5.5 0 0 0-.41.753l.223.447z"/>
                </svg>
                {/* The Red Dot (conditionally rendered) */}
                {newNotifications.length > 0 && (
                  <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </button>
              
              <Link to="/profile" className="text-gray-700 hover:text-indigo-600">
                My Profile
              </Link>
              <button onClick={logout} className="text-gray-700 hover:text-indigo-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
              <Link to="/signup" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;