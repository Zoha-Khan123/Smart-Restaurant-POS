import React from "react";
import StatCard from "../../../components/ui/StatCard";
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export default function AuditLogStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0">
      {/* 1. Total Logs */}
      <StatCard
        title="Total Logs"
        value={stats.totalLogs}
        change="Events"
        changeType="increase"
        subtext="Platform event trail"
        icon={ShieldAlert}
        cardBg="bg-primary"
        iconBg="bg-white/20"
      />

      {/* 2. Logged Today */}
      <StatCard
        title="Logged Today"
        value={stats.todayCount}
        change="Current 24h"
        changeType="increase"
        subtext="Real-time telemetry"
        icon={Clock}
        cardBg="bg-indigo-600"
        iconBg="bg-white/20"
      />

      {/* 3. Successful Actions */}
      <StatCard
        title="Successful Operations"
        value={stats.successCount}
        change="Authorized"
        changeType="increase"
        subtext="Completed smoothly"
        icon={CheckCircle2}
        cardBg="bg-emerald-600"
        iconBg="bg-white/20"
      />

      {/* 4. Failed Actions */}
      <StatCard
        title="Failed Operations"
        value={stats.failedCount}
        change={stats.failedCount === "0" ? "None" : "Attention"}
        changeType={stats.failedCount === "0" ? "increase" : "decrease"}
        subtext="Rejected or aborted"
        icon={XCircle}
        cardBg="bg-rose-600"
        iconBg="bg-white/20"
      />

      {/* 5. Critical Severity */}
      <StatCard
        title="Critical Security Alerts"
        value={stats.criticalCount}
        change={stats.criticalCount === "0" ? "All Clear" : "Priority"}
        changeType={stats.criticalCount === "0" ? "increase" : "warning"}
        subtext="Suspicious / Root alerts"
        icon={AlertTriangle}
        cardBg="bg-amber-600"
        iconBg="bg-white/20"
      />
    </div>
  );
}
