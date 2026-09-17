import React from "react";
import {
  Trash2,
  Ban,
  MailOpen,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

export default function ConfirmNotificationActionModal({
  isOpen,
  onClose,
  actionType, // 'delete' | 'cancel_schedule' | 'mark_all_read'
  notification,
  onConfirm,
}) {
  if (!isOpen) return null;

  // 1. Delete Action
  if (actionType === "delete") {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Delete Notification"
        subtitle={`Remove broadcast record`}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onConfirm(notification.id);
                onClose();
              }}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Delete Alert
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs leading-relaxed">
          <p className="text-text-secondary">
            Are you sure you want to delete{" "}
            <strong className="text-text-primary">"{notification?.title}"</strong>?
          </p>
          <div className="p-3.5 rounded-xl bg-danger-light border border-danger/20 text-danger text-[11px]">
            <p className="font-bold flex items-center gap-1.5 mb-0.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Log Deletion</span>
            </p>
            This action will remove this notification record from the platform administrative telemetry log.
          </div>
        </div>
      </Modal>
    );
  }

  // 2. Cancel Schedule Action
  if (actionType === "cancel_schedule") {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Cancel Scheduled Broadcast"
        subtitle={`Revoke scheduled delivery queue`}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={onClose}>
              Keep Scheduled
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onConfirm(notification.id);
                onClose();
              }}
            >
              <Ban className="w-3.5 h-3.5 mr-1" />
              Cancel Broadcast
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs leading-relaxed">
          <p className="text-text-secondary">
            Are you sure you want to cancel the scheduled broadcast for{" "}
            <strong className="text-text-primary">"{notification?.title}"</strong>?
          </p>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
            <p className="font-semibold mb-0.5">Queue Revocation</p>
            This message will not be dispatched to restaurant terminals at{" "}
            <strong>{notification?.scheduledAt}</strong>.
          </div>
        </div>
      </Modal>
    );
  }

  // 3. Mark All As Read
  if (actionType === "mark_all_read") {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Mark All as Read"
        subtitle="Clear unread notification indicators"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              <MailOpen className="w-3.5 h-3.5 mr-1" />
              Confirm All Read
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs leading-relaxed">
          <p className="text-text-secondary">
            Are you sure you want to mark all unread notifications across the platform as read?
          </p>
        </div>
      </Modal>
    );
  }

  return null;
}
