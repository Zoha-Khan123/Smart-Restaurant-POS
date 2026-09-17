import React from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

export default function ConfirmSecurityActionModal({
  isOpen,
  onClose,
  onConfirm,
  actionType, // 'revoke_session' | 'revoke_all' | 'disable_2fa'
}) {
  if (!isOpen) return null;

  const config = {
    revoke_session: {
      title: "Revoke Active Session",
      subtitle: "Are you sure you want to terminate this active login session?",
      description: "The user on that device will be immediately signed out and must re-authenticate with their password and 2FA passcode.",
      confirmText: "Revoke Session",
      variant: "danger",
    },
    revoke_all: {
      title: "Revoke All Other Sessions",
      subtitle: "Terminate all active connections across external browsers and mobile devices.",
      description: "This will immediately disconnect all devices other than your current active browser session.",
      confirmText: "Revoke All Sessions",
      variant: "danger",
    },
    disable_2fa: {
      title: "Disable Two-Factor Authentication",
      subtitle: "Warning: Disabling 2FA lowers the account security rating.",
      description: "Disabling Two-Factor Authentication removes the requirement for a TOTP passcode on sign-in. Root security policies may flag this account for non-compliance.",
      confirmText: "Disable 2FA Protection",
      variant: "danger",
    },
  }[actionType] || {
    title: "Confirm Security Action",
    subtitle: "Please confirm you wish to proceed.",
    description: "This administrative security operation will take effect immediately.",
    confirmText: "Confirm",
    variant: "danger",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={config.title}
      subtitle={config.subtitle}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={config.variant} onClick={onConfirm}>
            {config.confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-danger-light text-danger shrink-0 border border-danger/20">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <p className="text-xs text-text-secondary leading-relaxed">
            {config.description}
          </p>
        </div>
      </div>
    </Modal>
  );
}
