import React, { useState } from 'react';
import { loginUser } from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Đảm bảo bạn có file CSS để style giao diện

const Login = () => {

    const [loading, setLoading] = useState(false);
    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Đăng Nhập</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" name="username" placeholder="Tên đăng nhập" required />
                    <input type="password" name="password" placeholder="Mật khẩu" required />
                    <button type="submit" className="login-button" disabled={loading}>{loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}</button>
                </form>
                <p className="register-link">Chưa có tài khoản? <span>Đăng ký ngay</span></p>
            </div>
        </div>
    );
};

export default Login;
