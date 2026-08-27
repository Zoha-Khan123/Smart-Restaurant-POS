import React from "react";
import { Menu, Bell } from "lucide-react";
import { useLocation } from "react-router-dom";

// Route title mapping for breadcrumbs
const PAGE_TITLES = {
  "/dashboard": "Dashboard Overview",
  "/order-taker": "Order Taker (POS)",
  "/orders": "Orders History",
  "/tables": "Table Management",
  "/kot": "Kitchen Order Tickets (KOT)",
  "/billing": "Billing & Payments",
  "/menu": "Menu Management",
  "/inventory": "Inventory & Stock",
  "/customers": "Customer Directory",
  "/reports": "Reports & Analytics",
  "/staff": "Staff Management",
  "/settings": "System Settings",
  "/profile": "Admin Profile",
};

/**
 * Smart POS - Main Header / Topbar Component
 */
export default function Header({ onOpenMobileSidebar }) {
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] || "Smart POS";

  return (
    <header className="sticky top-0 z-30 h-16 bg-bg-card border-b border-border px-4 sm:px-6 flex items-center justify-between shadow-xs">
      
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-text-primary leading-tight">
            {pageTitle}
          </h2>
          <p className="hidden sm:block text-[11px] text-text-muted">
            Smart Café & Restaurant Management System
          </p>
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* Notification Bell */}
        <button
          type="button"
          className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-bg-card" />
        </button>

        <div className="h-6 w-px bg-border hidden sm:block" />

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-purple flex items-center justify-center text-text-white font-semibold text-xs shadow-sm">
            ZK
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-text-primary leading-tight">
              Zoha Khan
            </p>
            <p className="text-[10px] text-success font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
              Admin (Online)
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}
