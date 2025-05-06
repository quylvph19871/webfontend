import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css'; // hoặc dùng Tailwind

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>FSport Hello</h2>
            <nav>
                <NavLink to="/dashboard">Quản lý doanh thu</NavLink>
                <NavLink to="/products">Quản lý sản phẩm</NavLink>
                <NavLink to="/topSaling">Top sản phẩm bán chạy</NavLink>
                <NavLink to="/users">Quản lý người dùng</NavLink>
                <NavLink to="/orders">Quản lý đơn hàng</NavLink>
                <NavLink to="/chat">Nhắn tin</NavLink>

            </nav>
        </div>
    );
};

export default Sidebar;
