// src/pages/ProjectDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from '../Components/KanbanColumn';
import ChatWindow from '../Components/ChatWindow';
import { useParams } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { useAuth } from '../Context/AuthContext';

const ProjectDashboardPage = () => {
  const { projectId } = useParams();
  const { user } = useAuth();

  const [columns, setColumns] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectKanban = async () => {
      try {
        setLoading(true);
        const project = await projectService.getProjectById(projectId);
        setColumns(project.kanban); 
        setLoading(false);
      } catch (err) {
        setError('Failed to load project board. ' + err.message);
        setLoading(false);
      }
    };
    if (projectId) {
      fetchProjectKanban();
    }
  }, [projectId]);

  const handleAddTask = async (columnId, content) => {
    if (!content || content.trim() === "") return;
    try {
      const newTask = await projectService.addTask(projectId, columnId, content, user.token);
      const column = columns[columnId];
      const updatedItems = [...column, newTask];
      setColumns({ ...columns, [columnId]: updatedItems });
    } catch (err) {
      alert('Failed to add task: ' + err.message);
    }
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    
    const sourceColumn = Array.from(columns[source.droppableId]);
    const destColumn = (source.droppableId === destination.droppableId) 
      ? sourceColumn 
      : Array.from(columns[destination.droppableId]);
    
    const [task] = sourceColumn.splice(source.index, 1);
    destColumn.splice(destination.index, 0, task);

    setColumns({
      ...columns,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn,
    });
    
    const moveData = {
      taskId: draggableId,
      sourceColumnId: source.droppableId,
      destColumnId: destination.droppableId,
      destIndex: destination.index
    };

    projectService.moveTask(projectId, moveData, user.token)
      .catch(err => {
        console.error('Failed to move task on server:', err);
        alert('Error: Task move failed to save. Please refresh.');
      });
  };

  const handleUpdateTask = (taskId, newContent) => {
    // This is still local. Would need a new API route to persist.
    const newColumns = { ...columns };
    for (let columnId in newColumns) {
      const taskIndex = newColumns[columnId].findIndex(task => task._id === taskId);
      if (taskIndex > -1) {
        newColumns[columnId][taskIndex].content = newContent;
        break;
      }
    }
    setColumns(newColumns);
  };

  // --- NEW DELETE FUNCTION ---
  const handleDeleteTask = async (columnId, taskId) => {
    // 1. Optimistic UI Update
    const column = columns[columnId];
    const updatedItems = column.filter(task => task._id !== taskId);
    setColumns({
      ...columns,
      [columnId]: updatedItems
    });

    // 2. Call the API in the background
    try {
      await projectService.deleteTask(projectId, columnId, taskId, user.token);
    } catch (err) {
      console.error('Failed to delete task on server:', err);
      alert('Error: Task delete failed. Please refresh.');
      // Revert state if delete fails
      setColumns({ ...columns, [columnId]: column }); 
    }
  };
  // --- END NEW FUNCTION ---

  if (loading) return <div className="p-4">Loading project board...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!columns) return <div className="p-4">No project board found.</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Project Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex items-start space-x-4 overflow-x-auto pb-4">
              
              <KanbanColumn
                key='todo'
                columnId='todo'
                column={{ name: 'To-Do', items: columns.todo }}
                onUpdateTask={handleUpdateTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask} // <-- PASS PROP
              />
              <KanbanColumn
                key='inProgress'
                columnId='inProgress'
                column={{ name: 'In Progress', items: columns.inProgress }}
                onUpdateTask={handleUpdateTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask} // <-- PASS PROP
              />
              <KanbanColumn
                key='completed'
                columnId='completed'
                column={{ name: 'Completed', items: columns.completed }}
                onUpdateTask={handleUpdateTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask} // <-- PASS PROP
              />

            </div>
          </DragDropContext>
        </div>
        <div className="lg:col-span-1">
          <ChatWindow projectId={projectId} />
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboardPage;