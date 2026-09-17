import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * PublicAuthRoute Component
 * Prevents already authenticated Super Admins from seeing the login/reset forms.
 */
export default function PublicAuthRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/super-admin/dashboard" replace />;
  }

  return <Outlet />;
}
