// src/api/productApi.js
import axios from './axiosClient';  // Đảm bảo file này có tồn tại và hoạt động

// Lấy danh sách sản phẩm
export const getAllProducts = (token, is_active = null) => {
    const url = is_active !== null
        ? `/products/AdminGetProduct?is_active=${is_active}`
        : "/products/AdminGetProduct";

    return axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};


