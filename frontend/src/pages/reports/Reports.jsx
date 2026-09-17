import React, { useState, useMemo } from "react";
import {
  Wallet,
  TrendingUp,
  Store,
  Layers,
  Users,
  DollarSign,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import StatCard from "../../components/ui/StatCard";
import Loader from "../../components/ui/Loader";

import ReportHeader from "./components/ReportHeader";
import ReportFilters from "./components/ReportFilters";
import RevenueAnalytics from "./components/RevenueAnalytics";
import RestaurantAnalytics from "./components/RestaurantAnalytics";
import SubscriptionAnalytics from "./components/SubscriptionAnalytics";
import UserAnalytics from "./components/UserAnalytics";
import PaymentAnalytics from "./components/PaymentAnalytics";
import ReportsTable from "./components/ReportsTable";

import {
  calculateReportsOverview,
  MONTHLY_REVENUE_DATA,
  RESTAURANT_GROWTH_DATA,
  SUBSCRIPTION_PLAN_METRICS,
  SUBSCRIPTION_COHORT_SUMMARY,
  USER_ANALYTICS_DATA,
  PAYMENT_ANALYTICS_DATA,
  SUMMARY_REPORTS_TABLE_ROWS,
} from "../../data/reports";

export default function Reports() {
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: "this_month",
    plan: "all",
    restaurant: "all",
    paymentStatus: "all",
  });

  const [notification, setNotification] = useState(null);

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const overview = useMemo(() => {
    return calculateReportsOverview(filters.dateRange);
  }, [filters.dateRange]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast("Platform reports & analytics recalculated.");
    }, 450);
  };

  const handleResetFilters = () => {
    setFilters({
      dateRange: "this_month",
      plan: "all",
      restaurant: "all",
      paymentStatus: "all",
    });
    showToast("Analytics timeframe reset to default.", "info");
  };

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-white/10 text-xs sm:text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* 1. Page Header */}
      <ReportHeader
        onRefresh={handleRefresh}
        isLoading={isLoading}
        reportsData={SUMMARY_REPORTS_TABLE_ROWS}
        onExportSuccess={(msg) => showToast(msg)}
      />

      {/* 2. Dimensional Filters */}
      <ReportFilters
        filters={filters}
        onFilterChange={(key, val) =>
          setFilters((prev) => ({ ...prev, [key]: val }))
        }
        onReset={handleResetFilters}
      />

      {/* 3. 8 Overview KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
        <StatCard
          title="Total Revenue"
          value={overview.totalRevenue}
          change={overview.revenueChange}
          changeType="increase"
          subtext="Cumulative gross"
          icon={Wallet}
          cardBg="bg-emerald-600"
          iconBg="bg-white/20"
        />

        <StatCard
          title="Monthly Recurring (MRR)"
          value={overview.monthlyMRR}
          change={overview.mrrChange}
          changeType="increase"
          subtext="Contract run-rate"
          icon={TrendingUp}
          cardBg="bg-primary"
          iconBg="bg-white/20"
        />

        <StatCard
          title="Total Restaurants"
          value={overview.totalRestaurants}
          change={overview.restaurantsChange}
          changeType="increase"
          subtext="Platform portfolio"
          icon={Store}
          cardBg="bg-blue-600"
          iconBg="bg-white/20"
        />

        <StatCard
          title="Active Subscriptions"
          value={overview.activeSubscriptions}
          change={overview.subscriptionsChange}
          changeType="increase"
          subtext="Active agreements"
          icon={Layers}
          cardBg="bg-purple-600"
          iconBg="bg-white/20"
        />

        <StatCard
          title="Total Platform Users"
          value={overview.totalUsers}
          change={overview.usersChange}
          changeType="increase"
          subtext="Staff & manager seats"
          icon={Users}
          cardBg="bg-indigo-600"
          iconBg="bg-white/20"
        />

        <StatCard
          title="Avg Rev Per Outlet (ARPU)"
          value={overview.arpu}
          change={overview.arpuChange}
          changeType="increase"
          subtext="Per tenant average"
          icon={DollarSign}
          cardBg="bg-amber-600"
          iconBg="bg-white/20"
        />

        <StatCard
          title="Payment Success Rate"
          value={overview.paymentSuccessRate}
          change={overview.successRateChange}
          changeType="increase"
          subtext="Gateway reliability"
          icon={ShieldCheck}
          cardBg="bg-emerald-700"
          iconBg="bg-white/20"
        />

        <StatCard
          title="Platform Churn Rate"
          value={overview.churnRate}
          change={overview.churnChange}
          changeType="increase"
          subtext="Low subscription churn"
          icon={RotateCcw}
          cardBg="bg-rose-600"
          iconBg="bg-white/20"
        />
      </div>

      {isLoading ? (
        <div className="bg-bg-card rounded-2xl p-12 border border-border shadow-xs">
          <Loader size="lg" text="Recalculating analytics matrices..." />
        </div>
      ) : (
        <>
          {/* 4. Analytics Row 1: Revenue & Restaurant Growth */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
            <RevenueAnalytics data={MONTHLY_REVENUE_DATA} />
            <RestaurantAnalytics data={RESTAURANT_GROWTH_DATA} />
          </div>

          {/* 5. Analytics Row 2: Subscriptions & Payment Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
            <SubscriptionAnalytics
              plans={SUBSCRIPTION_PLAN_METRICS}
              cohort={SUBSCRIPTION_COHORT_SUMMARY}
            />
            <PaymentAnalytics data={PAYMENT_ANALYTICS_DATA} />
          </div>

          {/* 6. Analytics Row 3: Users & Staff Analytics */}
          <div className="grid grid-cols-1 gap-6 min-w-0">
            <UserAnalytics data={USER_ANALYTICS_DATA} />
          </div>

          {/* 7. Summary Multi-Period Table */}
          <ReportsTable data={SUMMARY_REPORTS_TABLE_ROWS} />
        </>
      )}
    </div>
  );
}
