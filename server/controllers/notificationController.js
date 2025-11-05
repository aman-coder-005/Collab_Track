// server/controllers/notificationController.js

import Notification from '../models/notificationModel.js';

// @desc    Get all unread notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      user: req.user._id,
      read: false // Only get unread ones
    }).sort({ createdAt: -1 }); // Newest first

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read
// @access  Private
export const markNotificationsAsRead = async (req, res) => {
  try {
    // Find all unread notifications for this user and update them
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { $set: { read: true } }
    );
    
    // Send back a success message
    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};