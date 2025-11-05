// server/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Project from '../models/projectModel.js'; // Make sure this filename is correct!

// --- 'protect' MIDDLEWARE WITH CRASH FIX ---
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      // Check if user was deleted after token was issued
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      // --- FIX ---
      // DO NOT THROW. Send a JSON response.
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    // --- FIX ---
    // DO NOT THROW. Send a JSON response.
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// --- 'isOwner' MIDDLEWARE WITH CRASH FIX ---
const isOwner = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() === req.user.id) {
      next();
    } else {
      return res.status(403).json({ message: 'User is not the owner of this project' });
    }
  } catch (error) {
    console.error(error.message);
    // --- FIX ---
    // DO NOT CALL next(error). Send a JSON response.
    return res.status(500).json({ message: 'Server Error in isOwner middleware' });
  }
};

export { protect, isOwner };