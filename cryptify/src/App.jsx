// src/App.jsx
// Root entry point.
// Controls which "page" (Auth or Dashboard) is shown.
// Holds registeredUsers in state so AuthPage can read them at login time.

import { useState } from "react";
import AuthPage  from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import "./index.css";

export default function App() {
  // Currently logged-in user  (null = show Auth)
  const [user, setUser] = useState(null);

  // All users who registered during this session
  // (persists across tab switches inside AuthPage)
  const [registeredUsers, setRegisteredUsers] = useState([]);

  const handleRegister = (newUser) => {
    setRegisteredUsers(prev => [...prev, newUser]);
  };

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return (
      <AuthPage
        registeredUsers={registeredUsers}
        onRegister={handleRegister}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      onLogout={handleLogout}
    />
  );
}
