// src/pages/OrderConfirmationPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiPackage,
  FiTruck,
  FiClock,
  FiMapPin,
  FiPhone,
  FiMail,
  FiUser,
  FiShoppingBag,
  FiDownload,
  FiShare2,
  FiPrinter,
  FiCopy,
  FiArrowRight,
  FiHome,
} from "react-icons/fi";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    // Simulate fetching order details
    fetchOrderDetails();

    // Clear cart after successful order
    clearCart();
  }, []);

  const fetchOrderDetails = async () => {
    // Simulate API call delay
    setTimeout(() => {
      const mockOrder = {
        id: "order_confirmation_1",
        name_id: "order_confirmation_1",
        order_number: `ORD-${new Date().getFullYear()}${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
        order_date: new Date().toISOString(),
        estimated_delivery: new Date(
          Date.now() + 5 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        status: "confirmed",
        payment_method: "card",
        customer: {
          name: "John Doe",
          email: "john@example.com",
          phone: "+2348012345678",
        },
        shipping_address: {
          full_name: "John Doe",
          address: "123 Main Street, Ikoyi",
          city: "Lagos",
          state: "Lagos",
          note: "Please leave at reception",
        },
        items: [
          {
            id: "order_item_1",
            name_id: "order_item_1",
            name: "Premium Wireless Headphones",
            quantity: 1,
            price: 35000,
            image:
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100",
          },
          {
            id: "order_item_2",
            name_id: "order_item_2",
            name: "Slim Fit Casual Shirt",
            quantity: 2,
            price: 9999,
            image:
              "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100",
          },
        ],
        subtotal: 54998,
        shipping_fee: 3000,
        tax: 0,
        discount: 0,
        total: 57998,
        shipping_method: "Standard Delivery",
        tracking_number:
          "TRK-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      };

      setOrderDetails(mockOrder);
      setLoading(false);
      startAutoRedirect();
    }, 2000);
  };

  const startAutoRedirect = () => {
    const timer = 30; // 30 seconds countdown
    setCountdown(timer);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  };

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(orderDetails.order_number);
    toast.success("Order number copied!", {
      id: "copy_order_toast",
      name_id: "copy_order_toast",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Order Confirmation",
          text: `Order ${orderDetails.order_number} confirmed!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      toast.success("Link copied to clipboard!", {
        id: "share_toast",
        name_id: "share_toast",
      });
    }
  };

  if (loading) {
    return (
      <div
        id="order_loading"
        name_id="order_loading"
        className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Confirming your order...
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Please wait while we process your order.
          </p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            No order found
          </h2>
          <Link
            to="/"
            id="return_home_from_error"
            name_id="return_home_from_error"
            className="text-primary-600 hover:text-primary-700 mt-4 inline-block"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  // Timeline steps
  const timelineSteps = [
    {
      id: "timeline_confirmed",
      name_id: "timeline_confirmed",
      icon: FiCheckCircle,
      label: "Order Confirmed",
      date: new Date(orderDetails.order_date).toLocaleString(),
      completed: true,
      active: true,
    },
    {
      id: "timeline_processing",
      name_id: "timeline_processing",
      icon: FiPackage,
      label: "Processing",
      date: "In progress",
      completed: false,
      active: true,
    },
    {
      id: "timeline_shipped",
      name_id: "timeline_shipped",
      icon: FiTruck,
      label: "Shipped",
      date: "Pending",
      completed: false,
      active: false,
    },
    {
      id: "timeline_delivered",
      name_id: "timeline_delivered",
      icon: FiCheckCircle,
      label: "Delivered",
      date: new Date(orderDetails.estimated_delivery).toLocaleDateString(
        "en-US",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      ),
      completed: false,
      active: false,
    },
  ];

  return (
    <div
      id="order_confirmation_page"
      name_id="order_confirmation_page"
      className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8 animate-bounce-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <FiCheckCircle className="w-10 h-10 text-green-500 dark:text-green-400" />
          </div>
          <h1
            id="order_success_title"
            name_id="order_success_title"
            className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
          >
            Order Confirmed!
          </h1>
          <p
            id="order_success_message"
            name_id="order_success_message"
            className="text-lg text-gray-600 dark:text-gray-300"
          >
            Thank you for your purchase. Your order has been placed
            successfully.
          </p>
        </div>

        {/* Order Number & Actions */}
        <div
          id="order_number_card"
          name_id="order_number_card"
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 animate-slide-up"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Order Number
              </p>
              <div className="flex items-center space-x-3">
                <h2
                  id="order_number_display"
                  name_id="order_number_display"
                  className="text-2xl font-bold text-gray-900 dark:text-white font-mono"
                >
                  {orderDetails.order_number}
                </h2>
                <button
                  onClick={handleCopyOrderNumber}
                  id="copy_order_button"
                  name_id="copy_order_button"
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                  title="Copy order number"
                >
                  <FiCopy className="w-5 h-5" />
                </button>
              </div>
              {orderDetails.tracking_number && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Tracking: {orderDetails.tracking_number}
                </p>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handlePrint}
                id="print_order_button"
                name_id="print_order_button"
                className="p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title="Print order"
              >
                <FiPrinter className="w-5 h-5" />
              </button>
              <button
                onClick={handleShare}
                id="share_order_button"
                name_id="share_order_button"
                className="p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title="Share order"
              >
                <FiShare2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  /* Download invoice logic */
                }}
                id="download_invoice_button"
                name_id="download_invoice_button"
                className="p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                title="Download invoice"
              >
                <FiDownload className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div
          id="order_timeline"
          name_id="order_timeline"
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6"
        >
          <h3
            id="timeline_title"
            name_id="timeline_title"
            className="text-lg font-semibold text-gray-900 dark:text-white mb-6"
          >
            Order Progress
          </h3>
          <div className="relative">
            {timelineSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  id={step.id}
                  name_id={step.name_id}
                  className={`flex items-start mb-6 last:mb-0 ${
                    step.completed
                      ? "opacity-100"
                      : step.active
                        ? "opacity-100"
                        : "opacity-60"
                  }`}
                >
                  {/* Timeline Icon */}
                  <div className="relative flex flex-col items-center mr-4">
                    <div
                      className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 z-10
                      ${
                        step.completed
                          ? "bg-green-500 border-green-500 text-white"
                          : step.active
                            ? "bg-primary-600 border-primary-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400"
                      }
                    `}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {index < timelineSteps.length - 1 && (
                      <div
                        className={`
                        w-0.5 h-full absolute top-10 left-1/2 -translate-x-1/2
                        ${step.completed ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"}
                      `}
                      />
                    )}
                  </div>

                  {/* Timeline Content */}
                  <div className="flex-1 pt-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {step.label}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {step.date}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer & Shipping Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Customer Details */}
          <div
            id="customer_details_card"
            name_id="customer_details_card"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
          >
            <h3
              id="customer_details_title"
              name_id="customer_details_title"
              className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2"
            >
              <FiUser className="w-5 h-5 text-primary-500" />
              <span>Customer Details</span>
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {orderDetails.customer.name}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <FiMail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {orderDetails.customer.email}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <FiPhone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {orderDetails.customer.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div
            id="shipping_address_card"
            name_id="shipping_address_card"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
          >
            <h3
              id="shipping_address_title"
              name_id="shipping_address_title"
              className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2"
            >
              <FiMapPin className="w-5 h-5 text-primary-500" />
              <span>Shipping Address</span>
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Recipient
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {orderDetails.shipping_address.full_name}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Address
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {orderDetails.shipping_address.address}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  City / State
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {orderDetails.shipping_address.city},{" "}
                  {orderDetails.shipping_address.state}
                </p>
              </div>
              {orderDetails.shipping_address.note && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Note
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                    "{orderDetails.shipping_address.note}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div
          id="order_items_card"
          name_id="order_items_card"
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6"
        >
          <h3
            id="order_items_title"
            name_id="order_items_title"
            className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2"
          >
            <FiShoppingBag className="w-5 h-5 text-primary-500" />
            <span>Order Items</span>
          </h3>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {orderDetails.items.map((item) => (
              <div
                key={item.id}
                id={item.id}
                name_id={item.name_id}
                className="flex items-center py-4 first:pt-0 last:pb-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                />
                <div className="flex-1 ml-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ₦{item.price.toLocaleString()} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div
          id="order_summary_card"
          name_id="order_summary_card"
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6"
        >
          <h3
            id="order_summary_title"
            name_id="order_summary_title"
            className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
          >
            Order Summary
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Subtotal
              </span>
              <span className="text-sm text-gray-900 dark:text-white font-medium">
                ₦{orderDetails.subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Shipping
              </span>
              <span className="text-sm text-gray-900 dark:text-white font-medium">
                {orderDetails.shipping_fee > 0
                  ? `₦${orderDetails.shipping_fee.toLocaleString()}`
                  : "Free"}
              </span>
            </div>

            {orderDetails.tax > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Tax
                </span>
                <span className="text-sm text-gray-900 dark:text-white font-medium">
                  ₦{orderDetails.tax.toLocaleString()}
                </span>
              </div>
            )}

            {orderDetails.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-green-500">Discount</span>
                <span className="text-sm text-green-500 font-medium">
                  -₦{orderDetails.discount.toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex justify-between pt-3 border-t dark:border-gray-700">
              <span className="text-base font-semibold text-gray-900 dark:text-white">
                Total
              </span>
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                ₦{orderDetails.total.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between pt-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Payment Method
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                {orderDetails.payment_method}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div
          id="delivery_info_card"
          name_id="delivery_info_card"
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6"
        >
          <div className="flex items-start space-x-4">
            <FiTruck className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3
                id="delivery_info_title"
                name_id="delivery_info_title"
                className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2"
              >
                Estimated Delivery
              </h3>
              <p className="text-blue-700 dark:text-blue-400">
                Your order will be delivered by{" "}
                <strong>
                  {new Date(orderDetails.estimated_delivery).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </strong>
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-500 mt-1">
                You will receive a notification when your order ships.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            to="/products"
            id="continue_shopping_button"
            name_id="continue_shopping_button"
            className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-md hover:shadow-lg"
          >
            <FiShoppingBag className="w-5 h-5" />
            <span>Continue Shopping</span>
          </Link>

          <Link
            to="/"
            id="back_to_home_button"
            name_id="back_to_home_button"
            className="inline-flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
          >
            <FiHome className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Auto-redirect */}
        {countdown !== null && (
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You will be redirected to the homepage in{" "}
              <span className="font-semibold text-primary-600 dark:text-primary-400">
                {countdown}
              </span>{" "}
              seconds
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
