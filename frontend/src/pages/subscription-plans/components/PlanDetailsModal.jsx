import React from "react";
import {
  Layers,
  DollarSign,
  Store,
  Users,
  Check,
  X,
  Calendar,
  Clock,
  ShieldCheck,
  Edit2,
  Sliders,
} from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import { PLAN_FEATURE_DEFINITIONS } from "../../../data/subscriptionPlans";

export default function PlanDetailsModal({
  isOpen,
  onClose,
  plan,
  onEdit,
}) {
  if (!isOpen || !plan) return null;

  const isActive = plan.status === "Active";
  const enabledCount = Object.values(plan.features || {}).filter(Boolean).length;
  const totalCount = PLAN_FEATURE_DEFINITIONS.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Subscription Plan Specification"
      subtitle={`Tier architecture and platform entitlements for ${plan.name} Plan`}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onClose();
              if (onEdit) onEdit(plan);
            }}
          >
            <Edit2 className="w-3.5 h-3.5 mr-1" />
            Edit Plan
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Top Tier Identity Card */}
        <div className="p-4 rounded-xl bg-bg-main border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-text-primary">
                {plan.name} Plan
              </h3>
              <Badge variant={isActive ? "success" : "danger"} size="sm" dot>
                {plan.status}
              </Badge>
              {plan.isPopular && (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-primary-light text-primary border border-primary/20">
                  Featured Tier
                </span>
              )}
            </div>
            <p className="text-text-muted mt-1 text-xs leading-relaxed">
              {plan.tagline}
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-2xl font-extrabold text-primary">
              ${plan.monthlyPrice}
            </span>
            <span className="text-text-muted text-xs"> / month</span>
            <p className="text-[11px] text-text-muted mt-0.5">
              ${plan.yearlyPrice} / year billed annually
            </p>
          </div>
        </div>

        {/* Adoption & Resource Limits */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-bg-card border border-border">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
              Active Outlets
            </span>
            <span className="font-bold text-text-primary text-sm mt-0.5 block">
              {plan.restaurantsCount || 0} Restaurants
            </span>
          </div>

          <div className="p-3 rounded-xl bg-bg-card border border-border">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
              Max Branches
            </span>
            <span className="font-bold text-text-primary text-sm mt-0.5 block">
              {plan.maxBranches} {typeof plan.maxBranches === "number" ? "Location(s)" : ""}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-bg-card border border-border">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
              Admin / Users
            </span>
            <span className="font-bold text-text-primary text-sm mt-0.5 block">
              {plan.maxUsers} {typeof plan.maxUsers === "number" ? "Seat(s)" : ""}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-bg-card border border-border">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
              Monthly Volume
            </span>
            <span className="font-bold text-text-primary text-sm mt-0.5 block">
              {plan.maxOrdersPerMonth} Orders
            </span>
          </div>
        </div>

        {/* Feature Entitlements Breakdown */}
        <div className="p-4 rounded-xl bg-bg-main/70 border border-border space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-text-primary flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Full Capabilities Checklist</span>
            </h4>
            <span className="text-[11px] font-semibold text-text-muted">
              {enabledCount} of {totalCount} Enabled
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {PLAN_FEATURE_DEFINITIONS.map((feature) => {
              const isEnabled = Boolean(plan.features?.[feature.id]);
              return (
                <div
                  key={feature.id}
                  className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${
                    isEnabled
                      ? "bg-bg-card border-border text-text-primary"
                      : "bg-bg-main border-border-light text-text-muted opacity-60"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      isEnabled
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-bg-main text-text-muted"
                    }`}
                  >
                    {isEnabled ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : (
                      <X className="w-3 h-3" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`font-semibold truncate ${isEnabled ? "" : "line-through"}`}>
                      {feature.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Meta */}
        <div className="flex items-center justify-between text-[11px] text-text-muted pt-1 border-t border-border">
          <span>Created: {plan.createdAt || "Jan 01, 2025"}</span>
          <span>Last Updated: {plan.updatedAt || "Mar 12, 2026"}</span>
        </div>
      </div>
    </Modal>
  );
}
