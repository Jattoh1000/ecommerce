// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import {
  FiShoppingCart,
  FiUser,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const Navbar = () => {
  const { cartCount } = useCart();
  const { darkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  return (
    <>
      <nav
        id="navbar"
        name_id="navbar"
        className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/"
                id="logo_link"
                name_id="logo_link"
                className="text-2xl font-bold text-primary-600 dark:text-primary-400"
              >
                ShopHub
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden sm:flex flex-1 max-w-lg mx-8 items-center">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <input
                    id="search_input"
                    name_id="search_input"
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                  />
                  <button
                    type="submit"
                    id="search_button"
                    name_id="search_button"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-primary-500"
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                id="theme_toggle_button"
                name_id="theme_toggle_button"
                className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {darkMode ? (
                  <FiSun className="w-5 h-5" />
                ) : (
                  <FiMoon className="w-5 h-5" />
                )}
              </button>

              {/* Cart Icon */}
              <Link
                to="/cart"
                id="cart_icon_link"
                name_id="cart_icon_link"
                className="relative text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <FiShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span
                    id="cart_count_badge"
                    name_id="cart_count_badge"
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce-in"
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Icon */}
              <Link
                to="/account"
                id="user_icon_link"
                name_id="user_icon_link"
                className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <FiUser className="w-6 h-6" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                id="mobile_menu_button"
                name_id="mobile_menu_button"
                className="sm:hidden text-gray-600 dark:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          {isMenuOpen && (
            <div className="sm:hidden pb-4 animate-slide-down">
              <form onSubmit={handleSearch}>
                <input
                  id="mobile_search_input"
                  name_id="mobile_search_input"
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                />
              </form>
            </div>
          )}
        </div>
      </nav>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/234XXXXXXXXXX"
        target="_blank"
        rel="noopener noreferrer"
        id="whatsapp_floating_button"
        name_id="whatsapp_floating_button"
        className="fixed bottom-8 right-8 z-50 bg-whatsapp hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-lg transform hover:scale-110 transition-all duration-300 animate-bounce-in group"
      >
        <FaWhatsapp className="w-8 h-8" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chat with us
        </span>
      </a>
    </>
  );
};

export default Navbar;
