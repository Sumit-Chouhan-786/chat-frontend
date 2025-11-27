import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./component/LoginForm";
import ChatUi from "./component/ChatUi";
import type { User } from "./types";
import RegisterForm from "./component/RegisterForm ";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("chatUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem("chatUser", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("chatUser");
  };

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterForm onRegister={handleLogin} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    );
  }

return (
  <BrowserRouter>
    <Routes>
      <Route path="/chat" element={<ChatUi currentUser={user} onLogout={handleLogout} />} />
      <Route path="*" element={<Navigate to="/chat" />} />
    </Routes>
  </BrowserRouter>
);

};

export default App;
