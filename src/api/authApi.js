import api from './axiosClient';


// Đăng nhập
export const loginUser = async (userData) => {
  const res = await api.post('/users/login', userData);
  if (res.data.accessToken && res.data.refreshToken) {
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('refreshToken', res.data.refreshToken);
  }
  return res;
};


