import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

/**
 * Smart POS - Main Layout
 * Wraps all application routes with a persistent Sidebar, Header, and responsive main content area.
 */
export default function MainLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // In future this will trigger authContext.logout()
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-bg-main flex">
      {/* 1. Fixed / Collapsible Sidebar */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* 2. Main Content Wrapper (Shifted right on desktop by 64 = 16rem for sidebar) */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        
        {/* Top Header */}
        <Header onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
