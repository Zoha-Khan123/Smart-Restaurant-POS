/**
 * Super Admin Audit & Security Logs - Mock Data
 * API-ready data structure for administrative event audit trails, access telemetry, and platform security logs.
 * Future API mapping: GET /api/audit-logs
 */

export const INITIAL_AUDIT_LOGS_DATA = [
  {
    id: "log-1001",
    action: "Subscription Plan Upgraded",
    module: "Subscriptions",
    description: "Upgraded tenant subscription tier from Standard ($79/mo) to Premium ($1,990/yr).",
    performedBy: "Alex Morgan",
    performedByRole: "Super Admin",
    targetType: "Subscription",
    targetId: "sub-001",
    targetName: "Urban Bites Bistro",
    restaurantId: "rst-001",
    restaurantName: "Urban Bites Bistro",
    ipAddress: "192.168.1.45",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0",
    status: "Success",
    severity: "Info",
    createdAt: "2026-03-28 14:35:20",
    metadata: {
      oldPlan: "Standard",
      newPlan: "Premium",
      billingCycle: "Yearly",
      amount: "$1,990.00",
      effectiveImmediately: true,
    },
  },
  {
    id: "log-1002",
    action: "Failed Root Login Attempt",
    module: "Security",
    description: "3 consecutive invalid password submissions for administrator root account.",
    performedBy: "Unknown Actor",
    performedByRole: "External",
    targetType: "Authentication",
    targetId: "usr-root",
    targetName: "Super Administrator",
    restaurantId: null,
    restaurantName: "Platform Root",
    ipAddress: "198.51.100.24",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
    status: "Failed",
    severity: "Critical",
    createdAt: "2026-03-28 13:12:05",
    metadata: {
      attemptCount: 3,
      authMethod: "Password",
      actionTaken: "IP Rate Limited (15m lockout)",
    },
  },
  {
    id: "log-1003",
    action: "Payment Refund Issued",
    module: "Payments",
    description: "Settlement refund of $79.00 processed for invoice INV-2026-007.",
    performedBy: "Sarah Jenkins",
    performedByRole: "Super Admin",
    targetType: "Payment",
    targetId: "PAY-2026-0897",
    targetName: "Invoice INV-2026-007",
    restaurantId: "rst-007",
    restaurantName: "Fire & Smoke BBQ",
    ipAddress: "10.0.4.19",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/122.0.0.0",
    status: "Success",
    severity: "Warning",
    createdAt: "2026-03-28 11:45:30",
    metadata: {
      refundAmount: "$79.00",
      reason: "Customer requested cancellation during trial setup",
      paymentGateway: "Stripe",
    },
  },
  {
    id: "log-1004",
    action: "User Role Permission Escalation",
    module: "Users",
    description: "Assigned temporary Manager refund override permissions to Cashier account.",
    performedBy: "Priya Sharma",
    performedByRole: "Restaurant Owner",
    targetType: "User",
    targetId: "usr-014",
    targetName: "Liam Evans",
    restaurantId: "rst-002",
    restaurantName: "Spice Symphony Grill",
    ipAddress: "172.16.20.88",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15",
    status: "Success",
    severity: "Warning",
    createdAt: "2026-03-28 10:20:14",
    metadata: {
      previousRole: "Cashier",
      newRole: "Manager",
      grantedBy: "Store Owner (Priya)",
    },
  },
  {
    id: "log-1005",
    action: "Broadcast Notification Dispatched",
    module: "Notifications",
    description: "Broadcasted high-priority system maintenance notification to all restaurant terminals.",
    performedBy: "Alex Morgan",
    performedByRole: "Super Admin",
    targetType: "Notification",
    targetId: "notif-001",
    targetName: "Scheduled Cloud DB Maintenance",
    restaurantId: null,
    restaurantName: "All Restaurants",
    ipAddress: "192.168.1.45",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0",
    status: "Success",
    severity: "Info",
    createdAt: "2026-03-28 09:15:00",
    metadata: {
      recipientCount: 128,
      priority: "High",
      type: "System",
    },
  },
  {
    id: "log-1006",
    action: "New Restaurant Onboarded",
    module: "Restaurants",
    description: "Created new tenant entity and provisioned database multi-tenant partition.",
    performedBy: "Alex Morgan",
    performedByRole: "Super Admin",
    targetType: "Restaurant",
    targetId: "rst-010",
    targetName: "Taco Fiesta Cantina",
    restaurantId: "rst-010",
    restaurantName: "Taco Fiesta Cantina",
    ipAddress: "192.168.1.45",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0",
    status: "Success",
    severity: "Info",
    createdAt: "2026-03-27 16:40:12",
    metadata: {
      initialPlan: "Premium",
      branchesConfigured: 2,
      primaryContact: "elena@tacofiesta.mx",
    },
  },
  {
    id: "log-1007",
    action: "Restaurant Temporarily Suspended",
    module: "Restaurants",
    description: "Suspended platform API sync due to repeated past-due invoice thresholds.",
    performedBy: "Billing Automation",
    performedByRole: "System",
    targetType: "Restaurant",
    targetId: "rst-005",
    targetName: "The Rustic Table",
    restaurantId: "rst-005",
    restaurantName: "The Rustic Table",
    ipAddress: "127.0.0.1",
    userAgent: "CronWorker-BillingDaemon/2.4",
    status: "Success",
    severity: "Critical",
    createdAt: "2026-03-27 00:05:00",
    metadata: {
      pastDueDays: 16,
      outstandingBalance: "$79.00",
      automatedAction: "POS Terminal Read-Only Mode",
    },
  },
  {
    id: "log-1008",
    action: "Subscription Validity Extended",
    module: "Subscriptions",
    description: "Added 30-day grace validity extension following manual wire payment confirmation.",
    performedBy: "Sarah Jenkins",
    performedByRole: "Super Admin",
    targetType: "Subscription",
    targetId: "sub-002",
    targetName: "Spice Symphony Grill",
    restaurantId: "rst-002",
    restaurantName: "Spice Symphony Grill",
    ipAddress: "10.0.4.19",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/122.0.0.0",
    status: "Success",
    severity: "Info",
    createdAt: "2026-03-26 14:10:44",
    metadata: {
      daysAdded: 30,
      newEndDate: "2026-08-15",
      reason: "Manual Offline Payment Confirmed",
    },
  },
  {
    id: "log-1009",
    action: "Password Reset Instructions Dispatched",
    module: "Authentication",
    description: "Generated encrypted 24-hour single-use password reset link for user marco@goldencrust.it.",
    performedBy: "Marco Rossi",
    performedByRole: "Restaurant Owner",
    targetType: "User",
    targetId: "usr-005",
    targetName: "Marco Rossi",
    restaurantId: "rst-003",
    restaurantName: "Golden Crust Pizzeria",
    ipAddress: "93.45.12.89",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) Firefox/123.0",
    status: "Success",
    severity: "Info",
    createdAt: "2026-03-25 18:32:10",
    metadata: {
      deliveryChannel: "Email (Encrypted token)",
      tokenExpiry: "24 Hours",
    },
  },
  {
    id: "log-1010",
    action: "Global Tax Configuration Modified",
    module: "Settings",
    description: "Updated default platform regional sales tax calculation rules for US-East zone.",
    performedBy: "Alex Morgan",
    performedByRole: "Super Admin",
    targetType: "Settings",
    targetId: "cfg-tax-01",
    targetName: "Regional Tax Matrix",
    restaurantId: null,
    restaurantName: "Platform Global",
    ipAddress: "192.168.1.45",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0",
    status: "Success",
    severity: "Warning",
    createdAt: "2026-03-24 15:20:00",
    metadata: {
      zone: "US-East",
      rateAdjustment: "8.25% to 8.50%",
      affectedTenants: 48,
    },
  },
];

