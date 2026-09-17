/**
 * Super Admin Dashboard - Mock Data & API-Ready Data Structures
 * This mock data structure closely mirrors the shape of a production REST/GraphQL API response.
 */

export const KPI_STATS = [
  {
    id: "total-restaurants",
    title: "Total Restaurants",
    value: "148",
    change: "+14.2%",
    changeType: "increase",
    subtext: "vs. last month",
    icon: "Building2",
    theme: "primary", // blue
    cardBg: "bg-blue-600",
    iconBg: "bg-blue-500/30",
  },
  {
    id: "active-restaurants",
    title: "Active Restaurants",
    value: "132",
    change: "89.2%",
    changeType: "increase",
    subtext: "operational rate",
    icon: "ShieldCheck",
    theme: "success", // emerald
    cardBg: "bg-emerald-600",
    iconBg: "bg-emerald-500/30",
  },
  {
    id: "inactive-restaurants",
    title: "Inactive Restaurants",
    value: "16",
    change: "-3.1%",
    changeType: "decrease",
    subtext: "needs attention",
    icon: "AlertTriangle",
    theme: "warning", // amber
    cardBg: "bg-amber-600",
    iconBg: "bg-amber-500/30",
  },
  {
    id: "total-users",
    title: "Total Users",
    value: "1,845",
    change: "+18.5%",
    changeType: "increase",
    subtext: "across all tenants",
    icon: "Users",
    theme: "purple", // purple
    cardBg: "bg-purple-600",
    iconBg: "bg-purple-500/30",
  },
  {
    id: "active-subscriptions",
    title: "Active Subscriptions",
    value: "128",
    change: "+9.8%",
    changeType: "increase",
    subtext: "97% renewal rate",
    icon: "CreditCard",
    theme: "indigo", // indigo
    cardBg: "bg-indigo-600",
    iconBg: "bg-indigo-500/30",
  },
  {
    id: "monthly-revenue",
    title: "Monthly Revenue",
    value: "$48,650",
    change: "+22.4%",
    changeType: "increase",
    subtext: "MRR this month",
    icon: "TrendingUp",
    theme: "teal", // teal
    cardBg: "bg-teal-600",
    iconBg: "bg-teal-500/30",
  },
  {
    id: "pending-payments",
    title: "Pending Payments",
    value: "$3,420",
    change: "6 Invoices",
    changeType: "warning",
    subtext: "awaiting settlement",
    icon: "Clock",
    theme: "rose", // rose
    cardBg: "bg-rose-600",
    iconBg: "bg-rose-500/30",
  },
];

/**
 * 6-Month Revenue Overview Trend Data
 */
export const REVENUE_OVERVIEW_DATA = [
  { month: "Oct", revenue: 32400, subscriptions: 26800, addOns: 5600 },
  { month: "Nov", revenue: 36200, subscriptions: 29400, addOns: 6800 },
  { month: "Dec", revenue: 41800, subscriptions: 33500, addOns: 8300 },
  { month: "Jan", revenue: 39500, subscriptions: 32100, addOns: 7400 },
  { month: "Feb", revenue: 44300, subscriptions: 36200, addOns: 8100 },
  { month: "Mar", revenue: 48650, subscriptions: 39850, addOns: 8800 },
];

/**
 * Restaurant / Tenant Growth Over Time (6 Months)
 */
export const RESTAURANT_GROWTH_DATA = [
  { month: "Oct", total: 95, active: 86, newAdded: 12 },
  { month: "Nov", total: 108, active: 98, newAdded: 15 },
  { month: "Dec", total: 122, active: 110, newAdded: 16 },
  { month: "Jan", total: 130, active: 117, newAdded: 11 },
  { month: "Feb", total: 139, active: 124, newAdded: 13 },
  { month: "Mar", total: 148, active: 132, newAdded: 14 },
];

/**
 * Subscription Distribution Data (Pie / Donut Chart)
 */
export const SUBSCRIPTION_DISTRIBUTION_DATA = [
  {
    name: "Standard",
    planKey: "standard",
    value: 54,
    count: 71,
    mrr: "$26,270",
    price: "$79/mo",
    color: "#2563eb", // Primary Blue
  },
  {
    name: "Premium",
    planKey: "premium",
    value: 28,
    count: 37,
    mrr: "$16,650",
    price: "$199/mo",
    color: "#8b5cf6", // Purple
  },
  {
    name: "Basic",
    planKey: "basic",
    value: 18,
    count: 24,
    mrr: "$5,730",
    price: "$29/mo",
    color: "#10b981", // Emerald
  },
];

