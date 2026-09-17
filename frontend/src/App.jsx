import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicAuthRoute from "./components/auth/PublicAuthRoute";
import MainLayout from "./components/layout/MainLayout";

// Auth Pages
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import TwoFactorVerification from "./pages/auth/TwoFactorVerification";

// Super Admin Core Pages
import Dashboard from "./pages/dashboard/Dashboard";
import Restaurants from "./pages/restaurants/Restaurants";
import RestaurantDetails from "./pages/restaurant-details/RestaurantDetails";
import Users from "./pages/users/Users";
import SubscriptionPlans from "./pages/subscription-plans/SubscriptionPlans";
import Subscriptions from "./pages/subscriptions/Subscriptions";
import Payments from "./pages/payments/Payments";
import Reports from "./pages/reports/Reports";
import Notifications from "./pages/notifications/Notifications";
import AuditLogs from "./pages/audit-logs/AuditLogs";
import Settings from "./pages/settings/Settings";
import Profile from "./pages/profile/Profile";
import Support from "./pages/support/Support";

/**
 * Super Admin Frontend Application
 * Provides multi-tenant management, authentication security, and platform governance for Super Admins.
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ====================================================
              1. PUBLIC AUTHENTICATION ROUTES (Super Admin Auth)
          ==================================================== */}
          <Route element={<PublicAuthRoute />}>
            <Route path="/super-admin/login" element={<Login />} />
            <Route path="/login" element={<Login />} />

            <Route path="/super-admin/forgot-password" element={<ForgotPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/super-admin/reset-password" element={<ResetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* Verification Pages (Accessible During Verification Steps) */}
          <Route path="/super-admin/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          <Route path="/super-admin/2fa" element={<TwoFactorVerification />} />
          <Route path="/2fa" element={<TwoFactorVerification />} />

          {/* ====================================================
              2. PROTECTED SUPER ADMIN PORTAL ROUTES
          ==================================================== */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              {/* Dashboard Routes */}
              <Route path="/super-admin/dashboard" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Restaurants Management Routes */}
              <Route path="/super-admin/restaurants" element={<Restaurants />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/super-admin/restaurants/:id" element={<RestaurantDetails />} />
              <Route path="/restaurants/:id" element={<RestaurantDetails />} />

              {/* Users Management Routes */}
              <Route path="/super-admin/users" element={<Users />} />
              <Route path="/users" element={<Users />} />

              {/* Subscriptions Management Routes */}
              <Route path="/super-admin/subscriptions" element={<Subscriptions />} />
              <Route path="/subscriptions" element={<Subscriptions />} />

              {/* Subscription Plans Management Routes */}
              <Route path="/super-admin/subscription-plans" element={<SubscriptionPlans />} />
              <Route path="/subscription-plans" element={<SubscriptionPlans />} />

              {/* Payments & Invoices Management Routes */}
              <Route path="/super-admin/payments" element={<Payments />} />
              <Route path="/payments" element={<Payments />} />

              {/* Reports & Analytics Routes */}
              <Route path="/super-admin/reports" element={<Reports />} />
              <Route path="/reports" element={<Reports />} />

              {/* Notifications Management Routes */}
              <Route path="/super-admin/notifications" element={<Notifications />} />
              <Route path="/notifications" element={<Notifications />} />

              {/* Audit Logs Routes */}
              <Route path="/super-admin/audit-logs" element={<AuditLogs />} />
              <Route path="/audit-logs" element={<AuditLogs />} />

              {/* Platform Settings Routes */}
              <Route path="/super-admin/settings" element={<Settings />} />
              <Route path="/settings" element={<Settings />} />

              {/* Help & Support Routes */}
              <Route path="/super-admin/support" element={<Support />} />
              <Route path="/support" element={<Support />} />

              {/* Profile & Security Routes */}
              <Route path="/super-admin/profile" element={<Profile />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* ====================================================
              3. ROOT & WILDCARD FALLBACKS
          ==================================================== */}
          <Route path="/" element={<Navigate to="/super-admin/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/super-admin/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
