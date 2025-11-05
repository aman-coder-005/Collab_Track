// src/Components/Navbar.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import socket from '../socket.js';
import { notificationService } from '../services/notificationService.js'; // <-- 1. IMPORT NEW SERVICE

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]); // <-- Renamed for clarity
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // --- 2. UPDATED useEffect TO FETCH FROM DB AND LISTEN TO SOCKET ---
  useEffect(() => {
    if (user) {
      // --- A) Fetch all old (unread) notifications from the database ---
      const fetchNotifications = async () => {
        try {
          const dbNotifications = await notificationService.getMyNotifications(user.token);
          setNotifications(dbNotifications);
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        }
      };

      fetchNotifications(); // Run on load

      // --- B) Connect to socket and listen for *new* real-time pings ---
      socket.connect();
      socket.emit('join_user_room', user._id);
      
      const handleNewNotification = (newNotification) => {
        console.log('New real-time notification received:', newNotification);
        // Add the new notification to the top of the list
        setNotifications(prev => [newNotification, ...prev]);
      };

      socket.on('new_notification', handleNewNotification);

      // Cleanup
      return () => {
        socket.off('new_notification', handleNewNotification);
        socket.disconnect();
      };
    } else {
      socket.disconnect();
    }
  }, [user]); // Re-runs when user logs in or out

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // --- 3. UPDATED Bell Click HANDLER ---
  const handleBellClick = async () => {
    // Toggle the dropdown
    setIsDropdownOpen(prev => !prev);
    
    // If we are opening the dropdown AND there are notifications
    if (!isDropdownOpen && notifications.length > 0) {
      try {
        // Tell the backend to mark all as "read"
        await notificationService.markAsRead(user.token);
        // We *could* optimistically clear the list, but it's better
        // to have a "read" state on each notification object.
        // For now, we'll just leave them until the next refresh.
        // A simpler way is to clear them from state:
        // setNotifications([]); // Uncomment this if you want them to disappear immediately
      } catch (error) {
        console.error("Failed to mark notifications as read:", error);
      }
    }
  };

  const handleNotificationClick = () => {
    // When a user clicks a *specific* notification,
    // we should just close the dropdown.
    setIsDropdownOpen(false);
    // You could also add logic here to mark just *one* item as read.
    // For now, we'll clear the whole list visually.
    setNotifications([]);
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          CollabTrack
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/projects" className="hover:text-gray-300">Find Projects</Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/create-project" className="bg-green-500 hover:bg-green-600 px-3 py-2 rounded-md text-sm font-medium">
                Create Project
              </Link>

              {/* --- 4. THE NOTIFICATION DROPDOWN (Unchanged JSX) --- */}
              <div className="relative">
                <button 
                  onClick={handleBellClick} 
                  className="relative text-white hover:text-gray-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4 4 0 0 0 4.646 6H4v2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V6h-.646a4 4 0 0 0-2.557-3.921L8 1.918zM14.22 12c.223.447.481.801.78 1.114V14H1v-1.886c.299-.313.557-.667.78-1.114l-.223-.447a.5.5 0 0 0-.41-.753H1V9h.08a.5.5 0 0 0 .41-.753l-.223-.447C1.48 7.39 1.222 7.036 1 6.723V5a3 3 0 0 1 3-3c.027 0 .054.002.08.006l.548.098a.5.5 0 0 0 .416-.023L8 1l2.92.599a.5.5 0 0 0 .416.023l.548-.098C11.946 2.002 11.973 2 12 2a3 3 0 0 1 3 3v1.723c-.222.313-.48.667-.78 1.114l-.223.447a.5.5 0 0 0 .41.753H15v1h-.08a.5.5 0 0 0-.41.753l.223.447z"/>
                  </svg>
                  {/* The Red Dot (based on the array length) */}
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white" />
                  )}
                </button>

                {/* The Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-20">
                    <div className="py-2 px-4 text-gray-800 font-bold border-b">Notifications</div>
                    <div className="flex flex-col max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => ( // use notif._id
                          <Link
                            key={notif._id || Math.random()} // Use the DB id
                            to={notif.link}
                            onClick={handleNotificationClick}
                            className="text-gray-700 px-4 py-3 hover:bg-gray-100 border-b"
                          >
                            <p className="text-sm">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notif.createdAt).toLocaleString()}
                            </p>
                          </Link>
                        ))
                      ) : (
                        <div className="text-gray-500 p-4 text-center">No new notifications</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <Link to="/profile" className="hover:text-gray-300">
                {user.name}
              </Link>
              <button onClick={handleLogout} className="hover:text-gray-300">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-md">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;