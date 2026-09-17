import React from "react";
import {
  Cpu,
  CreditCard,
  Layers,
  Store,
  Users,
  ShieldAlert,
  Megaphone,
} from "lucide-react";
import Badge from "../../../components/ui/Badge";
import {
  NOTIF_TYPE_VARIANTS,
  NOTIF_PRIORITY_VARIANTS,
} from "../../../data/notifications";

const TYPE_ICONS = {
  System: Cpu,
  Payment: CreditCard,
  Subscription: Layers,
  Restaurant: Store,
  User: Users,
  Security: ShieldAlert,
  Announcement: Megaphone,
};

export default function NotificationPreview({
  title,
  message,
  type = "Announcement",
  priority = "Normal",
  audience = "All Restaurants",
  restaurantName,
}) {
  const IconComponent = TYPE_ICONS[type] || Megaphone;
  const typeVariant = NOTIF_TYPE_VARIANTS[type] || "primary";
  const priorityVariant = NOTIF_PRIORITY_VARIANTS[priority] || "default";

  return (
    <div className="p-4 rounded-xl bg-bg-main border border-border space-y-2.5">
      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
        Restaurant Tenant View Preview
      </span>

      <div className="p-3.5 rounded-xl bg-bg-card border border-border shadow-xs flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            priority === "Critical"
              ? "bg-rose-50 text-rose-600 border border-rose-200"
              : type === "Payment"
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
              : "bg-primary/10 text-primary border border-primary/20"
          }`}
        >
          <IconComponent className="w-4 h-4" />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-xs font-bold text-text-primary">
              {title || "Notification Title"}
            </h4>
            <Badge variant={typeVariant} size="sm">
              {type}
            </Badge>
            <Badge variant={priorityVariant} size="sm">
              {priority}
            </Badge>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed">
            {message || "Your notification body message will appear here for restaurant managers and cashiers."}
          </p>

          <p className="text-[10px] text-text-muted pt-1">
            Delivering to:{" "}
            <strong className="text-text-primary">
              {audience === "Specific Restaurant" ? restaurantName || "Specific Outlet" : audience}
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}
