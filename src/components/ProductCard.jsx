// src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const ProductCard = ({ product, loading = false }) => {
  const { addToCart } = useCart();

  if (loading) {
    return (
      <div
        id="product_card_skeleton"
        name_id="product_card_skeleton"
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse"
      >
        <div className="h-48 bg-gray-200 dark:bg-gray-700" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div
      id={`product_card_${product.id}`}
      name_id={`product_card_${product.id}`}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group animate-fade-in"
    >
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <Link to={`/products/${product.slug}`}>
          <img
            id={`product_image_${product.id}`}
            name_id={`product_image_${product.id}`}
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </Link>

        {/* Discount Badge */}
        {product.discount_price && (
          <div
            id={`discount_badge_${product.id}`}
            name_id={`discount_badge_${product.id}`}
            className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold"
          >
            -
            {Math.round(
              ((product.price - product.discount_price) / product.price) * 100,
            )}
            %
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            id={`wishlist_button_${product.id}`}
            name_id={`wishlist_button_${product.id}`}
            className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
          >
            <FiHeart className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-red-500" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-1">
          {product.category}
        </div>

        <Link to={`/products/${product.slug}`}>
          <h3
            id={`product_name_${product.id}`}
            name_id={`product_name_${product.id}`}
            className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2"
          >
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className="w-4 h-4 text-yellow-400" />
          ))}
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
            ({product.rating})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            {product.discount_price ? (
              <>
                <span
                  id={`discount_price_${product.id}`}
                  name_id={`discount_price_${product.id}`}
                  className="text-xl font-bold text-gray-900 dark:text-white"
                >
                  ₦{product.discount_price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 line-through ml-2">
                  ₦{product.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                ₦{product.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => addToCart(product)}
          id={`add_to_cart_button_${product.id}`}
          name_id={`add_to_cart_button_${product.id}`}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all hover:shadow-lg active:scale-95"
        >
          <FiShoppingCart className="w-5 h-5" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
