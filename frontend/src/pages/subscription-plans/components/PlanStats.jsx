import React from "react";
import StatCard from "../../../components/ui/StatCard";
import { Layers, ShieldCheck, Zap, Store, Wallet } from "lucide-react";

export default function PlanStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0">
      {/* 1. Total Plans */}
      <StatCard
        title="Total Plans"
        value={stats.totalPlans}
        change="Tiers"
        changeType="increase"
        subtext="Configured"
        icon={Layers}
        cardBg="bg-primary"
        iconBg="bg-white/20"
      />

      {/* 2. Active Plans */}
      <StatCard
        title="Active Plans"
        value={stats.activePlans}
        change="Active"
        changeType="increase"
        subtext="Available"
        icon={ShieldCheck}
        cardBg="bg-emerald-600"
        iconBg="bg-white/20"
      />

      {/* 3. Most Popular Tier */}
      <StatCard
        title="Most Used Plan"
        value={stats.mostUsedPlan}
        change="Top Tier"
        changeType="increase"
        subtext="Popular"
        icon={Zap}
        cardBg="bg-purple-600"
        iconBg="bg-white/20"
      />

      {/* 4. Subscribed Restaurants */}
      <StatCard
        title="Subscribed Outlets"
        value={stats.totalRestaurantsOnPlans}
        change="Tenants"
        changeType="increase"
        subtext="Active"
        icon={Store}
        cardBg="bg-blue-600"
        iconBg="bg-white/20"
      />

      {/* 5. Monthly Subscription Run-Rate */}
      <StatCard
        title="Monthly Revenue"
        value={stats.monthlyRevenue}
        change="ARR"
        changeType="increase"
        subtext="Monthly sum"
        icon={Wallet}
        cardBg="bg-amber-600"
        iconBg="bg-white/20"
      />
    </div>
  );
}
