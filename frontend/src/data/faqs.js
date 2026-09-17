/**
 * Super Admin Knowledge Base & FAQs Dataset
 * Comprehensive questions and answers covering Multi-Tenancy, Billing, Hardware, Security, and System Maintenance.
 */

export const FAQ_CATEGORIES = [
  { id: "all", name: "All Topics" },
  { id: "tenants", name: "Tenants & Restaurants" },
  { id: "billing", name: "Subscriptions & Billing" },
  { id: "hardware", name: "POS Terminals & Printers" },
  { id: "security", name: "Security & Access Control" },
  { id: "system", name: "System Operations & API" },
];

export const INITIAL_FAQS_DATA = [
  {
    id: "FAQ-01",
    category: "tenants",
    question: "How do I onboard and provision a new restaurant tenant?",
    answer:
      "Navigate to the Restaurants management page (`/super-admin/restaurants`) and click the '+ Add Restaurant' button. Fill out the restaurant's operational profile, assign a subscription plan, and configure the primary Owner / Tenant Administrator credentials. The system automatically provisions an isolated tenant database schema and sends a welcome onboarding email.",
    tags: ["Onboarding", "Provisioning", "Restaurants"],
  },
  {
    id: "FAQ-02",
    category: "tenants",
    question: "What happens when a restaurant's status is set to 'Suspended'?",
    answer:
      "When a restaurant is suspended, all POS terminals, Kitchen Display Systems (KDS), and staff logins associated with that tenant are immediately locked. Customers attempting to place QR table orders will see a temporary maintenance notice. Data remains intact and can be restored instantly by setting status back to 'Active'.",
    tags: ["Suspension", "Tenant State", "Access"],
  },
  {
    id: "FAQ-03",
    category: "billing",
    question: "How do automatic subscription renewals and payment retries work?",
    answer:
      "Subscriptions renew automatically on the billing cycle anniversary date. If a tenant's credit card or direct debit fails, the platform marks the invoice as 'Pending Retry' and initiates automated retries at 24-hour intervals up to 3 times before placing the subscription in a 7-day grace period.",
    tags: ["Billing", "Invoices", "Retry Policy"],
  },
  {
    id: "FAQ-04",
    category: "billing",
    question: "Can Super Admins issue manual refunds or credit adjustments?",
    answer:
      "Yes. Open the Payments & Invoices page (`/super-admin/payments`), locate the specific transaction, and click the 'Refund' option in the action menu. You can issue a full or partial refund and optionally credit the tenant's wallet for future billing cycles.",
    tags: ["Refunds", "Credits", "Payments"],
  },
  {
    id: "FAQ-05",
    category: "hardware",
    question: "Which receipt printers and payment terminals are natively supported?",
    answer:
      "Smart POS supports all ESC/POS compliant thermal printers over Ethernet, Wi-Fi, USB, and Bluetooth (such as Epson TM-T88, Star Micronics TSP143, Sunmi K2). For payment processing, native terminal integrations are available for Stripe Terminal (BBPOS WisePOS E), Square Terminal, Pax, and Verifone devices.",
    tags: ["Hardware", "Printers", "Terminals", "ESC/POS"],
  },
  {
    id: "FAQ-06",
    category: "hardware",
    question: "How do I troubleshoot a printer showing 'Offline' on a POS terminal?",
    answer:
      "1. Verify that the printer is powered on and connected to the same local subnet / VLAN as the POS terminal.\n2. Print a status test sheet by holding the printer feed button during power-on to confirm the assigned IP address.\n3. In the Restaurant Admin hardware panel, test the IP ping connection.\n4. If using cloud printing, verify that the local WebSocket bridge gateway is online.",
    tags: ["Hardware", "Troubleshooting", "Networking"],
  },
  {
    id: "FAQ-07",
    category: "security",
    question: "How do I enforce Two-Factor Authentication (2FA) across all Super Admins?",
    answer:
      "Go to Platform Settings (`/super-admin/settings`) -> Security Settings. Enable the 'Enforce 2FA for Super Administrators' toggle and save. All Super Admin users will be required to configure a TOTP authenticator app (Google Authenticator, Authy, 1Password) upon their next sign-in.",
    tags: ["2FA", "MFA", "Security Policy"],
  },
  {
    id: "FAQ-08",
    category: "security",
    question: "Where can I review administrative and security audit logs?",
    answer:
      "All administrative actions, plan modifications, role assignments, impersonations, and login attempts are immutably recorded in the Audit Logs page (`/super-admin/audit-logs`). Logs can be filtered by actor, severity, module, date range, or exported as CSV reports.",
    tags: ["Audit Logs", "Compliance", "Security"],
  },
  {
    id: "FAQ-09",
    category: "system",
    question: "How do I enable Maintenance Mode for platform upgrades?",
    answer:
      "Navigate to Platform Settings -> System Settings. Toggle 'Maintenance Mode' to ON and customize the user-facing downtime message. While active, tenant staff will see a graceful maintenance banner while Super Admins maintain unrestricted access.",
    tags: ["Maintenance", "Upgrades", "System Operations"],
  },
  {
    id: "FAQ-10",
    category: "system",
    question: "What is the platform API rate limiting policy?",
    answer:
      "By default, public tenant API endpoints are rate limited to 300 requests per minute per tenant API key. Rate limits can be adjusted globally in System Settings or per tenant in the individual Restaurant Details page.",
    tags: ["API", "Rate Limiting", "Performance"],
  },
];
