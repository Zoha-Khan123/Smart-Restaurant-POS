import React, { useState, useMemo } from "react";
import {
  Search,
  Receipt,
  Printer,
  CreditCard,
  Layers,
  PauseCircle,
  Tag,
  Percent,
  CheckCircle2,
  FileText,
  UserCheck,
  Building2,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Payment from "./Payment";
import SplitBill from "./SplitBill";

/**
 * Sample Active Unsettled Orders for Billing
 */
const SAMPLE_BILLING_ORDERS = [
  {
    id: "ord-1024",
    orderNumber: "Order #1024",
    invoiceNumber: "INV-2024-001024",
    table: "Table 05",
    orderType: "Dine In",
    customer: "Zainab Shah",
    phone: "0300-1234567",
    waiter: "Usman Ali",
    date: "20 May 2024, 12:35 PM",
    discountPreset: 150,
    serviceCharge: 0,
    items: [
      { name: "Zinger Burger", quantity: 2, price: 450, total: 900 },
      { name: "Chicken Pizza", quantity: 1, price: 900, total: 900 },
      { name: "Coke (500ml)", quantity: 2, price: 120, total: 240 },
    ],
  },
  {
    id: "ord-1023",
    orderNumber: "Order #1023",
    invoiceNumber: "INV-2024-001023",
    table: "Table 03",
    orderType: "Dine In",
    customer: "Ahmed Khan",
    phone: "0301-9876543",
    waiter: "Ali Raza",
    date: "20 May 2024, 12:28 PM",
    discountPreset: 0,
    serviceCharge: 50,
    items: [
      { name: "Beef Burger", quantity: 1, price: 550, total: 550 },
      { name: "French Fries", quantity: 1, price: 250, total: 250 },
      { name: "Cold Coffee", quantity: 2, price: 250, total: 500 },
    ],
  },
  {
    id: "ord-1025",
    orderNumber: "Order #1025",
    invoiceNumber: "INV-2024-001025",
    table: "VIP Lounge",
    orderType: "Dine In",
    customer: "CEO Summit Group",
    phone: "0321-4567890",
    waiter: "Sara Bibi",
    date: "20 May 2024, 12:15 PM",
    discountPreset: 200,
    serviceCharge: 100,
    items: [
      { name: "Double Patty Burger", quantity: 3, price: 650, total: 1950 },
      { name: "Pepperoni Pizza", quantity: 1, price: 1100, total: 1100 },
      { name: "Cold Coffee", quantity: 3, price: 250, total: 750 },
    ],
  },
];

/**
 * Smart POS - Billing Main Screen (Screen 6 from Blueprint)
 */
export default function Billing() {
  // Navigation View: 'billing' | 'payment' | 'split'
  const [currentView, setCurrentView] = useState("billing");

  // Orders State
  const [orders, setOrders] = useState(SAMPLE_BILLING_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState("ord-1024");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & Discount Customization
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [customDiscountType, setCustomDiscountType] = useState("flat"); // 'flat' | 'percent'
  const [discountValue, setDiscountValue] = useState("150");
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Active Selected Order
  const activeOrder = useMemo(() => {
    return (
      orders.find((o) => o.id === selectedOrderId) ||
      orders[0] ||
      SAMPLE_BILLING_ORDERS[0]
    );
  }, [orders, selectedOrderId]);

  // Financial Calculations
  const calculations = useMemo(() => {
    if (!activeOrder) return { subtotal: 0, discount: 0, tax: 0, total: 0 };

    const subtotal = activeOrder.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    let discount = 0;
    if (customDiscountType === "percent") {
      discount = Math.round((subtotal * (parseFloat(discountValue) || 0)) / 100);
    } else {
      discount = parseFloat(discountValue) || 0;
    }

    const taxable = Math.max(0, subtotal - discount);
    const taxRate = 0.05; // 5% GST
    const taxAmount = Math.round(taxable * taxRate);
    const serviceCharge = activeOrder.serviceCharge || 0;
    const grandTotal = taxable + taxAmount + serviceCharge;

    return {
      subtotal,
      discount,
      taxAmount,
      serviceCharge,
      grandTotal,
    };
  }, [activeOrder, customDiscountType, discountValue]);

  // Order with active calculations for child views
  const enrichedOrder = useMemo(() => {
    return {
      ...activeOrder,
      ...calculations,
    };
  }, [activeOrder, calculations]);

  const handlePrintBill = () => {
    showToast(`Printing bill for ${activeOrder.orderNumber}...`, "info");
    window.print();
  };

  const handleHoldBill = () => {
    showToast(`Bill for ${activeOrder.orderNumber} put on hold`, "info");
  };

  const handlePaymentSuccess = (settledOrder) => {
    showToast(`Bill settled for ${settledOrder.table}!`, "success");
    // Remove or mark order as paid
    setOrders((prev) => prev.filter((o) => o.id !== settledOrder.id));
  };

  // -------------------------------------------------------------
  // RENDER CONDITIONAL SUB-VIEWS (PAYMENT OR SPLIT)
  // -------------------------------------------------------------

  if (currentView === "payment") {
    return (
      <Payment
        order={enrichedOrder}
        onBack={() => setCurrentView("billing")}
        onPaymentSuccess={handlePaymentSuccess}
      />
    );
  }

  if (currentView === "split") {
    return (
      <SplitBill
        order={enrichedOrder}
        onBack={() => setCurrentView("billing")}
        onProceedToPayment={(splitOrder) => {
          setCurrentView("payment");
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      
      {/* =========================================================
          TOP HEADER: TITLE, ORDER SEARCH & ACTIVE TABS
      ========================================================== */}
      <div className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice #, table, or customer..."
            className="w-full pl-10 pr-4 py-2.5 bg-bg-main border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Unsettled Orders Dropdown / Quick Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {orders.map((ord) => (
            <button
              key={ord.id}
              type="button"
              onClick={() => setSelectedOrderId(ord.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                selectedOrderId === ord.id
                  ? "bg-primary text-text-white border-primary shadow-xs"
                  : "bg-bg-main text-text-secondary hover:text-text-primary border-border"
              }`}
            >
              {ord.orderNumber} ({ord.table})
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================
          MAIN BILLING GRID: BILL DETAILS (LEFT) & INVOICE CARD (RIGHT)
      ========================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: ORDER INFO & ITEMIZED TABLE (7 COLS) */}
        <div className="lg:col-span-7 bg-bg-card rounded-2xl p-6 border border-border shadow-xs space-y-6">
          
          {/* Order Header Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-bold text-text-primary">
                  {activeOrder.orderNumber}
                </h3>
                <Badge variant="success">{activeOrder.table}</Badge>
                <Badge variant="primary">{activeOrder.orderType}</Badge>
              </div>
              <p className="text-xs text-text-muted mt-1">
                Invoice: <span className="font-semibold text-text-primary">{activeOrder.invoiceNumber}</span> • {activeOrder.date}
              </p>
            </div>

            <div className="text-left sm:text-right text-xs">
              <span className="text-text-muted block text-[11px]">Guest Details</span>
              <p className="font-bold text-text-primary">{activeOrder.customer}</p>
              <p className="text-text-muted text-[11px]">Waiter: {activeOrder.waiter}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Order Items ({activeOrder.items.length})
              </h4>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs">
                <thead className="bg-bg-main border-b border-border text-text-muted uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-4 py-3">Item</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light text-text-primary">
                  {activeOrder.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-bg-hover transition-colors">
                      <td className="px-4 py-3 font-semibold">{item.name}</td>
                      <td className="px-4 py-3 text-center font-bold text-primary">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right text-text-secondary">
                        Rs. {item.price.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-text-primary">
                        Rs. {(item.quantity * item.price).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Discount & Charges Controls */}
          <div className="p-4 rounded-xl bg-bg-main border border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs font-bold text-text-primary">
                  Applied Discount: Rs. {calculations.discount.toLocaleString()}
                </p>
                <p className="text-[11px] text-text-muted">
                  Custom discounts, voucher coupons, or staff offers
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDiscountModalOpen(true)}
              className="py-2 px-4 text-xs font-semibold shrink-0 gap-1.5"
            >
              <Percent className="w-3.5 h-3.5" />
              <span>Modify Discount</span>
            </Button>
          </div>

          {/* Secondary Actions: Hold & Split */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleHoldBill}
              className="py-2.5 text-xs font-semibold gap-1.5"
            >
              <PauseCircle className="w-4 h-4 text-amber-600" />
              <span>Hold Bill</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentView("split")}
              className="py-2.5 text-xs font-semibold gap-1.5"
            >
              <Layers className="w-4 h-4 text-primary" />
              <span>Split Bill</span>
            </Button>
          </div>

        </div>

        {/* RIGHT COLUMN: INVOICE BILL SUMMARY & PAYMENT CTA (5 COLS) */}
        <div className="lg:col-span-5 bg-bg-card rounded-2xl p-6 border border-border shadow-md space-y-6">
          
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold text-text-primary">
                BILL SUMMARY
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              UNPAID
            </span>
          </div>

          {/* Itemized Receipt Calculation */}
          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-text-secondary">
              <span>Items Subtotal</span>
              <span className="font-semibold text-text-primary">
                Rs. {calculations.subtotal.toLocaleString()}
              </span>
            </div>

            {calculations.discount > 0 && (
              <div className="flex justify-between text-danger font-medium">
                <span>Discount</span>
                <span>- Rs. {calculations.discount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-text-secondary">
              <span>GST / Sales Tax (5%)</span>
              <span className="font-semibold text-text-primary">
                Rs. {calculations.taxAmount.toLocaleString()}
              </span>
            </div>

            {calculations.serviceCharge > 0 && (
              <div className="flex justify-between text-text-secondary">
                <span>Service Charge</span>
                <span className="font-semibold text-text-primary">
                  Rs. {calculations.serviceCharge.toLocaleString()}
                </span>
              </div>
            )}

            {/* Grand Total Divider */}
            <div className="pt-4 border-t border-border flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold text-text-primary uppercase tracking-wider block">
                  GRAND TOTAL
                </span>
                <span className="text-[11px] text-text-muted">
                  Includes all taxes
                </span>
              </div>
              <span className="text-2xl font-extrabold text-emerald-600">
                Rs. {calculations.grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-2">
            <Button
              type="button"
              onClick={() => setCurrentView("payment")}
              fullWidth
              className="py-3.5 text-xs font-bold tracking-wider uppercase bg-emerald-600 hover:bg-emerald-700 text-white shadow-md gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>PROCEED TO PAYMENT</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handlePrintBill}
              fullWidth
              className="py-2.5 text-xs font-semibold gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Bill Slip</span>
            </Button>
          </div>

        </div>

      </div>

      {/* =========================================================
          MODAL: APPLY / MODIFY DISCOUNT
      ========================================================== */}
      {isDiscountModalOpen && (
        <Modal
          isOpen={isDiscountModalOpen}
          onClose={() => setIsDiscountModalOpen(false)}
          title="Apply Order Discount"
          subtitle={`Current Subtotal: Rs. ${calculations.subtotal.toLocaleString()}`}
          footer={
            <>
              <button
                type="button"
                onClick={() => setIsDiscountModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-text-secondary hover:bg-bg-hover rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <Button
                type="button"
                onClick={() => {
                  setIsDiscountModalOpen(false);
                  showToast("Discount applied to bill!");
                }}
                className="py-2 px-5 text-xs font-semibold"
              >
                Apply Discount
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            {/* Type selector */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCustomDiscountType("flat")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  customDiscountType === "flat"
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-bg-main border-border text-text-secondary"
                }`}
              >
                Flat Amount (Rs.)
              </button>

              <button
                type="button"
                onClick={() => setCustomDiscountType("percent")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  customDiscountType === "percent"
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-bg-main border-border text-text-secondary"
                }`}
              >
                Percentage (%)
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex gap-2">
              {(customDiscountType === "flat"
                ? ["0", "100", "150", "300", "500"]
                : ["0", "5", "10", "15", "20"]
              ).map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setDiscountValue(val)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-bg-main border border-border hover:border-primary text-text-primary"
                >
                  {customDiscountType === "flat" ? `Rs. ${val}` : `${val}%`}
                </button>
              ))}
            </div>

            {/* Input */}
            <Input
              label={
                customDiscountType === "flat"
                  ? "Discount Amount (Rs.)"
                  : "Discount Percentage (%)"
              }
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder="Enter discount value"
            />
          </div>
        </Modal>
      )}

      {/* TOAST FEEDBACK NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl text-white text-xs font-semibold flex items-center gap-2 ${
              toastMessage.type === "error" ? "bg-danger" : "bg-emerald-600"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

    </div>
  );
}
