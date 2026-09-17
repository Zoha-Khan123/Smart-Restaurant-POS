import React from "react";
import {
  Calendar,
  CreditCard,
  Store,
  Layers,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowUpDown,
  CalendarPlus,
  RefreshCw,
  Mail,
  FileText,
} from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import {
  SUB_STATUS_VARIANTS,
  SUB_PAYMENT_VARIANTS,
  SUB_PLAN_VARIANTS,
} from "../../../data/subscriptions";
import { INITIAL_PLANS_DATA } from "../../../data/subscriptionPlans";

export default function SubscriptionDetailsModal({
  isOpen,
  onClose,
  subscription,
  onChangePlan,
  onExtend,
}) {
  if (!isOpen || !subscription) return null;

  const statusVariant = SUB_STATUS_VARIANTS[subscription.status] || "default";
  const paymentVariant = SUB_PAYMENT_VARIANTS[subscription.paymentStatus] || "default";
  const planVariant = SUB_PLAN_VARIANTS[subscription.planName] || "primary";

  // Find plan metadata for entitlements
  const matchedPlan = INITIAL_PLANS_DATA.find(
    (p) => p.name.toLowerCase() === subscription.planName.toLowerCase()
  ) || INITIAL_PLANS_DATA[1];

  const isExpiringSoon = subscription.daysRemaining > 0 && subscription.daysRemaining <= 30;
  const isExpired = subscription.daysRemaining <= 0 || subscription.status === "Expired" || subscription.status === "Past Due";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Subscription Specification & Entitlements"
      subtitle={`Tenant agreement records for ${subscription.restaurantName}`}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {subscription.status !== "Cancelled" && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  onClose();
                  if (onExtend) onExtend(subscription);
                }}
              >
                <CalendarPlus className="w-3.5 h-3.5 mr-1" />
                Extend Period
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  onClose();
                  if (onChangePlan) onChangePlan(subscription);
                }}
              >
                <ArrowUpDown className="w-3.5 h-3.5 mr-1" />
                Change Plan
              </Button>
            </>
          )}
        </>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Top Header Card: Restaurant & Status */}
        <div className="p-4 rounded-xl bg-bg-main border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl ${
                subscription.logoColor || "bg-primary"
              } text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-xs`}
            >
              {subscription.restaurantLogo || subscription.restaurantName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-text-primary">
                  {subscription.restaurantName}
                </h3>
                <Badge variant={statusVariant} size="sm" dot>
                  {subscription.status}
                </Badge>
                <Badge variant={paymentVariant} size="sm">
                  {subscription.paymentStatus}
                </Badge>
              </div>
              <p className="text-text-muted mt-0.5 flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[11px] text-text-secondary">
                  Sub: {subscription.id}
                </span>
                <span>•</span>
                <span className="font-mono text-[11px] text-text-secondary">
                  Outlet: {subscription.restaurantId}
                </span>
                <span>•</span>
                <span className="text-text-muted">{subscription.restaurantEmail}</span>
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0 bg-bg-card sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-border">
            <Badge variant={planVariant} size="md">
              {subscription.planName} Plan
            </Badge>
            <p className="text-sm font-extrabold text-primary mt-1">
              {subscription.amount}
            </p>
          </div>
        </div>

        {/* 4 KPI Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-bg-card border border-border">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
              Billing Interval
            </span>
            <span className="font-bold text-text-primary text-sm mt-0.5 block">
              {subscription.billingCycle}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-bg-card border border-border">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
              Monthly Equivalent
            </span>
            <span className="font-bold text-text-primary text-sm mt-0.5 block">
              ${subscription.monthlyEquivalent}/mo
            </span>
          </div>

          <div className="p-3 rounded-xl bg-bg-card border border-border">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
              Days Remaining
            </span>
            <span
              className={`font-bold text-sm mt-0.5 block ${
                isExpired
                  ? "text-danger"
                  : isExpiringSoon
                  ? "text-amber-600"
                  : "text-emerald-600"
              }`}
            >
              {subscription.daysRemaining} Days
            </span>
          </div>

          <div className="p-3 rounded-xl bg-bg-card border border-border">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
              Auto-Renewal
            </span>
            <span
              className={`font-bold text-sm mt-0.5 flex items-center gap-1 ${
                subscription.autoRenewal ? "text-emerald-600" : "text-text-muted"
              }`}
            >
              {subscription.autoRenewal ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Enabled</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Disabled</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Subscription Timeline & Dates */}
        <div className="p-4 rounded-xl bg-bg-main/60 border border-border space-y-3">
          <h4 className="font-bold text-text-primary flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-primary" />
            <span>Subscription Timeline & Lifecycle Dates</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-2.5 rounded-lg bg-bg-card border border-border">
              <span className="text-[10px] font-medium text-text-muted block">
                Subscription Start Date
              </span>
              <span className="font-bold text-text-primary text-xs mt-0.5 block">
                {subscription.startDate}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-bg-card border border-border">
              <span className="text-[10px] font-medium text-text-muted block">
                Expiration / Renewal Date
              </span>
              <span className="font-bold text-text-primary text-xs mt-0.5 block">
                {subscription.endDate}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-bg-card border border-border">
              <span className="text-[10px] font-medium text-text-muted block">
                Next Invoicing Date
              </span>
              <span className="font-bold text-text-primary text-xs mt-0.5 block">
                {subscription.nextBillingDate}
              </span>
            </div>
          </div>
        </div>

        {/* Plan Capacity & Limits */}
        {matchedPlan && (
          <div className="p-4 rounded-xl bg-bg-main/60 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-text-primary flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Plan Quotas & Entitlements ({matchedPlan.name})</span>
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2 rounded-lg bg-bg-card border border-border">
                <span className="text-[10px] text-text-muted block">Branch Limit</span>
                <span className="font-bold text-text-primary text-xs mt-0.5 block">
                  {matchedPlan.maxBranches} Location(s)
                </span>
              </div>
              <div className="p-2 rounded-lg bg-bg-card border border-border">
                <span className="text-[10px] text-text-muted block">Admin Users</span>
                <span className="font-bold text-text-primary text-xs mt-0.5 block">
                  {matchedPlan.maxUsers} Accounts
                </span>
              </div>
              <div className="p-2 rounded-lg bg-bg-card border border-border">
                <span className="text-[10px] text-text-muted block">Staff Members</span>
                <span className="font-bold text-text-primary text-xs mt-0.5 block">
                  {matchedPlan.maxStaff} Staff
                </span>
              </div>
              <div className="p-2 rounded-lg bg-bg-card border border-border">
                <span className="text-[10px] text-text-muted block">Monthly Orders</span>
                <span className="font-bold text-text-primary text-xs mt-0.5 block">
                  {matchedPlan.maxOrdersPerMonth} Orders
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Audit Meta */}
        <div className="flex items-center justify-between text-[11px] text-text-muted pt-1 border-t border-border">
          <span>Created Record: {subscription.createdAt || "Jan 01, 2025"}</span>
          <span>Last Invoicing / Update: {subscription.updatedAt || "Mar 16, 2026"}</span>
        </div>
      </div>
    </Modal>
  );
}
