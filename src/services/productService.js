// src/services/productService.js
import api from "./api";

export const productService = {
  getAllProducts: () => api.get("/products"),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (productData) => api.post("/products", productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  getProductsByCategory: (category) =>
    api.get(`/products?category=${category}`),
  getFeaturedProducts: () => api.get("/products?featured=true"),
};
