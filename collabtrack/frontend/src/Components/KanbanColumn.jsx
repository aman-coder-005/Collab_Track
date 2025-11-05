// src/Components/KanbanColumn.jsx

import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

// 1. ACCEPT THE PROP
const KanbanColumn = ({ column, columnId, onAddTask, onUpdateTask, onDeleteTask }) => { 
  const [taskContent, setTaskContent] = useState('');
  
  const handleAddTaskSubmit = (e) => {
    e.preventDefault();
    if (taskContent.trim()) {
      onAddTask(columnId, taskContent);
      setTaskContent('');
    }
  };

  return (
    <div className="flex flex-col w-80 bg-gray-100 rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{column.name}</h2>
      
      <Droppable droppableId={columnId} key={columnId}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`flex-grow min-h-[400px] p-2 rounded-lg transition-colors
              ${snapshot.isDraggingOver ? 'bg-indigo-100' : 'bg-gray-100'}`
            }
          >
            {column.items.map((task, index) => (
              <TaskCard 
                key={task._id}
                task={task} 
                index={index} 
                onUpdateTask={onUpdateTask}
                // 2. PASS A SPECIFIC FUNCTION TO THE CARD
                // This gives the card the 'columnId' and 'task._id' it needs
                onDeleteTask={() => onDeleteTask(columnId, task._id)} 
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      
      {/* "Add a card" form */}
      <form onSubmit={handleAddTaskSubmit} className="mt-4">
        <textarea
          className="w-full p-2 border border-gray-300 rounded-lg"
          rows="3"
          placeholder="Enter a title for this card..."
          value={taskContent}
          onChange={(e) => setTaskContent(e.target.value)}
        />
        <button 
          type="submit"
          className="mt-2 w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700"
        >
          Add card
        </button>
      </form>
    </div>
  );
};

export default KanbanColumn;