import React from "react";
import {
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

export default function ConfirmSubscriptionActionModal({
  isOpen,
  onClose,
  actionType = "toggle_autorenew", // 'toggle_autorenew' | 'mark_paid'
  subscription,
  onConfirm,
}) {
  if (!isOpen || !subscription) return null;

  if (actionType === "toggle_autorenew") {
    const isEnabling = !subscription.autoRenewal;

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={isEnabling ? "Enable Auto-Renewal" : "Disable Auto-Renewal"}
        subtitle={`Update billing recurrence for ${subscription.restaurantName}`}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant={isEnabling ? "primary" : "danger"}
              onClick={() => {
                onConfirm(subscription.id, {
                  autoRenewal: isEnabling,
                  updatedAt: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  }),
                });
                onClose();
              }}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              {isEnabling ? "Enable Renewal" : "Disable Renewal"}
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs leading-relaxed">
          <p className="text-text-secondary">
            Are you sure you want to{" "}
            <strong className="text-text-primary">
              {isEnabling ? "enable" : "disable"}
            </strong>{" "}
            automatic renewal for{" "}
            <strong className="text-text-primary">{subscription.restaurantName}</strong>?
          </p>

          {isEnabling ? (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px]">
              <p className="font-semibold flex items-center gap-1.5 mb-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Seamless Continuity</span>
              </p>
              <p>
                The subscription will automatically renew for subsequent{" "}
                <strong>{subscription.billingCycle}</strong> terms at{" "}
                <strong>{subscription.amount}</strong> on{" "}
                <strong>{subscription.nextBillingDate}</strong> without service disruption.
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
              <p className="font-semibold flex items-center gap-1.5 mb-0.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Service Expiry Warning</span>
              </p>
              <p>
                The tenant's subscription will expire after{" "}
                <strong>{subscription.daysRemaining} days</strong> on{" "}
                <strong>{subscription.endDate}</strong> unless manually extended or renewed.
              </p>
            </div>
          )}
        </div>
      </Modal>
    );
  }

  return null;
}
