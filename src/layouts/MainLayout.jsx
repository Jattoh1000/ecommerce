// src/layouts/MainLayout.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

const MainLayout = ({ children }) => {
  return (
    <div
      id="main_layout"
      name_id="main_layout"
      className="min-h-screen bg-white dark:bg-gray-900 flex flex-col"
    >
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default MainLayout;
