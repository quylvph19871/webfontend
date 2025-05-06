import React, { useState } from 'react';
import { loginUser } from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await loginUser(form);
            console.log('Login response:', res);

            const { token, user } = res.data;

            if (user?.role === 'admin') {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                alert('Đăng nhập thành công!');
                navigate('/users');
            } else {
                setError('Bạn không có quyền truy cập!');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'Sai tài khoản hoặc mật khẩu!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Đăng Nhập</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" name="username" placeholder="Tên đăng nhập" value={form.username} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Mật khẩu" value={form.password} onChange={handleChange} required />
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                    </button>
                </form>
                <p className="register-link">
                    Chưa có tài khoản? <span onClick={() => navigate('/register')}>Đăng ký ngay</span>
                </p>
            </div>
        </div>
    );
};

export default Login;
