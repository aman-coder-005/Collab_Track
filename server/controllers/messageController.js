import Message from '../models/messageModel.js';

// @desc    Get all messages for a project
// @route   GET /api/messages/:projectId
// @access  Private (Only project members should see)
const getMessagesForProject = async (req, res) => {
  try {
    // 1. Get the projectId from the URL parameter
    const projectId = req.params.projectId;

    // 2. Find all messages that match the projectId
    const messages = await Message.find({ project: projectId })
      .populate('sender', 'name') // Get the sender's name from the User model
      .sort({ createdAt: 'asc' }); // Sort by oldest first

    // 3. Send the history
    res.status(200).json(messages);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { getMessagesForProject };