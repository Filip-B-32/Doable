import React, { useState } from 'react';
import TaskColumn from './TaskColumn';
import './TaskBoard.css';

const TaskBoard = ({ initialTasks = {}, onTasksChange }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [nextTaskId, setNextTaskId] = useState(1);

  const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'doing', title: 'Doing' },
    { id: 'done', title: 'Done' }
  ];

  const handleTaskAdd = (columnId, newTask) => {
    const updatedTasks = {
      ...tasks,
      [columnId]: [...(tasks[columnId] || []), newTask]
    };

    setTasks(updatedTasks);
    onTasksChange?.(updatedTasks);
  };

  const handleTaskDelete = (taskId, columnId) => {
    if (!columnId) {
      // If columnId is not provided, find and remove from any column
      const updatedTasks = { ...tasks };
      for (const colId in updatedTasks) {
        updatedTasks[colId] = updatedTasks[colId].filter(task => task.id !== taskId);
      }
      setTasks(updatedTasks);
      onTasksChange?.(updatedTasks);
    } else {
      const updatedTasks = {
        ...tasks,
        [columnId]: (tasks[columnId] || []).filter(task => task.id !== taskId)
      };
      setTasks(updatedTasks);
      onTasksChange?.(updatedTasks);
    }
  };

  const handleTaskEdit = (updatedTask) => {
    // Find and update the task in the correct column
    const updatedTasks = { ...tasks };
    let taskFound = false;

    for (const columnId in updatedTasks) {
      const taskIndex = updatedTasks[columnId].findIndex(t => t.id === updatedTask.id);
      if (taskIndex !== -1) {
        // If status changed, move to new column
        if (updatedTask.status && updatedTask.status !== columnId) {
          // Remove from current column
          updatedTasks[columnId] = updatedTasks[columnId].filter(t => t.id !== updatedTask.id);
          // Add to new column
          updatedTasks[updatedTask.status] = [...(updatedTasks[updatedTask.status] || []), updatedTask];
        } else {
          // Update in place
          updatedTasks[columnId][taskIndex] = updatedTask;
        }
        taskFound = true;
        break;
      }
    }

    if (taskFound) {
      setTasks(updatedTasks);
      onTasksChange?.(updatedTasks);
    }
  };

  const handleTaskMove = (taskId, fromColumnId, toColumnId) => {
    const updatedTasks = { ...tasks };
    const taskToMove = updatedTasks[fromColumnId]?.find(task => task.id === taskId);
    
    if (!taskToMove) return;

    // Remove from source column
    updatedTasks[fromColumnId] = updatedTasks[fromColumnId].filter(task => task.id !== taskId);
    
    // Add to target column with updated status
    const updatedTask = { ...taskToMove, status: toColumnId };
    updatedTasks[toColumnId] = [...(updatedTasks[toColumnId] || []), updatedTask];
    
    setTasks(updatedTasks);
    onTasksChange?.(updatedTasks);
  };


  return (
    <div className="task-board">
      <div className="board-columns">
        {columns.map((column) => (
          <TaskColumn
            key={column.id}
            columnId={column.id}
            title={column.title}
            tasks={tasks[column.id] || []}
            onTaskEdit={handleTaskEdit}
            onTaskDelete={handleTaskDelete}
            onTaskMove={handleTaskMove}
            onAddTask={column.id === 'todo' ? handleTaskAdd : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
