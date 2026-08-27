/**
 * Smart POS - Reports & Sales Analytics Dataset
 */

export const DATE_RANGES = [
  "Today",
  "Yesterday",
  "Last 7 Days",
  "Last 30 Days",
  "This Month",
  "Custom Range",
];

export const SALES_TREND_DATA = [
  { date: "Mon", sales: 42500, orders: 48, netProfit: 18200 },
  { date: "Tue", sales: 38900, orders: 42, netProfit: 16500 },
  { date: "Wed", sales: 51200, orders: 58, netProfit: 22400 },
  { date: "Thu", sales: 47800, orders: 52, netProfit: 20100 },
  { date: "Fri", sales: 68400, orders: 76, netProfit: 30800 },
  { date: "Sat", sales: 84500, orders: 94, netProfit: 39200 },
  { date: "Sun", sales: 79200, orders: 88, netProfit: 36400 },
];

export const ORDER_TYPES_DATA = [
  { name: "Dine In", value: 265, amount: 238500, color: "#2563eb" },
  { name: "Takeaway", value: 128, amount: 115200, color: "#16a34a" },
  { name: "Delivery", value: 65, amount: 58800, color: "#f59e0b" },
];

export const HOURLY_ORDER_RUSH = [
  { hour: "11 AM", dineIn: 12, takeaway: 8, delivery: 4 },
  { hour: "1 PM", dineIn: 45, takeaway: 22, delivery: 14 },
  { hour: "3 PM", dineIn: 18, takeaway: 15, delivery: 6 },
  { hour: "5 PM", dineIn: 24, takeaway: 18, delivery: 10 },
  { hour: "7 PM", dineIn: 52, takeaway: 28, delivery: 16 },
  { hour: "9 PM", dineIn: 64, takeaway: 30, delivery: 22 },
  { hour: "11 PM", dineIn: 28, takeaway: 12, delivery: 8 },
];

export const PAYMENT_METHODS_DATA = [
  { name: "Cash", value: 248600, count: 284, share: "60%", color: "#16a34a" },
  { name: "Debit/Credit Card", value: 132400, count: 142, share: "32%", color: "#2563eb" },
  { name: "Online QR / Bank", value: 31800, count: 32, share: "8%", color: "#8b5cf6" },
];

export const DAILY_PAYMENT_COLLECTION = [
  { day: "Mon", cash: 25500, card: 13600, online: 3400 },
  { day: "Tue", cash: 23300, card: 12400, online: 3200 },
  { day: "Wed", cash: 30700, card: 16400, online: 4100 },
  { day: "Thu", cash: 28700, card: 15300, online: 3800 },
  { day: "Fri", cash: 41000, card: 21900, online: 5500 },
  { day: "Sat", cash: 50700, card: 27000, online: 6800 },
  { day: "Sun", cash: 48700, card: 25800, online: 5000 },
];

export const STAFF_PERFORMANCE_DATA = [
  { name: "Usman Ali", role: "Head Waiter", orders: 142, sales: 148200, rating: 4.9, speed: "12m avg" },
  { name: "Sara Bibi", role: "VIP Captain", orders: 96, sales: 152100, rating: 5.0, speed: "10m avg" },
  { name: "Ali Raza", role: "Waiter", orders: 118, sales: 112500, rating: 4.8, speed: "14m avg" },
  { name: "Hamza Tariq", role: "Order Taker", orders: 102, sales: 89400, rating: 4.7, speed: "15m avg" },
];

export const CATEGORY_SALES_SHARE = [
  { name: "Burgers", value: 257300, color: "#2563eb" },
  { name: "Pizza", value: 193500, color: "#f97316" },
  { name: "Beverages", value: 98600, color: "#16a34a" },
  { name: "Sides", value: 54200, color: "#f59e0b" },
  { name: "Desserts", value: 34500, color: "#8b5cf6" },
];

