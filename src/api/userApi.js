import api from './axiosClient';

// Lấy danh sách người dùng
export const getUsers = async () => {
  return await api.get('/users/list');
};
