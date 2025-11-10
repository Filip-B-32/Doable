import React from 'react';
import { TaskBoard } from '../../components/TaskBoard';
import "./main-board.css";

// Sample initial tasks
const initialTasks = {
  todo: [
    { id: 'task-1', title: 'Design new feature', description: 'Create mockups for the new dashboard', status: 'todo' },
    { id: 'task-2', title: 'Fix navigation bug', description: 'Menu not closing on mobile', status: 'todo' },
  ],
  doing: [
    { id: 'task-3', title: 'Implement API integration', description: 'Connect frontend to the new endpoints', status: 'doing' },
  ],
  done: [
    { id: 'task-4', title: 'Setup project', description: 'Initial project configuration', status: 'done' },
    { id: 'task-5', title: 'Create login page', description: 'Design and implement login form', status: 'done' },
  ]
};

const MainBoard = () => {
  const handleTasksChange = (updatedTasks) => {
    // Here you would typically save the tasks to your state management or API
    console.log('Tasks updated:', updatedTasks);
  };

  return (
    <div className="main-board-container">
      <div className="board-container">
        <h1 className="board-title">Task Board</h1>
        <TaskBoard 
          initialTasks={initialTasks} 
          onTasksChange={handleTasksChange} 
        />
      </div>
    </div>
  );
};

export default MainBoard;
