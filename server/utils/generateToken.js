import jwt from 'jsonwebtoken';

// This function takes a user's ID and creates a signed token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // The token will be valid for 30 days
  });
};

export default generateToken;