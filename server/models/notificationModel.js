// server/models/notificationModel.js

import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    // The user who receives the notification
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true, 
      ref: 'User' 
    },
    message: { 
      type: String, 
      required: true 
    },
    read: { 
      type: Boolean, 
      required: true, 
      default: false 
    },
    // The link to go to when clicked
    link: { 
      type: String, 
      required: true 
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;