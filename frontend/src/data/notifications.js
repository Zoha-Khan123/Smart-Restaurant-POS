/**
 * Super Admin Notifications Management - Mock Data
 * API-ready data structure for platform notifications, alerts, and tenant announcements.
 * Future API mapping: GET /api/notifications
 */

export const INITIAL_NOTIFICATIONS_DATA = [
  {
    id: "notif-001",
    title: "Scheduled Cloud DB Maintenance",
    message: "Smart POS cloud infrastructure will undergo scheduled maintenance on Sunday, March 29 at 02:00 UTC. POS offline mode will be automatically active for all cashiers.",
    type: "System",
    priority: "High",
    audience: "All Restaurants",
    restaurantId: null,
    restaurantName: null,
    status: "Sent",
    isRead: false,
    createdBy: "Super Admin",
    createdAt: "2026-03-28 09:15",
    scheduledAt: null,
    sentAt: "2026-03-28 09:15",
    readAt: null,
    updatedAt: "2026-03-28 09:15",
  },
  {
    id: "notif-002",
    title: "Urgent Payment Overdue Notice",
    message: "Invoice INV-2026-005 ($79.00) for The Rustic Table is past due. Platform automated grace period expires in 48 hours.",
    type: "Payment",
    priority: "Critical",
    audience: "Specific Restaurant",
    restaurantId: "rst-005",
    restaurantName: "The Rustic Table",
    status: "Unread",
    isRead: false,
    createdBy: "Billing Automation",
    createdAt: "2026-03-28 08:30",
    scheduledAt: null,
    sentAt: "2026-03-28 08:30",
    readAt: null,
    updatedAt: "2026-03-28 08:30",
  },
  {
    id: "notif-003",
    title: "Subscription Renewal Notice - 30 Days",
    message: "Subscription sub-003 for Golden Crust Pizzeria will renew automatically on April 02, 2026 for $79/mo.",
    type: "Subscription",
    priority: "Normal",
    audience: "Specific Restaurant",
    restaurantId: "rst-003",
    restaurantName: "Golden Crust Pizzeria",
    status: "Sent",
    isRead: true,
    createdBy: "System",
    createdAt: "2026-03-27 14:00",
    scheduledAt: null,
    sentAt: "2026-03-27 14:00",
    readAt: "2026-03-27 15:20",
    updatedAt: "2026-03-27 15:20",
  },
  {
    id: "notif-004",
    title: "New POS Terminal Feature Release v2.4",
    message: "We have released table-side QR split billing and real-time inventory decrement sync. Please advise floor managers to refresh POS cash registers.",
    type: "Announcement",
    priority: "Normal",
    audience: "All Restaurant Admins",
    restaurantId: null,
    restaurantName: null,
    status: "Sent",
    isRead: true,
    createdBy: "Product Operations",
    createdAt: "2026-03-26 11:00",
    scheduledAt: null,
    sentAt: "2026-03-26 11:00",
    readAt: "2026-03-26 12:45",
    updatedAt: "2026-03-26 12:45",
  },
  {
    id: "notif-005",
    title: "Upcoming Easter Holiday Promotional Campaign",
    message: "Automated seasonal menu discounting and loyalty points boost campaign scheduled for broadcast across all branch terminals.",
    type: "Announcement",
    priority: "Normal",
    audience: "All Restaurants",
    restaurantId: null,
    restaurantName: null,
    status: "Scheduled",
    isRead: false,
    createdBy: "Marketing Admin",
    createdAt: "2026-03-25 16:30",
    scheduledAt: "2026-04-01 08:00",
    sentAt: null,
    readAt: null,
    updatedAt: "2026-03-25 16:30",
  },
  {
    id: "notif-006",
    title: "Security Alert: Multiple Failed Password Attempts",
    message: "5 consecutive failed login attempts detected for user alex.hayes@urbanbites.io from IP 192.168.1.104. Account locked for 15 minutes.",
    type: "Security",
    priority: "Critical",
    audience: "Specific Restaurant",
    restaurantId: "rst-001",
    restaurantName: "Urban Bites Bistro",
    status: "Unread",
    isRead: false,
    createdBy: "Security Gateway",
    createdAt: "2026-03-25 09:12",
    scheduledAt: null,
    sentAt: "2026-03-25 09:12",
    readAt: null,
    updatedAt: "2026-03-25 09:12",
  },
  {
    id: "notif-007",
    title: "Quarterly Platform Terms of Service Update",
    message: "Updated GDPR compliance, cloud storage archiving, and payment dispute handling policies will take effect May 01, 2026.",
    type: "System",
    priority: "Low",
    audience: "All Restaurant Admins",
    restaurantId: null,
    restaurantName: null,
    status: "Scheduled",
    isRead: false,
    createdBy: "Legal & Compliance",
    createdAt: "2026-03-24 10:00",
    scheduledAt: "2026-04-15 09:00",
    sentAt: null,
    readAt: null,
    updatedAt: "2026-03-24 10:00",
  },
  {
    id: "notif-008",
    title: "SMS Gateway Delivery Failure Notice",
    message: "SMS provider webhook failed to dispatch OTP codes to 3 waiter staff numbers during peak hours. Switched to fallback SMS route.",
    type: "System",
    priority: "High",
    audience: "All Restaurants",
    restaurantId: null,
    restaurantName: null,
    status: "Failed",
    isRead: true,
    createdBy: "System Telemetry",
    createdAt: "2026-03-23 20:15",
    scheduledAt: null,
    sentAt: "2026-03-23 20:15",
    readAt: "2026-03-23 20:45",
    updatedAt: "2026-03-23 20:45",
  },
  {
    id: "notif-009",
    title: "New Store Location Onboarded",
    message: "Sakura Japanese Lounge added a 3rd branch: 'Sakura Uptown Express'. Multi-branch cloud sync activated.",
    type: "Restaurant",
    priority: "Normal",
    audience: "Specific Restaurant",
    restaurantId: "rst-006",
    restaurantName: "Sakura Japanese Lounge",
    status: "Sent",
    isRead: true,
    createdBy: "Super Admin",
    createdAt: "2026-03-22 15:40",
    scheduledAt: null,
    sentAt: "2026-03-22 15:40",
    readAt: "2026-03-22 16:00",
    updatedAt: "2026-03-22 16:00",
  },
  {
    id: "notif-010",
    title: "Staff Permission Escalation Audit",
    message: "Cashier role 'John Doe' was assigned temporary Manager refund override permissions by Restaurant Admin.",
    type: "User",
    priority: "Low",
    audience: "Managers",
    restaurantId: "rst-002",
    restaurantName: "Spice Symphony Grill",
    status: "Sent",
    isRead: true,
    createdBy: "Audit Subsystem",
    createdAt: "2026-03-20 18:20",
    scheduledAt: null,
    sentAt: "2026-03-20 18:20",
    readAt: "2026-03-21 09:00",
    updatedAt: "2026-03-21 09:00",
  },
];

