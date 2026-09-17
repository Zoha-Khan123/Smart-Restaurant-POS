/**
 * Support Tickets Mock Dataset & Statistics Calculator
 * Manages customer and tenant support inquiries, incident tickets, and SLA performance.
 */

export const INITIAL_SUPPORT_TICKETS = [
  {
    id: "TCK-8901",
    ticketNumber: "#8901",
    restaurantId: "REST-001",
    restaurantName: "Bella Italia Ristorante",
    requesterName: "Marco Rossi",
    requesterEmail: "m.rossi@bellaitalia.com",
    requesterRole: "Restaurant Owner",
    subject: "Thermal Printer EPSON TM-T88VI offline on POS Terminal 2",
    category: "Hardware & Terminals",
    priority: "High",
    status: "Open",
    createdAt: "2026-03-28 08:30:00",
    updatedAt: "15 mins ago",
    assignedTo: "Sarah Jenkins (Hardware Tier 2)",
    description:
      "Our main kitchen receipt printer stopped communicating with POS Terminal 2 during morning prep. We power-cycled both the router and the printer, but IP ping continues timing out on port 9100.",
    messages: [
      {
        id: "msg-1",
        sender: "Marco Rossi",
        senderRole: "Requester",
        timestamp: "2026-03-28 08:30:00",
        avatar: "MR",
        text: "Our main kitchen receipt printer stopped communicating with POS Terminal 2 during morning prep. We power-cycled both the router and the printer, but IP ping continues timing out on port 9100.",
      },
      {
        id: "msg-2",
        sender: "Sarah Jenkins",
        senderRole: "Support Specialist",
        timestamp: "2026-03-28 08:45:10",
        avatar: "SJ",
        text: "Hi Marco, please check if the Ethernet cable is showing a solid green link light on the back of the TM-T88VI. Could you also print a self-test sheet by holding the Feed button while powering on?",
      },
    ],
  },
  {
    id: "TCK-8902",
    ticketNumber: "#8902",
    restaurantId: "REST-002",
    restaurantName: "Sakura Sushi Bar",
    requesterName: "Kenji Sato",
    requesterEmail: "kenji@sakurasushi.com",
    requesterRole: "General Manager",
    subject: "Request to upgrade annual Enterprise Plan with 2 extra branches",
    category: "Billing & Subscriptions",
    priority: "Medium",
    status: "In Progress",
    createdAt: "2026-03-27 14:20:00",
    updatedAt: "1 hour ago",
    assignedTo: "Alexander Wright (Super Admin)",
    description:
      "We are opening two new branch locations in downtown Seattle next month. We would like to expand our Enterprise subscription plan to cover 5 branches total with centralized inventory sync.",
    messages: [
      {
        id: "msg-1",
        sender: "Kenji Sato",
        senderRole: "Requester",
        timestamp: "2026-03-27 14:20:00",
        avatar: "KS",
        text: "We are opening two new branch locations in downtown Seattle next month. We would like to expand our Enterprise subscription plan to cover 5 branches total with centralized inventory sync.",
      },
      {
        id: "msg-2",
        sender: "Alexander Wright",
        senderRole: "Super Admin",
        timestamp: "2026-03-27 15:10:00",
        avatar: "AW",
        text: "Hello Kenji! Congratulations on the expansion. I am preparing a custom multi-location billing quote with the prorated branch addon pricing. I will share the invoice draft shortly.",
      },
    ],
  },
  {
    id: "TCK-8903",
    ticketNumber: "#8903",
    restaurantId: "REST-003",
    restaurantName: "Burger Craft Kitchen",
    requesterName: "David Miller",
    requesterEmail: "d.miller@burgercraft.io",
    requesterRole: "Tenant Administrator",
    subject: "Webhook signature verification error on Stripe checkout callbacks",
    category: "Integrations & API",
    priority: "Critical",
    status: "Open",
    createdAt: "2026-03-28 09:12:00",
    updatedAt: "25 mins ago",
    assignedTo: "DevOps Platform Support",
    description:
      "We are seeing HTTP 400 Bad Request responses when Stripe webhook events hit our payment reconciliation endpoint. It seems the signing secret in Super Admin was rotated.",
    messages: [
      {
        id: "msg-1",
        sender: "David Miller",
        senderRole: "Requester",
        timestamp: "2026-03-28 09:12:00",
        avatar: "DM",
        text: "We are seeing HTTP 400 Bad Request responses when Stripe webhook events hit our payment reconciliation endpoint. It seems the signing secret in Super Admin was rotated.",
      },
    ],
  },
  {
    id: "TCK-8904",
    ticketNumber: "#8904",
    restaurantId: "REST-004",
    restaurantName: "Le Bistro Parisien",
    requesterName: "Claire Dubois",
    requesterEmail: "claire@lebistro.fr",
    requesterRole: "Restaurant Manager",
    subject: "Customizing staff permission matrix for evening shift leads",
    category: "Account & Permissions",
    priority: "Low",
    status: "Waiting Customer",
    createdAt: "2026-03-26 11:00:00",
    updatedAt: "Yesterday",
    assignedTo: "Alex Support",
    description:
      "We want our evening shift supervisors to perform discount overrides up to 20% without requiring an Owner PIN, while still restricting refund permissions.",
    messages: [
      {
        id: "msg-1",
        sender: "Claire Dubois",
        senderRole: "Requester",
        timestamp: "2026-03-26 11:00:00",
        avatar: "CD",
        text: "We want our evening shift supervisors to perform discount overrides up to 20% without requiring an Owner PIN, while still restricting refund permissions.",
      },
      {
        id: "msg-2",
        sender: "Alex Support",
        senderRole: "Support Specialist",
        timestamp: "2026-03-26 13:40:00",
        avatar: "AS",
        text: "Bonjour Claire! You can configure granular discount ceiling permissions under Restaurant Admin -> Staff Roles -> Custom Permissions. Have you tried setting the Discount Threshold slider to 20%?",
      },
    ],
  },
  {
    id: "TCK-8905",
    ticketNumber: "#8905",
    restaurantId: "REST-005",
    restaurantName: "Taco Fiesta Cantina",
    requesterName: "Carlos Mendez",
    requesterEmail: "carlos@tacofiesta.com",
    requesterRole: "Owner",
    subject: "Table QR ordering digital menu sync latency during peak hours",
    category: "Technical & Performance",
    priority: "Medium",
    status: "Resolved",
    createdAt: "2026-03-25 18:45:00",
    updatedAt: "2 days ago",
    assignedTo: "DevOps Platform Support",
    description:
      "When we marked 8 menu items as 86'd (out of stock) on the POS, table QR codes continued allowing customer orders for about 4 minutes.",
    messages: [
      {
        id: "msg-1",
        sender: "Carlos Mendez",
        senderRole: "Requester",
        timestamp: "2026-03-25 18:45:00",
        avatar: "CM",
        text: "When we marked 8 menu items as 86'd (out of stock) on the POS, table QR codes continued allowing customer orders for about 4 minutes.",
      },
      {
        id: "msg-2",
        sender: "DevOps Platform Support",
        senderRole: "Super Admin Support",
        timestamp: "2026-03-25 19:15:00",
        avatar: "DO",
        text: "We identified a Redis edge cache TTL caching bug on menu inventory mutations. We deployed patch v2.8.4-p1 which reduces menu propagation latency to under 300 milliseconds globally.",
      },
      {
        id: "msg-3",
        sender: "Carlos Mendez",
        senderRole: "Requester",
        timestamp: "2026-03-25 20:02:00",
        avatar: "CM",
        text: "Tested just now and it updates instantly! Thank you so much for the swift fix.",
      },
    ],
  },
  {
    id: "TCK-8906",
    ticketNumber: "#8906",
    restaurantId: "REST-007",
    restaurantName: "Dragon Wok Express",
    requesterName: "Li Wei",
    requesterEmail: "li.wei@dragonwok.com",
    requesterRole: "Operations Lead",
    subject: "Tax rate invoice calculation rounding difference on delivery orders",
    category: "Billing & Subscriptions",
    priority: "High",
    status: "Closed",
    createdAt: "2026-03-24 10:15:00",
    updatedAt: "3 days ago",
    assignedTo: "Finance Operations",
    description:
      "Our monthly accounting report had a 3 cent variance due to half-up vs half-even floating point rounding on multi-item delivery bags.",
    messages: [
      {
        id: "msg-1",
        sender: "Li Wei",
        senderRole: "Requester",
        timestamp: "2026-03-24 10:15:00",
        avatar: "LW",
        text: "Our monthly accounting report had a 3 cent variance due to half-up vs half-even floating point rounding on multi-item delivery bags.",
      },
      {
        id: "msg-2",
        sender: "Finance Operations",
        senderRole: "Finance Specialist",
        timestamp: "2026-03-24 12:00:00",
        avatar: "FO",
        text: "We recalculated the ledger with banker's rounding compliance and issued an updated credit adjustment CSV. Ticket resolved.",
      },
    ],
  },
];

export const calculateSupportStats = (tickets = []) => {
  const total = tickets.length;
  const open = tickets.filter((t) => t.status === "Open").length;
  const inProgress = tickets.filter((t) => t.status === "In Progress").length;
  const waitingCustomer = tickets.filter((t) => t.status === "Waiting Customer").length;
  const resolved = tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length;
  const critical = tickets.filter((t) => t.priority === "Critical" && t.status !== "Closed" && t.status !== "Resolved").length;

  return {
    total,
    open,
    inProgress,
    waitingCustomer,
    resolved,
    critical,
    avgResponseTime: "1.8 hrs",
    slaCompliance: "99.4%",
  };
};
