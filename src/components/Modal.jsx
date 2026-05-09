// src/components/Modal.jsx
import React from "react";
import { FiX } from "react-icons/fi";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div
      id="modal_overlay"
      name_id="modal_overlay"
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          id="modal_backdrop"
          name_id="modal_backdrop"
          className="fixed inset-0 bg-black opacity-50"
          onClick={onClose}
        />

        <div
          id="modal_container"
          name_id="modal_container"
          className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-xl ${sizeClasses[size]} w-full animate-fade-in`}
        >
          <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
            <h3
              id="modal_title"
              name_id="modal_title"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              id="modal_close_button"
              name_id="modal_close_button"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
