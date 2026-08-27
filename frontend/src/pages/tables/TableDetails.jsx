import React from "react";
import { ArrowRightLeft } from "lucide-react";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { STATUS_CONFIG } from "./TableCard";

/**
 * Smart POS - TableDetails Modal Component
 */
export default function TableDetails({
  table,
  isOpen,
  onClose,
  onUpdateStatus,
  onStartOrder,
  onOpenTransfer,
}) {
  if (!table) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${table.number} Details`}
      subtitle={`Floor: ${table.area} • Capacity: ${table.seats} Seats`}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-text-secondary hover:bg-bg-hover rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>

          {table.status === "Available" && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => onUpdateStatus(table.id, "Reserved")}
                className="py-2 px-3 text-xs"
              >
                Reserve Table
              </Button>
              <Button
                type="button"
                onClick={() => onStartOrder(table)}
                className="py-2 px-4 text-xs font-semibold"
              >
                Start Order in POS
              </Button>
            </>
          )}

          {table.status === "Occupied" && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={onOpenTransfer}
                className="py-2 px-3 text-xs gap-1.5"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Transfer Table</span>
              </Button>
              <Button
                type="button"
                onClick={() => onUpdateStatus(table.id, "Cleaning")}
                className="py-2 px-4 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700"
              >
                Clear Bill & Free Table
              </Button>
            </>
          )}

          {table.status === "Reserved" && (
            <>
              <Button
                type="button"
                variant="danger"
                onClick={() => onUpdateStatus(table.id, "Available")}
                className="py-2 px-3 text-xs"
              >
                Cancel Reservation
              </Button>
              <Button
                type="button"
                onClick={() => onUpdateStatus(table.id, "Occupied")}
                className="py-2 px-4 text-xs font-semibold"
              >
                Seat Guests (Occupy)
              </Button>
            </>
          )}

          {table.status === "Cleaning" && (
            <Button
              type="button"
              onClick={() => onUpdateStatus(table.id, "Available")}
              className="py-2 px-5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700"
            >
              Mark Available (Ready)
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-4">
        {/* Status Header Pill */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-bg-main border border-border">
          <span className="text-xs text-text-secondary font-medium">
            Current Table Status:
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              STATUS_CONFIG[table.status]?.badgeBg
            } ${STATUS_CONFIG[table.status]?.badgeText}`}
          >
            {table.status}
          </span>
        </div>

        {/* Occupied Order Item List */}
        {table.status === "Occupied" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Current Order ({table.orderId})
              </h5>
              <span className="text-xs text-text-muted">
                Waiter: {table.waiter}
              </span>
            </div>

            <div className="bg-bg-main rounded-xl border border-border p-3 divide-y divide-border-light space-y-2">
              {table.orderItems?.map((item, i) => (
                <div
                  key={i}
                  className="pt-2 first:pt-0 flex justify-between items-center text-xs"
                >
                  <span className="text-text-primary font-medium">
                    {item.qty}x {item.name}
                  </span>
                  <span className="font-bold text-text-primary">
                    Rs. {item.price}
                  </span>
                </div>
              ))}

              <div className="pt-2 flex justify-between items-baseline">
                <span className="font-bold text-text-primary text-xs uppercase">
                  Total Bill
                </span>
                <span className="font-bold text-emerald-600 text-base">
                  Rs. {table.amount?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Status Override */}
        <div>
          <label className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-2">
            Quick Status Override
          </label>
          <div className="grid grid-cols-4 gap-2">
            {["Available", "Occupied", "Reserved", "Cleaning"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => onUpdateStatus(table.id, st)}
                className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  table.status === st
                    ? "border-primary bg-primary-light text-primary shadow-xs"
                    : "border-border bg-bg-card hover:bg-bg-hover text-text-secondary"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
