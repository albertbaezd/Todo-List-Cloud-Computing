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

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (newUsername: string) => {
    setUsername(newUsername);
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
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
                />
              }
            />
            <Route path="/todolist" element={<Todolist />} />
          </Routes>
        </header>
      </Router>
    </div>
  );
}

export default App;
