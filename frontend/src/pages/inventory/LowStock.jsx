import React from "react";
import { AlertTriangle, PackageX, ShoppingBag, ArrowUpRight } from "lucide-react";
import { INITIAL_INVENTORY } from "../../data/inventory";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

/**
 * Smart POS - Low Stock Alerts Component
 */
export default function LowStock() {
  const lowItems = INITIAL_INVENTORY.filter(
    (i) => i.status === "Low Stock" || i.status === "Out of Stock"
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between bg-bg-card p-4 rounded-2xl border border-border shadow-xs">
        <div>
          <h3 className="text-base font-bold text-text-primary">
            Critical Low Stock & Depleted Alerts ({lowItems.length})
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Ingredients that have reached or fallen below minimum safety buffer
          </p>
        </div>

        <Badge variant="danger">Action Required</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lowItems.map((item) => {
          const isOut = item.status === "Out of Stock";
          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border bg-bg-card flex flex-col justify-between space-y-4 shadow-xs ${
                isOut
                  ? "border-danger ring-2 ring-danger/10"
                  : "border-amber-300 ring-2 ring-amber-300/10"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isOut
                        ? "bg-danger-light text-danger"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {isOut ? (
                      <PackageX className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-text-primary">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-text-muted">
                      SKU: {item.sku} • {item.category}
                    </p>
                  </div>
                </div>

                <Badge variant={isOut ? "danger" : "warning"}>
                  {item.status}
                </Badge>
              </div>

              {/* Levels comparison */}
              <div className="p-3 rounded-xl bg-bg-main border border-border flex justify-between items-center text-xs">
                <div>
                  <span className="text-text-muted block text-[11px]">
                    Current Level
                  </span>
                  <span
                    className={`font-extrabold text-sm ${
                      isOut ? "text-danger" : "text-amber-700"
                    }`}
                  >
                    {item.stock} {item.unit}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-text-muted block text-[11px]">
                    Min. Safety Threshold
                  </span>
                  <span className="font-bold text-text-primary">
                    {item.minStock} {item.unit}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-border-light flex items-center justify-between">
                <span className="text-[11px] text-text-muted">
                  Supplier: {item.supplier}
                </span>

                <Button
                  type="button"
                  onClick={() =>
                    alert(`Purchase order draft created for ${item.name}!`)
                  }
                  className="py-1.5 px-3 text-xs font-semibold gap-1"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Re-order Now</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
