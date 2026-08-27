import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  LayoutGrid,
  ChefHat,
  CreditCard,
  UtensilsCrossed,
  Boxes,
  Users,
  BarChart3,
  UserCog,
  Settings,
  User,
  LogOut,
  X,
} from "lucide-react";

/**
 * Smart POS - Navigation Items Configuration
 */
const NAV_ITEMS = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Order Taker", path: "/order-taker", icon: ShoppingBag },
  { name: "Orders", path: "/orders", icon: ClipboardList },
  { name: "Tables", path: "/tables", icon: LayoutGrid },
  { name: "Kitchen / KOT", path: "/kot", icon: ChefHat },
  { name: "Billing", path: "/billing", icon: CreditCard },
  { name: "Menu", path: "/menu", icon: UtensilsCrossed },
  { name: "Inventory", path: "/inventory", icon: Boxes },
  { name: "Customers", path: "/customers", icon: Users },
  { name: "Reports", path: "/reports", icon: BarChart3 },
  { name: "Staff", path: "/staff", icon: UserCog },
];

const BOTTOM_ITEMS = [
  { name: "Settings", path: "/settings", icon: Settings },
  { name: "Profile", path: "/profile", icon: User },
];

/**
 * Smart POS - Sidebar Navigation Component
 * Supports responsive drawer behavior for mobile and fixed full-height for desktop.
 */
export default function Sidebar({ isOpen = false, onClose = () => {}, onLogout }) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      console.log("User logged out");
    }
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all duration-150 select-none group ${
      isActive
        ? "bg-primary text-text-white font-medium shadow-sm shadow-primary/20"
        : "text-text-muted hover:text-text-white hover:bg-white/5 font-normal"
    }`;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-bg-sidebar text-text-white flex flex-col justify-between border-r border-white/10 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* =========================================
            HEADER: LOGO & BRANDING
        ========================================== */}
        <div className="p-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            {/* Golden Restaurant Logo Badge */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-5 h-5 text-slate-950 fill-current"
              >
                <path d="M12 3a1 1 0 0 0-1 1v.08C7.16 4.54 4 7.86 4 12v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-4.14-3.16-7.46-7-7.92V4a1 1 0 0 0-1-1zm-9 13a1 1 0 0 0 0 2h18a1 1 0 1 0 0-2H3zm5-5.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5zm8 0a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5zm-4 0a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5z" />
              </svg>
            </div>

            <div>
              <h1 className="text-base font-bold text-text-white tracking-tight leading-none">
                Smart POS
              </h1>
              <p className="text-[11px] font-medium text-amber-400 tracking-wide mt-1">
                Café & Restaurant
              </p>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-text-muted hover:text-text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =========================================
            NAVIGATION LINKS (SCROLLABLE)
        ========================================== */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={navLinkClasses}
              >
                <Icon className="w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-105" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* =========================================
            BOTTOM SECTION: SETTINGS, PROFILE & LOGOUT
        ========================================== */}
        <div className="p-3 border-t border-white/10 space-y-1 shrink-0 bg-bg-sidebar">
          {BOTTOM_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={navLinkClasses}
              >
                <Icon className="w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-105" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

          {/* Logout Action */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-danger hover:text-text-white hover:bg-danger/20 transition-all duration-150 cursor-pointer group"
          >
            <LogOut className="w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-105" />
            <span className="font-normal group-hover:font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
