import React, { useState } from "react";
import {
  Layers,
  CreditCard,
  CheckCircle2,
  Calendar,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  Sparkles,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Modal from "../../../components/ui/Modal";
import Dropdown from "../../../components/ui/Dropdown";

const PLAN_FEATURES = {
  Basic: [
    "1 POS Terminal Device",
    "Standard Order & Billing System",
    "Digital Menu & QR Code Generator",
    "Daily Sales Summary Reports",
    "Standard Email Support",
  ],
  Standard: [
    "Up to 3 POS Terminal Devices",
    "Kitchen Order Tickets (KOT) Display",
    "Full Inventory & Stock Management",
    "Customer Loyalty & Directory",
    "Multi-Staff Permission Roles",
    "Priority Business Hours Support",
  ],
  Premium: [
    "Unlimited POS & KOT Terminals",
    "Multi-Branch Cloud Synchronization",
    "Advanced Real-Time Revenue Analytics",
    "Custom Receipt Branding & Invoicing",
    "Live Table Management & Floor Plans",
    "24/7 Dedicated Account Manager",
  ],
};

export default function RestaurantSubscription({
  restaurant,
  onUpdateSubscription,
}) {
  const [currentPlan, setCurrentPlan] = useState(
    restaurant.subscriptionPlan || "Standard"
  );
  const [autoRenew, setAutoRenew] = useState(
    restaurant.autoRenew !== undefined ? restaurant.autoRenew : true
  );
  const [endDate, setEndDate] = useState(
    restaurant.subscriptionEndDate || "2026-08-15"
  );
  const [status, setStatus] = useState(
    restaurant.daysLeft === "Expired"
      ? "Expired"
      : restaurant.status === "Inactive"
      ? "Past Due"
      : "Active"
  );

  const [isChangePlanOpen, setIsChangePlanOpen] = useState(false);
  const [isExtendOpen, setIsExtendOpen] = useState(false);
  const [selectedNewPlan, setSelectedNewPlan] = useState(currentPlan);
  const [extendPeriod, setExtendPeriod] = useState("1year");
  const [feedback, setFeedback] = useState(null);

  const showFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const getPlanPrice = (plan) => {
    return plan === "Premium" ? "$199" : plan === "Standard" ? "$79" : "$29";
  };

  const handleChangePlan = () => {
    setCurrentPlan(selectedNewPlan);
    setIsChangePlanOpen(false);
    showFeedback(`Subscription tier updated to ${selectedNewPlan} Plan.`);
    if (onUpdateSubscription) {
      onUpdateSubscription({
        subscriptionPlan: selectedNewPlan,
        planPrice: `${getPlanPrice(selectedNewPlan)}/mo`,
      });
    }
  };

  const handleExtend = () => {
    const currentYear = parseInt(endDate.split("-")[0], 10) || 2026;
    const addYears = extendPeriod === "1year" ? 1 : extendPeriod === "6months" ? 0.5 : 0.08;
    const newYear = currentYear + (extendPeriod === "1year" ? 1 : 0);
    const newEnd = `${newYear}-${endDate.split("-")[1] || "08"}-${
      endDate.split("-")[2] || "15"
    }`;

    setEndDate(newEnd);
    setStatus("Active");
    setIsExtendOpen(false);
    showFeedback(`Subscription successfully extended until ${newEnd}.`);
  };

  const handleToggleAutoRenew = () => {
    const nextVal = !autoRenew;
    setAutoRenew(nextVal);
    showFeedback(
      nextVal
        ? "Auto-renewal enabled for next billing cycle."
        : "Auto-renewal disabled."
    );
  };

  const getStatusBadge = () => {
    if (status === "Active")
      return (
        <Badge variant="success" size="md" dot>
          Active (Current)
        </Badge>
      );
    if (status === "Trial")
      return (
        <Badge variant="primary" size="md" dot>
          Trial (14 Days)
        </Badge>
      );
    if (status === "Expired")
      return (
        <Badge variant="danger" size="md" dot>
          Expired
        </Badge>
      );
    if (status === "Past Due")
      return (
        <Badge variant="warning" size="md" dot>
          Past Due
        </Badge>
      );
    return (
      <Badge variant="default" size="md">
        Cancelled
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Feedback Toast */}
      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Subscription Card */}
      <div className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs space-y-6">
        {/* Card Header & Tier Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/80 pb-5 min-w-0">
          <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
            <div
              className={`w-12 h-12 rounded-2xl ${
                currentPlan === "Premium"
                  ? "bg-purple-600"
                  : currentPlan === "Standard"
                  ? "bg-blue-600"
                  : "bg-emerald-600"
              } text-white flex items-center justify-center shadow-md shrink-0`}
            >
              <Zap className="w-6 h-6" />
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-lg sm:text-xl font-bold text-text-primary break-words">
                  {currentPlan} Subscription Plan
                </h3>
                <div className="shrink-0">
                  {getStatusBadge()}
                </div>
              </div>
              <p className="text-xs text-text-muted break-words">
                Billed {restaurant.billingCycle || "Monthly Recurring"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedNewPlan(currentPlan);
                setIsChangePlanOpen(true);
              }}
              className="!py-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Change Plan</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsExtendOpen(true)}
              className="!py-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Extend Period</span>
            </Button>
          </div>
        </div>

        {/* Subscription Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-bg-main border border-border">
            <p className="text-text-muted font-medium text-xs">Plan Rate</p>
            <h4 className="text-2xl font-bold text-text-primary mt-1">
              {getPlanPrice(currentPlan)}
              <span className="text-xs font-normal text-text-muted"> / mo</span>
            </h4>
            <span className="text-[11px] text-primary font-semibold mt-1 inline-block">
              Recurring Tier
            </span>
          </div>

          <div className="p-4 rounded-xl bg-bg-main border border-border">
            <p className="text-text-muted font-medium text-xs">Subscription Period</p>
            <h4 className="text-sm font-bold text-text-primary mt-1">
              {restaurant.subscriptionStartDate || "2025-01-01"}
            </h4>
            <p className="text-[11px] text-text-muted mt-0.5">
              Valid until {endDate}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-bg-main border border-border">
            <p className="text-text-muted font-medium text-xs">Days Remaining</p>
            <h4
              className={`text-2xl font-bold mt-1 ${
                restaurant.daysLeft === "Expired"
                  ? "text-danger"
                  : "text-emerald-600"
              }`}
            >
              {restaurant.daysLeft || "150 days"}
            </h4>
            <span className="text-[11px] text-text-muted mt-1 inline-block">
              Next invoice: {endDate}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-bg-main border border-border flex flex-col justify-between">
            <div>
              <p className="text-text-muted font-medium text-xs">Auto-Renewal</p>
              <h4
                className={`text-sm font-bold mt-1 ${
                  autoRenew ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {autoRenew ? "Enabled (Automatic)" : "Disabled (Manual)"}
              </h4>
            </div>
            <button
              type="button"
              onClick={handleToggleAutoRenew}
              className="text-[11px] font-semibold text-primary hover:underline text-left cursor-pointer mt-2"
            >
              {autoRenew ? "Disable Auto-Renew" : "Enable Auto-Renew"}
            </button>
          </div>
        </div>

        {/* Plan Entitlements & Features */}
        <div className="p-5 rounded-xl bg-bg-main/60 border border-border-light space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-text-primary uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Included Features in {currentPlan} Tier</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
            {(PLAN_FEATURES[currentPlan] || PLAN_FEATURES.Standard).map(
              (feat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-text-primary p-2 rounded-lg bg-bg-card border border-border-light shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium">{feat}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Modal: Change Plan Tier */}
      <Modal
        isOpen={isChangePlanOpen}
        onClose={() => setIsChangePlanOpen(false)}
        title="Change Subscription Tier"
        subtitle={`Select a new plan tier for ${restaurant.name}`}
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsChangePlanOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleChangePlan}>
              Apply New Plan
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          {["Basic", "Standard", "Premium"].map((p) => {
            const isSelected = selectedNewPlan === p;
            return (
              <div
                key={p}
                onClick={() => setSelectedNewPlan(p)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? "bg-primary-light/70 border-primary shadow-xs ring-2 ring-primary/20"
                    : "bg-bg-main border-border hover:bg-bg-hover"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-text-muted"
                    }`}
                  >
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-primary">
                      {p} Plan
                    </h4>
                    <p className="text-[11px] text-text-muted">
                      {p === "Premium"
                        ? "Unlimited terminals & priority support"
                        : p === "Standard"
                        ? "KOT, table management & inventory"
                        : "Single POS terminal system"}
                    </p>
                  </div>
                </div>

                <span className="font-extrabold text-sm text-text-primary">
                  {getPlanPrice(p)}/mo
                </span>
              </div>
            );
          })}
        </div>
      </Modal>

      {/* Modal: Extend Subscription Period */}
      <Modal
        isOpen={isExtendOpen}
        onClose={() => setIsExtendOpen(false)}
        title="Extend Subscription"
        subtitle={`Add validity duration for ${restaurant.name}`}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsExtendOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleExtend}>
              Confirm Extension
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Dropdown
            label="Extension Duration"
            value={extendPeriod}
            onChange={(e) => setExtendPeriod(e.target.value)}
            options={[
              { label: "1 Year (+12 Months)", value: "1year" },
              { label: "6 Months (+180 Days)", value: "6months" },
              { label: "1 Month (+30 Days)", value: "1month" },
            ]}
          />

          <div className="p-3 rounded-xl bg-bg-main border border-border text-xs text-text-muted">
            Current Expiry:{" "}
            <strong className="text-text-primary">{endDate}</strong>
          </div>
        </div>
      </Modal>
    </div>
  );
}
