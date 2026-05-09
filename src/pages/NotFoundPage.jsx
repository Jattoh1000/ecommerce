// src/pages/NotFoundPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiShoppingBag,
  FiArrowLeft,
  FiSearch,
  FiAlertCircle,
  FiCompass,
} from "react-icons/fi";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Quick links for navigation
  const quickLinks = [
    {
      id: "quick_link_home",
      name_id: "quick_link_home",
      label: "Homepage",
      path: "/",
      icon: FiHome,
      description: "Return to homepage",
    },
    {
      id: "quick_link_products",
      name_id: "quick_link_products",
      label: "Products",
      path: "/products",
      icon: FiShoppingBag,
      description: "Browse all products",
    },
    {
      id: "quick_link_categories",
      name_id: "quick_link_categories",
      label: "Categories",
      path: "/categories",
      icon: FiCompass,
      description: "Shop by category",
    },
  ];

  // Suggested pages based on common user intent
  const suggestedPages = [
    { label: "Deals & Offers", path: "/products?sort=discount" },
    { label: "New Arrivals", path: "/products?sort=newest" },
    { label: "Your Cart", path: "/cart" },
    { label: "Contact Us", path: "/contact" },
    { label: "FAQs", path: "/faqs" },
    { label: "Shipping Info", path: "/shipping" },
  ];

  return (
    <div
      id="not_found_page"
      name_id="not_found_page"
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-16"
    >
      <div className="max-w-3xl w-full text-center">
        {/* Error Code */}
        <div className="mb-8 relative">
          <div className="text-[150px] sm:text-[200px] font-black text-gray-100 dark:text-gray-800 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FiAlertCircle className="w-24 h-24 sm:w-32 sm:h-32 text-primary-500 dark:text-primary-400 animate-pulse" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 animate-fade-in">
          <h1
            id="not_found_title"
            name_id="not_found_title"
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Oops! Page Not Found
          </h1>
          <p
            id="not_found_description"
            name_id="not_found_description"
            className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto"
          >
            The page you're looking for doesn't exist or has been moved. Let's
            get you back on track!
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10 animate-slide-up">
          <form onSubmit={handleSearch}>
            <label
              id="not_found_search_label"
              name_id="not_found_search_label"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left"
            >
              Search for products
            </label>
            <div className="relative">
              <input
                id="not_found_search_input"
                name_id="not_found_search_input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full pl-5 pr-12 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-lg shadow-sm"
              />
              <button
                type="submit"
                id="not_found_search_button"
                name_id="not_found_search_button"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FiSearch className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.id}
                to={link.path}
                id={link.id}
                name_id={link.name_id}
                className="group bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {link.label}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {link.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Suggested Pages */}
        <div
          id="suggested_pages_section"
          name_id="suggested_pages_section"
          className="mb-8"
        >
          <h3
            id="suggested_pages_title"
            name_id="suggested_pages_title"
            className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3"
          >
            Popular Pages
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestedPages.map((page, index) => (
              <Link
                key={index}
                to={page.path}
                id={`suggested_link_${index}`}
                name_id={`suggested_link_${index}`}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors shadow-sm"
              >
                {page.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Back Button & Countdown */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            id="go_back_button"
            name_id="go_back_button"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium shadow-sm"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>

          <Link
            to="/"
            id="return_home_button"
            name_id="return_home_button"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors font-medium shadow-md hover:shadow-lg"
          >
            <FiHome className="w-5 h-5" />
            <span>Return Home</span>
          </Link>
        </div>

        {/* Auto-redirect Message */}
        <div className="mt-6 animate-fade-in">
          <p
            id="redirect_countdown"
            name_id="redirect_countdown"
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            Auto-redirecting to homepage in{" "}
            <span className="font-semibold text-primary-600 dark:text-primary-400">
              {countdown}
            </span>{" "}
            seconds...
          </p>
          <div className="w-48 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mt-3 overflow-hidden">
            <div
              id="countdown_progress_bar"
              name_id="countdown_progress_bar"
              className="h-full bg-primary-600 dark:bg-primary-400 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${(countdown / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Help Section */}
        <div
          id="help_section"
          name_id="help_section"
          className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help?{" "}
            <Link
              to="/contact"
              id="contact_support_link"
              name_id="contact_support_link"
              className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              Contact our support team
            </Link>{" "}
            or check our{" "}
            <Link
              to="/faqs"
              id="faqs_link"
              name_id="faqs_link"
              className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              FAQs
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
