import React, { useEffect, useState } from "react";
import TodoBoard from "../components/TodoBoard";
import TodoModal from "../components/TodoModal";
import api from "../utils/api";
import "./TodoPage.style.css";

const TodoPage = () => {
  const [todoList, setTodoList] = useState([]);
  const [todoValue, setTodoValue] = useState("");
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");

  const getTasks = async () => {
    const response = await api.get("/tasks");
    setTodoList(response.data.data);
  };

  useEffect(() => {
    getTasks();
  }, []);

  // 할 일을 추가하는 함수
  const addTodo = async () => {
    try {
      const response = await api.post("/tasks", {
        task: todoValue,
        isComplete: false,
        priority: selectedPriority,
        description: description,
      });
      if (response.status === 200) {
        getTasks();
      }
      setTodoValue("");
      setDescription("");
      setSelectedPriority("");
      setIsModalOpen(false);
    } catch (error) {
      console.log("error:", error);
    }
  };

  // 할 일을 삭제하는 함수
  const deleteItem = async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      if (response.status === 200) {
        getTasks();
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  // 할 일의 완료 상태를 변경하는 함수
  const toggleComplete = async (id) => {
    try {
      const task = todoList.find((item) => item._id === id);
      const response = await api.put(`/tasks/${id}`, {
        isComplete: !task.isComplete,
      });
      if (response.status === 200) {
        getTasks();
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  // 모달 열고 닫는 함수
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleFilterPriorityClick = (priority) => {
    setFilterPriority(priority === "All" ? "" : priority);
  };

  const filteredTodoList = filterPriority
    ? todoList.filter((item) => item.priority === filterPriority)
    : todoList;

  return (
    <div className="todo-container">
      <div className="todo-header">
        <div className="todo-logo">todo</div>
      </div>

      <div className="content-section">
        <div className="priority-filter-list">
          {["All", "Immediate", "High", "Normal", "Low"].map((priority) => (
            <span
              key={priority}
              className={`priority-filter ${
                filterPriority === priority ? "selected" : ""
              }`}
              data-priority={priority}
              onClick={() => handleFilterPriorityClick(priority)}
            >
              {priority}
            </span>
          ))}
        </div>
        <div className="task-list">
          <TodoBoard
            todoList={filteredTodoList}
            deleteItem={deleteItem}
            toggleComplete={toggleComplete}
            getTasks={getTasks}
          />
        </div>
      </div>

      <button onClick={toggleModal} className="add-task-button">
        +
      </button>

      {isModalOpen && (
        <TodoModal
          mode="add"
          todoValue={todoValue}
          setTodoValue={setTodoValue}
          description={description}
          setDescription={setDescription}
          selectedPriority={selectedPriority}
          setSelectedPriority={setSelectedPriority}
          onSave={addTodo}
          onClose={toggleModal}
        />
      )}
    </div>
  );
};

export default TodoPage;
