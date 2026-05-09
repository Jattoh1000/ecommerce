// src/admin/AdminOrders.jsx
import React, { useState, useEffect } from "react";
import {
  FiEye,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiPackage,
  FiMapPin,
  FiPhone,
  FiMail,
  FiPrinter,
  FiDownload,
} from "react-icons/fi";
import AdminTable from "./components/AdminTable";
import Modal from "../components/Modal";
import { ButtonSpinner } from "../components/LoadingSkeleton";
import { orderService } from "../services/orderService";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchQuery, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getAllOrders();
      let data = res.data;

      // Apply search filter
      if (searchQuery) {
        data = data.filter(
          (order) =>
            order.order_number
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            order.customer?.name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            order.customer?.email
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()),
        );
      }

      // Apply status filter
      if (statusFilter !== "all") {
        data = data.filter((order) => order.status === statusFilter);
      }

      // Sort by date (newest first)
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      // Paginate
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

      setOrders(paginatedData);
      setTotalOrders(data.length);
      setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
    } catch (error) {
      toast.error("Failed to load orders", {
        id: "orders_error_toast",
        name_id: "orders_error_toast",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`, {
        id: "order_status_update",
        name_id: "order_status_update",
      });
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      toast.error("Failed to update order status", {
        id: "order_status_error",
        name_id: "order_status_error",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      processing:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      shipped:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      delivered:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: FiClock,
      processing: FiPackage,
      shipped: FiTruck,
      delivered: FiCheckCircle,
      cancelled: FiXCircle,
    };
    return icons[status] || FiClock;
  };

  // Table Columns
  const columns = [
    {
      key: "order_number",
      label: "Order ID",
      sortable: true,
      render: (value) => (
        <span className="text-sm font-mono font-semibold text-primary-600 dark:text-primary-400">
          {value}
        </span>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      sortable: true,
      render: (value) => (
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {value?.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {value?.email}
          </p>
        </div>
      ),
    },
    {
      key: "products",
      label: "Items",
      sortable: false,
      render: (value) => (
        <div>
          <p className="text-sm text-gray-900 dark:text-white font-medium">
            {value?.length || 0} item(s)
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
            {value?.map((p) => p.name).join(", ")}
          </p>
        </div>
      ),
    },
    {
      key: "total",
      label: "Total",
      sortable: true,
      render: (value) => (
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          ₦{value?.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value) => {
        const StatusIcon = getStatusIcon(value);
        return (
          <span
            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(value)}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            <span className="capitalize">{value}</span>
          </span>
        );
      },
    },
    {
      key: "created_at",
      label: "Date",
      sortable: true,
      render: (value) => (
        <div>
          <p className="text-sm text-gray-900 dark:text-white">
            {new Date(value).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(value).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      ),
    },
    {
      key: "payment_method",
      label: "Payment",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
          {value || "N/A"}
        </span>
      ),
    },
  ];

  // Status Filter Buttons
  const statusFilters = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div id="admin_orders_page" name_id="admin_orders_page" className="p-6">
      {/* Page Header */}
      <div id="page_header" name_id="page_header" className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              id="page_title"
              name_id="page_title"
              className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
            >
              Orders Management
            </h1>
            <p
              id="page_description"
              name_id="page_description"
              className="text-gray-500 dark:text-gray-400"
            >
              Track and manage customer orders, update statuses, and process
              shipments.
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              id="export_orders_button"
              name_id="export_orders_button"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              id="print_orders_button"
              name_id="print_orders_button"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
            >
              <FiPrinter className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            id: "total_orders_stat",
            name_id: "total_orders_stat",
            label: "Total Orders",
            value: totalOrders,
            icon: FiShoppingBag,
            color: "bg-blue-500",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
          },
          {
            id: "total_revenue_stat",
            name_id: "total_revenue_stat",
            label: "Total Revenue",
            value: `₦${orders.reduce((sum, order) => sum + (order.total || 0), 0).toLocaleString()}`,
            icon: FiDollarSign,
            color: "bg-green-500",
            bgColor: "bg-green-50 dark:bg-green-900/20",
          },
          {
            id: "pending_orders_stat",
            name_id: "pending_orders_stat",
            label: "Pending Orders",
            value: orders.filter((o) => o.status === "pending").length,
            icon: FiClock,
            color: "bg-yellow-500",
            bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
          },
          {
            id: "delivered_orders_stat",
            name_id: "delivered_orders_stat",
            label: "Delivered Today",
            value: orders.filter((o) => o.status === "delivered").length,
            icon: FiCheckCircle,
            color: "bg-purple-500",
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
          },
        ].map((stat) => (
          <div
            key={stat.id}
            id={stat.id}
            name_id={stat.name_id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex items-center space-x-4 hover:shadow-lg transition-shadow"
          >
            <div className={`${stat.bgColor} p-3 rounded-xl`}>
              <stat.icon
                className={`w-5 h-5 ${stat.color.replace("bg-", "text-")}`}
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Status Filter Tabs */}
      <div
        id="order_status_filters"
        name_id="order_status_filters"
        className="mb-6 flex flex-wrap gap-2"
      >
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => {
              setStatusFilter(filter.value);
              setCurrentPage(1);
            }}
            id={`filter_${filter.value}`}
            name_id={`filter_${filter.value}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === filter.value
                ? "bg-primary-600 text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <AdminTable
        title="All Orders"
        columns={columns}
        data={orders}
        loading={loading}
        totalItems={totalOrders}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onSearch={handleSearch}
        onView={handleViewOrder}
        searchable={true}
        sortable={true}
        selectable={true}
        exportable={true}
        itemsPerPage={ITEMS_PER_PAGE}
        emptyMessage="No orders found"
        actions={true}
      />

      {/* Order Details Modal */}
      <Modal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        title={`Order #${selectedOrder?.order_number}`}
        size="xl"
      >
        {selectedOrder && (
          <div
            id="order_details_modal"
            name_id="order_details_modal"
            className="space-y-6"
          >
            {/* Order Status & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Status:
                </span>
                <span
                  className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}
                >
                  {React.createElement(getStatusIcon(selectedOrder.status), {
                    className: "w-4 h-4",
                  })}
                  <span className="capitalize">{selectedOrder.status}</span>
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  "pending",
                  "processing",
                  "shipped",
                  "delivered",
                  "cancelled",
                ].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                    disabled={updatingStatus || selectedOrder.status === status}
                    id={`update_status_${status}_button`}
                    name_id={`update_status_${status}_button`}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      selectedOrder.status === status
                        ? getStatusColor(status) + " cursor-default"
                        : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {updatingStatus
                      ? "..."
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer & Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Details */}
              <div
                id="customer_details_card"
                name_id="customer_details_card"
                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"
              >
                <h3
                  id="customer_details_title"
                  name_id="customer_details_title"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3 flex items-center space-x-2"
                >
                  <FiUsers className="w-4 h-4" />
                  <span>Customer Details</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Name:
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedOrder.customer?.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiMail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {selectedOrder.customer?.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiPhone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {selectedOrder.customer?.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Details */}
              <div
                id="shipping_details_card"
                name_id="shipping_details_card"
                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"
              >
                <h3
                  id="shipping_details_title"
                  name_id="shipping_details_title"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3 flex items-center space-x-2"
                >
                  <FiMapPin className="w-4 h-4" />
                  <span>Shipping Address</span>
                </h3>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedOrder.shipping_address?.full_name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedOrder.shipping_address?.address}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedOrder.shipping_address?.city},{" "}
                    {selectedOrder.shipping_address?.state}
                  </p>
                  {selectedOrder.shipping_address?.note && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-2">
                      Note: {selectedOrder.shipping_address.note}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3
                id="order_items_title"
                name_id="order_items_title"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3"
              >
                Order Items
              </h3>
              <div className="border dark:border-gray-700 rounded-xl overflow-hidden">
                <table
                  id="order_items_table"
                  name_id="order_items_table"
                  className="w-full"
                >
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        Product
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        Quantity
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        Price
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {selectedOrder.products?.map((product, index) => (
                      <tr key={`${product.product_id}_${index}`}>
                        <td className="py-3 px-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.name}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {product.quantity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            ₦{product.price?.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            ₦
                            {(
                              product.price * product.quantity
                            )?.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div
              id="order_summary_card"
              name_id="order_summary_card"
              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"
            >
              <h3
                id="order_summary_title"
                name_id="order_summary_title"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3"
              >
                Order Summary
              </h3>
              <div className="space-y-2 max-w-xs ml-auto">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Subtotal
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white font-medium">
                    ₦{selectedOrder.subtotal?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Shipping
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white font-medium">
                    ₦{selectedOrder.shipping_fee?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t dark:border-gray-600">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Total
                  </span>
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    ₦{selectedOrder.total?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Payment Method:
                </span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">
                  {selectedOrder.payment_method || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Order Date:
                </span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {new Date(selectedOrder.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
              <button
                onClick={() => setShowOrderModal(false)}
                id="close_order_modal_button"
                name_id="close_order_modal_button"
                className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                id="print_order_button"
                name_id="print_order_button"
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <FiPrinter className="w-4 h-4" />
                <span>Print Order</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrders;
