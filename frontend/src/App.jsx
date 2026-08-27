import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import OrderTaker from "./pages/order-taker/OrderTaker";
import Tables from "./pages/tables/Tables";
import KOT from "./pages/kitchen/KOT";
import Billing from "./pages/billing/Billing";
import Menu from "./pages/menu/Menu";
import Inventory from "./pages/inventory/Inventory";
import Customers from "./pages/customers/Customers";
import Reports from "./pages/reports/Reports";
import Staff from "./pages/staff/Staff";
import Orders from "./pages/orders/Orders";
import Profile from "./pages/profile/Profile";
import Settings from "./pages/settings/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected App Routes with MainLayout & Sidebar */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/order-taker" element={<OrderTaker />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/kot" element={<KOT />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Fallback Redirects to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
