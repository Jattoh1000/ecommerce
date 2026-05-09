// src/pages/CartPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";

const CartPage = () => {
  const { cart, cartCount, subtotal, removeFromCart, updateQuantity } =
    useCart();

  if (cart.length === 0) {
    return (
      <div
        id="empty_cart_container"
        name_id="empty_cart_container"
        className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"
      >
        <div className="text-center">
          <FiShoppingCart className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2
            id="empty_cart_title"
            name_id="empty_cart_title"
            className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-2"
          >
            Your cart is empty
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Add some products to get started!
          </p>
          <Link
            to="/products"
            id="continue_shopping_link"
            name_id="continue_shopping_link"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      id="cart_page"
      name_id="cart_page"
      className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1
          id="cart_title"
          name_id="cart_title"
          className="text-3xl font-bold text-gray-900 dark:text-white mb-8"
        >
          Shopping Cart ({cartCount} items)
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                id={`cart_item_${item.id}`}
                name_id={`cart_item_${item.id}`}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex items-center space-x-4 animate-fade-in"
              >
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {item.name}
                  </h3>

                  <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    {item.selectedColor !== "Default" && (
                      <p>Color: {item.selectedColor}</p>
                    )}
                    {item.selectedSize !== "Standard" && (
                      <p>Size: {item.selectedSize}</p>
                    )}
                  </div>

                  <p className="text-primary-600 dark:text-primary-400 font-bold mt-2">
                    ₦
                    {(
                      (item.discount_price || item.price) * item.quantity
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    id={`cart_decrease_${item.id}`}
                    name_id={`cart_decrease_${item.id}`}
                    className="p-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiMinus className="w-4 h-4" />
                  </button>

                  <span
                    id={`cart_quantity_${item.id}`}
                    name_id={`cart_quantity_${item.id}`}
                    className="w-8 text-center font-semibold text-gray-900 dark:text-white"
                  >
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    id={`cart_increase_${item.id}`}
                    name_id={`cart_increase_${item.id}`}
                    className="p-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  id={`cart_remove_${item.id}`}
                  name_id={`cart_remove_${item.id}`}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div
              id="order_summary"
              name_id="order_summary"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24"
            >
              <h2
                id="order_summary_title"
                name_id="order_summary_title"
                className="text-xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Shipping</span>
                  <span className="text-green-600">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 pt-3 mb-6">
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                id="proceed_to_checkout_button"
                name_id="proceed_to_checkout_button"
                className="block w-full bg-primary-600 hover:bg-primary-700 text-white text-center py-3 rounded-lg font-bold transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
