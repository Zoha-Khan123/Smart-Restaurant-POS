import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  CheckCircle2,
  Ban,
  MoreVertical,
  Trash2,
  ShieldAlert,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";

export default function RestaurantHeader({
  restaurant,
  onEdit,
  onToggleStatus,
  onSuspend,
  onDelete,
}) {
  const navigate = useNavigate();
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

  if (!restaurant) return null;

  const isActive = restaurant.status === "Active";

  return (
    <div className="space-y-4 min-w-0">
      {/* Back Navigation Bar */}
      <div>
        <button
          type="button"
          onClick={() => navigate("/super-admin/restaurants")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-primary transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Restaurants Directory</span>
        </button>
      </div>

      {/* Main Header Card */}
      <div className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5 min-w-0">
        {/* Left: Tenant Identity & Badges */}
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
          <div
            className={`w-12 sm:w-14 h-12 sm:h-14 rounded-2xl ${
              restaurant.logoColor || "bg-primary"
            } text-white font-bold text-base sm:text-lg flex items-center justify-center shrink-0 shadow-md ring-4 ring-primary/10`}
          >
            {restaurant.initials}
          </div>

          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg sm:text-2xl font-bold text-text-primary tracking-tight break-words">
                {restaurant.name}
              </h1>
              <span className="font-mono text-xs font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded-lg border border-primary/20 shrink-0">
                {restaurant.id}
              </span>
            </div>

            <p className="text-xs text-text-muted break-words">
              {restaurant.category} • Registered on {restaurant.createdAt}
            </p>

            {/* Status Badges Row */}
            <div className="flex items-center gap-2 flex-wrap pt-0.5">
              <Badge variant={restaurant.statusVariant} size="sm" dot className="shrink-0">
                {restaurant.status}
              </Badge>
              <Badge variant={restaurant.planVariant} size="sm" className="shrink-0">
                {restaurant.subscriptionPlan} Plan
              </Badge>
              <Badge variant={restaurant.paymentVariant} size="sm" dot className="shrink-0">
                Payment: {restaurant.paymentStatus}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="!py-2"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Restaurant</span>
          </Button>

          <Button
            variant={isActive ? "secondary" : "primary"}
            size="sm"
            onClick={onToggleStatus}
            className="!py-2"
          >
            {isActive ? (
              <>
                <Ban className="w-3.5 h-3.5 text-amber-600" />
                <span>Disable Access</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Enable Access</span>
              </>
            )}
          </Button>

          {/* More Actions Dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className="p-2 rounded-lg bg-bg-main border border-border text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer focus:outline-none"
              title="More Actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMoreOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-bg-card rounded-2xl border border-border shadow-xl z-50 overflow-hidden py-1.5 animate-in fade-in-50 duration-150 text-left">
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreOpen(false);
                    onSuspend();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-amber-600 transition-colors cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4 text-text-muted" />
                  <span>Suspend Operations</span>
                </button>

                <div className="border-t border-border my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setIsMoreOpen(false);
                    onDelete();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-danger hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-danger" />
                  <span>Delete Restaurant</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
