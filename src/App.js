import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TodoPage from "./pages/TodoPage";
import RegisterPage from "./pages/RegisterPage";
import PrivateRoute from "./route/PrivateRoute";
import api from "./utils/api";
import Header from "./components/Header";

function App() {
  const [user, setUser] = useState(null);

  // 토큰을 통해 유저 정보 가져오기
  const getUser = async () => {
    try {
      const storedToken = sessionStorage.getItem("token");
      if (storedToken) {
        const response = await api.get("/user/me");
        setUser(response.data.user);
      }
    } catch (error) {
      setUser(null);
    }
  };

  // 로그아웃 함수
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
    Navigate('/login"');
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      <Header user={user} handleLogout={handleLogout} />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute user={user}>
                <TodoPage />
              </PrivateRoute>
            }
          />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/login"
            element={<LoginPage user={user} setUser={setUser} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
