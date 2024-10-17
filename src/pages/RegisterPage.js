import React, { useState } from "react";
import api from "../utils/api";
import "./RegisterPage.style.css";
import LoadingSpinner from "../components/LoadingSpinner";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secPassword, setSectPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); 
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
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="register-page-container">
       {loading ? (
      <LoadingSpinner /> 
    ) : (
      <form className="register-page-form" onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <p>Get started by creating your new account</p>

        <div className="register-form-group">
          <label htmlFor="formName"></label>
          <input
            type="text"
            id="formName"
            placeholder="Full Name"
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="register-form-group">
          <label htmlFor="formBasicEmail"></label>
          <input
            type="email"
            id="formBasicEmail"
            placeholder="Email Address"
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="register-form-group">
          <label htmlFor="formBasicPassword"></label>
          <input
            type="password"
            id="formBasicPassword"
            placeholder="Password"
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <div className="register-form-group">
          <label htmlFor="formConfirmPassword"></label>
          <input
            type="password"
            id="formConfirmPassword"
            placeholder="Confirm Password"
            onChange={(event) => setSectPassword(event.target.value)}
            required
          />
        </div>

        {error && <div className="register-error-message">{error}</div>}

        <button className="register-button" type="submit">
          Register
        </button>
      </form>
    )}
    </div>
  
  );
};

export default RegisterPage;
