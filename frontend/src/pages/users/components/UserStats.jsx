import React from "react";
import StatCard from "../../../components/ui/StatCard";
import { Users, ShieldCheck, AlertTriangle, Zap, Store } from "lucide-react";

export default function UserStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0">
      {/* 1. Total Platform Users */}
      <StatCard
        title="Total Users"
        value={stats.totalUsers}
        change="+12.5%"
        changeType="increase"
        subtext="Across all tenants"
        icon={Users}
        cardBg="bg-primary"
        iconBg="bg-white/20"
      />

      {/* 2. Active Accounts */}
      <StatCard
        title="Active Users"
        value={stats.activeUsers}
        change="Operational"
        changeType="increase"
        subtext="Live access granted"
        icon={ShieldCheck}
        cardBg="bg-emerald-600"
        iconBg="bg-white/20"
      />

      {/* 3. Inactive / Suspended */}
      <StatCard
        title="Inactive / Suspended"
        value={stats.inactiveUsers}
        change={stats.inactiveUsers === "0" ? "All Clear" : "Restricted"}
        changeType={stats.inactiveUsers === "0" ? "increase" : "warning"}
        subtext="Access blocked"
        icon={AlertTriangle}
        cardBg="bg-rose-600"
        iconBg="bg-white/20"
      />

      {/* 4. Super Administrators */}
      <StatCard
        title="Super Admins"
        value={stats.superAdmins}
        change="Platform Root"
        changeType="increase"
        subtext="Full privileges"
        icon={Zap}
        cardBg="bg-purple-600"
        iconBg="bg-white/20"
      />

      {/* 5. Restaurant Owners & Admins */}
      <StatCard
        title="Tenant Admins"
        value={stats.restaurantAdmins}
        change="Store Owners"
        changeType="increase"
        subtext="Branch management"
        icon={Store}
        cardBg="bg-blue-600"
        iconBg="bg-white/20"
      />
    </div>
  );
}
