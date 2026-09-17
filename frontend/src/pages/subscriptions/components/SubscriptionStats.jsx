import React from "react";
import StatCard from "../../../components/ui/StatCard";
import {
  CreditCard,
  ShieldCheck,
  Zap,
  Clock,
  AlertTriangle,
  Wallet,
} from "lucide-react";

export default function SubscriptionStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0">
      {/* 1. Total Subscriptions */}
      <StatCard
        title="Total Subs"
        value={stats.totalSubscriptions}
        change="Tenants"
        changeType="increase"
        subtext="Platform total"
        icon={CreditCard}
        cardBg="bg-primary"
        iconBg="bg-white/20"
      />

      {/* 2. Active Subscriptions */}
      <StatCard
        title="Active"
        value={stats.activeSubscriptions}
        change="Good Standing"
        changeType="increase"
        subtext="Live access"
        icon={ShieldCheck}
        cardBg="bg-emerald-600"
        iconBg="bg-white/20"
      />

      {/* 3. Trial Subscriptions */}
      <StatCard
        title="Trial Mode"
        value={stats.trialSubscriptions}
        change="14-Day Free"
        changeType="increase"
        subtext="Onboarding"
        icon={Zap}
        cardBg="bg-purple-600"
        iconBg="bg-white/20"
      />

      {/* 4. Expiring Soon (<= 30 Days) */}
      <StatCard
        title="Expiring Soon"
        value={stats.expiringSoon}
        change="≤ 30 Days"
        changeType="warning"
        subtext="Needs renewal"
        icon={Clock}
        cardBg="bg-amber-600"
        iconBg="bg-white/20"
      />

      {/* 5. Expired / Past Due */}
      <StatCard
        title="Expired / Due"
        value={stats.expiredOrPastDue}
        change="Restricted"
        changeType={stats.expiredOrPastDue === "0" ? "increase" : "decrease"}
        subtext="Past grace"
        icon={AlertTriangle}
        cardBg="bg-rose-600"
        iconBg="bg-white/20"
      />

      {/* 6. Monthly Recurring Revenue */}
      <StatCard
        title="Monthly MRR"
        value={stats.monthlyRevenue}
        change="Active Sum"
        changeType="increase"
        subtext="Normalized"
        icon={Wallet}
        cardBg="bg-blue-700"
        iconBg="bg-white/20"
      />
    </div>
  );
}
