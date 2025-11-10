import React, { useCallback, useState, useRef, useEffect } from 'react';
import TaskCard from './TaskCard';
import './TaskBoard.css';

const TaskColumn = ({ 
  title, 
  tasks = [], 
  onTaskEdit, 
  onTaskDelete, 
  onAddTask,
  onTaskMove,
  columnId 
}) => {
  const columnRef = useRef(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [touchStartY, setTouchStartY] = useState(null);
  const [scrollStartTop, setScrollStartTop] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [openMoveMenuId, setOpenMoveMenuId] = useState(null);

  const handleAddTask = () => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: 'New Task',
      description: 'Click to edit this task',
      status: columnId
    };
    onAddTask?.(columnId, newTask);
  };

  const handleTaskDelete = (taskId) => {
    onTaskDelete?.(taskId, columnId);
  };

  const handleTouchMove = useCallback((e) => {
    if (touchStartY !== null && columnRef.current) {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      columnRef.current.scrollTop = scrollStartTop + deltaY;
    }
  }, [touchStartY, scrollStartTop]);

  const handleTouchStart = useCallback((e) => {
    setTouchStartY(e.touches[0].clientY);
    setScrollStartTop(columnRef.current?.scrollTop || 0);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setTouchStartY(null);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(true);
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    setIsDraggingOver(false);
    
    const taskId = e.dataTransfer?.getData('taskId') || e.target.closest('[data-task-id]')?.dataset.taskId;
    const sourceColumnId = e.dataTransfer?.getData('sourceColumnId') || e.target.closest('[data-column-id]')?.dataset.columnId;
    
    if (taskId && sourceColumnId && sourceColumnId !== columnId) {
      onTaskMove?.(taskId, sourceColumnId, columnId);
    }
  }, [columnId, onTaskMove]);

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceColumnId', columnId);
    e.dataTransfer.effectAllowed = 'move';
    
    // Add visual feedback
    e.target.classList.add('dragging');
    
    // Set a custom drag image
    const dragImage = e.currentTarget.cloneNode(true);
    dragImage.style.width = `${e.currentTarget.offsetWidth}px`;
    dragImage.style.opacity = '0.8';
    dragImage.style.position = 'fixed';
    dragImage.style.pointerEvents = 'none';
    dragImage.style.zIndex = '1000';
    
    // Position off-screen initially
    dragImage.style.top = '-9999px';
    dragImage.style.left = '0';
    
    document.body.appendChild(dragImage);
    
    // Calculate the offset to center the drag image
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Set the drag image with the calculated offset
    e.dataTransfer.setDragImage(dragImage, x, y);
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
  };

  const handleTaskMove = (taskId, fromColumnId, toColumnId) => {
    if (toColumnId === 'close-others') {
      setOpenMoveMenuId(null);
      return;
    }
    onTaskMove?.(taskId, fromColumnId, toColumnId);
  };
  
  // Handle menu toggle from child
  const handleMenuToggle = (taskId, isOpen) => {
    setOpenMoveMenuId(isOpen ? taskId : null);
  };

  // Add touch event listeners for mobile scrolling
  useEffect(() => {
    const column = columnRef.current;
    if (column) {
      column.addEventListener('touchmove', handleTouchMove, { passive: false });
      column.addEventListener('touchstart', handleTouchStart, { passive: true });
      column.addEventListener('touchend', handleTouchEnd, { passive: true });
      return () => {
        column.removeEventListener('touchmove', handleTouchMove);
        column.removeEventListener('touchstart', handleTouchStart);
        column.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [handleTouchMove, handleTouchStart, handleTouchEnd]);

  return (
    <div 
      ref={columnRef}
      className={`task-column ${isDraggingOver ? 'column-drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-column-id={columnId}
    >
      <div className="column-header">
        <h3 className="column-title">{title}</h3>
        <span className="task-count">{tasks.length}</span>
      </div>
      
      <div className="tasks-container">
        {tasks.length === 0 ? (
          <div className="empty-state">
            {columnId === 'todo' ? 'No tasks yet. Add one below!' : 'Drop tasks here'}
          </div>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
              onDragEnd={handleDragEnd}
              className="task-card-wrapper"
            >
              <TaskCard 
                key={task.id}
                task={task} 
                onEdit={onTaskEdit}
                onDelete={handleTaskDelete}
                onMove={handleTaskMove}
                availableColumns={[
                  { id: 'todo', title: 'To Do' },
                  { id: 'doing', title: 'Doing' },
                  { id: 'done', title: 'Done' }
                ]}
                currentColumnId={columnId}
                isMoveMenuOpen={openMoveMenuId === task.id}
                onMoveMenuToggle={(isOpen) => handleMenuToggle(task.id, isOpen)}
              />
            </div>
          ))
        )}
      </div>
      
      {columnId === 'todo' && (
        <button 
          className="add-task-button"
          onClick={handleAddTask}
        >
          + Add Task
        </button>
      )}
    </div>
  );
};

export default TaskColumn;
