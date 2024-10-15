import React, { useState } from "react";
import "./TodoItem.style.css";

const TodoItem = ({ item, deleteItem, toggleComplete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedTask, setEditedTask] = useState(item.task);
  const [editedDescription, setEditedDescription] = useState(item.description);

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
    setShowMenu(false); // 메뉴 닫고 모달창 열기
  };

  const handleEditSave = () => {
    // 여기에 수정 저장 로직 추가 (예: API 호출)
    setIsEditModalOpen(false);
  };

  return (
    <div className={`todo-item ${item.isComplete ? "item-complete" : ""}`}>
      {/* 제목과 부가설명 */}
      <div className="todo-item-header">
        <div className="todo-item-title">{item.task}</div>
        <button className="todo-item-menu-button" onClick={handleMenuToggle}>
          &#8230; {/* 세 점 아이콘 */}
        </button>
        {showMenu && (
          <div className="menu-dropdown">
            <button onClick={handleEditClick}>Edit</button>
            <button onClick={() => deleteItem(item._id)}>Delete</button>
          </div>
        )}
      </div>

      {/* 부가설명 텍스트 */}
      <div className="todo-item-description">
        {item.description || "No additional description."}
      </div>

      {/* Done 체크박스 */}
      <div className="todo-checkbox">
        <label>Done</label>
        <input
          type="checkbox"
          checked={item.isComplete}
          onChange={() => toggleComplete(item._id)}
        />
      </div>

      {/* 수정 모달 */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Task</h2>
              <button
                className="cancel-button"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
            </div>

            <div className="add-todo-form">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  placeholder="Edit task title..."
                  value={editedTask}
                  onChange={(e) => setEditedTask(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  placeholder="Edit task description..."
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                />
              </div>

              <div className="modal-buttons">
                <button className="save-button" onClick={handleEditSave}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
