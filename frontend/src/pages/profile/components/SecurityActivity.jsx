import React from "react";
import { ShieldCheck, ShieldAlert, Clock, Globe, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";

export default function SecurityActivity({ activities = [] }) {
  return (
    <Card
      title="Recent Security Activity"
      subtitle="Immutable event logs tracking your system actions."
      actions={
        <Link
          to="/super-admin/audit-logs"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 shrink-0"
        >
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      }
    >
      <div className="divide-y divide-border min-w-0">
        {activities.map((act) => {
          const isSuccess = act.status === "success";
          return (
            <div
              key={act.id}
              className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3 min-w-0"
            >
              <div
                className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                  isSuccess
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "bg-rose-50 text-rose-600 border border-rose-200"
                }`}
              >
                {isSuccess ? (
                  <ShieldCheck className="w-4 h-4" />
                ) : (
                  <ShieldAlert className="w-4 h-4" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1.5 flex-wrap min-w-0">
                  <p className="text-xs font-bold text-text-primary break-words">
                    {act.action}
                  </p>
                  <Badge
                    variant={isSuccess ? "success" : "danger"}
                    size="sm"
                  >
                    {act.status.toUpperCase()}
                  </Badge>
                </div>

                <p className="text-xs text-text-muted mt-1 break-words leading-relaxed">
                  {act.description}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-text-muted mt-1.5 flex-wrap min-w-0">
                  <span className="flex items-center gap-1 font-mono shrink-0">
                    <Globe className="w-3 h-3 text-text-muted" />
                    {act.ip}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3 text-text-muted" />
                    {act.timestamp}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
