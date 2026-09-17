import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Ban,
  Trash2,
  AlertTriangle,
  ShieldAlert,
  Store,
  ExternalLink,
} from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

export default function ConfirmPlanActionModal({
  isOpen,
  onClose,
  actionType, // 'toggle_status' | 'delete'
  plan,
  onConfirm,
}) {
  const navigate = useNavigate();

  if (!isOpen || !plan) return null;

  const isActive = plan.status === "Active";
  const hasSubscribers = (Number(plan.restaurantsCount) || 0) > 0;

  // 1. Status Toggle Modal (Activate / Deactivate)
  if (actionType === "toggle_status") {
    const nextStatus = isActive ? "Inactive" : "Active";

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={isActive ? "Deactivate Subscription Plan" : "Activate Subscription Plan"}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant={isActive ? "danger" : "primary"}
              onClick={() => {
                onConfirm(plan.id, { status: nextStatus });
                onClose();
              }}
            >
              {isActive ? (
                <>
                  <Ban className="w-3.5 h-3.5 mr-1" />
                  Confirm Deactivation
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Confirm Activation
                </>
              )}
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs leading-relaxed">
          <p className="text-text-secondary">
            Are you sure you want to set{" "}
            <strong className="text-text-primary">{plan.name} Plan</strong> to{" "}
            <strong className="text-text-primary">{nextStatus}</strong>?
          </p>

          {isActive ? (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] space-y-1">
              <p className="font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Assignment Restriction Notice</span>
              </p>
              <p>
                Deactivating this plan will hide it from new onboarding restaurants.
                Existing subscribed restaurants ({plan.restaurantsCount || 0} active) will NOT be disrupted and will maintain their current billing cycle.
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px]">
              <p className="font-bold mb-0.5">Live Availability</p>
              <p>
                This plan will immediately become available for new restaurant registrations and tier upgrades.
              </p>
            </div>
          )}
        </div>
      </Modal>
    );
  }

  // 2. Delete Plan Modal (with Protection Business Rule)
  if (actionType === "delete") {
    if (hasSubscribers) {
      // Deletion Blocked because restaurants are currently using this plan
      return (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          title="Plan Deletion Blocked"
          size="sm"
          footer={
            <>
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  onClose();
                  navigate("/super-admin/restaurants");
                }}
              >
                <Store className="w-3.5 h-3.5 mr-1" />
                View Subscribed Restaurants
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-xs leading-relaxed">
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Active Subscriptions Detected</span>
              </p>
              <p className="text-[11px]">
                The <strong>{plan.name} Plan</strong> is currently assigned to{" "}
                <strong>{plan.restaurantsCount} active restaurant tenant(s)</strong>.
              </p>
              <p className="text-[11px] text-amber-800 pt-1">
                To protect billing integrity and tenant service continuity, plans with active subscribers cannot be deleted. Please migrate all restaurants to an alternative tier before deleting this plan.
              </p>
            </div>
          </div>
        </Modal>
      );
    }

    // Allowed to delete (0 active subscribers)
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Permanently Delete Subscription Plan"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onConfirm(plan.id);
                onClose();
              }}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Delete Plan
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs leading-relaxed">
          <p className="text-text-secondary">
            Are you sure you want to delete{" "}
            <strong className="text-text-primary">{plan.name} Plan</strong>?
          </p>
          <div className="p-3.5 rounded-xl bg-danger-light border border-danger/20 text-danger text-[11px]">
            <p className="font-bold flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Irreversible Action</span>
            </p>
            <p>
              This tier definition and its feature limitations will be permanently purged from the platform catalog.
            </p>
          </div>
        </div>
      </Modal>
    );
  }

  return null;
}
