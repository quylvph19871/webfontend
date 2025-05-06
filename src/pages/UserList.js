import React, { useEffect, useState } from 'react';
import { getUsers } from '../api';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Bạn chưa đăng nhập!");
                navigate('/login');
                return;
            }

            try {
                const res = await getUsers(token);
                setUsers(res.data);
            } catch (error) {
                if (error.response?.status === 401) {
                    alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    setError(error.response?.data?.message || 'Lỗi khi tải dữ liệu');
                }
            }
        };

        fetchUsers();
    }, [navigate]);

    return (
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '10px',
                padding: '20px',
                maxWidth: '900px', // giảm chiều rộng
                margin: '0 auto', // căn giữa
                overflowX: 'auto', // cuộn ngang nếu quá to
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
                    Quản lý người dùng
                </h2>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Tên đăng nhập</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Số điện thoại</th>
                            <th style={styles.th}>Họ và tên</th>
                            <th style={styles.th}>Vai trò</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index} style={{ textAlign: 'center' }}>
                                <td style={styles.td}>{user.username}</td>
                                <td style={styles.td}>{user.email}</td>
                                <td style={styles.td}>{user.phone}</td>
                                <td style={styles.td}>{user.fullname}</td>
                                <td style={styles.td}>{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );


};

const styles = {
    th: {
        padding: '8px',
        borderBottom: '1px solid #ddd',
        backgroundColor: '#f5f5f5',
        fontWeight: 'bold',
        whiteSpace: 'nowrap'
    },
    td: {
        padding: '8px',
        borderBottom: '1px solid #ddd',
        whiteSpace: 'nowrap'
    }
};


export default UserList;
