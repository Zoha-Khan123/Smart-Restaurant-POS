/**
 * Super Admin Reports & Analytics - Mock Data & Definitions
 * Platform-wide analytics time series, tier breakdowns, cohorts, and KPI aggregates.
 * Future API mapping: GET /api/reports/*
 */

export const REPORT_DATE_PRESETS = [
  { value: "today", label: "Today" },
  { value: "this_week", label: "This Week" },
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "last_3_months", label: "Last 3 Months" },
  { value: "last_6_months", label: "Last 6 Months" },
  { value: "this_year", label: "This Year (2026)" },
];

export const MONTHLY_REVENUE_DATA = [
  { month: "Oct 25", revenue: 28400, subscriptions: 24200, addOns: 4200, growth: "+8.2%" },
  { month: "Nov 25", revenue: 32100, subscriptions: 27500, addOns: 4600, growth: "+13.0%" },
  { month: "Dec 25", revenue: 37800, subscriptions: 31900, addOns: 5900, growth: "+17.7%" },
  { month: "Jan 26", revenue: 41250, subscriptions: 35000, addOns: 6250, growth: "+9.1%" },
  { month: "Feb 26", revenue: 46900, subscriptions: 39800, addOns: 7100, growth: "+13.7%" },
  { month: "Mar 26", revenue: 56400, subscriptions: 47900, addOns: 8500, growth: "+20.2%" },
];

export const RESTAURANT_GROWTH_DATA = [
  { month: "Oct 25", total: 78, newOutlets: 12, churned: 1, active: 75, inactive: 3 },
  { month: "Nov 25", total: 88, newOutlets: 11, churned: 1, active: 85, inactive: 3 },
  { month: "Dec 25", total: 98, newOutlets: 13, churned: 3, active: 94, inactive: 4 },
  { month: "Jan 26", total: 108, newOutlets: 12, churned: 2, active: 103, inactive: 5 },
  { month: "Feb 26", total: 118, newOutlets: 14, churned: 4, active: 112, inactive: 6 },
  { month: "Mar 26", total: 128, newOutlets: 15, churned: 5, active: 122, inactive: 6 },
];

export const SUBSCRIPTION_PLAN_METRICS = [
  {
    id: "plan-basic",
    name: "Basic",
    price: 29,
    restaurants: 26,
    percentage: 21,
    revenue: "$754 / mo",
    rawRevenue: 754,
    color: "#10b981", // Emerald
  },
  {
    id: "plan-standard",
    name: "Standard",
    price: 79,
    restaurants: 68,
    percentage: 55,
    revenue: "$5,372 / mo",
    rawRevenue: 5372,
    color: "#2563eb", // Primary Blue
  },
  {
    id: "plan-premium",
    name: "Premium",
    price: 199,
    restaurants: 28,
    percentage: 24,
    revenue: "$5,572 / mo",
    rawRevenue: 5572,
    color: "#8b5cf6", // Purple
  },
];

export const SUBSCRIPTION_COHORT_SUMMARY = {
  newSubscriptions: 15,
  renewalsCount: 42,
  expiringCount: 8,
  cancelledCount: 3,
  retentionRate: "97.6%",
};

export const USER_ANALYTICS_DATA = {
  totalUsers: 468,
  activeUsers: 442,
  inactiveUsers: 26,
  roleDistribution: [
    { role: "Super Admin", count: 4, percentage: 1, color: "#8b5cf6" },
    { role: "Admin", count: 128, percentage: 27, color: "#2563eb" },
    { role: "Manager", count: 96, percentage: 21, color: "#0ea5e9" },
    { role: "Cashier", count: 142, percentage: 30, color: "#10b981" },
    { role: "Waiter", count: 68, percentage: 15, color: "#f59e0b" },
    { role: "Kitchen Staff", count: 30, percentage: 6, color: "#ec4899" },
  ],
  topTenantsByUsers: [
    { restaurantName: "Urban Bites Bistro", users: 18, branches: 4 },
    { restaurantName: "Sakura Japanese Lounge", users: 16, branches: 3 },
    { restaurantName: "Spice Symphony Grill", users: 12, branches: 2 },
    { restaurantName: "Bella Vista Trattoria", users: 11, branches: 2 },
    { restaurantName: "Taco Fiesta Cantina", users: 10, branches: 2 },
  ],
};

