import React, { useState, useEffect } from "react";
import {
  CalendarPlus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";

const EXTENSION_PRESETS = [
  { label: "+7 Days", days: 7, desc: "Grace period" },
  { label: "+15 Days", days: 15, desc: "Half month" },
  { label: "+30 Days", days: 30, desc: "1 Month extension" },
  { label: "+90 Days", days: 90, desc: "1 Quarter (3 mos)" },
  { label: "+180 Days", days: 180, desc: "Half Year (6 mos)" },
  { label: "+365 Days", days: 365, desc: "Full Year (12 mos)" },
];

export default function ExtendSubscriptionModal({
  isOpen,
  onClose,
  subscription,
  onSave,
}) {
  const [selectedDays, setSelectedDays] = useState(30);
  const [customDays, setCustomDays] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [reason, setReason] = useState("Manual Offline Payment Confirmed");
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (subscription) {
      setSelectedDays(30);
      setIsCustom(false);
      setCustomDays("");
      setReason("Manual Offline Payment Confirmed");
      setCustomReason("");
    }
  }, [subscription, isOpen]);

  if (!isOpen || !subscription) return null;

  const effectiveDaysToAdd = isCustom
    ? Math.max(Number(customDays) || 0, 1)
    : selectedDays;

  // Calculate new end date based on current end date or current date
  const currentEnd = new Date(subscription.endDate || Date.now());
  // If current date is already in past, extend from now
  const baseDate = currentEnd.getTime() < Date.now() ? new Date() : currentEnd;
  const newEndDateObj = new Date(baseDate.getTime() + effectiveDaysToAdd * 24 * 60 * 60 * 1000);
  const formattedNewEndDate = newEndDateObj.toISOString().split("T")[0];
  const newDaysRemaining = Math.max(
    (subscription.daysRemaining > 0 ? subscription.daysRemaining : 0) + effectiveDaysToAdd,
    effectiveDaysToAdd
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalReason = reason === "Other" ? customReason : reason;

    const updatedData = {
      endDate: formattedNewEndDate,
      nextBillingDate: formattedNewEndDate,
      daysRemaining: newDaysRemaining,
      status: "Active", // Resets to active if it was expired or past due
      paymentStatus: "Paid",
      updatedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      extensionNote: `${effectiveDaysToAdd} days added (${finalReason})`,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSave(subscription.id, updatedData);
      onClose();
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Extend Subscription Validity"
      subtitle={`Grant additional service period for ${subscription.restaurantName}`}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={effectiveDaysToAdd <= 0 || isSubmitting}
          >
            {isSubmitting ? "Extending..." : `Extend by ${effectiveDaysToAdd} Days`}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Current Validity Summary */}
        <div className="p-3.5 rounded-xl bg-bg-main border border-border flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-text-muted">
              Current Expiration
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-text-muted" />
              <span className="font-bold text-text-primary text-xs sm:text-sm">
                {subscription.endDate}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-text-muted">
              Current Remaining
            </span>
            <p className="font-bold text-text-primary text-xs sm:text-sm mt-0.5">
              {subscription.daysRemaining} Days
            </p>
          </div>
        </div>

        {/* Extension Duration Presets */}
        <div>
          <label className="block text-xs font-bold text-text-primary mb-2">
            Select Extension Duration
          </label>
          <div className="grid grid-cols-3 gap-2">
            {EXTENSION_PRESETS.map((preset) => {
              const isSelected = !isCustom && selectedDays === preset.days;
              return (
                <button
                  key={preset.days}
                  type="button"
                  onClick={() => {
                    setIsCustom(false);
                    setSelectedDays(preset.days);
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-primary/10 border-primary text-primary font-bold ring-2 ring-primary/20"
                      : "bg-bg-card border-border text-text-secondary hover:border-text-muted"
                  }`}
                >
                  <p className="text-xs font-bold">{preset.label}</p>
                  <p className="text-[10px] opacity-75 mt-0.5">{preset.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Custom Duration Input */}
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCustom(true)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                isCustom
                  ? "bg-primary/10 border-primary text-primary font-bold"
                  : "bg-bg-card border-border text-text-muted hover:text-text-primary"
              }`}
            >
              Custom Days:
            </button>
            {isCustom && (
              <input
                type="number"
                min="1"
                max="1825"
                placeholder="e.g. 45"
                value={customDays}
                onChange={(e) => setCustomDays(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-bg-main border border-border text-text-primary text-xs focus:outline-none focus:border-primary"
              />
            )}
          </div>
        </div>

        {/* Reason for Extension */}
        <div>
          <label className="block text-xs font-bold text-text-primary mb-1.5">
            Audit Reason for Extension
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-bg-main border border-border text-text-primary text-xs focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="Manual Offline Payment Confirmed">
              Manual Offline Payment Confirmed (Bank Transfer / Wire)
            </option>
            <option value="Grace Period / Courtesy Extension">
              Grace Period / Courtesy Extension
            </option>
            <option value="Billing Dispute Resolution">
              Billing Dispute Resolution
            </option>
            <option value="Promotional Goodwill Credit">
              Promotional Goodwill Credit
            </option>
            <option value="Platform Outage / Service SLA Compensation">
              Platform Outage / Service SLA Compensation
            </option>
            <option value="Other">Other (Specify Below)</option>
          </select>

          {reason === "Other" && (
            <input
              type="text"
              placeholder="Enter detailed reason for audit log..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="mt-2 w-full px-3 py-2 rounded-xl bg-bg-main border border-border text-text-primary text-xs focus:outline-none focus:border-primary"
              required
            />
          )}
        </div>

        {/* Calculation Preview Alert */}
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong>Extension Summary:</strong> Extending by{" "}
            <strong>+{effectiveDaysToAdd} days</strong> will set new expiration date to{" "}
            <strong>{formattedNewEndDate}</strong> (
            <strong>{newDaysRemaining} total days remaining</strong>). Status will update to Active.
          </div>
        </div>
      </form>
    </Modal>
  );
}
