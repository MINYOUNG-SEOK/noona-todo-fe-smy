import React, { useState } from "react";
import api from "../utils/api";
import "./RegisterPage.style.css";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secPassword, setSectPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (password !== secPassword) {
        throw new Error("비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
      }
      const response = await api.post("/user", { name, email, password });
      if (response.status === 200) {
        // 로그인 페이지로 이동
        window.location.href = "/login";
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h1>회원가입</h1>

        <div className="form-group">
          <label htmlFor="formName">이름</label>
          <input
            type="text"
            id="formName"
            placeholder="이름을 입력해주세요"
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="formBasicEmail">이메일 주소</label>
          <input
            type="email"
            id="formBasicEmail"
            placeholder="이메일 주소를 입력해주세요"
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="formBasicPassword">비밀번호</label>
          <input
            type="password"
            id="formBasicPassword"
            placeholder="비밀번호를 입력해주세요"
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="formConfirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="formConfirmPassword"
            placeholder="비밀번호를 한번 더 입력해주세요"
            onChange={(event) => setSectPassword(event.target.value)}
            required
          />
        </div>

        {error && <div className="red-error">{error}</div>}

        <button className="button-register" type="submit">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
