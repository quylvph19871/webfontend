import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css'; // hoặc dùng Tailwind

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>FShort Hello</h2>
            <nav>
                <NavLink to="/" end>Dashboard</NavLink>

            </nav>
        </div>
    );
};

export default Sidebar;
