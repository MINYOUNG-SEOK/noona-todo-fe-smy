import React, { useState, useEffect } from "react";
import "./TodoItem.style.css";

const TodoItem = ({ item, deleteItem, toggleComplete, openEditModal }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest(".menu-dropdown, .todo-item-menu-button")) {
        return;
      }
      setShowMenu(false);
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteItem(item._id);
    } catch (error) {
      console.log("error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Immediate":
        return "#ffcece";
      case "High":
        return "#d2ceff";
      case "Normal":
        return "#d1e5f7";
      case "Low":
        return "#daf2d6";
      default:
        return "";
    }
  };

  return (
    <div className={`todo-item ${item.isComplete ? "item-complete" : ""}`}>
      <div className="todo-item-header">
        <div className="todo-item-title">{item.task} (by {item.author.name})</div>
        <button
          className="todo-item-menu-button"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
        >
          &#8230;
        </button>
        {/* 메뉴 드롭다운 */}
        {showMenu && (
          <div className="menu-dropdown" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                openEditModal(item); // 수정 모달 열기
                setShowMenu(false);
              }}
              disabled={isDeleting}
            >
              Edit
            </button>
            <button onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Delete..." : "Delete"}
            </button>
          </div>
        )}
      </div>

      <div className="todo-item-description">{item.description || ""}</div>

      <div className="todo-item-footer">
        <div
          className="todo-item-priority-circle"
          style={{ backgroundColor: getPriorityColor(item.priority) }}
        ></div>
        <div className="todo-checkbox">
          <label>Done</label>
          <input
            type="checkbox"
            checked={item.isComplete}
            onChange={() => toggleComplete(item._id)}
            disabled={isDeleting}
          />
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
