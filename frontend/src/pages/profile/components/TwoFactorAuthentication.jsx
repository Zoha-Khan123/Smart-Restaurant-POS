import React, { useState } from "react";
import { ShieldCheck, Smartphone, Key, AlertTriangle, Eye, EyeOff, Copy, Check } from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Modal from "../../../components/ui/Modal";

export default function TwoFactorAuthentication({
  isEnabled = true,
  method = "Authenticator App (TOTP)",
  onToggle2FA,
}) {
  const [showBackupCodesModal, setShowBackupCodesModal] = useState(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);

  // Masked recovery codes mock
  const recoveryCodes = [
    "8A4K-92L1-XN92",
    "4B2P-87WQ-90MN",
    "99KL-21ZA-77BC",
    "66TR-33YU-10PL",
    "55DF-88HG-44JK",
    "12QW-99ER-77TY",
  ];

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  return (
    <>
      <Card
        title="Two-Factor Authentication (2FA)"
        subtitle="Require an OTP passcode on each login."
        badge={
          isEnabled ? (
            <Badge variant="success" size="sm" dot>
              Active
            </Badge>
          ) : (
            <Badge variant="danger" size="sm" dot>
              Disabled
            </Badge>
          )
        }
      >
        <div className="space-y-4 min-w-0">
          <div className="p-4 rounded-xl border border-border bg-bg-main/40 space-y-3 min-w-0">
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-text-primary break-words">
                  {method}
                </p>
                <p className="text-xs text-text-muted mt-0.5 break-words leading-relaxed">
                  Secured with Google Authenticator, 1Password, or Authy compatible TOTP tokens.
                </p>
              </div>
            </div>

            {/* Action buttons on their own row to prevent overflowing */}
            <div className="flex items-center gap-2 pt-2 border-t border-border/70 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBackupCodesModal(true)}
                className="flex-1 min-w-[110px] text-xs !py-1.5"
              >
                <Key className="w-3.5 h-3.5 mr-1" />
                Backup Codes
              </Button>

              <Button
                variant={isEnabled ? "danger" : "primary"}
                size="sm"
                onClick={onToggle2FA}
                className="flex-1 min-w-[110px] text-xs !py-1.5 font-semibold"
              >
                {isEnabled ? "Disable 2FA" : "Enable 2FA"}
              </Button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5 min-w-0">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed break-words">
              <span className="font-bold">Notice:</span> Two-factor authentication is globally enforced for Super Admin operators.
            </p>
          </div>
        </div>
      </Card>

      {/* Backup Recovery Codes Modal */}
      <Modal
        isOpen={showBackupCodesModal}
        onClose={() => setShowBackupCodesModal(false)}
        title="Emergency Recovery Codes"
        subtitle="Store these one-time recovery codes in a safe place. Each code can only be used once."
        size="md"
        footer={
          <Button variant="secondary" onClick={() => setShowBackupCodesModal(false)}>
            Done
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2.5">
            {recoveryCodes.map((code, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-bg-main font-mono text-xs text-text-primary font-bold"
              >
                <span>{code}</span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(code, idx)}
                  className="p-1 rounded text-text-muted hover:text-primary hover:bg-bg-hover transition-colors cursor-pointer"
                  title="Copy code"
                >
                  {copiedCodeIndex === idx ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-text-muted leading-relaxed">
            If you lose access to your primary mobile device, you can use any of the above emergency security codes to regain root access.
          </p>
        </div>
      </Modal>
    </>
  );
}
