// src/Components/TaskCard.jsx

import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

// 1. ACCEPT THE PROP
const TaskCard = ({ task, index, onUpdateTask, onDeleteTask }) => {
  if (!task) return null;
  
  return (
    <Draggable 
      draggableId={task._id}
      index={index}
      key={task._id}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          // 2. ADD 'relative' FOR POSITIONING THE BUTTON
          className={`relative bg-white p-4 mb-3 rounded-lg shadow-sm ${
            snapshot.isDragging ? 'ring-2 ring-indigo-500' : ''
          }`}
          style={{ ...provided.draggableProps.style }}
        >
          {/* --- 3. ADD THE DELETE BUTTON --- */}
          <button
            onClick={onDeleteTask} // Calls the function passed from KanbanColumn
            className="absolute top-1 right-2 text-gray-400 hover:text-red-500 font-bold"
            aria-label="Delete task"
          >
            &times; {/* This is an "X" character */}
          </button>
          {/* --- END OF BUTTON --- */}

          {/* 4. ADD PADDING-RIGHT 'pr-4' TO AVOID OVERLAP */}
          <p className="text-gray-900 pr-4">{task.content}</p> 
          <p className="text-sm text-gray-500 mt-2">
            Added by: {task.createdBy?.name || '...'}
          </p>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;