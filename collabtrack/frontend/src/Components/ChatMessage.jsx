import React from 'react';

const ChatMessage = ({ message, isCurrentUser }) => {
  // Base styling for all messages
  const baseClasses = "max-w-xs md:max-w-md p-3 rounded-lg";
  
  // Conditional styling
  const messageClasses = isCurrentUser
    ? `${baseClasses} bg-indigo-500 text-white self-end` // Current user's message
    : `${baseClasses} bg-gray-200 text-gray-800 self-start`; // Other users' messages

  return (
    <div className={`flex flex-col mb-3 ${isCurrentUser ? 'items-end' : 'items-start'}`}>
      {!isCurrentUser && (
        <p className="text-xs text-gray-500 mb-1 ml-1">{message.sender.name}</p>
      )}
      <div className={messageClasses}>
        <p>{message.text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;