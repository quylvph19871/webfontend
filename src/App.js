import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Register from "./pages/Register";
import Login from "./pages/Login";
import UserList from "./pages/UserList";
import ProductList from "./pages/ProductList";
import ProductCreate from "./pages/ProductCreate";
import ProductEdit from "./pages/ProductEdit";
import "./App.css";

function AppLayout() {


  return (
    <div style={{ display: "flex" }}>

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
