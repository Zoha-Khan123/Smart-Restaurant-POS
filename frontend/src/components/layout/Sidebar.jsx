import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  Users,
  CreditCard,
  Layers,
  Receipt,
  BarChart3,
  Bell,
  ShieldAlert,
  Settings,
  LifeBuoy,
  User,
  LogOut,
  X,
  Shield,
} from "lucide-react";

/**
 * Super Admin Navigation Items Configuration
 */
const NAV_ITEMS = [
  { name: "Dashboard", path: "/super-admin/dashboard", icon: LayoutDashboard },
  { name: "Restaurants", path: "/super-admin/restaurants", icon: Store },
  { name: "Users", path: "/super-admin/users", icon: Users },
  { name: "Subscriptions", path: "/super-admin/subscriptions", icon: CreditCard },
  { name: "Subscription Plans", path: "/super-admin/subscription-plans", icon: Layers },
  { name: "Payments & Invoices", path: "/super-admin/payments", icon: Receipt },
  { name: "Reports & Analytics", path: "/super-admin/reports", icon: BarChart3 },
  { name: "Notifications", path: "/super-admin/notifications", icon: Bell, badge: "3" },
  { name: "Audit Logs", path: "/super-admin/audit-logs", icon: ShieldAlert },
];

const BOTTOM_ITEMS = [
  { name: "Settings", path: "/super-admin/settings", icon: Settings },
  { name: "Support", path: "/super-admin/support", icon: LifeBuoy },
  { name: "Profile", path: "/super-admin/profile", icon: User },
];

/**
 * Super Admin - Sidebar Navigation Component
 * Matches the exact styling, dimensions, active/hover states, and responsive behavior of the Restaurant Admin sidebar.
 */
export default function Sidebar({ isOpen = false, onClose = () => {}, onLogout }) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      console.log("Super Admin logged out");
    }
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-all duration-150 select-none group ${
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
            HEADER: LOGO & SUPER ADMIN BRANDING
        ========================================== */}
        <div className="p-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            {/* Super Admin Shield/Crown Badge */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple flex items-center justify-center shadow-md shadow-primary/30 shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold text-text-white tracking-tight leading-none">
                  Smart POS
                </h1>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-primary/30 text-primary-light border border-primary/40">
                  Super
                </span>
              </div>
              <p className="text-[11px] font-medium text-amber-400 tracking-wide mt-1">
                Platform Admin
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
          <div className="px-3.5 pb-2 text-[10px] font-bold text-text-muted/70 uppercase tracking-wider">
            Main Menu
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={navLinkClasses}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-105" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-danger/80 text-white leading-none">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* =========================================
            BOTTOM SECTION: SETTINGS, SUPPORT, PROFILE & LOGOUT
        ========================================== */}
        <div className="p-3 border-t border-white/10 space-y-1 shrink-0 bg-bg-sidebar">
          <div className="px-3.5 pb-1 text-[10px] font-bold text-text-muted/70 uppercase tracking-wider">
            System
          </div>
          {BOTTOM_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={navLinkClasses}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-105" />
                  <span>{item.name}</span>
                </div>
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