/**
 * Calculate KPI summary statistics based on live audit logs dataset
 */
export function calculateAuditLogStats(logs = []) {
  const total = logs.length;
  // Today's logs (2026-03-28 in mock data)
  const today = logs.filter((l) => l.createdAt.startsWith("2026-03-28")).length;
  const success = logs.filter((l) => l.status === "Success").length;
  const failed = logs.filter((l) => l.status === "Failed").length;
  const critical = logs.filter((l) => l.severity === "Critical").length;

  return {
    totalLogs: total.toString(),
    todayCount: today.toString(),
    successCount: success.toString(),
    failedCount: failed.toString(),
    criticalCount: critical.toString(),
  };
}

/**
 * Badge Lookups
 */
export const LOG_MODULE_VARIANTS = {
  Authentication: "indigo",
  Restaurants: "primary",
  Users: "purple",
  Subscriptions: "emerald",
  Payments: "success",
  Notifications: "amber",
  Settings: "default",
  Security: "danger",
  Other: "default",
};

export const LOG_STATUS_VARIANTS = {
  Success: "success",
  Failed: "danger",
};

export const LOG_SEVERITY_VARIANTS = {
  Info: "primary",
  Warning: "warning",
  Critical: "danger",
};

export const LOG_ROLE_VARIANTS = {
  "Super Admin": "purple",
  "Restaurant Owner": "primary",
  Manager: "indigo",
  System: "default",
  External: "danger",
};

export const LOG_MODULE_OPTIONS = [
  "Authentication",
  "Restaurants",
  "Users",
  "Subscriptions",
  "Payments",
  "Notifications",
  "Settings",
  "Security",
  "Other",
];

export const LOG_SEVERITY_OPTIONS = [
  "Info",
  "Warning",
  "Critical",
];

export const LOG_STATUS_OPTIONS = [
  "Success",
  "Failed",
];

export const LOG_ROLE_OPTIONS = [
  "Super Admin",
  "Restaurant Owner",
  "Manager",
  "System",
  "External",
];