export const PAYMENT_ANALYTICS_DATA = {
  totalInvoiced: "$242,850",
  successRate: "96.4%",
  outstandingAmount: "$6,240",
  refundedAmount: "$1,580",
  distribution: [
    { status: "Paid", count: 214, amount: "$235,030", percentage: 96.8, color: "#10b981" },
    { status: "Pending", count: 8, amount: "$3,420", percentage: 1.4, color: "#f59e0b" },
    { status: "Overdue", count: 4, amount: "$2,820", percentage: 1.2, color: "#e11d48" },
    { status: "Failed", count: 2, amount: "$1,150", percentage: 0.5, color: "#dc2626" },
    { status: "Refunded", count: 3, amount: "$1,580", percentage: 0.6, color: "#8b5cf6" },
  ],
  methods: [
    { method: "Credit / Debit Card", count: 154, percentage: 67, color: "#2563eb" },
    { method: "Bank Wire Transfer", count: 52, percentage: 23, color: "#4f46e5" },
    { method: "Online Payment Gateways", count: 25, percentage: 10, color: "#10b981" },
  ],
};

export const SUMMARY_REPORTS_TABLE_ROWS = [
  {
    period: "March 2026 (Current)",
    restaurants: 128,
    newRestaurants: 15,
    activeSubscriptions: 122,
    revenue: "$56,400",
    paymentsCount: 128,
    newUsers: 48,
    churnRate: "1.8%",
  },
  {
    period: "February 2026",
    restaurants: 118,
    newRestaurants: 14,
    activeSubscriptions: 112,
    revenue: "$46,900",
    paymentsCount: 116,
    newUsers: 42,
    churnRate: "2.1%",
  },
  {
    period: "January 2026",
    restaurants: 108,
    newRestaurants: 12,
    activeSubscriptions: 103,
    revenue: "$41,250",
    paymentsCount: 105,
    newUsers: 36,
    churnRate: "1.9%",
  },
  {
    period: "December 2025",
    restaurants: 98,
    newRestaurants: 13,
    activeSubscriptions: 94,
    revenue: "$37,800",
    paymentsCount: 96,
    newUsers: 39,
    churnRate: "2.4%",
  },
  {
    period: "November 2025",
    restaurants: 88,
    newRestaurants: 11,
    activeSubscriptions: 85,
    revenue: "$32,100",
    paymentsCount: 86,
    newUsers: 31,
    churnRate: "1.5%",
  },
  {
    period: "October 2025",
    restaurants: 78,
    newRestaurants: 12,
    activeSubscriptions: 75,
    revenue: "$28,400",
    paymentsCount: 76,
    newUsers: 28,
    churnRate: "1.2%",
  },
];

/**
 * Calculates overall KPI summary based on chosen date range filter
 */
export function calculateReportsOverview(dateRange = "this_month") {
  return {
    totalRevenue: "$242,850",
    revenueChange: "+20.2% vs last mo",
    monthlyMRR: "$48,500",
    mrrChange: "+13.7%",
    totalRestaurants: "128",
    restaurantsChange: "+15 New this mo",
    activeSubscriptions: "122",
    subscriptionsChange: "95.3% active rate",
    totalUsers: "468",
    usersChange: "+48 onboarded",
    arpu: "$1,897",
    arpuChange: "+6.4% per tenant",
    paymentSuccessRate: "96.4%",
    successRateChange: "+0.8% reliability",
    churnRate: "1.8%",
    churnChange: "-0.3% low churn",
  };
}
