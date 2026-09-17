/**
 * Default Platform Settings Mock Data
 * Multi-tenant configuration and global platform properties.
 */

export const INITIAL_SETTINGS_DATA = {
  general: {
    platformName: "Smart POS Enterprise Platform",
    platformTagline: "Multi-Tenant Cloud Point of Sale & Restaurant OS",
    supportEmail: "support@smartpos-platform.io",
    adminContactPhone: "+1 (800) 555-0199",
    defaultCurrency: "USD",
    defaultTimezone: "America/New_York",
    defaultLanguage: "en",
    dateFormat: "YYYY-MM-DD",
    platformLogoUrl: "",
    faviconUrl: "",
  },
  security: {
    require2FASuperAdmin: true,
    allow2FATenants: true,
    sessionTimeoutMinutes: 60,
    maxLoginAttempts: 5,
    lockoutDurationMinutes: 15,
    passwordMinLength: 10,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
    ipWhitelistingEnabled: false,
    ipWhitelist: "192.168.1.0/24, 10.0.0.0/16, 72.80.12.9",
  },
  notifications: {
    emailNotificationsMaster: true,
    alertNewRestaurant: true,
    alertSubscriptionChanges: true,
    alertHighSecurityEvents: true,
    alertSystemErrors: true,
    alertPaymentFailures: true,
    webhookEnabled: true,
    webhookUrl: "https://api.smartpos-platform.io/v1/webhooks/super-admin-events",
    weeklyDigestEmail: true,
  },
  system: {
    maintenanceMode: false,
    maintenanceMessage: "Smart POS is undergoing scheduled database maintenance. Services will resume shortly.",
    debugLogging: false,
    apiRateLimit: 300,
    autoBackupFrequency: "daily",
    storageRetentionDays: 90,
    systemVersion: "v2.8.4-enterprise",
    buildId: "build-2026.03.28-rc4",
    lastBackupAt: "Today, 03:00 AM UTC",
  },
  appearance: {
    themeMode: "light",
    primaryBrandColor: "#2563eb",
    sidebarDensity: "expanded",
    tableRowDensity: "comfortable",
  },
};

export const CURRENCY_OPTIONS = [
  { code: "USD", symbol: "$", label: "USD ($) - US Dollar" },
  { code: "EUR", symbol: "€", label: "EUR (€) - Euro" },
  { code: "GBP", symbol: "£", label: "GBP (£) - British Pound" },
  { code: "CAD", symbol: "CA$", label: "CAD (CA$) - Canadian Dollar" },
  { code: "AUD", symbol: "AU$", label: "AUD (AU$) - Australian Dollar" },
  { code: "AED", symbol: "AED", label: "AED (AED) - UAE Dirham" },
  { code: "PKR", symbol: "Rs", label: "PKR (Rs) - Pakistani Rupee" },
  { code: "INR", symbol: "₹", label: "INR (₹) - Indian Rupee" },
];

export const TIMEZONE_OPTIONS = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "America/New York (EST/EDT UTC-5/UTC-4)" },
  { value: "America/Chicago", label: "America/Chicago (CST/CDT UTC-6/UTC-5)" },
  { value: "America/Los_Angeles", label: "America/Los Angeles (PST/PDT UTC-8/UTC-7)" },
  { value: "Europe/London", label: "Europe/London (GMT/BST UTC+0/UTC+1)" },
  { value: "Europe/Paris", label: "Europe/Paris (CET/CEST UTC+1/UTC+2)" },
  { value: "Asia/Dubai", label: "Asia/Dubai (GST UTC+4)" },
  { value: "Asia/Karachi", label: "Asia/Karachi (PKT UTC+5)" },
  { value: "Asia/Singapore", label: "Asia/Singapore (SGT UTC+8)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (JST UTC+9)" },
];

export const LANGUAGE_OPTIONS = [
  { code: "en", label: "English (US)" },
  { code: "en-gb", label: "English (UK)" },
  { code: "es", label: "Spanish (Español)" },
  { code: "fr", label: "French (Français)" },
  { code: "de", label: "German (Deutsch)" },
  { code: "ar", label: "Arabic (العربية)" },
];

export const BRAND_COLORS = [
  { name: "Ocean Blue (Default)", hex: "#2563eb", bgClass: "bg-blue-600" },
  { name: "Royal Indigo", hex: "#4f46e5", bgClass: "bg-indigo-600" },
  { name: "Emerald Green", hex: "#059669", bgClass: "bg-emerald-600" },
  { name: "Royal Purple", hex: "#8b5cf6", bgClass: "bg-purple-600" },
  { name: "Amber Orange", hex: "#ea580c", bgClass: "bg-orange-600" },
  { name: "Dark Slate", hex: "#334155", bgClass: "bg-slate-700" },
];
