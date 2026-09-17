import React from "react";
import StatCard from "../../../components/ui/StatCard";
import {
  Bell,
  MailCheck,
  Send,
  CalendarClock,
  AlertTriangle,
} from "lucide-react";

export default function NotificationStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0">
      {/* 1. Total Notifications */}
      <StatCard
        title="Total Notifications"
        value={stats.totalNotifications}
        change="Broadcasts"
        changeType="increase"
        subtext="Platform log"
        icon={Bell}
        cardBg="bg-primary"
        iconBg="bg-white/20"
      />

      {/* 2. Unread Alerts */}
      <StatCard
        title="Unread Alerts"
        value={stats.unreadCount}
        change={stats.unreadCount === "0" ? "All Read" : "Needs Review"}
        changeType={stats.unreadCount === "0" ? "increase" : "warning"}
        subtext="Pending tenant attention"
        icon={MailCheck}
        cardBg="bg-amber-600"
        iconBg="bg-white/20"
      />

      {/* 3. Sent Successfully */}
      <StatCard
        title="Dispatched"
        value={stats.sentCount}
        change="Delivered"
        changeType="increase"
        subtext="Live on terminals"
        icon={Send}
        cardBg="bg-emerald-600"
        iconBg="bg-white/20"
      />

      {/* 4. Scheduled Pipeline */}
      <StatCard
        title="Scheduled Queue"
        value={stats.scheduledCount}
        change="Upcoming"
        changeType="increase"
        subtext="Pending time trigger"
        icon={CalendarClock}
        cardBg="bg-purple-600"
        iconBg="bg-white/20"
      />

      {/* 5. Delivery Failures */}
      <StatCard
        title="Delivery Failures"
        value={stats.failedCount}
        change={stats.failedCount === "0" ? "Zero Errors" : "Action Required"}
        changeType={stats.failedCount === "0" ? "increase" : "decrease"}
        subtext="Webhook / SMS drops"
        icon={AlertTriangle}
        cardBg="bg-rose-600"
        iconBg="bg-white/20"
      />
    </div>
  );
}
