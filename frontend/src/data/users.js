/**
 * Super Admin Users Management - Mock Data
 * API-ready data structure for multi-tenant platform user accounts.
 * Future API mapping: GET /api/users
 */

export const INITIAL_USERS_DATA = [
  {
    id: "usr-001",
    name: "Alexander Hayes",
    email: "alex.hayes@urbanbites.io",
    phone: "+1 (555) 234-5678",
    avatar: "AH",
    avatarBg: "bg-blue-600",
    role: "Admin",
    restaurantId: "rst-001",
    restaurantName: "Urban Bites Bistro",
    status: "Active",
    lastLogin: "Today, 02:45 PM",
    lastLoginIp: "192.168.1.45 (Chrome / macOS)",
    activeSessions: 2,
    createdAt: "Jan 12, 2025",
  },
  {
    id: "usr-002",
    name: "Eleanor Vance",
    email: "eleanor.vance@smartpos-platform.io",
    phone: "+1 (555) 019-2834",
    avatar: "EV",
    avatarBg: "bg-purple-600",
    role: "Super Admin",
    restaurantId: null,
    restaurantName: "Platform",
    status: "Active",
    lastLogin: "Today, 03:10 PM",
    lastLoginIp: "172.56.21.90 (Firefox / Windows)",
    activeSessions: 3,
    createdAt: "Jan 01, 2025",
  },
  {
    id: "usr-003",
    name: "Priya Sharma",
    email: "priya@spicesymphony.com",
    phone: "+1 (555) 876-5432",
    avatar: "PS",
    avatarBg: "bg-amber-600",
    role: "Admin",
    restaurantId: "rst-002",
    restaurantName: "Spice Symphony Grill",
    status: "Active",
    lastLogin: "Yesterday, 07:15 PM",
    lastLoginIp: "10.0.4.12 (Safari / iOS)",
    activeSessions: 1,
    createdAt: "Feb 04, 2025",
  },
  {
    id: "usr-004",
    name: "Marco Rossi",
    email: "marco@goldencrust.it",
    phone: "+1 (555) 345-6789",
    avatar: "MR",
    avatarBg: "bg-emerald-600",
    role: "Admin",
    restaurantId: "rst-003",
    restaurantName: "Golden Crust Pizzeria",
    status: "Active",
    lastLogin: "Today, 11:30 AM",
    lastLoginIp: "192.168.2.110 (Edge / Windows)",
    activeSessions: 2,
    createdAt: "Feb 18, 2025",
  },
  {
    id: "usr-005",
    name: "Liam O'Connor",
    email: "liam.oc@urbanbites.io",
    phone: "+1 (555) 432-8765",
    avatar: "LO",
    avatarBg: "bg-indigo-600",
    role: "Manager",
    restaurantId: "rst-001",
    restaurantName: "Urban Bites Bistro",
    status: "Active",
    lastLogin: "Today, 01:20 PM",
    lastLoginIp: "192.168.1.52 (Chrome / Android)",
    activeSessions: 1,
    createdAt: "Jan 20, 2025",
  },
  {
    id: "usr-006",
    name: "Sophia Martinez",
    email: "sophia.m@spicesymphony.com",
    phone: "+1 (555) 654-0987",
    avatar: "SM",
    avatarBg: "bg-teal-600",
    role: "Cashier",
    restaurantId: "rst-002",
    restaurantName: "Spice Symphony Grill",
    status: "Active",
    lastLogin: "Today, 12:45 PM",
    lastLoginIp: "10.0.4.55 (POS Terminal #1)",
    activeSessions: 1,
    createdAt: "Feb 10, 2025",
  },
  {
    id: "usr-007",
    name: "Sarah Jenkins",
    email: "sarah.j@oceancatch.co",
    phone: "+1 (555) 987-6543",
    avatar: "SJ",
    avatarBg: "bg-cyan-600",
    role: "Admin",
    restaurantId: "rst-004",
    restaurantName: "Ocean Catch Seafood",
    status: "Active",
    lastLogin: "Mar 14, 2026",
    lastLoginIp: "192.168.3.20 (Safari / macOS)",
    activeSessions: 1,
    createdAt: "Mar 01, 2025",
  },
  {
    id: "usr-008",
    name: "David Chen",
    email: "david.c@goldencrust.it",
    phone: "+1 (555) 234-9012",
    avatar: "DC",
    avatarBg: "bg-orange-600",
    role: "Waiter",
    restaurantId: "rst-003",
    restaurantName: "Golden Crust Pizzeria",
    status: "Active",
    lastLogin: "Today, 02:00 PM",
    lastLoginIp: "192.168.2.14 (Tablet #3)",
    activeSessions: 1,
    createdAt: "Mar 05, 2025",
  },
  {
    id: "usr-009",
    name: "Marcus Thorne",
    email: "marcus.thorne@smartpos-platform.io",
    phone: "+1 (555) 901-4321",
    avatar: "MT",
    avatarBg: "bg-purple-700",
    role: "Super Admin",
    restaurantId: null,
    restaurantName: "Platform",
    status: "Active",
    lastLogin: "Today, 09:15 AM",
    lastLoginIp: "108.45.12.89 (Chrome / Linux)",
    activeSessions: 2,
    createdAt: "Jan 01, 2025",
  },
  {
    id: "usr-010",
    name: "Carlos Rivera",
    email: "carlos@therustictable.org",
    phone: "+1 (555) 456-7890",
    avatar: "CR",
    avatarBg: "bg-rose-600",
    role: "Admin",
    restaurantId: "rst-005",
    restaurantName: "The Rustic Table",
    status: "Inactive",
    lastLogin: "Mar 10, 2026",
    lastLoginIp: "192.168.5.10 (Chrome / Windows)",
    activeSessions: 0,
    createdAt: "Mar 15, 2025",
  },
  {
    id: "usr-011",
    name: "Emily Watson",
    email: "emily.w@urbanbites.io",
    phone: "+1 (555) 789-0123",
    avatar: "EW",
    avatarBg: "bg-amber-700",
    role: "Kitchen Staff",
    restaurantId: "rst-001",
    restaurantName: "Urban Bites Bistro",
    status: "Active",
    lastLogin: "Today, 11:10 AM",
    lastLoginIp: "192.168.1.80 (KOT Display #1)",
    activeSessions: 1,
    createdAt: "Feb 01, 2025",
  },
  {
    id: "usr-012",
    name: "Kenji Sato",
    email: "kenji@sakuralounge.com",
    phone: "+1 (555) 567-8901",
    avatar: "KS",
    avatarBg: "bg-red-600",
    role: "Admin",
    restaurantId: "rst-006",
    restaurantName: "Sakura Japanese Lounge",
    status: "Active",
    lastLogin: "Today, 01:40 PM",
    lastLoginIp: "192.168.6.15 (Safari / macOS)",
    activeSessions: 2,
    createdAt: "Mar 22, 2025",
  },
  {
    id: "usr-013",
    name: "Jessica Taylor",
    email: "jessica.t@spicesymphony.com",
    phone: "+1 (555) 890-1234",
    avatar: "JT",
    avatarBg: "bg-orange-500",
    role: "Waiter",
    restaurantId: "rst-002",
    restaurantName: "Spice Symphony Grill",
    status: "Suspended",
    lastLogin: "Feb 28, 2026",
    lastLoginIp: "10.0.4.19 (Tablet #1)",
    activeSessions: 0,
    createdAt: "Feb 15, 2025",
  },
  {
    id: "usr-014",
    name: "Robert Miller",
    email: "robert@fireandsmokebbq.net",
    phone: "+1 (555) 678-9012",
    avatar: "RM",
    avatarBg: "bg-amber-800",
    role: "Admin",
    restaurantId: "rst-007",
    restaurantName: "Fire & Smoke BBQ",
    status: "Active",
    lastLogin: "Today, 10:05 AM",
    lastLoginIp: "192.168.7.25 (Chrome / Windows)",
    activeSessions: 1,
    createdAt: "Apr 05, 2025",
  },
  {
    id: "usr-015",
    name: "Aaliyah Khan",
    email: "aaliyah.k@sakuralounge.com",
    phone: "+1 (555) 321-7654",
    avatar: "AK",
    avatarBg: "bg-indigo-500",
    role: "Manager",
    restaurantId: "rst-006",
    restaurantName: "Sakura Japanese Lounge",
    status: "Active",
    lastLogin: "Today, 12:15 PM",
    lastLoginIp: "192.168.6.30 (iPad / iOS)",
    activeSessions: 1,
    createdAt: "Mar 25, 2025",
  },
  {
    id: "usr-016",
    name: "Hannah Abbott",
    email: "hannah@greengarden.org",
    phone: "+1 (555) 789-3456",
    avatar: "HA",
    avatarBg: "bg-emerald-700",
    role: "Admin",
    restaurantId: "rst-008",
    restaurantName: "Green Garden Organics",
    status: "Inactive",
    lastLogin: "Mar 01, 2026",
    lastLoginIp: "192.168.8.10 (Firefox / Linux)",
    activeSessions: 0,
    createdAt: "Apr 12, 2025",
  },
];