/**
 * Recent Restaurants Data
 */
export const RECENT_RESTAURANTS_DATA = [
  {
    id: "rst-001",
    name: "Urban Bites Bistro",
    category: "Fine Dining & Café",
    logoColor: "bg-blue-600",
    initials: "UB",
    owner: {
      name: "Alexander Hayes",
      email: "alex.hayes@urbanbites.io",
      avatarBg: "bg-amber-600",
    },
    plan: "Premium",
    planVariant: "purple",
    paymentStatus: "Paid",
    paymentVariant: "success",
    restaurantStatus: "Active",
    statusVariant: "success",
    expiryDate: "Mar 28, 2027",
    daysLeft: "376 days",
  },
  {
    id: "rst-002",
    name: "Spice Symphony Grill",
    category: "Indian & Asian Fusion",
    logoColor: "bg-amber-600",
    initials: "SS",
    owner: {
      name: "Priya Sharma",
      email: "priya@spicesymphony.com",
      avatarBg: "bg-emerald-600",
    },
    plan: "Standard",
    planVariant: "primary",
    paymentStatus: "Paid",
    paymentVariant: "success",
    restaurantStatus: "Active",
    statusVariant: "success",
    expiryDate: "Aug 15, 2026",
    daysLeft: "150 days",
  },
  {
    id: "rst-003",
    name: "Golden Crust Pizzeria",
    category: "Italian & Pizzeria",
    logoColor: "bg-emerald-600",
    initials: "GC",
    owner: {
      name: "Marco Rossi",
      email: "marco@goldencrust.it",
      avatarBg: "bg-blue-600",
    },
    plan: "Standard",
    planVariant: "primary",
    paymentStatus: "Pending",
    paymentVariant: "warning",
    restaurantStatus: "Active",
    statusVariant: "success",
    expiryDate: "Apr 02, 2026",
    daysLeft: "15 days",
  },
  {
    id: "rst-004",
    name: "Ocean Catch Seafood",
    category: "Seafood Bar & Grill",
    logoColor: "bg-cyan-600",
    initials: "OC",
    owner: {
      name: "Sarah Jenkins",
      email: "sarah.j@oceancatch.co",
      avatarBg: "bg-purple-600",
    },
    plan: "Premium",
    planVariant: "purple",
    paymentStatus: "Paid",
    paymentVariant: "success",
    restaurantStatus: "Active",
    statusVariant: "success",
    expiryDate: "Dec 19, 2026",
    daysLeft: "276 days",
  },
  {
    id: "rst-005",
    name: "Velvet Beans Coffee Bar",
    category: "Specialty Café & Bakery",
    logoColor: "bg-purple-600",
    initials: "VB",
    owner: {
      name: "Liam O'Connor",
      email: "liam@velvetbeans.coffee",
      avatarBg: "bg-rose-600",
    },
    plan: "Basic",
    planVariant: "info",
    paymentStatus: "Paid",
    paymentVariant: "success",
    restaurantStatus: "Active",
    statusVariant: "success",
    expiryDate: "Jun 10, 2026",
    daysLeft: "84 days",
  },
  {
    id: "rst-006",
    name: "Rustic Smoke BBQ",
    category: "Smokehouse & Grill",
    logoColor: "bg-rose-600",
    initials: "RS",
    owner: {
      name: "David Vance",
      email: "dvance@rusticsmoke.net",
      avatarBg: "bg-slate-600",
    },
    plan: "Basic",
    planVariant: "info",
    paymentStatus: "Overdue",
    paymentVariant: "danger",
    restaurantStatus: "Inactive",
    statusVariant: "danger",
    expiryDate: "Mar 10, 2026",
    daysLeft: "Expired",
  },
];

/**
 * Recent Payments & Invoices Data
 */
