// api.js

import api from "./axiosClient";

export const getOrders = (filters) => {
  return api.get("/order/getAll", {
    params: filters,
  });
};
export const updateOrderStatus = (orderId, status) => {
  return api.put(`/order/update/${orderId}`, { status });
};

export const getDetail = (orderId) => {
  return api.get(`/order/getDetail/${orderId}`);
};
