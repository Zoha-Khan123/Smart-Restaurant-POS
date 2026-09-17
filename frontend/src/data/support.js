/**
 * Support Overview & Platform Channels Data
 */

export const SUPPORT_CATEGORIES_DATA = [
  {
    id: "tenants",
    title: "Tenants & Restaurants",
    description: "Provisioning, onboarding, restaurant branding, staff permissions, and location setup.",
    icon: "Store",
    articleCount: 24,
    color: "primary",
  },
  {
    id: "billing",
    title: "Billing & Subscriptions",
    description: "Subscription tiers, recurring invoices, payment gateways, proration, and refunds.",
    icon: "CreditCard",
    articleCount: 18,
    color: "emerald",
  },
  {
    id: "hardware",
    title: "POS Hardware & KDS",
    description: "Thermal receipt printers, barcode scanners, payment terminals, and KDS routing.",
    icon: "Laptop",
    articleCount: 15,
    color: "purple",
  },
  {
    id: "security",
    title: "Security & Governance",
    description: "Two-factor authentication, IP whitelisting, session control, and audit logs.",
    icon: "ShieldAlert",
    articleCount: 12,
    color: "amber",
  },
  {
    id: "api",
    title: "API & Webhooks",
    description: "REST endpoints, HMAC webhook signatures, API tokens, and rate limits.",
    icon: "Code",
    articleCount: 20,
    color: "blue",
  },
  {
    id: "troubleshooting",
    title: "Diagnostics & SLA",
    description: "Live cluster health, WebSocket bridge latency, edge CDN, and uptime status.",
    icon: "Activity",
    articleCount: 14,
    color: "rose",
  },
];

export const SUPPORT_CONTACT_CHANNELS = [
  {
    title: "24/7 Platform DevOps Emergency",
    description: "For critical production outages, cluster degradation, or database failovers.",
    actionText: "+1 (800) 555-0199",
    type: "phone",
    badge: "24/7 Hotline",
    variant: "danger",
  },
  {
    title: "Dedicated Tier-3 Engineering Desk",
    description: "Direct email route to platform core engineers and database administrators.",
    actionText: "devops-support@smartpos-platform.io",
    type: "email",
    badge: "< 15 min SLA",
    variant: "primary",
  },
  {
    title: "Super Admin Slack Channel",
    description: "Internal team communication for platform incident triaging and live monitoring.",
    actionText: "Join #ops-superadmin",
    type: "chat",
    badge: "Active",
    variant: "purple",
  },
];
