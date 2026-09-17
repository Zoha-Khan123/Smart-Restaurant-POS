import React from "react";
import { Trash2, AlertTriangle, FileSpreadsheet } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

export default function ConfirmAuditLogActionModal({
  isOpen,
  onClose,
  actionType,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Audit Log Action"
      subtitle="Administrative confirmation required"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm
          </Button>
        </>
      }
    >
      <div className="space-y-3 text-xs leading-relaxed">
        <p className="text-text-secondary">
          Are you sure you want to proceed with this audit log action?
        </p>
      </div>
    </Modal>
  );
}
