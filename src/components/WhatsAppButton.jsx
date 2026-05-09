// src/components/WhatsAppButton.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiX, FiSend, FiClock, FiUser } from "react-icons/fi";

const WhatsAppButton = ({
  phoneNumber = "234XXXXXXXXXX", // Update with your WhatsApp number
  message = "Hello! I have a question about your products.",
  position = "right",
  showPopup = true,
  autoOpenDelay = 5000,
  greetingMessage = "Hi there! 👋\nNeed help? Chat with us on WhatsApp.",
  agentName = "Customer Support",
  agentStatus = "online",
  responseTime = "Typically replies within 1 hour",
  size = "large",
  pulseAnimation = true,
  tooltipText = "Chat with us on WhatsApp!",
  customColors = {
    bg: "#25D366",
    hoverBg: "#22c35e",
    text: "#ffffff",
    bubble: "#ffffff",
    bubbleText: "#333333",
  },
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  // Use refs to track the container and button
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const popupRef = useRef(null);

  // Show button with animation on mount
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 500);
  }, []);

  // Auto-open popup
  useEffect(() => {
    if (autoOpenDelay > 0 && showPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, autoOpenDelay);
      return () => clearTimeout(timer);
    }
  }, [autoOpenDelay, showPopup]);

  // Close popup when clicking outside - FIXED VERSION
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Don't close if clicking the main button
      if (buttonRef.current && buttonRef.current.contains(e.target)) {
        return;
      }

      // Don't close if clicking inside the popup
      if (popupRef.current && popupRef.current.contains(e.target)) {
        return;
      }

      // Don't close if clicking inside the container
      if (containerRef.current && containerRef.current.contains(e.target)) {
        return;
      }

      // Otherwise, close the popup
      if (isOpen) {
        setIsOpen(false);
      }
    };

    // Add event listener with a small delay to prevent immediate firing
    if (isOpen) {
      // Use setTimeout to prevent the same click from closing it
      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  // Prevent body scroll when popup is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Toggle popup - FIXED to prevent event bubbling issues
  const handleTogglePopup = (e) => {
    e.stopPropagation(); // Prevent event from bubbling to document
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  // Close popup
  const handleClosePopup = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(false);
  };

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank",
    );
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (userMessage.trim()) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg_${Date.now()}`,
          text: userMessage,
          sender: "user",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      const encodedMessage = encodeURIComponent(userMessage);
      window.open(
        `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
        "_blank",
      );

      setUserMessage("");
    }
  };

  const handleQuickReply = (replyMessage) => {
    const encodedMessage = encodeURIComponent(replyMessage);
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank",
    );
  };

  const positionClasses =
    position === "left" ? "left-4 sm:left-8" : "right-4 sm:right-8";

  const sizeClasses = {
    small: { button: "w-12 h-12", icon: "w-5 h-5" },
    medium: { button: "w-14 h-14", icon: "w-6 h-6" },
    large: { button: "w-16 h-16", icon: "w-8 h-8" },
  };

  const statusColors = {
    online: "bg-green-400",
    away: "bg-yellow-400",
    offline: "bg-gray-400",
  };

  const quickReplies = [
    { id: "quick_reply_1", text: "Hello! I need help" },
    { id: "quick_reply_2", text: "Product inquiry" },
    { id: "quick_reply_3", text: "Order status" },
    { id: "quick_reply_4", text: "Shipping info" },
  ];

  return (
    <div
      ref={containerRef}
      id="whatsapp_widget_container"
      name_id="whatsapp_widget_container"
      className={`fixed bottom-6 sm:bottom-8 ${positionClasses} z-50 transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      }`}
    >
      {/* Chat Popup */}
      {isOpen && (
        <div
          ref={popupRef}
          id="whatsapp_chat_popup"
          name_id="whatsapp_chat_popup"
          className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-slide-up border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            id="whatsapp_chat_header"
            name_id="whatsapp_chat_header"
            className="relative overflow-hidden cursor-pointer"
            style={{ backgroundColor: customColors.bg }}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white" />
            </div>

            <div className="relative p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div
                      id="agent_avatar"
                      name_id="agent_avatar"
                      className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                    >
                      <FiUser className="w-6 h-6 text-white" />
                    </div>
                    <div
                      id="agent_status_indicator"
                      name_id="agent_status_indicator"
                      className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${statusColors[agentStatus]} rounded-full border-2 border-white`}
                    />
                  </div>

                  <div>
                    <h3
                      id="agent_name"
                      name_id="agent_name"
                      className="text-white font-semibold text-sm"
                    >
                      {agentName}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <div
                        className={`w-1.5 h-1.5 ${statusColors[agentStatus]} rounded-full`}
                      />
                      <p
                        id="agent_response_time"
                        name_id="agent_response_time"
                        className="text-white/80 text-xs"
                      >
                        {agentStatus === "online"
                          ? "Online"
                          : agentStatus === "away"
                            ? "Away"
                            : "Offline"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Close Button - FIXED */}
                <button
                  onClick={handleClosePopup}
                  id="close_chat_button"
                  name_id="close_chat_button"
                  className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors z-10"
                  type="button"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Chat Body */}
          <div
            id="whatsapp_chat_body"
            name_id="whatsapp_chat_body"
            className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          >
            {/* Greeting Message */}
            <div
              id="greeting_message"
              name_id="greeting_message"
              className="flex justify-start"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm max-w-[85%]">
                <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line">
                  {greetingMessage}
                </p>
                <div className="flex items-center space-x-1 mt-2 text-xs text-gray-400">
                  <FiClock className="w-3 h-3" />
                  <span>{responseTime}</span>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                id={msg.id}
                name_id={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-2xl px-4 py-2.5 shadow-sm max-w-[85%] ${
                    msg.sender === "user"
                      ? "rounded-tr-none text-white"
                      : "rounded-tl-none bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                  }`}
                  style={
                    msg.sender === "user"
                      ? { backgroundColor: customColors.bg }
                      : {}
                  }
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs mt-1 opacity-70">{msg.time}</p>
                </div>
              </div>
            ))}

            {/* Quick Replies */}
            <div
              id="quick_replies_section"
              name_id="quick_replies_section"
              className="space-y-2"
            >
              <p
                id="quick_replies_label"
                name_id="quick_replies_label"
                className="text-xs text-gray-500 dark:text-gray-400 text-center"
              >
                Quick replies
              </p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply.id}
                    onClick={() => handleQuickReply(reply.text)}
                    id={reply.id}
                    name_id={reply.id}
                    type="button"
                    className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-300 hover:border-green-500 hover:text-green-600 dark:hover:text-green-400 transition-colors shadow-sm"
                  >
                    {reply.text}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Footer */}
          <div
            id="whatsapp_chat_footer"
            name_id="whatsapp_chat_footer"
            className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              onSubmit={handleSendMessage}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                id="whatsapp_message_input"
                name_id="whatsapp_message_input"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white transition-all"
              />
              <button
                type="submit"
                id="send_message_button"
                name_id="send_message_button"
                disabled={!userMessage.trim()}
                className="p-2.5 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: userMessage.trim()
                    ? customColors.bg
                    : "#ccc",
                }}
              >
                <FiSend className="w-5 h-5" />
              </button>
            </form>

            <p
              id="powered_by_text"
              name_id="powered_by_text"
              className="text-center text-xs text-gray-400 mt-3"
            >
              Powered by WhatsApp
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <div className="relative">
        {/* Tooltip */}
        {showTooltip && !isOpen && (
          <div
            id="whatsapp_tooltip"
            name_id="whatsapp_tooltip"
            className="absolute bottom-full right-0 mb-3 bg-gray-900 dark:bg-gray-700 text-white text-sm px-4 py-2 rounded-xl shadow-lg animate-fade-in whitespace-nowrap"
          >
            {tooltipText}
            <div className="absolute top-full right-6 w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45" />
          </div>
        )}

        {/* Main Button - FIXED */}
        <button
          ref={buttonRef}
          onClick={handleTogglePopup}
          onMouseEnter={() => {
            setShowTooltip(true);
          }}
          onMouseLeave={() => {
            setShowTooltip(false);
          }}
          id="whatsapp_main_button"
          name_id="whatsapp_main_button"
          type="button"
          className={`
            ${sizeClasses[size].button}
            rounded-full shadow-2xl flex items-center justify-center
            transition-all duration-300 transform hover:scale-110 active:scale-95
            relative z-10
          `}
          style={{
            backgroundColor: customColors.bg,
            animation: pulseAnimation && !isOpen ? "pulse 2s infinite" : "none",
          }}
          aria-label={isOpen ? "Close chat" : "Open WhatsApp chat"}
        >
          {isOpen ? (
            <FiX className={`${sizeClasses[size].icon} text-white`} />
          ) : (
            <FaWhatsapp className={`${sizeClasses[size].icon} text-white`} />
          )}
        </button>

        {/* Notification Badge */}
        {!isOpen && (
          <div
            id="whatsapp_notification_badge"
            name_id="whatsapp_notification_badge"
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-bounce-in border-2 border-white dark:border-gray-800 z-20"
          >
            <span className="text-[10px] text-white font-bold">1</span>
          </div>
        )}

        {/* Online Indicator Ring */}
        {!isOpen && agentStatus === "online" && (
          <div
            id="whatsapp_online_indicator"
            name_id="whatsapp_online_indicator"
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 z-20"
          />
        )}
      </div>

      {/* Global Styles for Animations */}
      <style>{`
        @keyframes pulse-shadow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
          }
          50% {
            box-shadow: 0 0 0 15px rgba(37, 211, 102, 0);
          }
        }
        
        .animate-pulse-shadow {
          animation: pulse-shadow 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default WhatsAppButton;