export const RECENT_PAYMENTS_DATA = [
  {
    id: "pay-1089",
    invoiceId: "INV-2026-0891",
    restaurant: "Urban Bites Bistro",
    restaurantInitials: "UB",
    amount: "$199.00",
    paymentMethod: "Stripe Card",
    status: "Completed",
    statusVariant: "success",
    date: "Mar 16, 2026",
    time: "03:42 PM",
    billingCycle: "Monthly (Premium)",
  },
  {
    id: "pay-1088",
    invoiceId: "INV-2026-0890",
    restaurant: "Spice Symphony Grill",
    restaurantInitials: "SS",
    amount: "$790.00",
    paymentMethod: "Bank Transfer",
    status: "Completed",
    statusVariant: "success",
    date: "Mar 16, 2026",
    time: "01:15 PM",
    billingCycle: "Annual (Standard)",
  },
  {
    id: "pay-1087",
    invoiceId: "INV-2026-0889",
    restaurant: "Golden Crust Pizzeria",
    restaurantInitials: "GC",
    amount: "$79.00",
    paymentMethod: "PayPal",
    status: "Pending",
    statusVariant: "warning",
    date: "Mar 15, 2026",
    time: "11:20 AM",
    billingCycle: "Monthly (Standard)",
  },
  {
    id: "pay-1086",
    invoiceId: "INV-2026-0888",
    restaurant: "Ocean Catch Seafood",
    restaurantInitials: "OC",
    amount: "$1,990.00",
    paymentMethod: "Stripe Card",
    status: "Completed",
    statusVariant: "success",
    date: "Mar 14, 2026",
    time: "09:05 AM",
    billingCycle: "Annual (Premium)",
  },
  {
    id: "pay-1085",
    invoiceId: "INV-2026-0887",
    restaurant: "Velvet Beans Coffee",
    restaurantInitials: "VB",
    amount: "$29.00",
    paymentMethod: "Credit Card",
    status: "Completed",
    statusVariant: "success",
    date: "Mar 13, 2026",
    time: "04:30 PM",
    billingCycle: "Monthly (Basic)",
  },
  {
    id: "pay-1084",
    invoiceId: "INV-2026-0886",
    restaurant: "Rustic Smoke BBQ",
    restaurantInitials: "RS",
    amount: "$29.00",
    paymentMethod: "Direct Debit",
    status: "Failed",
    statusVariant: "danger",
    date: "Mar 10, 2026",
    time: "08:12 AM",
    billingCycle: "Monthly (Basic)",
  },
];

/**
 * Recent Platform Activity & Timeline Events
 */
export const PLATFORM_ACTIVITY_DATA = [
  {
    id: "act-1",
    title: "New Restaurant Onboarded",
    description: "Urban Bites Bistro was successfully registered by Alex Hayes.",
    timeAgo: "10 mins ago",
    type: "restaurant_created",
    icon: "Building2",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    id: "act-2",
    title: "Subscription Upgraded",
    description: "Ocean Catch Seafood upgraded their plan to Premium Tier.",
    timeAgo: "45 mins ago",
    type: "subscription_upgraded",
    icon: "Zap",
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
  },
  {
    id: "act-3",
    title: "Payment Received",
    description: "Annual subscription payment of $790.00 confirmed for Spice Symphony.",
    timeAgo: "2 hours ago",
    type: "payment_received",
    icon: "CheckCircle2",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
  },
  {
    id: "act-4",
    title: "Admin Account Created",
    description: "Primary administrator credentials provisioned for Golden Crust Pizzeria.",
    timeAgo: "4 hours ago",
    type: "admin_created",
    icon: "UserCheck",
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50",
  },
  {
    id: "act-5",
    title: "Restaurant Status Changed",
    description: "Rustic Smoke BBQ status marked as Inactive due to expired billing.",
    timeAgo: "6 hours ago",
    type: "status_changed",
    icon: "AlertCircle",
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
  },
  {
    id: "act-6",
    title: "System Backup Completed",
    description: "Automated multi-tenant daily database backup archived successfully.",
    timeAgo: "12 hours ago",
    type: "system_audit",
    icon: "ShieldCheck",
    iconColor: "text-teal-600",
    iconBg: "bg-teal-50",
  },
];

/**
 * Quick Action Items
 */
export const QUICK_ACTIONS = [
  {
    id: "qa-add-restaurant",
    title: "Add Restaurant",
    description: "Onboard a new tenant to the POS platform",
    icon: "PlusCircle",
    actionRoute: "/super-admin/restaurants/new",
    primary: true,
  },
  {
    id: "qa-manage-restaurants",
    title: "Manage Restaurants",
    description: "View, filter and configure all tenant branches",
    icon: "Store",
    actionRoute: "/super-admin/restaurants",
    primary: false,
  },
  {
    id: "qa-view-payments",
    title: "View Payments",
    description: "Track invoices, receipts and revenue streams",
    icon: "Receipt",
    actionRoute: "/super-admin/payments",
    primary: false,
  },
  {
    id: "qa-view-reports",
    title: "View Reports",
    description: "Analyze multi-tenant performance & KPIs",
    icon: "BarChart3",
    actionRoute: "/super-admin/reports",
    primary: false,
  },
];
