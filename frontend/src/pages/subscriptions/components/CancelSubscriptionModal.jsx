import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Ban,
  Calendar,
  ShieldAlert,
  Info,
} from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

export default function CancelSubscriptionModal({
  isOpen,
  onClose,
  subscription,
  onConfirm,
}) {
  const [cancelTiming, setCancelTiming] = useState("end_of_period"); // "end_of_period" | "immediate"
  const [reason, setReason] = useState("Tenant requested cancellation");
  const [customReason, setCustomReason] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (subscription) {
      setCancelTiming("end_of_period");
      setReason("Tenant requested cancellation");
      setCustomReason("");
      setIsConfirmed(false);
    }
  }, [subscription, isOpen]);

  if (!isOpen || !subscription) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isConfirmed) return;

    setIsSubmitting(true);

    const finalReason = reason === "Other" ? customReason : reason;

    const updatedData = {
      status: cancelTiming === "immediate" ? "Cancelled" : subscription.status,
      autoRenewal: false,
      cancellationTiming: cancelTiming,
      cancellationReason: finalReason,
      cancelledAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      daysRemaining: cancelTiming === "immediate" ? 0 : subscription.daysRemaining,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onConfirm(subscription.id, updatedData);
      onClose();
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel Subscription"
      subtitle={`Configure cancellation policy for ${subscription.restaurantName}`}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Keep Subscription
          </Button>
          <Button
            variant="danger"
            onClick={handleSubmit}
            disabled={!isConfirmed || isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Confirm Cancellation"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Warning Banner */}
        <div className="p-3.5 rounded-xl bg-danger-light border border-danger/20 text-danger flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-danger" />
          <div className="text-[11px] leading-relaxed">
            <strong className="block text-xs">Subscription Cancellation Warning</strong>
            Cancelling this subscription will disable automatic renewals and limit tenant access according to selected timeline.
          </div>
        </div>

        {/* Subscription Target Summary */}
        <div className="p-3.5 rounded-xl bg-bg-main border border-border flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-text-muted">
              Restaurant
            </span>
            <p className="font-bold text-text-primary text-xs sm:text-sm mt-0.5">
              {subscription.restaurantName}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-text-muted">
              Plan & End Date
            </span>
            <p className="font-bold text-text-primary text-xs sm:text-sm mt-0.5">
              {subscription.planName} • {subscription.endDate}
            </p>
          </div>
        </div>

        {/* Cancellation Timing */}
        <div>
          <label className="block text-xs font-bold text-text-primary mb-2">
            Cancellation Effective Timing
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-bg-card hover:bg-bg-hover cursor-pointer transition-colors">
              <input
                type="radio"
                name="cancelTiming"
                value="end_of_period"
                checked={cancelTiming === "end_of_period"}
                onChange={(e) => setCancelTiming(e.target.value)}
                className="text-primary focus:ring-primary h-4 w-4"
              />
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-text-primary block text-xs">
                  At end of current billing cycle ({subscription.endDate})
                </span>
                <span className="text-[10px] text-text-muted">
                  Recommended. Tenant retains platform access for the remaining {subscription.daysRemaining} days already paid for.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-bg-card hover:bg-bg-hover cursor-pointer transition-colors">
              <input
                type="radio"
                name="cancelTiming"
                value="immediate"
                checked={cancelTiming === "immediate"}
                onChange={(e) => setCancelTiming(e.target.value)}
                className="text-danger focus:ring-danger h-4 w-4"
              />
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-danger block text-xs">
                  Immediately (Revoke access now)
                </span>
                <span className="text-[10px] text-text-muted">
                  Immediately cuts off POS cloud syncing and marks tenant account as Cancelled.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Reason for Cancellation */}
        <div>
          <label className="block text-xs font-bold text-text-primary mb-1.5">
            Reason for Cancellation
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-bg-main border border-border text-text-primary text-xs focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="Tenant requested cancellation">
              Tenant requested cancellation
            </option>
            <option value="Non-payment / Card failed repeatedly">
              Non-payment / Card failed repeatedly
            </option>
            <option value="Restaurant permanently closed">
              Restaurant permanently closed
            </option>
            <option value="Switched to alternative platform">
              Switched to alternative platform
            </option>
            <option value="Violation of Platform Terms">
              Violation of Platform Terms
            </option>
            <option value="Other">Other (Specify Below)</option>
          </select>

          {reason === "Other" && (
            <input
              type="text"
              placeholder="Specify cancellation details for audit records..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="mt-2 w-full px-3 py-2 rounded-xl bg-bg-main border border-border text-text-primary text-xs focus:outline-none focus:border-primary"
              required
            />
          )}
        </div>

        {/* Confirmation Checkbox */}
        <div className="p-3 rounded-xl bg-bg-main border border-border">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="mt-0.5 text-danger rounded focus:ring-danger h-4 w-4 cursor-pointer"
            />
            <span className="text-xs text-text-secondary leading-snug">
              I acknowledge that I am modifying the active contract for{" "}
              <strong className="text-text-primary">{subscription.restaurantName}</strong>{" "}
              and have verified this decision.
            </span>
          </label>
        </div>
      </form>
    </Modal>
  );
}
