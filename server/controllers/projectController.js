// server/controllers/projectController.js

import Project from '../models/projectModel.js'; 
import User from '../models/userModel.js';
import mongoose from 'mongoose';
import Notification from '../models/notificationModel.js'; // <-- 1. IMPORT NOTIFICATION MODEL

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
  const { title, description, requiredSkills } = req.body;
  try {
    let skillsArray = []; 
    if (Array.isArray(requiredSkills)) {
      skillsArray = requiredSkills.map(skill => skill.trim()).filter(Boolean);
    } else if (typeof requiredSkills === 'string') {
      skillsArray = requiredSkills.split(',').map(skill => skill.trim()).filter(Boolean);
    }
    const newProject = new Project({
      title,
      description,
      requiredSkills: skillsArray,
      owner: req.user.id,
    });
    const project = await newProject.save();
    res.status(201).json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('owner', 'name')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a single project by its ID
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('teamMembers', 'name email')
      .populate('applications.user', 'name email')
      .populate('kanban.todo.createdBy', 'name')
      .populate('kanban.inProgress.createdBy', 'name')
      .populate('kanban.completed.createdBy', 'name');

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).send('Server Error');
  }
};

// --- THIS IS THE UPDATED FUNCTION ---
// @desc    Apply to join a project
// @route   POST /api/projects/:id/apply
// @access  Private
export const applyToProject = async (req, res) => {
  const { message, skills } = req.body;
  
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    
    const userId = req.user.id; 
    const userName = req.user.name;

    if (project.owner.toString() === userId) {
      return res.status(400).json({ msg: 'You cannot apply to your own project' });
    }
    if (project.teamMembers.some(memberId => memberId.toString() === userId)) {
      return res.status(400).json({ msg: 'You are already a member of this project' });
    }
    if (project.applications.some(app => app.user.toString() === userId)) {
      return res.status(400).json({ msg: 'You have already applied' });
    }

    const newApplication = {
      user: userId,
      name: userName,
      skills: skills || [],
      message: message || '',
    };

    project.applications.push(newApplication);
    await project.save();

    // --- THIS IS THE NEW NOTIFICATION LOGIC ---
    try {
      const ownerId = project.owner.toString();
      const notificationData = {
        user: ownerId, // The user to notify (the owner)
        message: `${userName} applied to your project: ${project.title}`,
        link: `/projects/${project._id}`,
      };

      // 1. Save the notification to the database
      const newNotification = new Notification(notificationData);
      await newNotification.save();
      
      // 2. Emit the real-time ping (still important!)
      // (The frontend will get this and add it to its list)
      req.io.to(ownerId).emit('new_notification', newNotification); // Send the full DB object
      console.log(`Notification saved and sent to owner: ${ownerId}`);
      
    } catch (notificationError) {
      // If notifications fail, don't crash the whole request
      console.error('Failed to send notification:', notificationError);
    }
    // --- END OF NEW LOGIC ---

    res.json(project.applications);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// --- END OF UPDATED FUNCTION ---

// @desc    Accept a user's application
// @route   POST /api/projects/:id/accept
// @access  Private (Owner only)
export const acceptMember = async (req, res) => {
  const { applicationId } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    const application = project.applications.id(applicationId);
    if (!application) return res.status(404).json({ msg: 'Application not found' });
    const userIdToAccept = application.user;
    if (!project.teamMembers.some(id => id.toString() === userIdToAccept.toString())) {
      project.teamMembers.push(userIdToAccept);
    }
    application.deleteOne();
    await project.save();
    const updatedProject = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('teamMembers', 'name email')
      .populate('applications.user', 'name email');
    res.json(updatedProject); 
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Decline a user's application
// @route   POST /api/projects/:id/decline
// @access  Private (Owner only)
export const declineMember = async (req, res) => {
  const { applicationId } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    const application = project.applications.id(applicationId);
    if (!application) return res.status(404).json({ msg: 'Application not found' });
    application.deleteOne();
    await project.save();
    const updatedProject = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('teamMembers', 'name email')
      .populate('applications.user', 'name email');
    res.json(updatedProject);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add a new task to a Kanban column
// @route   POST /api/projects/:id/kanban/tasks
// @access  Private
export const addTaskToKanban = async (req, res) => {
  const { columnId, content } = req.body; 
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    
    const newTask = { content, createdBy: req.user.id };

    if (project.kanban[columnId]) {
      project.kanban[columnId].push(newTask);
      await project.save();
      
      const taskIndex = project.kanban[columnId].length - 1;
      await project.populate({
        path: `kanban.${columnId}.${taskIndex}.createdBy`,
        select: 'name'
      });
      
      const populatedTask = project.kanban[columnId][taskIndex];
      res.status(201).json(populatedTask); 
    } else {
      return res.status(400).json({ msg: 'Invalid column ID' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Move a task between or within Kanban columns
// @route   PUT /api/projects/:id/kanban/tasks/move
// @access  Private
export const moveTaskInKanban = async (req, res) => {
  const { taskId, sourceColumnId, destColumnId, destIndex } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    const sourceColumn = project.kanban[sourceColumnId];
    if (!sourceColumn) return res.status(400).json({ msg: 'Invalid source column' });
    const task = sourceColumn.id(taskId); 
    if (!task) return res.status(404).json({ msg: 'Task not found in source column' });
    task.deleteOne();
    const destColumn = project.kanban[destColumnId];
    if (!destColumn) return res.status(400).json({ msg: 'Invalid destination column' });
    destColumn.splice(destIndex, 0, task);
    await project.save();
    res.status(200).json({ message: 'Task moved successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a task from a Kanban column
// @route   DELETE /api/projects/:id/kanban/tasks
// @access  Private
export const deleteTaskFromKanban = async (req, res) => {
  const { columnId, taskId } = req.body;

  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    
    const column = project.kanban[columnId];
    if (!column) {
      return res.status(400).json({ msg: 'Invalid column ID' });
    }

    const task = column.id(taskId);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    task.deleteOne();
    await project.save();

    res.status(200).json({ message: 'Task deleted successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};  