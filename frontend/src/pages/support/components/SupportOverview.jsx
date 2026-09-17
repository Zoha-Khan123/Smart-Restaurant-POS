import React from "react";
import { LifeBuoy, AlertCircle, Clock, CheckCircle2, ShieldAlert } from "lucide-react";
import StatCard from "../../../components/ui/StatCard";

export default function SupportOverview({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
      <StatCard
        title="Total Support Tickets"
        value={stats.total}
        change="+8% this month"
        changeType="increase"
        icon={LifeBuoy}
        cardBg="bg-primary"
        variant="colored"
      />

      <StatCard
        title="Open / Unassigned"
        value={stats.open}
        subtext="Requires triage"
        changeType="warning"
        icon={AlertCircle}
        cardBg="bg-amber-600"
        variant="colored"
      />

      <StatCard
        title="In Progress"
        value={stats.inProgress}
        subtext="Under technical review"
        icon={Clock}
        cardBg="bg-blue-600"
        variant="colored"
      />

      <StatCard
        title="Resolved / Closed"
        value={stats.resolved}
        change="99.4% SLA Target"
        changeType="increase"
        icon={CheckCircle2}
        cardBg="bg-emerald-600"
        variant="colored"
      />
    </div>
  );
}
