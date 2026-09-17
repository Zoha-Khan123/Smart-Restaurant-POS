import React, { useState, useEffect } from "react";
import {
  Layers,
  ArrowUpDown,
  Check,
  Calendar,
  AlertCircle,
  HelpCircle,
  Sparkles,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import { INITIAL_PLANS_DATA } from "../../../data/subscriptionPlans";

export default function ChangePlanModal({
  isOpen,
  onClose,
  subscription,
  onSave,
}) {
  const [selectedPlanId, setSelectedPlanId] = useState("plan-standard");
  const [billingCycle, setBillingCycle] = useState("Monthly");
  const [effectiveTiming, setEffectiveTiming] = useState("immediate"); // "immediate" | "next_cycle"
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state when subscription opens
  useEffect(() => {
    if (subscription) {
      const currentPlan = INITIAL_PLANS_DATA.find(
        (p) => p.name.toLowerCase() === subscription.planName.toLowerCase()
      );
      if (currentPlan) {
        setSelectedPlanId(currentPlan.id);
      } else {
        setSelectedPlanId("plan-standard");
      }
      setBillingCycle(subscription.billingCycle || "Monthly");
      setEffectiveTiming("immediate");
    }
  }, [subscription, isOpen]);

  if (!isOpen || !subscription) return null;

  const currentPlan = INITIAL_PLANS_DATA.find(
    (p) => p.name.toLowerCase() === subscription.planName.toLowerCase()
  ) || INITIAL_PLANS_DATA[1];

  const targetPlan = INITIAL_PLANS_DATA.find((p) => p.id === selectedPlanId) || INITIAL_PLANS_DATA[1];

  // Calculate new pricing
  const newPrice = billingCycle === "Yearly" ? targetPlan.yearlyPrice : targetPlan.monthlyPrice;
  const newMonthlyEquivalent = billingCycle === "Yearly" ? Math.round(targetPlan.yearlyPrice / 12) : targetPlan.monthlyPrice;
  const newAmountString = billingCycle === "Yearly" ? `$${targetPlan.yearlyPrice.toLocaleString()} / yr` : `$${targetPlan.monthlyPrice} / mo`;

  const isSamePlanAndCycle =
    targetPlan.name.toLowerCase() === subscription.planName.toLowerCase() &&
    billingCycle === subscription.billingCycle;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updatedData = {
      planId: targetPlan.id,
      planName: targetPlan.name,
      billingCycle: billingCycle,
      amount: newAmountString,
      monthlyEquivalent: newMonthlyEquivalent,
      effectiveTiming: effectiveTiming,
      updatedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
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
      title="Change Subscription Plan"
      subtitle={`Configure new tier and billing cycle for ${subscription.restaurantName}`}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSamePlanAndCycle || isSubmitting}
          >
            {isSubmitting ? "Updating Plan..." : "Apply Plan Change"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Current Plan Overview */}
        <div className="p-3.5 rounded-xl bg-bg-main border border-border flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-text-muted">
              Current Plan & Cycle
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-bold text-text-primary text-sm">
                {subscription.planName} Tier
              </span>
              <span className="text-text-muted">•</span>
              <span className="text-text-secondary">{subscription.billingCycle}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-extrabold text-text-primary text-sm">
              {subscription.amount}
            </span>
            <p className="text-[10px] text-text-muted">
              Expires: {subscription.endDate}
            </p>
          </div>
        </div>

        {/* 1. Select Billing Frequency */}
        <div>
          <label className="block text-xs font-bold text-text-primary mb-2">
            Billing Frequency
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setBillingCycle("Monthly")}
              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                billingCycle === "Monthly"
                  ? "bg-primary/10 border-primary text-text-primary ring-2 ring-primary/20"
                  : "bg-bg-card border-border text-text-muted hover:border-text-muted"
              }`}
            >
              <div>
                <p className="font-bold text-xs text-text-primary">Monthly Billing</p>
                <p className="text-[11px] text-text-muted mt-0.5">Pay standard monthly rate</p>
              </div>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  billingCycle === "Monthly"
                    ? "border-primary bg-primary text-white"
                    : "border-border"
                }`}
              >
                {billingCycle === "Monthly" && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setBillingCycle("Yearly")}
              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer relative ${
                billingCycle === "Yearly"
                  ? "bg-primary/10 border-primary text-text-primary ring-2 ring-primary/20"
                  : "bg-bg-card border-border text-text-muted hover:border-text-muted"
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-xs text-text-primary">Yearly Billing</p>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Save ~20%
                  </span>
                </div>
                <p className="text-[11px] text-text-muted mt-0.5">Billed once annually</p>
              </div>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  billingCycle === "Yearly"
                    ? "border-primary bg-primary text-white"
                    : "border-border"
                }`}
              >
                {billingCycle === "Yearly" && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
            </button>
          </div>
        </div>

        {/* 2. Select Target Plan */}
        <div>
          <label className="block text-xs font-bold text-text-primary mb-2">
            Select New Subscription Tier
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {INITIAL_PLANS_DATA.map((p) => {
              const isSelected = selectedPlanId === p.id;
              const price = billingCycle === "Yearly" ? p.yearlyPrice : p.monthlyPrice;
              const rateLabel = billingCycle === "Yearly" ? `/ yr` : `/ mo`;

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlanId(p.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-bg-card border-primary ring-2 ring-primary/25 shadow-sm"
                      : "bg-bg-card border-border hover:border-text-muted/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-text-primary">
                      {p.name}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-border"
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="mb-2">
                    <span className="text-base font-extrabold text-primary">
                      ${price}
                    </span>
                    <span className="text-[10px] text-text-muted"> {rateLabel}</span>
                  </div>

                  <div className="space-y-1 text-[11px] text-text-muted border-t border-border/60 pt-2">
                    <p>• {p.maxBranches} {typeof p.maxBranches === "number" ? "Location(s)" : ""}</p>
                    <p>• {p.maxUsers} Admin / User seat(s)</p>
                    <p>• {p.maxOrdersPerMonth} monthly orders</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Effective Timing */}
        <div>
          <label className="block text-xs font-bold text-text-primary mb-1.5">
            Effective Switch Timing
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-bg-card hover:bg-bg-hover cursor-pointer transition-colors">
              <input
                type="radio"
                name="effectiveTiming"
                value="immediate"
                checked={effectiveTiming === "immediate"}
                onChange={(e) => setEffectiveTiming(e.target.value)}
                className="text-primary focus:ring-primary h-4 w-4"
              />
              <div>
                <span className="font-semibold text-text-primary block">
                  Immediately (Recommended)
                </span>
                <span className="text-[10px] text-text-muted">
                  Switch plan features and quotas right away.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-bg-card hover:bg-bg-hover cursor-pointer transition-colors">
              <input
                type="radio"
                name="effectiveTiming"
                value="next_cycle"
                checked={effectiveTiming === "next_cycle"}
                onChange={(e) => setEffectiveTiming(e.target.value)}
                className="text-primary focus:ring-primary h-4 w-4"
              />
              <div>
                <span className="font-semibold text-text-primary block">
                  At next billing period ({subscription.nextBillingDate})
                </span>
                <span className="text-[10px] text-text-muted">
                  Keep current plan active until the current period expires.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Change Comparison Notice */}
        {!isSamePlanAndCycle && (
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Plan Transition Preview:</strong> Switching from{" "}
              <strong>{subscription.planName} ({subscription.amount})</strong> to{" "}
              <strong>{targetPlan.name} ({newAmountString})</strong>.
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}
