import React from "react";
import StatCard from "../../../components/ui/StatCard";
import {
  Wallet,
  TrendingUp,
  Clock,
  AlertTriangle,
  XCircle,
  RotateCcw,
} from "lucide-react";

export default function PaymentStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0">
      {/* 1. Total Revenue */}
      <StatCard
        title="Total Revenue"
        value={stats.totalRevenue}
        change="Cumulative"
        changeType="increase"
        subtext="Platform lifetime"
        icon={Wallet}
        cardBg="bg-emerald-600"
        iconBg="bg-white/20"
      />

      {/* 2. This Month Revenue */}
      <StatCard
        title="This Month Revenue"
        value={stats.thisMonthRevenue}
        change="Current Mo"
        changeType="increase"
        subtext="Settled balance"
        icon={TrendingUp}
        cardBg="bg-primary"
        iconBg="bg-white/20"
      />

      {/* 3. Pending Payments */}
      <StatCard
        title="Pending Payments"
        value={stats.pendingPayments}
        change={`${stats.pendingCount || 0} Invoices`}
        changeType="warning"
        subtext="Awaiting settlement"
        icon={Clock}
        cardBg="bg-amber-600"
        iconBg="bg-white/20"
      />

      {/* 4. Overdue Payments */}
      <StatCard
        title="Overdue Payments"
        value={stats.overduePayments}
        change={`${stats.overdueCount || 0} Accounts`}
        changeType={stats.overdueCount === "0" ? "increase" : "decrease"}
        subtext="Past grace period"
        icon={AlertTriangle}
        cardBg="bg-rose-600"
        iconBg="bg-white/20"
      />

      {/* 5. Failed Payments */}
      <StatCard
        title="Failed Payments"
        value={stats.failedPayments}
        change={`${stats.failedCount || 0} Attempts`}
        changeType={stats.failedCount === "0" ? "increase" : "decrease"}
        subtext="Card/Gateway errors"
        icon={XCircle}
        cardBg="bg-red-700"
        iconBg="bg-white/20"
      />

      {/* 6. Refunded Amount */}
      <StatCard
        title="Refunded Amount"
        value={stats.refundedAmount}
        change="Reversals"
        changeType="decrease"
        subtext="Returned to clients"
        icon={RotateCcw}
        cardBg="bg-purple-600"
        iconBg="bg-white/20"
      />
    </div>
  );
}
