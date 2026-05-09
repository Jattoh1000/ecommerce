// src/admin/components/AdminSidebar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiPackage,
  FiGrid,
  FiShoppingBag,
  FiTrendingUp,
  FiUsers,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
  FiMenu,
  FiX,
  FiTag,
  FiTruck,
  FiBarChart2,
  FiBell,
  FiMail,
} from "react-icons/fi";

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      id: "admin_nav_dashboard",
      name_id: "admin_nav_dashboard",
      label: "Dashboard",
      path: "/admin",
      icon: FiHome,
      badge: null,
    },
    {
      id: "admin_nav_analytics",
      name_id: "admin_nav_analytics",
      label: "Analytics",
      path: "/admin/analytics",
      icon: FiTrendingUp,
      badge: null,
    },
    {
      id: "admin_nav_products",
      name_id: "admin_nav_products",
      label: "Products",
      path: "/admin/products",
      icon: FiPackage,
      badge: "156",
    },
    {
      id: "admin_nav_categories",
      name_id: "admin_nav_categories",
      label: "Categories",
      path: "/admin/categories",
      icon: FiGrid,
      badge: null,
    },
    {
      id: "admin_nav_orders",
      name_id: "admin_nav_orders",
      label: "Orders",
      path: "/admin/orders",
      icon: FiShoppingBag,
      badge: "12",
    },
    {
      id: "admin_nav_customers",
      name_id: "admin_nav_customers",
      label: "Customers",
      path: "/admin/customers",
      icon: FiUsers,
      badge: null,
    },
    {
      id: "admin_nav_inventory",
      name_id: "admin_nav_inventory",
      label: "Inventory",
      path: "/admin/inventory",
      icon: FiTag,
      badge: null,
    },
    {
      id: "admin_nav_shipping",
      name_id: "admin_nav_shipping",
      label: "Shipping",
      path: "/admin/shipping",
      icon: FiTruck,
      badge: null,
    },
    {
      id: "admin_nav_messages",
      name_id: "admin_nav_messages",
      label: "Messages",
      path: "/admin/messages",
      icon: FiMail,
      badge: "3",
    },
    {
      id: "admin_nav_notifications",
      name_id: "admin_nav_notifications",
      label: "Notifications",
      path: "/admin/notifications",
      icon: FiBell,
      badge: "5",
    },
    {
      id: "admin_nav_settings",
      name_id: "admin_nav_settings",
      label: "Settings",
      path: "/admin/settings",
      icon: FiSettings,
      badge: null,
    },
  ];

  // Mobile overlay
  const MobileOverlay = () => (
    <div
      id="sidebar_mobile_overlay"
      name_id="sidebar_mobile_overlay"
      className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      onClick={() => setIsMobileOpen(false)}
    />
  );

  // Toggle button for mobile
  const MobileToggle = () => (
    <button
      onClick={() => setIsMobileOpen(!isMobileOpen)}
      id="mobile_sidebar_toggle"
      name_id="mobile_sidebar_toggle"
      className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {isMobileOpen ? (
        <FiX className="w-6 h-6" />
      ) : (
        <FiMenu className="w-6 h-6" />
      )}
    </button>
  );

  return (
    <>
      <MobileToggle />

      {/* Mobile Overlay */}
      {isMobileOpen && <MobileOverlay />}

      {/* Sidebar */}
      <aside
        id="admin_sidebar"
        name_id="admin_sidebar"
        className={`
          fixed top-0 left-0 h-screen z-50
          bg-white dark:bg-gray-800 
          border-r border-gray-200 dark:border-gray-700
          transition-all duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-20" : "w-72"}
          flex flex-col
        `}
      >
        {/* Logo Section */}
        <div
          id="sidebar_header"
          name_id="sidebar_header"
          className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
        >
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div
                id="sidebar_logo_icon"
                name_id="sidebar_logo_icon"
                className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center"
              >
                <FiPackage className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  id="sidebar_brand_name"
                  name_id="sidebar_brand_name"
                  className="text-xl font-bold text-gray-900 dark:text-white"
                >
                  ShopHub
                </h1>
                <p
                  id="sidebar_brand_label"
                  name_id="sidebar_brand_label"
                  className="text-xs text-gray-500 dark:text-gray-400"
                >
                  Admin Panel
                </p>
              </div>
            </div>
          )}

          {/* Collapse Toggle (Desktop) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            id="sidebar_collapse_toggle"
            name_id="sidebar_collapse_toggle"
            className="hidden lg:block p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <FiChevronRight className="w-5 h-5" />
            ) : (
              <FiChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* User Profile Section */}
        {!isCollapsed && (
          <div
            id="sidebar_user_profile"
            name_id="sidebar_user_profile"
            className="p-4 border-b border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3">
              <div
                id="sidebar_user_avatar"
                name_id="sidebar_user_avatar"
                className="w-12 h-12 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <span className="text-lg font-bold text-white">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p
                  id="sidebar_user_name"
                  name_id="sidebar_user_name"
                  className="text-sm font-semibold text-gray-900 dark:text-white truncate"
                >
                  Admin User
                </p>
                <p
                  id="sidebar_user_role"
                  name_id="sidebar_user_role"
                  className="text-xs text-gray-500 dark:text-gray-400 truncate"
                >
                  Super Admin
                </p>
              </div>
              <div
                id="sidebar_user_status"
                name_id="sidebar_user_status"
                className="w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex-shrink-0"
                title="Online"
              />
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav
          id="sidebar_navigation"
          name_id="sidebar_navigation"
          className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin"
        >
          {!isCollapsed && (
            <p
              id="sidebar_menu_label"
              name_id="sidebar_menu_label"
              className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
            >
              Main Menu
            </p>
          )}

          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                to={item.path}
                id={item.id}
                name_id={item.name_id}
                className={`
                  flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative
                  ${
                    isActive
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
                  }
                `}
                title={isCollapsed ? item.label : ""}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-primary-600 dark:text-primary-400" : ""}`}
                  />
                  {item.badge && isCollapsed && (
                    <span
                      id={`${item.id}_badge_indicator`}
                      name_id={`${item.id}_badge_indicator`}
                      className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                    />
                  )}
                </div>

                {!isCollapsed && (
                  <>
                    <span className="ml-3 flex-1">{item.label}</span>
                    {item.badge && (
                      <span
                        id={`${item.id}_badge`}
                        name_id={`${item.id}_badge`}
                        className="px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <div
                        id={`${item.id}_active_indicator`}
                        name_id={`${item.id}_active_indicator`}
                        className="absolute right-3 w-1.5 h-8 bg-primary-600 dark:bg-primary-400 rounded-full"
                      />
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div
          id="sidebar_footer"
          name_id="sidebar_footer"
          className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-2"
        >
          {/* Storage Info */}
          {!isCollapsed && (
            <div
              id="sidebar_storage_info"
              name_id="sidebar_storage_info"
              className="px-3 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Storage
                </span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  68%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  id="sidebar_storage_bar"
                  name_id="sidebar_storage_bar"
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: "68%" }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                13.5 GB of 20 GB used
              </p>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={() => {
              // Handle logout logic here
              console.log("Logout clicked");
            }}
            id="sidebar_logout_button"
            name_id="sidebar_logout_button"
            className={`
              flex items-center w-full px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200
              ${isCollapsed ? "justify-center" : ""}
            `}
            title="Logout"
          >
            <FiLogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>

        {/* Collapsed State Brand Logo */}
        {isCollapsed && (
          <div
            id="sidebar_collapsed_brand"
            name_id="sidebar_collapsed_brand"
            className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-center"
          >
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <FiPackage className="w-6 h-6 text-white" />
            </div>
          </div>
        )}
      </aside>

      {/* Spacer for fixed sidebar on desktop */}
      {!isMobileOpen && (
        <div
          id="sidebar_spacer"
          name_id="sidebar_spacer"
          className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${
            isCollapsed ? "w-20" : "w-72"
          }`}
        />
      )}
    </>
  );
};

export default AdminSidebar;
