import React, { useState, useEffect } from "react";
import {
  Shield,
  Key,
  LogOut,
  Trash2,
  AlertTriangle,
  Send,
  CheckCircle2,
} from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Dropdown from "../../../components/ui/Dropdown";
import { AVAILABLE_ROLES, ALL_ROLES } from "../../../data/users";

export default function ConfirmActionModal({
  isOpen,
  onClose,
  actionType, // 'change_role' | 'reset_password' | 'force_logout' | 'delete'
  user,
  onConfirm,
}) {
  const [selectedRole, setSelectedRole] = useState(user?.role || "Admin");

  useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const roleOptions = (
    user.role === "Super Admin" ? ALL_ROLES : AVAILABLE_ROLES
  ).map((r) => ({
    label: r,
    value: r,
  }));

  // Render modal content based on actionType
  if (actionType === "change_role") {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Change Assigned User Role"
        subtitle={`Modify permissions level for ${user.name}`}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onConfirm(user.id, { role: selectedRole });
                onClose();
              }}
            >
              <Shield className="w-3.5 h-3.5 mr-1" />
              Apply New Role
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-bg-main border border-border">
            <p className="text-text-muted">Current Role:</p>
            <p className="font-bold text-text-primary text-sm mt-0.5">{user.role}</p>
          </div>

          <Dropdown
            label="Select New Role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            options={roleOptions}
          />

          <p className="text-[11px] text-text-muted leading-relaxed">
            Changing this role will immediately alter navigation access, POS terminal privileges, and report viewing clearance for {user.name}.
          </p>
        </div>
      </Modal>
    );
  }

  if (actionType === "reset_password") {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Reset User Password"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onConfirm(user.id);
                onClose();
              }}
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              Send Reset Instructions
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs leading-relaxed">
          <p className="text-text-secondary">
            Send password reset instructions to{" "}
            <strong className="text-text-primary break-all">{user.email}</strong>?
          </p>
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px]">
            <p className="font-semibold mb-0.5">Secure Dispatch</p>
            <p>
              A one-time encrypted password setup link with a 24-hour expiration token will be emailed to the user.
            </p>
          </div>
        </div>
      </Modal>
    );
  }

  if (actionType === "force_logout") {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Force Terminate Sessions"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onConfirm(user.id);
                onClose();
              }}
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Terminate All Sessions
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs leading-relaxed">
          <p className="text-text-secondary">
            This will immediately terminate all active sessions (<strong>{user.activeSessions || 1} active device(s)</strong>) for{" "}
            <strong className="text-text-primary">{user.name}</strong>.
          </p>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
            <p className="font-semibold mb-0.5">Session Invalidation</p>
            <p>
              The user will be logged out of any connected mobile devices, POS cashiers, or browser dashboards instantly.
            </p>
          </div>
        </div>
      </Modal>
    );
  }

  if (actionType === "delete") {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Permanently Delete User Account"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onConfirm(user.id);
                onClose();
              }}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Delete User
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs leading-relaxed">
          <p className="text-text-secondary">
            Are you sure you want to permanently delete{" "}
            <strong className="text-text-primary">{user.name}</strong> (
            <strong className="text-text-primary">{user.email}</strong>)?
          </p>
          <div className="p-3.5 rounded-xl bg-danger-light border border-danger/20 text-danger text-[11px]">
            <p className="font-bold flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Irreversible Action</span>
            </p>
            <p>
              This will remove their profile, revoke all system credentials, and erase device hardware pairings across the platform.
            </p>
          </div>
        </div>
      </Modal>
    );
  }

  return null;
}
