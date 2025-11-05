// server/server.js

import 'dotenv/config'; 
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

// --- Models (for socket logic) ---
import Message from './models/messageModel.js';

// --- Routes ---
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js'; // <-- 1. IMPORT NEW ROUTE

// --- Initial Server & DB Setup ---
connectDB();
const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// --- Middleware ---
app.use(express.json()); // To parse JSON request bodies

// This middleware MUST be defined *BEFORE* your API routes (app.use('/api/...'))
app.use((req, res, next) => {
  req.io = io;
  next();
});

// --- API Routes ---
// These must come *AFTER* the 'req.io' middleware
app.get('/', (req, res) => {
  res.send('CollabTrack Backend is running!');
});

app.use('/api/users', userRoutes); 
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes); // <-- 2. USE NEW ROUTE

// --- Socket.io Connection Logic ---
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join_user_room', (userId) => {
    socket.join(userId);
    console.log(`User ${socket.id} joined their private room: ${userId}`);
  });

  socket.on('join_project', (projectId) => {
    socket.join(projectId);
    console.log(`User ${socket.id} joined project room: ${projectId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const message = new Message({
        project: data.projectId,
        sender: data.senderId,
        senderName: data.senderName,
        content: data.content,
      });
      const savedMessage = await message.save();
      io.to(data.projectId).emit('receive_message', savedMessage);
    } catch (error) {
      console.error('Error saving or broadcasting message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// --- Start the Server ---
httpServer.listen(PORT, () => {
  console.log(`Server is running with Socket.io on http://localhost:${PORT}`);
});