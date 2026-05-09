// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ButtonSpinner } from "../components/LoadingSkeleton";
import toast from "react-hot-toast";
import api from "../services/api";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, subtotal } = useCart();
  const [shippingLocations, setShippingLocations] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    state: "",
    city: "",
    address: "",
    note: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchShippingLocations();
  }, []);

  useEffect(() => {
    if (selectedShipping) {
      const location = shippingLocations.find(
        (loc) => loc.id === selectedShipping,
      );
      setShippingFee(location?.fee || 0);
    }
  }, [selectedShipping, shippingLocations]);

  const fetchShippingLocations = async () => {
    try {
      const res = await api.get("/shipping");
      setShippingLocations(res.data);
    } catch (error) {
      toast.error("Failed to load shipping locations");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!selectedShipping)
      newErrors.shipping = "Please select a shipping location";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const orderData = {
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        },
        shipping_address: {
          full_name: formData.fullName,
          state: formData.state,
          city: formData.city,
          address: formData.address,
          note: formData.note,
        },
        products: cart.map((item) => ({
          product_id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.discount_price || item.price,
        })),
        shipping_method: selectedShipping,
        shipping_fee: shippingFee,
        subtotal: subtotal,
        total: subtotal + shippingFee,
        status: "pending",
        payment_method: "card",
      };

      await api.post("/orders", orderData);

      toast.success("Order placed successfully!", {
        id: "order_success_toast",
        name_id: "order_success_toast",
      });

      navigate("/order-confirmation");
    } catch (error) {
      toast.error("Failed to place order. Please try again.", {
        id: "order_error_toast",
        name_id: "order_error_toast",
      });
    } finally {
      setLoading(false);
    }
  };

  const total = subtotal + shippingFee;

  return (
    <div
      id="checkout_page"
      name_id="checkout_page"
      className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1
          id="checkout_title"
          name_id="checkout_title"
          className="text-3xl font-bold text-gray-900 dark:text-white mb-8"
        >
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Delivery Details */}
            <div className="lg:col-span-2 space-y-6">
              <div
                id="delivery_form_section"
                name_id="delivery_form_section"
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
              >
                <h2
                  id="delivery_details_title"
                  name_id="delivery_details_title"
                  className="text-xl font-bold text-gray-900 dark:text-white mb-4"
                >
                  Delivery Details
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      id="full_name_input"
                      name_id="full_name_input"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white ${
                        errors.fullName
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      id="phone_input"
                      name_id="phone_input"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white ${
                        errors.phone
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      id="email_input"
                      name_id="email_input"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white ${
                        errors.email
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      id="state_input"
                      name_id="state_input"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white ${
                        errors.state
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      id="city_input"
                      name_id="city_input"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white ${
                        errors.city
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      id="address_textarea"
                      name_id="address_textarea"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white ${
                        errors.address
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Additional Note (Optional)
                    </label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      rows="2"
                      id="note_textarea"
                      name_id="note_textarea"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Selector */}
              <div
                id="shipping_selector_section"
                name_id="shipping_selector_section"
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
              >
                <h2
                  id="shipping_method_title"
                  name_id="shipping_method_title"
                  className="text-xl font-bold text-gray-900 dark:text-white mb-4"
                >
                  Shipping Method
                </h2>

                <div className="space-y-3">
                  {shippingLocations.map((location) => (
                    <label
                      key={location.id}
                      id={`shipping_option_${location.id}`}
                      name_id={`shipping_option_${location.id}`}
                      className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedShipping === location.id
                          ? "border-primary-600 bg-primary-50 dark:bg-primary-900"
                          : "border-gray-200 dark:border-gray-600 hover:border-primary-400"
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shipping"
                          value={location.id}
                          checked={selectedShipping === location.id}
                          onChange={(e) => setSelectedShipping(e.target.value)}
                          id={`shipping_radio_${location.id}`}
                          name_id={`shipping_radio_${location.id}`}
                          className="mr-3"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {location.city}, {location.state}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Estimated delivery: {location.estimated_days}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-primary-600 dark:text-primary-400">
                        ₦{location.fee.toLocaleString()}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.shipping && (
                  <p className="text-red-500 text-sm mt-2">{errors.shipping}</p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div
                id="checkout_summary"
                name_id="checkout_summary"
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24"
              >
                <h2
                  id="order_summary_title"
                  name_id="order_summary_title"
                  className="text-xl font-bold text-gray-900 dark:text-white mb-4"
                >
                  Order Summary
                </h2>

                <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                      id={`summary_item_${item.id}`}
                      name_id={`summary_item_${item.id}`}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-600 dark:text-gray-300">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ₦
                        {(
                          (item.discount_price || item.price) * item.quantity
                        ).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t dark:border-gray-700 pt-3 space-y-2">
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span id="subtotal_amount" name_id="subtotal_amount">
                      ₦{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Shipping</span>
                    <span id="shipping_amount" name_id="shipping_amount">
                      {shippingFee > 0
                        ? `₦${shippingFee.toLocaleString()}`
                        : "Select shipping"}
                    </span>
                  </div>
                </div>

                <div className="border-t dark:border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span id="total_amount" name_id="total_amount">
                      ₦{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  id="place_order_button"
                  name_id="place_order_button"
                  className="w-full mt-6 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold flex items-center justify-center transition-colors"
                >
                  {loading ? <ButtonSpinner /> : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
