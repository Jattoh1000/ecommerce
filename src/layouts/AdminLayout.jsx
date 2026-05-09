// src/layouts/AdminLayout.jsx
import React, { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import AdminSidebar from "../admin/components/AdminSidebar";
import {
  FiBell,
  FiSearch,
  FiMenu,
  FiExternalLink,
  FiChevronDown,
} from "react-icons/fi";

const AdminLayout = () => {
  const location = useLocation();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Get current page title dynamically
  const getPageTitle = () => {
    const path = location.pathname;

    if (path === "/admin") return "Dashboard";
    if (path.includes("/admin/products")) return "Products Management";
    if (path.includes("/admin/categories")) return "Categories Management";
    if (path.includes("/admin/orders")) return "Orders Management";
    if (path.includes("/admin/customers")) return "Customers Management";
    if (path.includes("/admin/analytics")) return "Analytics";
    if (path.includes("/admin/settings")) return "Settings";

    return "Admin Panel";
  };

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === "/admin") return "Dashboard";
    return `Home / ${getPageTitle()}`;
  };

  return (
    <div
      id="admin_layout"
      name_id="admin_layout"
      className="flex min-h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden"
    >
      {/* Sidebar - Hidden on mobile, shown on desktop */}
      <div className="hidden lg:block flex-shrink-0 fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-20">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar is handled inside AdminSidebar component */}

      {/* Main Content Area */}
      <div
        id="admin_main_content"
        name_id="admin_main_content"
        className="flex-1 flex flex-col min-w-0 w-full lg:w-auto lg:pl-[22%]"
      >
        {/* Top Header Bar */}
        <header
          id="admin_top_header"
          name_id="admin_top_header"
          className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30"
        >
          <div className="px-3 sm:px-4 lg:px-6 py-3">
            {/* First Row - Always visible */}
            <div className="flex items-center justify-between gap-3">
              {/* Left side - Title & Breadcrumb */}
              <div className="flex-1 min-w-0">
                <h2
                  id="admin_page_title"
                  name_id="admin_page_title"
                  className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white truncate"
                >
                  {getPageTitle()}
                </h2>
                <p
                  id="admin_breadcrumb"
                  name_id="admin_breadcrumb"
                  className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 hidden sm:block"
                >
                  {getBreadcrumb()}
                </p>
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
                {/* Search Icon - Mobile */}
                <button
                  onClick={() => setShowMobileSearch(!showMobileSearch)}
                  id="mobile_search_toggle"
                  name_id="mobile_search_toggle"
                  className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Toggle search"
                >
                  <FiSearch className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Search Bar - Desktop */}
                <div className="hidden lg:block">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="admin_header_search"
                      name_id="admin_header_search"
                      type="text"
                      placeholder="Search anything..."
                      className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm w-48 xl:w-64 transition-all"
                    />
                  </div>
                </div>

                {/* Search Bar - Tablet */}
                <div className="hidden sm:block lg:hidden">
                  <input
                    id="admin_header_search_tablet"
                    name_id="admin_header_search_tablet"
                    type="text"
                    placeholder="Search..."
                    className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm w-32 md:w-40 transition-all"
                  />
                </div>

                {/* Notification Bell */}
                <button
                  id="admin_notification_button"
                  name_id="admin_notification_button"
                  className="relative p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                  title="Notifications"
                >
                  <FiBell className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span
                    id="notification_badge"
                    name_id="notification_badge"
                    className="absolute top-1 right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"
                  />
                </button>

                {/* View Store Link - Hidden on smallest screens */}
                <Link
                  to="/"
                  id="view_store_link"
                  name_id="view_store_link"
                  target="_blank"
                  className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs sm:text-sm font-medium flex-shrink-0"
                >
                  <FiExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">View Store</span>
                </Link>

                {/* User Menu */}
                <div className="relative flex-shrink-0">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    id="user_menu_button"
                    name_id="user_menu_button"
                    className="flex items-center gap-2 p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div
                      id="admin_header_avatar"
                      name_id="admin_header_avatar"
                      className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
                    >
                      <span className="text-xs sm:text-sm font-bold text-white">
                        A
                      </span>
                    </div>
                    <div className="hidden xl:block text-left">
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                        Admin User
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 leading-tight">
                        Super Admin
                      </p>
                    </div>
                    <FiChevronDown className="hidden sm:block w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      {/* Backdrop for mobile */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      />

                      <div
                        id="user_dropdown_menu"
                        name_id="user_dropdown_menu"
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 animate-fade-in"
                      >
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 xl:hidden">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            Admin User
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Super Admin
                          </p>
                        </div>
                        <button
                          id="profile_button"
                          name_id="profile_button"
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Profile
                        </button>
                        <button
                          id="settings_button"
                          name_id="settings_button"
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Settings
                        </button>
                        <Link
                          to="/"
                          id="view_store_dropdown"
                          name_id="view_store_dropdown"
                          target="_blank"
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 md:hidden"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FiExternalLink className="w-3 h-3" />
                          View Store
                        </Link>
                        <hr className="border-gray-200 dark:border-gray-700 my-1" />
                        <button
                          id="logout_button"
                          name_id="logout_button"
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Search Bar - Expandable */}
            {showMobileSearch && (
              <div className="mt-3 lg:hidden animate-slide-down">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="admin_header_search_mobile"
                    name_id="admin_header_search_mobile"
                    type="text"
                    placeholder="Search anything..."
                    autoFocus
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm transition-all"
                    onBlur={() => setShowMobileSearch(false)}
                  />
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main
          id="admin_page_content"
          name_id="admin_page_content"
          className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 lg:p-6"
        >
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation (Quick Actions) */}
        <nav
          id="mobile_bottom_nav"
          name_id="mobile_bottom_nav"
          className="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-2 py-2 flex items-center justify-around fixed bottom-0 left-0 right-0 z-30"
        >
          <Link
            to="/admin"
            id="mobile_nav_dashboard"
            name_id="mobile_nav_dashboard"
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
              location.pathname === "/admin"
                ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-[10px] font-medium">Home</span>
          </Link>

          <Link
            to="/admin/products"
            id="mobile_nav_products"
            name_id="mobile_nav_products"
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
              location.pathname.includes("/admin/products")
                ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <span className="text-[10px] font-medium">Products</span>
          </Link>

          <Link
            to="/admin/orders"
            id="mobile_nav_orders"
            name_id="mobile_nav_orders"
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
              location.pathname.includes("/admin/orders")
                ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span className="text-[10px] font-medium">Orders</span>
          </Link>

          <Link
            to="/admin/categories"
            id="mobile_nav_categories"
            name_id="mobile_nav_categories"
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
              location.pathname.includes("/admin/categories")
                ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span className="text-[10px] font-medium">Categories</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default AdminLayout;
