import React, { useEffect, useState } from "react";
import "./TodoModal.style.css";

const TodoModal = ({
  mode = "add",
  todoValue = "",
  description = "",
  selectedPriority = "",
  setTodoValue,
  setDescription,
  setSelectedPriority,
  onSave,
  onClose,
}) => {
  const priorities = ["Immediate", "High", "Normal", "Low"];
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (mode === "edit") {
      setTodoValue(todoValue);
      setDescription(description);
      setSelectedPriority(selectedPriority);
    }
  }, [
    mode,
    todoValue,
    description,
    selectedPriority,
    setTodoValue,
    setDescription,
    setSelectedPriority,
  ]);

  const handleSelectedPriorityClick = (priority) => {
    setSelectedPriority((prevPriority) =>
      prevPriority === priority ? "" : priority
    );
  };

  const handleSaveClick = async () => {
    if (!todoValue.trim()) { // 제목이 비어있으면 알림창 표시
      alert("Title is required. Please add a title.");
      return; 
    }

    setLoading(true); 
    await onSave();
    setLoading(false); 
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="save-button" onClick={handleSaveClick}>
          {loading ? "Saving..." : mode === "add" ? "Add" : "Save"}
          </button>
        </div>

        <div className="add-todo-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              placeholder={
                mode === "add" ? "Add a title ..." : "Edit task title..."
              }
              value={todoValue}
              onChange={(event) => setTodoValue(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder={
                mode === "add"
                  ? "Add a description ..."
                  : "Edit task description..."
              }
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={loading} 
            />
          </div>

          <div className="form-group">
            <label>Priority</label>
            <div className="priority-modal-list">
              {priorities.map((priority) => (
                <span
                  key={priority}
                  className={`priority-modal ${
                    selectedPriority === priority ? "selected" : ""
                  }`}
                  data-priority={priority}
                  onClick={() => handleSelectedPriorityClick(priority)}
                  disabled={loading}
                >
                  {priority}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoModal;
