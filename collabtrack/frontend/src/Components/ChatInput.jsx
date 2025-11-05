import React, { useState } from 'react';

const ChatInput = () => {
  const [message, setMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() === '') return;
    console.log('Sending message:', message); // Simulate sending
    setMessage(''); // Clear input after sending
  };

  return (
    <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-200">
      <div className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default ChatInput;