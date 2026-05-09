// src/admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPackage, FiShoppingBag, FiGrid, FiDollarSign } from "react-icons/fi";
import api from "../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCategories: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, ordersRes, categoriesRes] = await Promise.all([
        api.get("/products"),
        api.get("/orders"),
        api.get("/categories"),
      ]);

      const products = productsRes.data;
      const orders = ordersRes.data;

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalCategories: categoriesRes.data.length,
        totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      id: "total_products_stat",
      name_id: "total_products_stat",
      label: "Total Products",
      value: stats.totalProducts,
      icon: FiPackage,
      color: "bg-blue-500",
      link: "/admin/products",
    },
    {
      id: "total_orders_stat",
      name_id: "total_orders_stat",
      label: "Total Orders",
      value: stats.totalOrders,
      icon: FiShoppingBag,
      color: "bg-green-500",
      link: "/admin/orders",
    },
    {
      id: "total_categories_stat",
      name_id: "total_categories_stat",
      label: "Categories",
      value: stats.totalCategories,
      icon: FiGrid,
      color: "bg-purple-500",
      link: "/admin/categories",
    },
    {
      id: "total_revenue_stat",
      name_id: "total_revenue_stat",
      label: "Total Revenue",
      value: `₦${stats.totalRevenue.toLocaleString()}`,
      icon: FiDollarSign,
      color: "bg-yellow-500",
      link: null,
    },
  ];

  return (
    <div
      id="admin_dashboard"
      name_id="admin_dashboard"
      className="min-h-screen bg-gray-100 dark:bg-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1
          id="admin_dashboard_title"
          name_id="admin_dashboard_title"
          className="text-3xl font-bold text-gray-900 dark:text-white mb-8"
        >
          Admin Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <div
              key={stat.id}
              id={stat.id}
              name_id={stat.name_id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                {stat.link && (
                  <Link
                    to={stat.link}
                    id={`view_${stat.id}_link`}
                    name_id={`view_${stat.id}_link`}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    View All
                  </Link>
                )}
              </div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {stat.label}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div
          id="recent_orders_section"
          name_id="recent_orders_section"
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2
              id="recent_orders_title"
              name_id="recent_orders_title"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              Recent Orders
            </h2>
            <Link
              to="/admin/orders"
              id="view_all_orders_link"
              name_id="view_all_orders_link"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table
              id="recent_orders_table"
              name_id="recent_orders_table"
              className="w-full"
            >
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    id={`order_row_${order.id}`}
                    name_id={`order_row_${order.id}`}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-3 px-4 text-primary-600 dark:text-primary-400 font-medium">
                      {order.order_number}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {order.customer.name}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      ₦{order.total.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "processing"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-sm">
                      {order.created_at}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
