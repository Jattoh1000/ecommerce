// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import NotFoundPage from "./pages/NotFoundPage";

// Admin Pages
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import AdminCategories from "./admin/AdminCategories";
import AdminOrders from "./admin/AdminOrders";

// Components
import Toast from "./components/Toast";

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <MainLayout>
                    <HomePage />
                  </MainLayout>
                }
              />
              <Route
                path="/products"
                element={
                  <MainLayout>
                    <ProductsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/products/:slug"
                element={
                  <MainLayout>
                    <ProductDetailPage />
                  </MainLayout>
                }
              />
              <Route
                path="/cart"
                element={
                  <MainLayout>
                    <CartPage />
                  </MainLayout>
                }
              />
              <Route
                path="/checkout"
                element={
                  <MainLayout>
                    <CheckoutPage />
                  </MainLayout>
                }
              />
              <Route
                path="/order-confirmation"
                element={
                  <MainLayout>
                    <OrderConfirmation />
                  </MainLayout>
                }
              />

              <Route
                path="/admin"
                element={
                  <MainLayout>
                    <OrderConfirmation />
                  </MainLayout>
                }
              />

              {/* Admin Routes - Fixed: Using nested routes with Outlet */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders" element={<AdminOrders />} />
              </Route>

              {/* 404 - Must be the last route */}
              <Route
                path="*"
                element={
                  <MainLayout>
                    <NotFoundPage />
                  </MainLayout>
                }
              />
            </Routes>

            <Toast />
          </div>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
