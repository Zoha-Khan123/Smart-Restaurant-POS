import React from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Zap,
  CheckCircle2,
  UserCheck,
  AlertCircle,
  ShieldCheck,
  Clock,
  ExternalLink,
} from "lucide-react";
import Badge from "../../../components/ui/Badge";

const ICON_MAP = {
  Building2,
  Zap,
  CheckCircle2,
  UserCheck,
  AlertCircle,
  ShieldCheck,
};

export default function PlatformActivity({ activities = [] }) {
  return (
    <div className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-text-primary text-base tracking-tight">
              Platform Activity
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Real-time audit log of system events
          </p>
        </div>

        <Link
          to="/super-admin/audit-logs"
          className="text-xs font-semibold text-primary hover:text-primary-dark flex items-center gap-1"
        >
          <span>Audit Log</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
        {activities.map((act) => {
          const IconComponent = ICON_MAP[act.icon] || Clock;

          return (
            <div key={act.id} className="relative group">
              {/* Timeline Node Bullet */}
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full ${act.iconBg} ${act.iconColor} border-2 border-bg-card flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform`}
              >
                <IconComponent className="w-2.5 h-2.5" />
              </div>

              {/* Event Content */}
              <div className="bg-bg-main/60 rounded-xl p-3 border border-border-light hover:bg-bg-hover transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-text-primary">
                    {act.title}
                  </h4>
                  <span className="text-[10px] text-text-muted font-medium shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {act.timeAgo}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  {act.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-border-light text-center">
        <p className="text-[11px] text-text-muted">
          All tenant actions are encrypted and logged for compliance.
        </p>
      </div>
    </div>
  );
}
