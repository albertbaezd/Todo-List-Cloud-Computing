import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Todolist from "./Todolist.tsx";
import LoginPage from "./components/Login.tsx";
import RegisterPage from "./components/Register.tsx";

function App() {
  const [user_id, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (newUsername: string) => {
    setUsername(newUsername);
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
  };

  const handleUserIdChange = (newUserId: string) => {
    setUserId(newUserId);
  };

  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <Routes>
            {/* Redirect from root to /login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route
              path="/login"
              element={
                <LoginPage
                  username={username}
                  password={password}
                  onUsernameChange={handleUsernameChange}
                  onPasswordChange={handlePasswordChange}
                  onUserIdChange={handleUserIdChange}
                />
              }
            />
            <Route
              path="/todolist/:user_id"
              element={<Todolist user_id={user_id} username={username} />}
            />
            {/* Add the Register route here */}
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </header>
      </Router>
    </div>
  );
}

export default App;
