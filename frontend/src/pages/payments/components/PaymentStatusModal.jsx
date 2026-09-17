import React, { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Building2,
  CreditCard,
  Receipt,
  FileCheck,
} from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import {
  PAYMENT_STATUS_VARIANTS,
} from "../../../data/payments";

export default function PaymentStatusModal({
  isOpen,
  onClose,
  payment,
  onConfirm,
}) {
  const [offlineMethod, setOfflineMethod] = useState("Bank Transfer");
  const [referenceNote, setReferenceNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !payment) return null;

  const currentStatusVariant = PAYMENT_STATUS_VARIANTS[payment.paymentStatus] || "default";

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const todayStr = new Date().toISOString().split("T")[0];

    const updatedData = {
      paymentStatus: "Paid",
      invoiceStatus: "Paid",
      paymentDate: todayStr,
      paymentMethod: offlineMethod,
      transactionReference: referenceNote || `manual_wire_${Date.now().toString().slice(-6)}`,
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
      title="Mark Payment as Paid"
      subtitle={`Confirm offline settlement verification for ${payment.restaurantName}`}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="!bg-emerald-600 hover:!bg-emerald-700"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            {isSubmitting ? "Confirming..." : "Confirm Settlement"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Invoice Target Summary */}
        <div className="p-3.5 rounded-xl bg-bg-main border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-text-muted">
              Invoice Reference
            </span>
            <span className="font-mono font-bold text-text-primary text-xs">
              {payment.invoiceId}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-text-muted">Restaurant Tenant:</span>
            <span className="font-bold text-text-primary">{payment.restaurantName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-text-muted">Settlement Due:</span>
            <span className="font-extrabold text-primary text-sm font-mono">
              {payment.amount}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-border/60">
            <span className="text-text-muted">Current Status:</span>
            <Badge variant={currentStatusVariant} size="sm" dot>
              {payment.paymentStatus}
            </Badge>
          </div>
        </div>

        {/* Settlement Method Option */}
        <div>
          <label className="block text-xs font-bold text-text-primary mb-1.5">
            Confirmed Payment Method
          </label>
          <select
            value={offlineMethod}
            onChange={(e) => setOfflineMethod(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-bg-main border border-border text-text-primary text-xs focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="Bank Transfer">Bank Wire Transfer Verified</option>
            <option value="Online Payment">Online Gateway Manual Capture</option>
            <option value="Card">Direct Credit Card Authorization</option>
            <option value="Other">Manual Corporate Check / Settlement</option>
          </select>
        </div>

        {/* Audit Reference / Notes */}
        <div>
          <label className="block text-xs font-bold text-text-primary mb-1.5">
            Bank Transaction ID / Reference (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. WIRE-88910-US or Check #4412"
            value={referenceNote}
            onChange={(e) => setReferenceNote(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-bg-main border border-border text-text-primary text-xs focus:outline-none focus:border-primary"
          />
        </div>

        {/* Confirmation Note */}
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] leading-relaxed">
          <p className="font-semibold flex items-center gap-1.5 mb-0.5">
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Revenue Adjustment</span>
          </p>
          Marking this invoice as Paid will update platform revenue numbers and mark the tenant's subscription as settled.
        </div>
      </form>
    </Modal>
  );
}
