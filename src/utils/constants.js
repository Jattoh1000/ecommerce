// src/utils/constants.js
export const WHATSAPP_NUMBER = "234XXXXXXXXXX"; // Update with actual number

export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

export const PAYMENT_METHODS = {
  CARD: "card",
  TRANSFER: "transfer",
  CASH: "cash",
};

export const ITEMS_PER_PAGE = 8;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];
