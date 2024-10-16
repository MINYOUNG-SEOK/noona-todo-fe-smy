import React from "react";
import "./TodoBoard.style.css";
import TodoItem from "./TodoItem";

const TodoBoard = ({ todoList, deleteItem, toggleComplete, getTasks }) => {
  return (
    <div className="todo-board">
      {todoList.length > 0 ? (
        todoList.map((item) => (
          <TodoItem
            key={item._id}
            item={item}
            deleteItem={deleteItem}
            toggleComplete={toggleComplete}
            getTasks={getTasks}
          />
        ))
      ) : (
        <p>데이터가 비어있어요!😮</p>
      )}
    </div>
  );
};

export default TodoBoard;
