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

// Lấy sản phẩm theo danh mục
export const getProductsByCategory = (categoryId, token) => {
    return axios.get(`/products/category/${categoryId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Thêm sản phẩm
export const createProduct = async (productData, token) => {
    try {
        const response = await axios.post("/products/addProducts", productData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'  // Content-Type là 'application/json' nếu bạn gửi JSON
            }
        });
        return response.data; // Trả về dữ liệu phản hồi từ server
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error.response ? error.response.data : error.message);
        throw error;  // Ném lỗi ra ngoài để xử lý ở nơi gọi hàm
    }
};


// Cập nhật sản phẩm
export const updateProduct = async (id, productData, token) => {
    try {
        const response = await axios.put(`/products/updateProducts/${id}`, productData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'  // Content-Type là 'application/json' nếu bạn gửi JSON
            }
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật sản phẩm:', error.response ? error.response.data : error.message);
        throw error;
    }
};

