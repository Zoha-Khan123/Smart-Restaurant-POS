import React from "react";
import { CheckCircle2, Ban, ShieldAlert, AlertTriangle } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

export default function ConfirmStatusModal({
  isOpen,
  onClose,
  user,
  newStatus,
  onConfirm,
}) {
  if (!isOpen || !user) return null;

  const isActivating = newStatus === "Active";
  const isSuspending = newStatus === "Suspended";

  const getTitle = () => {
    if (isActivating) return "Activate User Account";
    if (isSuspending) return "Suspend User Account";
    return "Deactivate User Account";
  };

  const getButtonVariant = () => {
    if (isActivating) return "primary";
    return "danger";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={getButtonVariant()}
            onClick={() => {
              onConfirm(user.id, newStatus || (user.status === "Active" ? "Inactive" : "Active"));
              onClose();
            }}
          >
            {isActivating ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Confirm Activation
              </>
            ) : isSuspending ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                Confirm Suspension
              </>
            ) : (
              <>
                <Ban className="w-3.5 h-3.5 mr-1" />
                Confirm Deactivation
              </>
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-3 text-xs leading-relaxed">
        <p className="text-text-secondary">
          Are you sure you want to change the status of{" "}
          <strong className="text-text-primary">{user.name}</strong> ({user.role}) to{" "}
          <strong className="text-text-primary">
            {newStatus || (user.status === "Active" ? "Inactive" : "Active")}
          </strong>
          ?
        </p>

        {isActivating ? (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
            <p className="font-semibold mb-0.5">Access Restoration</p>
            <p className="text-[11px]">
              This user will immediately be able to sign in, use POS terminals, and process orders.
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
            <p className="font-semibold mb-0.5">Access Restriction</p>
            <p className="text-[11px]">
              This user will be logged out and prevented from accessing the POS and management portals until re-enabled.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