/**
 * Calculate KPI statistics based on live dataset
 */
export function calculateUserStats(users = []) {
  const total = users.length;
  const active = users.filter((u) => u.status === "Active").length;
  const inactive = users.filter((u) => u.status === "Inactive" || u.status === "Suspended").length;
  const superAdmins = users.filter((u) => u.role === "Super Admin").length;
  const restaurantAdmins = users.filter((u) => u.role === "Admin").length;

  return {
    totalUsers: total.toString(),
    activeUsers: active.toString(),
    inactiveUsers: inactive.toString(),
    superAdmins: superAdmins.toString(),
    restaurantAdmins: restaurantAdmins.toString(),
  };
}

/**
 * Role badge style lookup
 */
export const ROLE_BADGE_VARIANTS = {
  "Super Admin": "purple",
  Admin: "primary",
  Manager: "indigo",
  Cashier: "teal",
  Waiter: "orange",
  "Kitchen Staff": "warning",
};

/**
 * Status badge style lookup
 */
export const STATUS_BADGE_VARIANTS = {
  Active: "success",
  Inactive: "danger",
  Suspended: "warning",
};

/**
 * Available Roles for Add/Edit
 */
export const AVAILABLE_ROLES = [
  "Admin",
  "Manager",
  "Cashier",
  "Waiter",
  "Kitchen Staff",
];

/**
 * Available Platform Roles (for filters)
 */
export const ALL_ROLES = [
  "Super Admin",
  "Admin",
  "Manager",
  "Cashier",
  "Waiter",
  "Kitchen Staff",
];

/**
 * Available Statuses
 */
export const ALL_STATUSES = ["Active", "Inactive", "Suspended"];
