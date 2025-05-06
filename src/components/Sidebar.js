import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css'; // hoặc dùng Tailwind

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>FShort Hello</h2>
            <nav>
                <NavLink to="/" end>Dashboard</NavLink>
                <NavLink to="/products">Quản lý sản phẩm</NavLink>
                <NavLink to="/users">Quản lý người dùng</NavLink>
                <NavLink to="/orders">Quản lý đơn hàng</NavLink>
                <NavLink to="/stats">Thống kê</NavLink>
                <NavLink to="/stats">Nhắn Tin</NavLink>

            </nav>
        </div>
    );
};

export default Sidebar;
