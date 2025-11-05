import axios from 'axios';

// The '/api/users' path will be proxied to 'http://localhost:5000/api/users'
// thanks to our vite.config.js setup.
const API_URL = '/api/users';



// NEW: Real signup function
const signup = async (name, email, password) => {
  // 1. Make the POST request to our backend
  const response = await axios.post(API_URL, { name, email, password });
  
  // 2. Return the data (this won't be used, but it's good practice)
  return response.data;
};

// NEW: Real login function
const login = async (email, password) => {
  // 1. Make the POST request to the login route
  const response = await axios.post(`${API_URL}/login`, { email, password });

  // 2. Return the user data and token
  //    This response.data is what we'll save in our AuthContext
  return response.data;
};

// We just export the two functions
export const authService = {
  signup,
  login,
};