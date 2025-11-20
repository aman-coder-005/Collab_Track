import axios from 'axios';

// The '/api/users' path will be proxied to 'http://localhost:5000/api/users'
// thanks to our vite.config.js setup.
const API_URL = '/api/users';



// NEW: Real signup function
const signup = async (name, email, password) => {
  // The backend route is likely router.post('/register', ...)
  // So we must post to /api/users/register
  const response = await axios.post(`${API_URL}/register`, { name, email, password });
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