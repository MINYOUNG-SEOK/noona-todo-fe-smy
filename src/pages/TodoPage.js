import React, { useEffect, useState } from "react";
import TodoBoard from "../components/TodoBoard";
import api from "../utils/api";
import "./TodoPage.style.css";

const TodoPage = () => {
  const [todoList, setTodoList] = useState([]);
  const [todoValue, setTodoValue] = useState("");
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 필터링용 우선순위 상태
  const [filterPriority, setFilterPriority] = useState("");

  // 모달창 우선순위 등록용 상태
  const [selectedPriority, setSelectedPriority] = useState("");

  const getTasks = async () => {
    const response = await api.get("/tasks");
    setTodoList(response.data.data);
  };

  useEffect(() => {
    getTasks();
  }, []);

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

  const deleteItem = async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      if (response.status === 200) {
        getTasks();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

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
      console.log("error", error);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

// 필터링용 우선순위 선택 핸들러
const handleFilterPriorityClick = (priority) => {
  if (priority === "All") {
    setFilterPriority(""); // 전체 보기 선택 시 필터를 초기화
  } else {
    setFilterPriority(priority);
  }
};

const filteredTodoList = filterPriority
? todoList.filter((item) => item.priority === filterPriority)
: todoList;

  // 모달창 우선순위 등록용 선택 핸들러
  const handleSelectedPriorityClick = (priority) => {
    setSelectedPriority(priority);
  };

  return (
    <div className="todo-container">
      {/* 좌측 상단에 TODO 텍스트 */}
      <div className="todo-header">
        <div className="todo-logo">todo</div>
      </div>
  
      {/* TODO 텍스트 아래에 우선순위 리스트와 할일 리스트를 배치 */}
      <div className="content-section">
        {/* 필터링용 우선순위 리스트 */}
        <div className="priority-filter-list">
          {["All", "No Priority", "Immediate", "High", "Normal", "Low"].map((priority) => (
            <span
              key={priority}
              className={`priority-filter ${filterPriority === priority ? "selected" : ""}`}
              data-priority={priority}
              onClick={() => handleFilterPriorityClick(priority)}
            >
              {priority}
            </span>
          ))}
        </div>
  
        {/* 할일 리스트 */}
        <div className="task-list">
          <TodoBoard
            todoList={filteredTodoList} // 필터링된 리스트 전달
            deleteItem={deleteItem}
            toggleComplete={toggleComplete}
          />
        </div>
      </div>
  
      {/* "+" 버튼 */}
      <button onClick={toggleModal} className="add-task-button">
        +
      </button>
  
      {/* 모달 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <button className="cancel-button" onClick={toggleModal}>
                Cancel
              </button>
              <button className="add-button" onClick={addTodo}>
                Add
              </button>
            </div>

            <div className="add-todo-form">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  placeholder="add a title ..."
                  value={todoValue}
                  onChange={(event) => setTodoValue(event.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  placeholder="add a description ..."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Priority</label>
                <div className="priority-modal-list">
                  {["No Priority", "Immediate", "High", "Normal", "Low"].map((priority) => (
                    <span
                      key={priority}
                      className={`priority-modal ${
                        selectedPriority === priority ? "selected" : ""
                      }`}
                      data-priority={priority}
                      onClick={() => handleSelectedPriorityClick(priority)}
                    >
                      {priority}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoPage;
