// src/api/categoryApi.js
import axios from './axiosClient';

export const getCategories = (token) => {
    return axios.get('/categories/listCategories', {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const createCategory = (name, token) => {
    return axios.post('/categories/createCategory', { name }, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

