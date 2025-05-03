// api.js

import api from "./axiosClient";

export const getOrders = (filters) => {
  return api.get("/order/getAll", {
    params: filters,
  });
};
