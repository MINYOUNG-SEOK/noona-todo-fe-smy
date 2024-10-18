import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TodoBoard from "../components/TodoBoard";
import TodoModal from "../components/TodoModal";
import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../utils/api";
import "./TodoPage.style.css";

const TodoPage = ({ user, setUser }) => {
  const [todoList, setTodoList] = useState([]);
  const [todoValue, setTodoValue] = useState("");
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [hideDone, setHideDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get("/tasks");
      setTodoList(response.data.data);
    } catch (error) {
      console.log("error:", error);
    } finally {
      setLoading(false);
    }
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
          // todoList 상태에서 바로 새 할 일 추가
        setTodoList((prevList) => [...prevList, response.data.data]);
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
          // todoList에서 삭제된 항목만 제거
        setTodoList((prevList) => prevList.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  // 할 일의 완료 상태를 변경하는 함수 : UI에서 완료 상태 업데이트 후 비동기 API 요청으로 백엔드 동기화 처리
  const toggleComplete = async (id) => {
    setTodoList((prevList) =>
      prevList.map((item) =>
        item._id === id ? { ...item, isComplete: !item.isComplete } : item
      )
    );
    try {
      const task = todoList.find((item) => item._id === id);
      await api.put(`/tasks/${id}`, {
        isComplete: !task.isComplete,
      });
    } catch (error) {
      console.log("Error toggling complete status:", error);
    }
  };

  // 모달 열고 닫는 함수
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleFilterPriorityClick = (priority) => {
    if (priority === "All Tasks") {
      setFilterPriority("");
    } else {
      setFilterPriority(priority);
    }
  };

  const filteredTodoList = filterPriority
    ? todoList.filter((item) => item.priority === filterPriority)
    : todoList;

  const finalTodoList = hideDone
    ? filteredTodoList.filter((item) => !item.isComplete)
    : filteredTodoList;

  const resetFilterPriority = () => {
    setFilterPriority("");
  };

  // 로그아웃 함수
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="todo-container">
      <Header
        user={user}
        handleLogout={handleLogout}
        getTasks={getTasks}
        resetFilterPriority={resetFilterPriority}
        resetHideDone={() => setHideDone(false)}
      />
      {loading ? (
        <LoadingSpinner /> 
      ) : (
        <>
          <div className="add-task-button-area">
            <button onClick={toggleModal} className="add-task-button">
              Add Task
            </button>
          </div>
          <div className="content-section">
            <div className="filter-area">
              <div className="priority-filter-list">
                {["All Tasks", "Immediate", "High", "Normal", "Low"].map(
                  (priority) => (
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
                  )
                )}
              </div>

              <div className="hide-done-tasks">
                <input
                  type="checkbox"
                  checked={hideDone}
                  onChange={() => setHideDone(!hideDone)}
                />
                <label>Hide Done Tasks</label>
              </div>
            </div>

            <div className="task-list">
              <TodoBoard
                todoList={finalTodoList}
                deleteItem={deleteItem}
                toggleComplete={toggleComplete}
                getTasks={getTasks}
              />
            </div>
          </div>

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
        </>
      )}
    </div>
  );
};

export default TodoPage;
