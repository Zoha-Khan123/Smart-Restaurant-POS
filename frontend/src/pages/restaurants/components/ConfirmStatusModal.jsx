import React, { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

export default function ConfirmStatusModal({
  isOpen,
  onClose,
  restaurant,
  onConfirm,
}) {
  const [loading, setLoading] = useState(false);

  if (!restaurant) return null;

  const isCurrentActive = restaurant.status === "Active";
  const targetAction = isCurrentActive ? "Disable" : "Enable";

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      onConfirm(restaurant.id, isCurrentActive ? "Inactive" : "Active");
      setLoading(false);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isCurrentActive ? "Disable Restaurant Access" : "Enable Restaurant Access"}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={isCurrentActive ? "danger" : "primary"}
            onClick={handleConfirm}
            loading={loading}
          >
            {isCurrentActive ? "Disable Restaurant" : "Enable Restaurant"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Warning / Info Banner */}
        <div
          className={`p-4 rounded-xl flex items-start gap-3 border ${
            isCurrentActive
              ? "bg-amber-50/70 border-amber-200 text-amber-900"
              : "bg-emerald-50/70 border-emerald-200 text-emerald-900"
          }`}
        >
          {isCurrentActive ? (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          )}
          <div className="text-xs leading-relaxed">
            {isCurrentActive ? (
              <p>
                Disabling this restaurant will immediately revoke POS terminal logins,
                restrict tenant admin portal access, and freeze pending order processing
                for all connected branch devices.
              </p>
            ) : (
              <p>
                Enabling this restaurant will immediately restore full POS operations,
                grant tenant admin access, and reactivate all kitchen order display terminals.
              </p>
            )}
          </div>
        </div>

        {/* Restaurant Summary Card */}
        <div className="p-3.5 rounded-xl bg-bg-main border border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl ${restaurant.logoColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}
            >
              {restaurant.initials}
            </div>
            <div>
              <p className="font-bold text-text-primary text-sm">
                {restaurant.name}
              </p>
              <p className="text-[11px] text-text-muted">
                {restaurant.ownerName} • {restaurant.ownerEmail}
              </p>
            </div>
          </div>

          <div className="text-right">
            <Badge variant={restaurant.statusVariant} size="sm" dot>
              {restaurant.status}
            </Badge>
          </div>
        </div>
      </div>
    </Modal>
  );
}
