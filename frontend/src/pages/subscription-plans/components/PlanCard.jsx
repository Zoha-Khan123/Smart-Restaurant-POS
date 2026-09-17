import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Eye,
  Edit2,
  CheckCircle2,
  Ban,
  Trash2,
  Check,
  X,
  Store,
  Users,
  Building,
  Zap,
  Sparkles,
  Calendar,
} from "lucide-react";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import { PLAN_FEATURE_DEFINITIONS } from "../../../data/subscriptionPlans";

export default function PlanCard({
  plan,
  onViewDetails,
  onEdit,
  onToggleStatus,
  onDelete,
}) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setIsMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!plan) return null;

  const isActive = plan.status === "Active";

  // Calculate enabled feature count
  const enabledFeaturesCount = Object.values(plan.features || {}).filter(Boolean).length;
  const totalFeaturesCount = PLAN_FEATURE_DEFINITIONS.length;

  return (
    <div
      className={`bg-bg-card rounded-2xl border transition-all duration-200 flex flex-col justify-between relative shadow-xs hover:shadow-md ${
        plan.isPopular
          ? "border-primary/50 ring-2 ring-primary/20"
          : "border-border hover:border-text-muted"
      }`}
    >
      {/* Popular Ribbon Tag */}
      {plan.isPopular && (
        <div className="absolute -top-3 left-6 z-10">
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-primary to-purple text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm tracking-wider uppercase">
            <Sparkles className="w-3 h-3" />
            Most Popular Choice
          </span>
        </div>
      )}

      {/* Card Header & Pricing */}
      <div className="p-5 sm:p-6 space-y-5">
        {/* Top Identity Row */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold text-text-primary tracking-tight">
                {plan.name}
              </h3>
              <Badge variant={isActive ? "success" : "danger"} size="sm" dot>
                {plan.status}
              </Badge>
            </div>
            <p className="text-xs text-text-muted mt-1 leading-relaxed line-clamp-2">
              {plan.tagline}
            </p>
          </div>

          {/* Action Menu Dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className="p-2 rounded-lg bg-bg-main border border-border text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer focus:outline-none"
              title="Plan Actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMoreOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-bg-card rounded-2xl border border-border shadow-xl z-50 overflow-hidden py-1.5 animate-in fade-in-50 zoom-in-95 duration-100 text-left">
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreOpen(false);
                    onViewDetails(plan);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-primary transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-text-muted" />
                  <span>View Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMoreOpen(false);
                    onEdit(plan);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-primary transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-text-muted" />
                  <span>Edit Plan</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMoreOpen(false);
                    onToggleStatus(plan);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-amber-600 transition-colors cursor-pointer"
                >
                  {isActive ? (
                    <>
                      <Ban className="w-3.5 h-3.5 text-amber-500" />
                      <span>Deactivate Plan</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Activate Plan</span>
                    </>
                  )}
                </button>

                <div className="border-t border-border my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setIsMoreOpen(false);
                    onDelete(plan);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-danger hover:bg-danger-light transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-danger" />
                  <span>Delete Plan</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Block */}
        <div className="p-4 rounded-xl bg-bg-main border border-border">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-text-primary tracking-tight">
              ${plan.monthlyPrice}
            </span>
            <span className="text-xs text-text-muted font-medium">/ month</span>
          </div>
          <div className="flex items-center justify-between gap-2 mt-1 pt-1.5 border-t border-border/60 text-xs">
            <span className="text-text-muted">Yearly Billed:</span>
            <span className="font-bold text-text-primary">
              ${plan.yearlyPrice}/yr{" "}
              <span className="text-[10px] text-emerald-600 font-semibold">(Save ~16%)</span>
            </span>
          </div>
        </div>

        {/* Plan Limits Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-bg-main border border-border-light">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
              Branches Limit
            </span>
            <span className="font-bold text-text-primary mt-0.5 block">
              {plan.maxBranches} {typeof plan.maxBranches === "number" ? "Location(s)" : ""}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-bg-main border border-border-light">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
              User Accounts
            </span>
            <span className="font-bold text-text-primary mt-0.5 block">
              {plan.maxUsers} {typeof plan.maxUsers === "number" ? "Seat(s)" : ""}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-bg-main border border-border-light">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
              Staff Allowed
            </span>
            <span className="font-bold text-text-primary mt-0.5 block">
              {plan.maxStaff}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-bg-main border border-border-light">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
              Orders / Month
            </span>
            <span className="font-bold text-text-primary mt-0.5 block">
              {plan.maxOrdersPerMonth}
            </span>
          </div>
        </div>

        {/* Feature Entitlements Checklist */}
        <div className="space-y-2.5 pt-2 border-t border-border/80">
          <div className="flex items-center justify-between text-xs font-bold text-text-primary">
            <span>Features Included</span>
            <span className="text-[11px] text-text-muted font-normal">
              {enabledFeaturesCount} / {totalFeaturesCount} Enabled
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {PLAN_FEATURE_DEFINITIONS.map((feat) => {
              const isEnabled = Boolean(plan.features?.[feat.id]);
              return (
                <div
                  key={feat.id}
                  className={`flex items-center gap-2 text-xs ${
                    isEnabled ? "text-text-primary font-medium" : "text-text-muted line-through opacity-60"
                  }`}
                >
                  {isEnabled ? (
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-bg-main text-text-muted flex items-center justify-center shrink-0">
                      <X className="w-3 h-3" />
                    </div>
                  )}
                  <span className="truncate">{feat.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 sm:p-5 bg-bg-main/60 border-t border-border rounded-b-2xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-text-secondary">
          <Store className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="font-bold text-text-primary">
            {plan.restaurantsCount || 0}
          </span>{" "}
          <span>restaurant(s) active</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(plan)}
          className="shrink-0"
        >
          <span>View Details</span>
        </Button>
      </div>
    </div>
  );
}
