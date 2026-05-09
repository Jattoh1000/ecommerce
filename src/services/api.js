// src/services/api.js
import axios from "axios";
import {
  products,
  categories,
  banners,
  shippingLocations,
  orders,
  reviews,
  notifications,
  users,
} from "../data/data";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock axios instance
const mockAxios = async (config) => {
  await delay(500); // Simulate network delay

  const { method, url, data } = config;

  // GET requests
  if (method === "get") {
    if (url === "/products") return { data: products };
    if (url === "/categories") return { data: categories };
    if (url === "/banners") return { data: banners };
    if (url === "/shipping") return { data: shippingLocations };
    if (url === "/orders") return { data: orders };
    if (url === "/reviews") return { data: reviews };
    if (url === "/notifications") return { data: notifications };
    if (url === "/users") return { data: users };

    // Get single product
    if (url.startsWith("/products/")) {
      const id = url.split("/")[2];
      const product = products.find((p) => p.id === id);
      return { data: product };
    }
  }

  // POST requests
  if (method === "post") {
    if (url === "/products") {
      const newProduct = {
        ...data,
        id: `product_${Date.now()}`,
        name_id: `product_${Date.now()}`,
      };
      products.push(newProduct);
      return { data: newProduct };
    }
    if (url === "/categories") {
      const newCategory = {
        ...data,
        id: `cat_${Date.now()}`,
        name_id: `cat_${Date.now()}`,
      };
      categories.push(newCategory);
      return { data: newCategory };
    }
    if (url === "/orders") {
      const newOrder = {
        ...data,
        id: `order_${Date.now()}`,
        name_id: `order_${Date.now()}`,
        order_number: `ORD-${Date.now()}`,
      };
      orders.push(newOrder);
      return { data: newOrder };
    }
  }

  // PUT requests
  if (method === "put") {
    if (url.startsWith("/products/")) {
      const id = url.split("/")[2];
      const index = products.findIndex((p) => p.id === id);
      if (index !== -1) {
        products[index] = { ...products[index], ...data };
        return { data: products[index] };
      }
    }
    if (url.startsWith("/categories/")) {
      const id = url.split("/")[2];
      const index = categories.findIndex((c) => c.id === id);
      if (index !== -1) {
        categories[index] = { ...categories[index], ...data };
        return { data: categories[index] };
      }
    }
    if (url.startsWith("/orders/")) {
      const id = url.split("/")[2];
      const index = orders.findIndex((o) => o.id === id);
      if (index !== -1) {
        orders[index] = { ...orders[index], ...data };
        return { data: orders[index] };
      }
    }
  }

  // DELETE requests
  if (method === "delete") {
    if (url.startsWith("/products/")) {
      const id = url.split("/")[2];
      const index = products.findIndex((p) => p.id === id);
      if (index !== -1) {
        products.splice(index, 1);
        return { data: { success: true } };
      }
    }
  }

  throw new Error("Not found");
};

// Create axios-like instance
const api = {
  get: (url) => mockAxios({ method: "get", url }),
  post: (url, data) => mockAxios({ method: "post", url, data }),
  put: (url, data) => mockAxios({ method: "put", url, data }),
  delete: (url) => mockAxios({ method: "delete", url }),
};

export default api;
