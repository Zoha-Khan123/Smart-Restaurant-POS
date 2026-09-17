/**
 * Super Admin Subscription Plans Management - Mock Data & Definitions
 * Platform-level subscription pricing tiers and capability entitlements.
 * Future API mapping: GET /api/subscription-plans
 */

export const PLAN_FEATURE_DEFINITIONS = [
  {
    id: "pos",
    name: "POS Terminal System",
    description: "Front-desk point of sale terminal device support and cashier till management",
    category: "Core POS",
  },
  {
    id: "orders",
    name: "Live Order Management",
    description: "Dine-in, takeaway, online delivery tracking, and kitchen sync",
    category: "Core POS",
  },
  {
    id: "tables",
    name: "Table & Floor Plan Management",
    description: "Visual table layout mapping, guest seating, and live occupancy status",
    category: "Operations",
  },
  {
    id: "kot",
    name: "Kitchen Order Tickets (KOT)",
    description: "Kitchen display screens (KDS) and automatic thermal ticket printer dispatch",
    category: "Operations",
  },
  {
    id: "billing",
    name: "Custom Invoicing & Split Billing",
    description: "Multi-currency settlement, split bills by seat/item, and tax invoices",
    category: "Billing",
  },
  {
    id: "inventory",
    name: "Inventory & Stock Tracking",
    description: "Real-time ingredient levels, wastage logs, and low-stock replenishment alerts",
    category: "Inventory",
  },
  {
    id: "customers",
    name: "Customer CRM & Loyalty Rewards",
    description: "Guest directory, order preferences, promotional discounts, and reward points",
    category: "Marketing",
  },
  {
    id: "reports",
    name: "Daily Sales & Financial Reports",
    description: "End-of-day Z-reports, revenue breakdowns, and accounting CSV exports",
    category: "Analytics",
  },
  {
    id: "staff",
    name: "Staff Roles & Shift Auditing",
    description: "Granular permissions for cashiers, managers, and waiters with clock-in audits",
    category: "Management",
  },
  {
    id: "multiBranch",
    name: "Multi-Branch Cloud Sync",
    description: "Centralized menu catalog, stock sharing, and multi-location monitoring",
    category: "Enterprise",
  },
  {
    id: "analytics",
    name: "Advanced Real-Time Analytics",
    description: "Predictive revenue forecasts, top menu items, and peak hour heatmaps",
    category: "Analytics",
  },
  {
    id: "apiAccess",
    name: "REST API & Webhook Access",
    description: "Custom integration webhooks for third-party aggregators and ERP systems",
    category: "Enterprise",
  },
  {
    id: "prioritySupport",
    name: "24/7 Dedicated SLA Support",
    description: "Dedicated technical account manager with 15-minute emergency response SLA",
    category: "Support",
  },
];

export const INITIAL_PLANS_DATA = [
  {
    id: "plan-basic",
    name: "Basic",
    tagline: "Essential starter setup for single-terminal cafes, food trucks, and small bakeries.",
    monthlyPrice: 29,
    yearlyPrice: 290,
    status: "Active",
    badgeVariant: "emerald",
    colorTheme: "emerald",
    isPopular: false,
    maxBranches: 1,
    maxUsers: 3,
    maxStaff: 5,
    maxOrdersPerMonth: "1,500",
    restaurantsCount: 2,
    features: {
      pos: true,
      orders: true,
      tables: false,
      kot: false,
      billing: true,
      inventory: false,
      customers: false,
      reports: true,
      staff: false,
      multiBranch: false,
      analytics: false,
      apiAccess: false,
      prioritySupport: false,
    },
    createdAt: "Jan 01, 2025",
    updatedAt: "Feb 10, 2026",
  },
  {
    id: "plan-standard",
    name: "Standard",
    tagline: "Complete restaurant operating platform for growing casual dining and busy bistros.",
    monthlyPrice: 79,
    yearlyPrice: 790,
    status: "Active",
    badgeVariant: "primary",
    colorTheme: "blue",
    isPopular: true,
    maxBranches: 3,
    maxUsers: 10,
    maxStaff: 25,
    maxOrdersPerMonth: "10,000",
    restaurantsCount: 5,
    features: {
      pos: true,
      orders: true,
      tables: true,
      kot: true,
      billing: true,
      inventory: true,
      customers: true,
      reports: true,
      staff: true,
      multiBranch: false,
      analytics: false,
      apiAccess: false,
      prioritySupport: false,
    },
    createdAt: "Jan 01, 2025",
    updatedAt: "Mar 01, 2026",
  },
  {
    id: "plan-premium",
    name: "Premium",
    tagline: "Advanced multi-branch enterprise power for restaurant chains, franchises, and resorts.",
    monthlyPrice: 199,
    yearlyPrice: 1990,
    status: "Active",
    badgeVariant: "purple",
    colorTheme: "purple",
    isPopular: false,
    maxBranches: "Unlimited",
    maxUsers: "Unlimited",
    maxStaff: "Unlimited",
    maxOrdersPerMonth: "Unlimited",
    restaurantsCount: 3,
    features: {
      pos: true,
      orders: true,
      tables: true,
      kot: true,
      billing: true,
      inventory: true,
      customers: true,
      reports: true,
      staff: true,
      multiBranch: true,
      analytics: true,
      apiAccess: true,
      prioritySupport: true,
    },
    createdAt: "Jan 01, 2025",
    updatedAt: "Mar 12, 2026",
  },
];

/**
 * Calculate KPI statistics based on live subscription plans dataset
 */
export function calculatePlanStats(plans = []) {
  const total = plans.length;
  const active = plans.filter((p) => p.status === "Active").length;

  let mostUsed = "None";
  let maxCount = -1;
  let totalSubscribedRestaurants = 0;
  let estimatedMonthlyRev = 0;

  plans.forEach((p) => {
    const count = Number(p.restaurantsCount) || 0;
    const price = Number(p.monthlyPrice) || 0;
    totalSubscribedRestaurants += count;
    estimatedMonthlyRev += count * price;

    if (count > maxCount) {
      maxCount = count;
      mostUsed = p.name;
    }
  });

  return {
    totalPlans: total.toString(),
    activePlans: active.toString(),
    mostUsedPlan: mostUsed,
    totalRestaurantsOnPlans: totalSubscribedRestaurants.toString(),
    monthlyRevenue: `$${estimatedMonthlyRev.toLocaleString()}/mo`,
  };
}
