import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface LoginPageProps {
  username: string;
  password: string;
  onUsernameChange: (username: string) => void;
  onPasswordChange: (password: string) => void;
}

function LoginPage({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
}: LoginPageProps) {
  const navigate = useNavigate();
  const [error, setError] = React.useState<string>("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/login`,
        { username, password }
      );
      if (response.status === 200) {
        // Redirect to Todolist page
        navigate("/todolist");
      }
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.error || "Login failed");
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
