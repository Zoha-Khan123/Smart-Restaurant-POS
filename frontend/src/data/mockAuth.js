/**
 * Super Admin Mock Authentication Dataset
 * Represents the identity accounts and security policies for platform authentication simulation.
 * 
 * NOTE FOR BACKEND INTEGRATION:
 * In production, passwords and tokens must NEVER be handled on the frontend.
 * The backend API (e.g. POST /api/auth/login) will authenticate via hashed passwords,
 * issue secure HTTP-only cookies/JWTs, and strictly enforce RBAC.
 */

export const MOCK_SUPER_ADMIN_USERS = [
  {
    id: "USR-SA-001",
    email: "admin@smartpos-platform.io",
    name: "Alexander Wright",
    role: "SUPER_ADMIN",
    designation: "Chief Platform Architect & Super Administrator",
    avatar: "",
    initials: "AW",
    emailVerified: true,
    twoFactorEnabled: true,
    twoFactorMethod: "Authenticator App (TOTP)",
    status: "Active",
  },
  {
    id: "USR-SA-002",
    email: "demo@smartpos-platform.io",
    name: "Demo Super Admin",
    role: "SUPER_ADMIN",
    designation: "Platform Operations Lead",
    avatar: "",
    initials: "DA",
    emailVerified: true,
    twoFactorEnabled: false,
    status: "Active",
  },
  {
    id: "USR-SA-003",
    email: "unverified@smartpos-platform.io",
    name: "New Admin Member",
    role: "SUPER_ADMIN",
    designation: "Platform Security Auditor",
    avatar: "",
    initials: "NA",
    emailVerified: false,
    twoFactorEnabled: false,
    status: "Pending Verification",
  },
  {
    id: "USR-TENANT-001",
    email: "manager@bellabistro.com",
    name: "Marco Rossi",
    role: "RESTAURANT_MANAGER", // Non-super-admin to test unauthorized block
    designation: "Restaurant General Manager",
    avatar: "",
    initials: "MR",
    emailVerified: true,
    twoFactorEnabled: false,
    status: "Active",
  },
];

export const MOCK_VALID_OTP = "123456";
export const MOCK_BACKUP_OTP = "892104";
