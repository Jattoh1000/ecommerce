// src/components/Footer.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleNewsletter = (e) => {
    e.preventDefault();
    toast.success("Subscribed to newsletter!", {
      id: "newsletter_toast",
      name_id: "newsletter_toast",
    });
    setEmail("");
  };

  return (
    <footer
      id="footer"
      name_id="footer"
      className="bg-gray-900 dark:bg-gray-950 text-white mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3
              id="footer_brand"
              name_id="footer_brand"
              className="text-2xl font-bold text-primary-400 mb-4"
            >
              ShopHub
            </h3>
            <p className="text-gray-400 mb-4">
              Your one-stop shop for everything you need. Quality products at
              the best prices.
            </p>
            <div className="flex space-x-4">
              {["Facebook", "Twitter", "Instagram"].map((social) => (
                <a
                  key={social}
                  href="#"
                  id={`social_link_${social.toLowerCase()}`}
                  name_id={`social_link_${social.toLowerCase()}`}
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              id="quick_links_title"
              name_id="quick_links_title"
              className="text-lg font-semibold mb-4"
            >
              Quick Links
            </h4>
            <ul className="space-y-2">
              {["Home", "Products", "Categories", "Deals"].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase()}`}
                    id={`footer_link_${link.toLowerCase()}`}
                    name_id={`footer_link_${link.toLowerCase()}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4
              id="customer_service_title"
              name_id="customer_service_title"
              className="text-lg font-semibold mb-4"
            >
              Customer Service
            </h4>
            <ul className="space-y-2">
              {["Contact Us", "FAQs", "Shipping Info", "Returns"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to={`/${item.toLowerCase().replace(" ", "-")}`}
                      id={`service_link_${item.toLowerCase().replace(" ", "_")}`}
                      name_id={`service_link_${item.toLowerCase().replace(" ", "_")}`}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4
              id="newsletter_title"
              name_id="newsletter_title"
              className="text-lg font-semibold mb-4"
            >
              Newsletter
            </h4>
            <p className="text-gray-400 mb-4">
              Subscribe to get special offers and updates.
            </p>
            <form onSubmit={handleNewsletter} className="flex">
              <input
                id="newsletter_email_input"
                name_id="newsletter_email_input"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-2 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                id="newsletter_subscribe_button"
                name_id="newsletter_subscribe_button"
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 rounded-r-lg font-semibold transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2024 ShopHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
