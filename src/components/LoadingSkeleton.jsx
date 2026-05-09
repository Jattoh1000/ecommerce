// src/components/LoadingSkeleton.jsx
import React from "react";

export const ProductSkeleton = () => (
  <div
    id="product_skeleton"
    name_id="product_skeleton"
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

export const PageLoader = () => (
  <div
    id="page_loader"
    name_id="page_loader"
    className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center"
  >
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 mx-auto mb-4" />
      <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
        Loading...
      </p>
    </div>
  </div>
);

export const ButtonSpinner = () => (
  <svg
    id="button_spinner"
    name_id="button_spinner"
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);
