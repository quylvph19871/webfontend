import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Register from "./pages/Register";
import Login from "./pages/Login";
import UserList from "./pages/UserList";
import "./App.css";

function AppLayout() {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Các path không hiển thị Sidebar
  const hideSidebarPaths = ["/login", "/register"];
  const shouldShowSidebar = token && !hideSidebarPaths.includes(location.pathname);

  return (
    <div style={{ display: "flex" }}>
      {shouldShowSidebar && <Sidebar />}

      <div
        className="App"
        style={{
          padding: "20px",
          flex: 1,
          marginLeft: shouldShowSidebar ? "220px" : 0,
          transition: "margin-left 0.3s"
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<UserList />} />

        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