export const TOP_PRODUCTS_REPORT = [
  {
    id: "p1",
    name: "Zinger Burger",
    category: "Burgers",
    quantity: 342,
    revenue: 153900,
    growth: "+14%",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "p3",
    name: "Chicken Pizza (Med)",
    category: "Pizza",
    quantity: 215,
    revenue: 193500,
    growth: "+18%",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "p2",
    name: "Beef Burger",
    category: "Burgers",
    quantity: 188,
    revenue: 103400,
    growth: "+9%",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "p7",
    name: "Coke (500ml)",
    category: "Drinks",
    quantity: 480,
    revenue: 57600,
    growth: "+22%",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "p9",
    name: "Cold Coffee",
    category: "Coffee",
    quantity: 164,
    revenue: 41000,
    growth: "+11%",
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&auto=format&fit=crop&q=80",
  },
];

export const SALES_TRANSACTIONS = [
  {
    id: "tx-1",
    orderNumber: "ORD-1024",
    date: "20 May 2024, 12:35 PM",
    customer: "Zainab Shah",
    category: "Burgers & Pizza",
    items: "Zinger Burger (2x), Pizza (1x), Coke (2x)",
    paymentMethod: "Cash",
    subtotal: 2040,
    discount: 150,
    tax: 94,
    total: 1984,
    status: "Completed",
  },
  {
    id: "tx-2",
    orderNumber: "ORD-1023",
    date: "20 May 2024, 12:28 PM",
    customer: "Ahmed Khan",
    category: "Burgers",
    items: "Beef Burger (1x), Fries (1x), Cold Coffee (2x)",
    paymentMethod: "Card",
    subtotal: 1300,
    discount: 0,
    tax: 65,
    total: 1365,
    status: "Completed",
  },
  {
    id: "tx-3",
    orderNumber: "ORD-1022",
    date: "20 May 2024, 12:15 PM",
    customer: "Walk-in Guest",
    category: "Pizza",
    items: "Pepperoni Pizza Large (2x), Coke (3x)",
    paymentMethod: "Cash",
    subtotal: 2560,
    discount: 200,
    tax: 118,
    total: 2478,
    status: "Completed",
  },
  {
    id: "tx-4",
    orderNumber: "ORD-1021",
    date: "20 May 2024, 11:50 AM",
    customer: "Dr. Bilal Tariq",
    category: "Burgers & Drinks",
    items: "Double Patty (3x), Cold Coffee (3x)",
    paymentMethod: "Card",
    subtotal: 2700,
    discount: 150,
    tax: 128,
    total: 2678,
    status: "Completed",
  },
  {
    id: "tx-5",
    orderNumber: "ORD-1020",
    date: "20 May 2024, 11:30 AM",
    customer: "Usman Ghani",
    category: "Sides & Coffee",
    items: "Garlic Fries (2x), Cappuccino (2x)",
    paymentMethod: "Online",
    subtotal: 1100,
    discount: 50,
    tax: 53,
    total: 1103,
    status: "Completed",
  },
  {
    id: "tx-6",
    orderNumber: "ORD-1019",
    date: "20 May 2024, 11:10 AM",
    customer: "Fatima Noor",
    category: "Desserts",
    items: "Chocolate Brownie (2x), Vanilla Shake (1x)",
    paymentMethod: "Cash",
    subtotal: 820,
    discount: 0,
    tax: 41,
    total: 861,
    status: "Completed",
  },
  {
    id: "tx-7",
    orderNumber: "ORD-1018",
    date: "20 May 2024, 10:45 AM",
    customer: "Hamza Farooq",
    category: "Burgers",
    items: "Zinger Burger (1x), Coke (1x)",
    paymentMethod: "Cash",
    subtotal: 570,
    discount: 0,
    tax: 28,
    total: 598,
    status: "Completed",
  },
  {
    id: "tx-8",
    orderNumber: "ORD-1017",
    date: "20 May 2024, 10:20 AM",
    customer: "Corporate Order #4",
    category: "Burgers & Pizza",
    items: "Zinger (5x), Chicken Pizza (3x), Coke (8x)",
    paymentMethod: "Bank Transfer",
    subtotal: 5910,
    discount: 500,
    tax: 270,
    total: 5680,
    status: "Completed",
  },
];
