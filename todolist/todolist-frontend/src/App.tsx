import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Todolist from './Todolist.tsx'
import LoginPage from './components/Login.tsx';

function App() {
  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <Routes>
            {/* Redirect from root to /login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/todolist" element={<Todolist />} />
          </Routes>
        </header>
      </Router>
    </div>
  );
}

export default App;
