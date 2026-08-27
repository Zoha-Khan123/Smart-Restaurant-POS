import React from "react";
import {
  Clock,
  Printer,
  Eye,
  Trash2,
  CheckCircle2,
  Flame,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

/**
 * Smart POS - KOT Kitchen Ticket Card Component
 */
export default function KOTCard({
  kot,
  onStatusChange,
  onViewDetails,
  onCancel,
  onPrint,
}) {
  const isUrgent = kot.priority === "Urgent";
  const isServed = kot.status === "Served";

  // Determine Next Status & Button Label
  const getNextAction = () => {
    switch (kot.status) {
      case "New":
        return {
          nextStatus: "Preparing",
          label: "Start Preparing",
          icon: Flame,
          buttonClass: "bg-warning hover:opacity-95 text-text-primary font-bold",
        };
      case "Preparing":
        return {
          nextStatus: "Ready",
          label: "Mark Ready",
          icon: CheckCircle2,
          buttonClass: "bg-emerald-600 hover:bg-emerald-700 text-white font-bold",
        };
      case "Ready":
        return {
          nextStatus: "Served",
          label: "Mark Served",
          icon: ArrowRight,
          buttonClass: "bg-primary hover:bg-primary-dark text-white font-bold",
        };
      case "Served":
      default:
        return null;
    }
  };

  const getStatusStyles = () => {
    switch (kot.status) {
      case "New":
        return "bg-danger-light text-danger border-danger/30";
      case "Preparing":
        return "bg-warning-light text-warning border-warning/30";
      case "Ready":
        return "bg-success-light text-success border-success/30";
      case "Served":
        return "bg-bg-hover text-text-secondary border-border";
      default:
        return "bg-bg-main text-text-secondary border-border";
    }
  };

  const getStatusIcon = () => {
    switch (kot.status) {
      case "New":
        return <AlertCircle className="w-3.5 h-3.5" />;
      case "Preparing":
        return <Flame className="w-3.5 h-3.5" />;
      case "Ready":
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case "Served":
        return <Clock className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  const action = getNextAction();

  return (
    <div
      className={`bg-bg-card rounded-2xl border transition-all duration-200 shadow-xs flex flex-col justify-between overflow-hidden relative ${
        isUrgent
          ? "border-danger ring-2 ring-danger/15 shadow-md shadow-danger/5"
          : "border-border hover:border-primary/40 hover:shadow-md"
      }`}
    >
      {/* Top Banner: Priority Stripe if Urgent */}
      {isUrgent && (
        <div className="bg-danger text-text-white text-[11px] font-bold uppercase tracking-wider py-1 px-4 text-center flex items-center justify-center gap-1.5 shadow-2xs">
          <Flame className="w-3.5 h-3.5" />
          <span>Rush / Urgent Priority</span>
        </div>
      )}

      {/* HEADER: KOT #, TABLE, TIME & STATUS */}
      <div className="p-4 border-b border-border bg-bg-main/60">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-text-primary text-base tracking-tight">
                {kot.kotNumber}
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-bg-card border border-border text-text-secondary">
                {kot.orderNumber}
              </span>
            </div>

            <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
              <span>Waiter: {kot.waiter}</span>
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-1.5 shrink-0">
            {isUrgent && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-danger text-text-white flex items-center gap-1 shadow-xs animate-pulse">
                <Flame className="w-3 h-3" />
                Urgent
              </span>
            )}
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border flex items-center gap-1.5 shadow-2xs ${getStatusStyles()}`}
            >
              {getStatusIcon()}
              <span>{kot.status}</span>
            </span>
          </div>
        </div>

        {/* Subheader: Table & Elapsed Timer */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border-light text-xs">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
              {kot.table}
            </span>
            <span className="text-text-muted text-[11px]">
              ({kot.orderType})
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-text-secondary font-medium text-xs">
            <Clock className="w-3.5 h-3.5 text-text-muted" />
            <span>{kot.time}</span>
            <span
              className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                kot.elapsedMinutes > 20
                  ? "bg-danger-light text-danger"
                  : kot.elapsedMinutes > 10
                  ? "bg-warning-light text-warning"
                  : "bg-bg-card text-text-muted"
              }`}
            >
              {kot.elapsedMinutes}m ago
            </span>
          </div>
        </div>
      </div>

      {/* BODY: ORDERED ITEMS */}
      <div className="p-4 flex-1 space-y-3 divide-y divide-border-light max-h-[300px] overflow-y-auto">
        {kot.items.map((item, idx) => (
          <div key={idx} className="pt-2.5 first:pt-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary-light text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {item.quantity}×
                </span>

                <div>
                  <h4 className="text-sm font-bold text-text-primary leading-snug">
                    {item.name}
                  </h4>

                  {item.size && (
                    <p className="text-xs text-text-secondary font-medium">
                      Size: {item.size}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {item.modifiers?.length > 0 && (
              <div className="ml-8 mt-1.5 flex flex-wrap gap-1">
                {item.modifiers.map((mod, mi) => (
                  <span
                    key={mi}
                    className="inline-block px-2 py-0.5 rounded-md bg-bg-main border border-border text-[11px] font-medium text-text-primary"
                  >
                    + {mod}
                  </span>
                ))}
              </div>
            )}

            {item.itemNote && (
              <p className="ml-8 mt-1 text-[11px] font-semibold text-amber-700 italic bg-amber-50/70 border border-amber-200/60 rounded px-2 py-0.5">
                Note: {item.itemNote}
              </p>
            )}
          </div>
        ))}

        {kot.specialInstructions && (
          <div className="pt-3">
            <div className="p-2.5 rounded-xl bg-bg-main border border-border-light text-xs text-text-secondary">
              <span className="font-bold text-text-primary block text-[11px] uppercase tracking-wider mb-0.5">
                👨‍🍳 Kitchen Instructions:
              </span>
              <p className="italic text-text-primary font-medium">
                "{kot.specialInstructions}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER: STATUS TRANSITIONS */}
      <div className="p-4 bg-bg-main/40 border-t border-border space-y-2.5">
        {action ? (
          <button
            type="button"
            onClick={() => onStatusChange(kot.id, action.nextStatus)}
            className={`w-full py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99] ${action.buttonClass}`}
          >
            <action.icon className="w-4 h-4" />
            <span>{action.label}</span>
          </button>
        ) : (
          <div className="py-2 text-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Order Completed & Served</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border-light">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onViewDetails(kot)}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              title="View Complete Order"
            >
              <Eye className="w-4 h-4" />
              <span className="text-[11px] hidden sm:inline">Details</span>
            </button>

            <button
              type="button"
              onClick={() => onPrint(kot)}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              title="Print Kitchen Ticket"
            >
              <Printer className="w-4 h-4" />
              <span className="text-[11px] hidden sm:inline">Print</span>
            </button>
          </div>

          {!isServed && (
            <button
              type="button"
              onClick={() => onCancel(kot.id)}
              className="p-1.5 rounded-lg text-danger hover:bg-danger-light transition-colors cursor-pointer"
              title="Cancel Kitchen Ticket"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
