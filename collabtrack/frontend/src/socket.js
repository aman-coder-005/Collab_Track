// src/socket.js

import { io } from 'socket.io-client';

// This is the URL of your backend server
const SERVER_URL = "http://localhost:5000"; 

// Create the socket instance
// We set autoConnect to false so we can manually connect
// when a user actually enters the chat.
const socket = io(SERVER_URL, {
  autoConnect: false
});

export default socket;