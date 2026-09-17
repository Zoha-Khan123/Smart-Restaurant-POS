import React, { useState, useEffect } from "react";
import {
  RotateCcw,
  AlertTriangle,
  DollarSign,
  ShieldAlert,
  Info,
} from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

export default function RefundPaymentModal({
  isOpen,
  onClose,
  payment,
  onConfirm,
}) {
  const [refundAmount, setRefundAmount] = useState("");
  const [reason, setReason] = useState("Customer requested cancellation");
  const [customReason, setCustomReason] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (payment) {
      setRefundAmount(payment.rawTotal?.toString() || "");
      setReason("Customer requested cancellation");
      setCustomReason("");
      setError("");
    }
  }, [payment, isOpen]);

  if (!isOpen || !payment) return null;

  const maxAmount = payment.rawTotal || 0;

  const handleAmountChange = (val) => {
    setRefundAmount(val);
    const num = Number(val);
    if (isNaN(num) || num <= 0) {
      setError("Refund amount must be greater than $0.00");
    } else if (num > maxAmount) {
      setError(`Refund amount cannot exceed original payment of $${maxAmount.toFixed(2)}`);
    } else {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(refundAmount);
    if (isNaN(num) || num <= 0) {
      setError("Please enter a valid refund amount");
      return;
    }
    if (num > maxAmount) {
      setError(`Refund amount cannot exceed $${maxAmount.toFixed(2)}`);
      return;
    }

    const finalReason = reason === "Other" ? customReason : reason;
    if (!finalReason.trim()) {
      setError("Refund audit reason is required");
      return;
    }

    setIsSubmitting(true);

    const updatedData = {
      paymentStatus: "Refunded",
      invoiceStatus: "Cancelled",
      refundAmount: num,
      refundReason: finalReason,
      updatedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onConfirm(payment.id, updatedData);
      onClose();
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Issue Transaction Refund"
      subtitle={`Process settlement reversal for ${payment.restaurantName}`}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleSubmit}
            disabled={Boolean(error) || !refundAmount || isSubmitting}
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            {isSubmitting ? "Processing..." : `Refund $${Number(refundAmount || 0).toFixed(2)}`}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Warning Banner */}
        <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong className="block text-xs">Gateway Reversal Notice</strong>
            Refunding will adjust platform revenue metrics and notify the tenant accounting contact.
          </div>
        </div>

        {/* Invoice & Original Amount Summary */}
        <div className="p-3.5 rounded-xl bg-bg-main border border-border flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-text-muted">
              Invoice Reference
            </span>
            <p className="font-mono font-bold text-text-primary text-xs sm:text-sm mt-0.5">
              {payment.invoiceId}
            </p>
            <p className="text-[10px] text-text-muted">{payment.restaurantName}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-text-muted">
              Settled Payment
            </span>
            <p className="font-extrabold text-text-primary text-xs sm:text-sm mt-0.5 font-mono">
              {payment.amount}
            </p>
            <p className="text-[10px] text-text-muted">Method: {payment.paymentMethod}</p>
          </div>
        </div>

        {/* Refund Amount Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-text-primary">
              Refund Amount (USD) *
            </label>
            <button
              type="button"
              onClick={() => handleAmountChange(maxAmount.toString())}
              className="text-[11px] text-primary hover:underline font-semibold cursor-pointer"
            >
              Full Refund (${maxAmount.toFixed(2)})
            </button>
          </div>

          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted font-bold text-sm">
              $
            </span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={maxAmount}
              value={refundAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className={`w-full pl-8 pr-4 py-2.5 rounded-xl bg-bg-main border text-text-primary text-xs font-mono font-bold focus:outline-none focus:ring-2 ${
                error
                  ? "border-danger focus:ring-danger/20"
                  : "border-border focus:border-primary focus:ring-primary/20"
              }`}
              placeholder="0.00"
              required
            />
          </div>
          {error && (
            <p className="text-[11px] text-danger mt-1 font-medium">{error}</p>
          )}
        </div>

        {/* Reason for Refund */}
        <div>
          <label className="block text-xs font-bold text-text-primary mb-1.5">
            Audit Reason for Refund *
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-bg-main border border-border text-text-primary text-xs focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="Customer requested cancellation">
              Customer requested cancellation during trial setup
            </option>
            <option value="Duplicate transaction charge">
              Duplicate transaction charge
            </option>
            <option value="Service SLA outage compensation">
              Service SLA outage compensation
            </option>
            <option value="Plan downgrade adjustment">
              Plan downgrade adjustment
            </option>
            <option value="Billing dispute resolution">
              Billing dispute resolution
            </option>
            <option value="Other">Other (Specify Below)</option>
          </select>

          {reason === "Other" && (
            <input
              type="text"
              placeholder="Enter specific audit reason..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="mt-2 w-full px-3 py-2 rounded-xl bg-bg-main border border-border text-text-primary text-xs focus:outline-none focus:border-primary"
              required
            />
          )}
        </div>
      </form>
    </Modal>
  );
}
