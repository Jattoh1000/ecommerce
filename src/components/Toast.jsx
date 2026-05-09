// src/components/Toast.jsx
import React from "react";
import { Toaster } from "react-hot-toast";

const Toast = () => {
  return (
    <Toaster
      id="toaster"
      name_id="toaster"
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#363636",
          color: "#fff",
        },
        success: {
          style: {
            background: "#059669",
          },
        },
        error: {
          style: {
            background: "#DC2626",
          },
        },
      }}
    />
  );
};

export default Toast;
