import React, { useEffect, useRef } from "react";
import "./TaskBoard.css";

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onMove,
  availableColumns,
  currentColumnId,
  isMoveMenuOpen = false,
  onMoveMenuToggle = () => {},
}) => {
  const { id, title, description } = task;
  const moveButtonRef = useRef(null);
  const optionsRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target) &&
        moveButtonRef.current &&
        !moveButtonRef.current.contains(event.target)
      ) {
        onMoveMenuToggle(false);
      }
    }

    if (isMoveMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMoveMenuOpen]);

  const handleMoveClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isMoveMenuOpen) {
      if (onMove) {
        onMove(task.id, currentColumnId, "close-others");
      }
      onMoveMenuToggle(true);
    } else {
      onMoveMenuToggle(false);
    }
  };

  const handleMoveToColumn = (columnId, e) => {
    e.stopPropagation();
    e.preventDefault();

    if (columnId !== currentColumnId) {
      onMove(task.id, currentColumnId, columnId);
    }
    onMoveMenuToggle(false);
  };

  return (
    <div className="task-card">
      <div className="task-card-content" onClick={() => onEdit && onEdit(task)}>
        <div className="task-card-header">
          <h4 className="task-title">{title}</h4>
          <button
            className="task-card-delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
          >
            ×
          </button>
        </div>
        {description && <p className="task-description">{description}</p>}
      </div>

      <div className="task-card-footer">
        <button
          ref={moveButtonRef}
          className={`move-button ${isMoveMenuOpen ? "active" : ""}`}
          onClick={handleMoveClick}
        >
          Move to...
        </button>

        {isMoveMenuOpen && (
          <div className="move-options" ref={optionsRef}>
            {availableColumns
              .filter((col) => col.id !== currentColumnId)
              .map((column) => (
                <button
                  key={column.id}
                  className="move-option"
                  onClick={(e) => handleMoveToColumn(column.id, e)}
                >
                  {column.title}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
