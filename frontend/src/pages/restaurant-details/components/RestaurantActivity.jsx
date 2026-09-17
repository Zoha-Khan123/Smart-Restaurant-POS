import React from "react";
import {
  Clock,
  CheckCircle2,
  UserCheck,
  Zap,
  Store,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { getRestaurantActivity } from "../../../data/restaurants";

const ICON_MAP = {
  CheckCircle2,
  UserCheck,
  Zap,
  Store,
  ShieldCheck,
  CreditCard,
};

export default function RestaurantActivity({ restaurant }) {
  const activities = getRestaurantActivity(restaurant);

  return (
    <div className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-text-primary text-base">
              Tenant Activity Timeline
            </h3>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Audit history of operational events, logins, settlements, and configuration changes
          </p>
        </div>

        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Live Tracking
        </span>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
        {activities.map((act) => {
          const IconComponent = ICON_MAP[act.icon] || Clock;

          return (
            <div key={act.id} className="relative group">
              {/* Timeline Bullet Node */}
              <div
                className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full ${act.iconBg} ${act.iconColor} border-2 border-bg-card flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform`}
              >
                <IconComponent className="w-3 h-3" />
              </div>

              {/* Event Content Container */}
              <div className="bg-bg-main/70 rounded-2xl p-4 border border-border-light hover:bg-bg-hover transition-colors space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-xs sm:text-sm font-bold text-text-primary">
                    {act.title}
                  </h4>
                  <span className="text-[11px] text-text-muted font-medium flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3 text-text-muted" />
                    {act.timestamp}
                  </span>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  {act.description}
                </p>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-text-muted">
                  <span>Triggered by:</span>
                  <span className="font-semibold text-text-primary bg-bg-card px-2 py-0.5 rounded-md border border-border">
                    {act.actor}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
