// src/Context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  // 1. Rename your state setter to 'setUserState' to avoid conflicts
  const [user, setUserState] = useState(() => {
    const storedUser = localStorage.getItem('userInfo'); // <-- I'll use 'userInfo' as it's more common
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // 2. This is the new, "smart" setUser function
  //    It updates BOTH React's state AND localStorage
  //    This is the function your EditProfilePage will use.
  const setUser = (newUserData) => {
    if (newUserData) {
      // Store the new user data in localStorage
      localStorage.setItem('userInfo', JSON.stringify(newUserData));
    } else {
      // If user is null (logging out), remove it
      localStorage.removeItem('userInfo');
    }
    // Update the React state, which will re-render all components
    setUserState(newUserData);
  };
  
  // 3. Your login/logout functions should also use this new smart function
  const login = (userData) => {
    setUser(userData); // This now handles localStorage *and* state
  };

  const logout = () => {
    setUser(null); // This now clears localStorage *and* state
  };

  // 4. THIS IS THE FIX: Add 'setUser' to the value object
  const value = {
    user,
    setUser, // <-- Now EditProfilePage can get this function
    login,
    logout,
    isLoggedIn: !!user, // You can keep this
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};  


