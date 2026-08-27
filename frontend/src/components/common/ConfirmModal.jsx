import React from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

/**
 * Reusable Confirmation Dialog Modal
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed with this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-medium text-text-secondary hover:bg-bg-hover rounded-lg transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <Button
            type="button"
            variant={variant}
            loading={loading}
            onClick={onConfirm}
            className="py-2 px-4 text-xs font-semibold"
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3 py-2">
        <div className="p-2.5 rounded-xl bg-danger-light text-danger shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pt-1">
          {message}
        </p>
      </div>
    </Modal>
  );
}
