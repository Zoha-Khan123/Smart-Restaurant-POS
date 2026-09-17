import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  Bell,
  ChevronDown,
  User,
  Settings,
  ShieldAlert,
  LogOut,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { INITIAL_NOTIFICATIONS_DATA } from "../../data/notifications";

// Route title mapping for breadcrumbs & header
const PAGE_TITLES = {
  "/super-admin/dashboard": "Dashboard Overview",
  "/dashboard": "Dashboard Overview",
  "/super-admin/restaurants": "Restaurant Management",
  "/restaurants": "Restaurant Management",
  "/super-admin/users": "Users Management",
  "/users": "Users Management",
  "/super-admin/subscriptions": "Tenant Subscriptions",
  "/super-admin/subscription-plans": "Subscription Plans & Pricing",
  "/super-admin/payments": "Payments & Invoices",
  "/super-admin/reports": "System Reports & Analytics",
  "/super-admin/notifications": "Notifications Center",
  "/super-admin/audit-logs": "System Audit & Security Logs",
  "/super-admin/settings": "Platform Settings",
  "/super-admin/support": "Customer Support & Tickets",
  "/super-admin/profile": "Super Admin Profile",
};

/**
 * Super Admin Top Header Component
 * Recreates the exact styling and aesthetics from Restaurant Admin while adding Super Admin capabilities.
 */
export default function Header({ onOpenMobileSidebar, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Dynamic Title (matches exact route or details route)
  const pageTitle =
    PAGE_TITLES[location.pathname] ||
    (location.pathname.includes("/restaurants/")
      ? "Restaurant Details"
      : "Dashboard Overview");

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [headerNotifications, setHeaderNotifications] = useState(INITIAL_NOTIFICATIONS_DATA);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Unread notifications count
  const unreadCount = headerNotifications.filter((n) => !n.isRead || n.status === "Unread").length;
  const recentNotifications = headerNotifications.slice(0, 3);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsProfileOpen(false);
    if (onLogout) {
      await onLogout();
    } else {
      navigate("/super-admin/login");
    }
  };

  const handleMarkAllHeaderRead = () => {
    setHeaderNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true, status: "Read" }))
    );
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-bg-card border-b border-border px-3.5 sm:px-6 flex items-center justify-between shadow-xs min-w-0">
      
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1 mr-2">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h2 className="text-sm sm:text-lg font-bold text-text-primary leading-tight truncate">
            {pageTitle}
          </h2>
          <p className="hidden sm:block text-[11px] text-text-muted truncate">
            Smart POS Platform Super Administrator Control Panel
          </p>
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        
        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setIsNotificationsOpen((prev) => !prev);
              setIsProfileOpen(false);
            }}
            className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer focus:outline-none"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-bg-card" />
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-bg-card rounded-2xl border border-border shadow-xl z-50 overflow-hidden animate-in fade-in-50 duration-150">
              <div className="p-4 border-b border-border flex items-center justify-between bg-bg-main/50">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                    Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary-light text-primary border border-primary/20">
                      {unreadCount} Unread
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
                  onClick={handleMarkAllHeaderRead}
                >
                  Mark all read
                </button>
              </div>

              <div className="divide-y divide-border-light max-h-72 overflow-y-auto">
                {recentNotifications.map((notif) => {
                  return (
                    <div
                      key={notif.id}
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        navigate("/super-admin/notifications");
                      }}
                      className="p-3.5 hover:bg-bg-hover transition-colors flex items-start gap-3 cursor-pointer"
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${!notif.isRead ? "text-primary bg-primary/10" : "text-text-muted bg-bg-main"}`}>
                        <Bell className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-text-primary leading-snug">
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-text-muted truncate mt-0.5">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-text-muted font-medium mt-1 inline-block">
                          {notif.createdAt}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-2.5 border-t border-border bg-bg-main/50 text-center">
                <Link
                  to="/super-admin/notifications"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-xs font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1"
                >
                  View all notifications <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-border hidden sm:block" />

        {/* User Profile Pill & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setIsProfileOpen((prev) => !prev);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 pl-1 p-1 rounded-xl hover:bg-bg-hover transition-colors cursor-pointer text-left focus:outline-none"
          >
            {/* Super Admin Avatar Badge */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-purple flex items-center justify-center text-text-white font-bold text-xs shadow-sm ring-2 ring-primary/20 shrink-0">
              SA
            </div>

            <div className="hidden md:block text-left pr-1">
              <p className="text-xs font-semibold text-text-primary leading-tight flex items-center gap-1">
                Super Admin
                <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform duration-150 ${isProfileOpen ? "rotate-180" : ""}`} />
              </p>
              <p className="text-[10px] text-success font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
                Platform Owner (Online)
              </p>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-bg-card rounded-2xl border border-border shadow-xl z-50 overflow-hidden py-1.5 animate-in fade-in-50 duration-150">
              <div className="px-4 py-2.5 border-b border-border bg-bg-main/50">
                <p className="text-xs font-bold text-text-primary">Super Administrator</p>
                <p className="text-[11px] text-text-muted truncate">admin@smartpos-platform.io</p>
              </div>

              <div className="py-1">
                <Link
                  to="/super-admin/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-primary transition-colors"
                >
                  <User className="w-4 h-4 text-text-muted" />
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/super-admin/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-primary transition-colors"
                >
                  <Settings className="w-4 h-4 text-text-muted" />
                  <span>Platform Settings</span>
                </Link>

                <Link
                  to="/super-admin/audit-logs"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-primary transition-colors"
                >
                  <ShieldAlert className="w-4 h-4 text-text-muted" />
                  <span>Security & Audit Logs</span>
                </Link>
              </div>

              <div className="border-t border-border pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
