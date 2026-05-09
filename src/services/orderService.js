// src/services/orderService.js
import api from "./api";

export const orderService = {
  getAllOrders: () => api.get("/orders"),
  getOrderById: (id) => api.get(`/orders/${id}`),
  createOrder: (orderData) => api.post("/orders", orderData),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}`, { status }),
};