/**
 * Calculate KPI summary stats based on notifications dataset
 */
export function calculateNotificationStats(notifications = []) {
  const total = notifications.length;
  const unread = notifications.filter((n) => !n.isRead || n.status === "Unread").length;
  const sent = notifications.filter((n) => n.status === "Sent" || n.isRead).length;
  const scheduled = notifications.filter((n) => n.status === "Scheduled").length;
  const failed = notifications.filter((n) => n.status === "Failed").length;

  return {
    totalNotifications: total.toString(),
    unreadCount: unread.toString(),
    sentCount: sent.toString(),
    scheduledCount: scheduled.toString(),
    failedCount: failed.toString(),
  };
}

/**
 * Badge styling lookups
 */
export const NOTIF_TYPE_VARIANTS = {
  System: "primary",
  Payment: "emerald",
  Subscription: "purple",
  Restaurant: "indigo",
  User: "primary",
  Security: "danger",
  Announcement: "amber",
};

export const NOTIF_PRIORITY_VARIANTS = {
  Low: "default",
  Normal: "primary",
  High: "warning",
  Critical: "danger",
};

export const NOTIF_STATUS_VARIANTS = {
  Read: "default",
  Unread: "primary",
  Sent: "success",
  Scheduled: "purple",
  Failed: "danger",
  Cancelled: "default",
};

export const NOTIF_AUDIENCE_OPTIONS = [
  "All Restaurants",
  "All Restaurant Admins",
  "Managers",
  "Specific Restaurant",
];

export const NOTIF_TYPE_OPTIONS = [
  "System",
  "Payment",
  "Subscription",
  "Restaurant",
  "User",
  "Security",
  "Announcement",
];

export const NOTIF_PRIORITY_OPTIONS = [
  "Low",
  "Normal",
  "High",
  "Critical",
];
