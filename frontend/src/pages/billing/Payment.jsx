import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Banknote,
  QrCode,
  Printer,
  Receipt,
  RotateCcw,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";

/**
 * Payment Methods Configuration
 */
const PAYMENT_METHODS = [
  { id: "cash", label: "Cash", icon: Banknote, desc: "Cash counter payment" },
  { id: "card", label: "Debit / Credit Card", icon: CreditCard, desc: "POS card terminal" },
  { id: "online", label: "Online / Bank QR", icon: QrCode, desc: "Bank transfer, EasyPaisa, JazzCash" },
];

/**
 * Smart POS - Payment Processing Component (Screen 6 from Blueprint)
 */
export default function Payment({
  order,
  onBack,
  onPaymentSuccess,
}) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountReceived, setAmountReceived] = useState(
    order?.grandTotal ? String(order.grandTotal) : "2000"
  );
  const [referenceNumber, setReferenceNumber] = useState("");
  const [cardType, setCardType] = useState("Visa");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paidReceipt, setPaidReceipt] = useState(null);

  const grandTotal = order?.grandTotal || 1984;

  // Change Calculation for Cash
  const changeAmount = useMemo(() => {
    const received = parseFloat(amountReceived) || 0;
    return Math.max(0, received - grandTotal);
  }, [amountReceived, grandTotal]);

  const isAmountSufficient = (parseFloat(amountReceived) || 0) >= grandTotal;

  const quickCashOptions = [
    grandTotal,
    Math.ceil(grandTotal / 500) * 500,
    Math.ceil(grandTotal / 1000) * 1000,
    5000,
  ].filter((val, idx, self) => self.indexOf(val) === idx && val >= grandTotal);

  const handleConfirmPayment = () => {
    if (paymentMethod === "cash" && !isAmountSufficient) {
      alert("Amount received is less than total amount due.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setPaidReceipt({
        invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
        orderNo: order?.orderNumber || "Order #1024",
        table: order?.table || "Table 05",
        total: grandTotal,
        method: paymentMethod,
        amountReceived: parseFloat(amountReceived) || grandTotal,
        change: changeAmount,
        date: new Date().toLocaleString(),
      });
      if (onPaymentSuccess) onPaymentSuccess(order);
    }, 900);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  // SUCCESS STATE VIEW
  if (isSuccess && paidReceipt) {
    return (
      <div className="max-w-xl mx-auto py-8">
        <div className="bg-bg-card rounded-2xl border border-border shadow-lg p-6 sm:p-8 text-center">
          {/* Animated Success Icon */}
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-bold text-text-primary">
            Payment Successful!
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Transaction completed and bill settled for {paidReceipt.table}.
          </p>

          {/* Receipt Breakdown Card */}
          <div className="mt-6 p-4 rounded-xl bg-bg-main border border-border text-xs space-y-2.5 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-border-light">
              <span className="text-text-muted">Invoice Number</span>
              <span className="font-bold text-text-primary">{paidReceipt.invoiceNo}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Order Ref</span>
              <span className="font-semibold text-text-primary">{paidReceipt.orderNo}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Payment Method</span>
              <span className="font-bold text-primary uppercase">{paidReceipt.method}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Amount Received</span>
              <span className="font-semibold text-text-primary">
                Rs. {paidReceipt.amountReceived.toLocaleString()}
              </span>
            </div>
            {paidReceipt.method === "cash" && (
              <div className="flex justify-between items-center text-emerald-700 font-bold">
                <span>Change Returned</span>
                <span className="text-sm">Rs. {paidReceipt.change.toLocaleString()}</span>
              </div>
            )}
            <div className="pt-2 border-t border-border flex justify-between items-baseline">
              <span className="font-bold text-text-primary uppercase">Total Paid</span>
              <span className="text-lg font-bold text-emerald-600">
                Rs. {paidReceipt.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrintReceipt}
              fullWidth
              className="py-3 text-xs gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </Button>

            <Button
              type="button"
              onClick={onBack}
              fullWidth
              className="py-3 text-xs font-semibold"
            >
              Back to Billing / New Order
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between bg-bg-card rounded-2xl p-4 border border-border shadow-xs">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-text-primary px-3 py-2 rounded-xl hover:bg-bg-hover transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Order Bill</span>
        </button>

        <div className="flex items-center gap-2">
          <Badge variant="primary">{order?.orderNumber || "Order #1024"}</Badge>
          <Badge variant="success">{order?.table || "Table 05"}</Badge>
        </div>
      </div>

      {/* Main Payment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: PAYMENT METHOD & TENDER (7 COLS) */}
        <div className="lg:col-span-7 bg-bg-card rounded-2xl p-6 border border-border shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Select Payment Method
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Choose how the customer is settling the bill
            </p>
          </div>

          {/* Payment Method Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected
                      ? "border-primary bg-primary-light/40 text-primary shadow-xs ring-2 ring-primary/20"
                      : "border-border bg-bg-card text-text-secondary hover:bg-bg-hover hover:border-text-muted"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className="w-5 h-5" />
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-primary">
                      {method.label}
                    </h4>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      {method.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ====================================================
              CASH TENDER INPUTS
          ===================================================== */}
          {paymentMethod === "cash" && (
            <div className="p-5 rounded-xl bg-bg-main border border-border space-y-4 animate-fadeIn">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Cash Tender Calculation
              </h4>

              {/* Quick Cash Buttons */}
              <div className="flex flex-wrap gap-2">
                {quickCashOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAmountReceived(String(opt))}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-bg-card border border-border hover:border-primary text-text-primary hover:text-primary transition-colors cursor-pointer"
                  >
                    Rs. {opt.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Amount Received Input */}
              <div>
                <label className="text-xs font-medium text-text-primary mb-1.5 block">
                  Amount Received from Customer (Rs.)
                </label>
                <input
                  type="number"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  placeholder="Enter cash received"
                  className="w-full text-base font-bold px-4 py-2.5 bg-bg-card border border-border rounded-xl text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Live Change Calculator Banner */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                  Change to Return
                </span>
                <span className="text-lg font-extrabold text-emerald-700">
                  Rs. {changeAmount.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* ====================================================
              CARD INPUTS
          ===================================================== */}
          {paymentMethod === "card" && (
            <div className="p-5 rounded-xl bg-bg-main border border-border space-y-4 animate-fadeIn">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                POS Card Terminal Details
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-text-primary mb-1.5 block">
                    Card Network
                  </label>
                  <select
                    value={cardType}
                    onChange={(e) => setCardType(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 bg-bg-card border border-border rounded-lg"
                  >
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="PayPak">PayPak</option>
                    <option value="UnionPay">UnionPay</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-text-primary mb-1.5 block">
                    Terminal Slip / Ref # (Optional)
                  </label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="e.g. TXN-8942"
                    className="w-full text-xs px-3 py-2.5 bg-bg-card border border-border rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              ONLINE / QR INPUTS
          ===================================================== */}
          {paymentMethod === "online" && (
            <div className="p-5 rounded-xl bg-bg-main border border-border space-y-4 animate-fadeIn text-center">
              <QrCode className="w-12 h-12 text-primary mx-auto opacity-80" />
              <div>
                <h4 className="text-xs font-bold text-text-primary">
                  Scan Dynamic Restaurant QR Code
                </h4>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Accept EasyPaisa, JazzCash, Nayapay, Raast, or Mobile Banking
                </p>
              </div>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="Enter Transaction ID (TID) / Customer mobile..."
                className="w-full text-xs px-3.5 py-2.5 bg-bg-card border border-border rounded-xl text-center"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="py-3 px-5 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmPayment}
              loading={isProcessing}
              fullWidth
              className="py-3 text-xs font-bold tracking-wider uppercase bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              CONFIRM & PAY BILL (Rs. {grandTotal.toLocaleString()})
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN: BILL SUMMARY (5 COLS) */}
        <div className="lg:col-span-5 bg-bg-card rounded-2xl p-6 border border-border shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold text-text-primary">
                Bill Summary
              </h3>
            </div>
            <span className="text-xs text-text-muted">
              {order?.date || "Today 12:35 PM"}
            </span>
          </div>

          {/* Itemized Table */}
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto divide-y divide-border-light text-xs">
            {order?.items?.map((item, idx) => (
              <div key={idx} className="pt-2 first:pt-0 flex justify-between items-center">
                <div>
                  <p className="font-bold text-text-primary">
                    {item.quantity}× {item.name}
                  </p>
                  <p className="text-[10px] text-text-muted">@ Rs. {item.price}</p>
                </div>
                <span className="font-bold text-text-primary">
                  Rs. {item.quantity * item.price}
                </span>
              </div>
            )) || (
              <p className="text-xs text-text-muted py-4 text-center">
                Sample Order Items Loaded
              </p>
            )}
          </div>

          {/* Breakdown */}
          <div className="pt-3 border-t border-border space-y-2 text-xs">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal</span>
              <span className="font-semibold text-text-primary">
                Rs. {(order?.subtotal || 2040).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-danger font-medium">
              <span>Discount</span>
              <span>- Rs. {(order?.discount || 150).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Tax (5%)</span>
              <span className="font-semibold text-text-primary">
                Rs. {(order?.taxAmount || 94).toLocaleString()}
              </span>
            </div>
            <div className="pt-3 border-t border-border flex justify-between items-baseline">
              <span className="text-sm font-bold text-text-primary uppercase">
                TOTAL DUE
              </span>
              <span className="text-2xl font-bold text-emerald-600">
                Rs. {grandTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
