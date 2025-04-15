import api from './axiosClient';

// Đăng ký người dùng
export const registerUser = async (userData) => {
  return await api.post('/users/register', userData);
};

// Đăng nhập
export const loginUser = async (userData) => {
  const res = await api.post('/users/login', userData);
  if (res.data.accessToken && res.data.refreshToken) {
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('refreshToken', res.data.refreshToken);
  }
  return res;
};


