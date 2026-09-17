import React from "react";
import {
  CreditCard,
  Building2,
  Globe,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Calendar,
  Layers,
  Store,
  Hash,
  ShieldCheck,
} from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import {
  PAYMENT_STATUS_VARIANTS,
  INVOICE_STATUS_VARIANTS,
} from "../../../data/payments";
import { SUB_PLAN_VARIANTS } from "../../../data/subscriptions";

export default function PaymentDetailsModal({
  isOpen,
  onClose,
  payment,
  onViewInvoice,
  onRefund,
}) {
  if (!isOpen || !payment) return null;

  const payStatusVariant = PAYMENT_STATUS_VARIANTS[payment.paymentStatus] || "default";
  const invStatusVariant = INVOICE_STATUS_VARIANTS[payment.invoiceStatus] || "default";
  const planVariant = SUB_PLAN_VARIANTS[payment.planName] || "primary";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Transaction Record"
      subtitle={`Settlement details for ${payment.restaurantName}`}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {payment.paymentStatus === "Paid" && (
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                if (onRefund) onRefund(payment);
              }}
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Issue Refund
            </Button>
          )}
          <Button
            variant="primary"
            onClick={() => {
              onClose();
              if (onViewInvoice) onViewInvoice(payment);
            }}
          >
            <FileText className="w-3.5 h-3.5 mr-1" />
            View Invoice
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Top Summary Banner */}
        <div className="p-4 rounded-xl bg-bg-main border border-border flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
              Settlement Amount
            </span>
            <span className="text-xl font-extrabold text-text-primary mt-0.5 block">
              {payment.amount}
            </span>
            <p className="text-[11px] text-text-muted mt-0.5">
              Plan: {payment.planName} ({payment.billingCycle})
            </p>
          </div>

          <div className="text-right space-y-1">
            <Badge variant={payStatusVariant} size="md" dot>
              {payment.paymentStatus}
            </Badge>
            <p className="text-[10px] text-text-muted font-mono block">
              Inv: {payment.invoiceId}
            </p>
          </div>
        </div>

        {/* Transaction Identity Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-bg-card border border-border">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
              Payment Reference ID
            </span>
            <span className="font-mono font-bold text-text-primary text-xs mt-0.5 block truncate">
              {payment.paymentId}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-bg-card border border-border">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
              Invoice Reference
            </span>
            <span className="font-mono font-bold text-text-primary text-xs mt-0.5 block truncate">
              {payment.invoiceId}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-bg-card border border-border">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
              Restaurant Tenant
            </span>
            <span className="font-bold text-text-primary text-xs mt-0.5 block truncate">
              {payment.restaurantName}
            </span>
            <span className="text-[10px] text-text-muted font-mono block">
              {payment.restaurantId}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-bg-card border border-border">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
              Subscription Agreement
            </span>
            <span className="font-mono font-bold text-text-primary text-xs mt-0.5 block truncate">
              {payment.subscriptionId}
            </span>
          </div>
        </div>

        {/* Payment Gateway & Method Details (Masked Security) */}
        <div className="p-3.5 rounded-xl bg-bg-main/60 border border-border space-y-2.5">
          <h4 className="font-bold text-text-primary flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Payment Method & Channel</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-bg-card border border-border">
              <span className="text-text-muted">Payment Channel:</span>
              <span className="font-semibold text-text-primary">
                {payment.paymentMethod}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-bg-card border border-border">
              <span className="text-text-muted">Instrument:</span>
              <span className="font-semibold text-text-primary font-mono">
                {payment.cardLast4
                  ? `•••• ${payment.cardLast4} (${payment.cardBrand})`
                  : payment.cardBrand || "Direct Transfer"}
              </span>
            </div>

            <div className="sm:col-span-2 flex items-center justify-between p-2 rounded-lg bg-bg-card border border-border">
              <span className="text-text-muted">Gateway Txn Ref:</span>
              <span className="font-mono text-text-secondary text-[11px] truncate max-w-[200px]">
                {payment.transactionReference || "None"}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline Dates */}
        <div className="grid grid-cols-3 gap-2 text-[11px] text-text-muted border-t border-border pt-3">
          <div>
            <span className="block font-medium">Invoiced Date:</span>
            <span className="text-text-primary font-semibold">{payment.invoiceDate}</span>
          </div>
          <div>
            <span className="block font-medium">Payment Date:</span>
            <span className="text-text-primary font-semibold">{payment.paymentDate}</span>
          </div>
          <div>
            <span className="block font-medium">Payment Due:</span>
            <span className="text-text-primary font-semibold">{payment.dueDate}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
