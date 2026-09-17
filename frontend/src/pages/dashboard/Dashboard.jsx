import React, { useState } from "react";
import WelcomeHeader from "./components/WelcomeHeader";
import KPISection from "./components/KPISection";
import QuickActions from "./components/QuickActions";
import RevenueChart from "./components/RevenueChart";
import GrowthChart from "./components/GrowthChart";
import SubscriptionChart from "./components/SubscriptionChart";
import RecentRestaurantsTable from "./components/RecentRestaurantsTable";
import RecentPaymentsTable from "./components/RecentPaymentsTable";
import PlatformActivity from "./components/PlatformActivity";
import AddRestaurantModal from "./components/AddRestaurantModal";

import {
  KPI_STATS,
  REVENUE_OVERVIEW_DATA,
  RESTAURANT_GROWTH_DATA,
  SUBSCRIPTION_DISTRIBUTION_DATA,
  RECENT_RESTAURANTS_DATA,
  RECENT_PAYMENTS_DATA,
  PLATFORM_ACTIVITY_DATA,
  QUICK_ACTIONS,
} from "../../data/dashboard";

/**
 * Super Admin Dashboard Page
 * Main landing page for Super Administrator to monitor multi-tenant platform health,
 * financial performance, tenant onboarding, subscriptions, and system activity.
 */
export default function Dashboard() {
  const [kpiStats, setKpiStats] = useState(KPI_STATS);
  const [revenueData] = useState(REVENUE_OVERVIEW_DATA);
  const [growthData] = useState(RESTAURANT_GROWTH_DATA);
  const [subscriptionData] = useState(SUBSCRIPTION_DISTRIBUTION_DATA);
  const [restaurants, setRestaurants] = useState(RECENT_RESTAURANTS_DATA);
  const [payments] = useState(RECENT_PAYMENTS_DATA);
  const [activities, setActivities] = useState(PLATFORM_ACTIVITY_DATA);
  const [quickActions] = useState(QUICK_ACTIONS);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Handle adding new restaurant
  const handleAddRestaurant = (newRestaurant) => {
    setRestaurants([newRestaurant, ...restaurants]);
    
    // Update KPI stats count dynamically
    setKpiStats((prev) =>
      prev.map((kpi) => {
        if (kpi.id === "total-restaurants") {
          return { ...kpi, value: (parseInt(kpi.value, 10) + 1).toString() };
        }
        if (kpi.id === "active-restaurants") {
          return { ...kpi, value: (parseInt(kpi.value, 10) + 1).toString() };
        }
        return kpi;
      })
    );

    // Prepend new activity
    const newActivity = {
      id: `act-${Date.now()}`,
      title: "New Restaurant Onboarded",
      description: `${newRestaurant.name} was registered by ${newRestaurant.owner.name}.`,
      timeAgo: "Just now",
      type: "restaurant_created",
      icon: "Building2",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    };
    setActivities([newActivity, ...activities]);
  };

  const handleRefresh = () => {
    console.log("Refreshing dashboard data from platform API...");
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Welcome & Control Header */}
      <WelcomeHeader
        onRefresh={handleRefresh}
        onAddRestaurant={() => setIsAddModalOpen(true)}
      />

      {/* 2. 7 KPI Stat Cards */}
      <KPISection stats={kpiStats} />

      {/* 3. Quick Action Shortcuts */}
      <QuickActions
        actions={quickActions}
        onAddRestaurant={() => setIsAddModalOpen(true)}
      />

      {/* 4. Top Charts Grid: Revenue Overview & Subscription Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Revenue Overview Area Chart (2 Cols) */}
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} />
        </div>

        {/* Subscription Tier Distribution Donut Chart (1 Col) */}
        <div className="lg:col-span-1">
          <SubscriptionChart data={subscriptionData} />
        </div>
      </div>

      {/* 5. Second Charts Grid: Restaurant Growth & Live Platform Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Restaurant Growth Bar Chart (2 Cols) */}
        <div className="lg:col-span-2">
          <GrowthChart data={growthData} />
        </div>

        {/* Platform Activity Timeline (1 Col) */}
        <div className="lg:col-span-1">
          <PlatformActivity activities={activities} />
        </div>
      </div>

      {/* 6. Recent Restaurants Directory Table */}
      <RecentRestaurantsTable restaurants={restaurants} />

      {/* 7. Recent Invoices & Payments Table */}
      <RecentPaymentsTable payments={payments} />

      {/* Onboard Restaurant Modal */}
      <AddRestaurantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSuccess={handleAddRestaurant}
      />
    </div>
  );
}
