// src/Components/ChatWindow.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../Context/AuthContext';
import { messageService } from '../services/messageService.js';
import socket from '../socket.js';

// We now receive projectId as a prop
const ChatWindow = ({ projectId }) => {
  const { user } = useAuth(); // Get logged-in user

  const [messages, setMessages] = useState([]); // Holds all chat messages
  const [newMessage, setNewMessage] = useState(''); // The user's typed message
  const [error, setError] = useState('');
  
  // A ref to the chat window for auto-scrolling
  const chatBottomRef = useRef(null);

  // --- Main Effect for Chat Logic ---
  useEffect(() => {
    // Don't do anything if we don't have a projectId or user
    if (!projectId || !user) return;

    // 1. Manually connect to the socket
    socket.connect();

    // 2. Tell the server we are joining this project's "room"
    socket.emit('join_project', projectId);

    // 3. Function to fetch all message history
    const fetchHistory = async () => {
      try {
        const history = await messageService.getMessages(projectId, user.token);
        setMessages(history);
      } catch (err) {
        setError('Failed to load message history.');
      }
    };
    
    fetchHistory();

    // 4. Set up the listener for *new* messages from the server
    const handleReceiveMessage = (receivedMessage) => {
      setMessages(prevMessages => [...prevMessages, receivedMessage]);
    };
    
    socket.on('receive_message', handleReceiveMessage);

    // 5. CLEANUP: When the component unmounts or projectId changes
    return () => {
      socket.off('receive_message', handleReceiveMessage); // Stop listening
      socket.disconnect(); // Disconnect from socket
    };
  }, [projectId, user]); // Re-run if the project ID or user changes

  // --- Auto-scroll to bottom when new messages are added ---
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Handle Sending a New Message ---
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    // This data object must match your server.js 'send_message' handler
    const messageData = {
      projectId: projectId,
      senderId: user._id,
      senderName: user.name,
      content: newMessage.trim(),
    };

    // Emit the message to the server
    socket.emit('send_message', messageData);

    // Clear the input box
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[80vh] bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 border-b pb-4 mb-4">
        Project Chat
      </h2>
      
      {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      {/* --- Message Display Window --- */}
      <div className="flex-grow overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div 
              key={msg._id || `msg-${Math.random()}`} // Use _id, fallback for optimism
              className={`mb-4 ${msg.sender === user._id ? 'text-right' : 'text-left'}`}
            >
              <div 
                className={`inline-block p-3 rounded-lg ${
                  msg.sender === user._id 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="text-sm font-bold">
                  {msg.senderName}
                </p>
                <p>{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : 'Sending...'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages yet. Say hi!</p>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* --- Message Input Form --- */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button 
          type="submit"
          className="bg-indigo-600 text-white font-bold py-3 px-5 rounded-lg hover:bg-indigo-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;