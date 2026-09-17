/**
 * Super Admin Profile & Session Data
 * Contains super admin personal details, 2FA status, and active authentication sessions.
 */

export const INITIAL_PROFILE_DATA = {
  id: "USR-SA-001",
  firstName: "Alexander",
  lastName: "Wright",
  email: "admin@smartpos-platform.io",
  phone: "+1 (555) 349-2810",
  designation: "Chief Platform Architect & Super Administrator",
  department: "Global Infrastructure & Platform Operations",
  location: "San Francisco, CA (USA)",
  timezone: "America/Los_Angeles",
  bio: "Lead Super Administrator responsible for multi-tenant cluster orchestration, high availability, security governance, and billing operations across all Smart POS tenant ecosystems.",
  role: "Super Administrator",
  status: "Active",
  avatarUrl: "",
  initials: "AW",
  joinedDate: "January 15, 2024",
  lastLogin: "Today, 10:42 AM (from 192.168.1.45)",
  twoFactorEnabled: true,
  twoFactorMethod: "Authenticator App (TOTP)",
  activeSessionsCount: 3,
  securityScore: 96,
};

export const INITIAL_SESSIONS_DATA = [
  {
    id: "SES-101",
    current: true,
    device: "Chrome 124 on macOS Sonoma (Apple Silicon)",
    ip: "192.168.1.45",
    location: "San Francisco, CA, United States",
    lastActive: "Active now",
    deviceType: "desktop",
    browser: "Google Chrome",
  },
  {
    id: "SES-102",
    current: false,
    device: "Safari 17 on iPhone 15 Pro (iOS 17.4)",
    ip: "72.80.12.9",
    location: "San Francisco, CA, United States",
    lastActive: "2 hours ago",
    deviceType: "mobile",
    browser: "Apple Safari",
  },
  {
    id: "SES-103",
    current: false,
    device: "Firefox 125 on Windows 11 Pro",
    ip: "104.28.19.4",
    location: "Austin, TX, United States",
    lastActive: "Yesterday at 4:15 PM",
    deviceType: "desktop",
    browser: "Mozilla Firefox",
  },
];
