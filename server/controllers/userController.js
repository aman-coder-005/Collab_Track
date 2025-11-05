// server/controllers/userController.js

import mongoose from 'mongoose';
import User from '../models/userModel.js';
import Project from '../models/projectModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      // --- FIX ---
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({
        _id: user._id, name: user.name, email: user.email, token: generateToken(user._id),
        // Send back all fields so AuthContext is complete
        skills: user.skills, 
        bio: user.bio,
        github: user.github
      });
    } else {
      // --- FIX ---
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id, name: user.name, email: user.email, token: generateToken(user._id),
        // Send back all fields so AuthContext is complete
        skills: user.skills, 
        bio: user.bio,
        github: user.github
      });
    } else {
      // --- FIX ---
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(5.00).json({ message: error.message });
  }
};

// @desc    Get *current* user profile (your "My Profile" page)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        github: user.github,
        skills: user.skills,
      });
    } else {
      // --- FIX ---
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update *current* user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.bio = req.body.bio || user.bio;
      user.github = req.body.github || user.github;
      user.skills = req.body.skills || user.skills;
      
      const updatedUser = await user.save();
      
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        github: updatedUser.github,
        skills: updatedUser.skills,
        token: generateToken(updatedUser._id),
      });
    } else {
      // --- FIX ---
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    // Check for duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get a public user profile by ID
// @route   GET /api/users/profile/:id
// @access  Public
export const getUserProfileById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    const projects = await Project.find({
      $or: [
        { owner: req.params.id },
        { teamMembers: req.params.id }
      ]
    })
    .select('title description _id')
    .sort({ createdAt: -1 });
    
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      github: user.github,
      skills: user.skills,
      projects: projects
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

export {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
