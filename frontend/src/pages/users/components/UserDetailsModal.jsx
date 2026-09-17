import React from "react";
import {
  User,
  Mail,
  Phone,
  Store,
  Shield,
  Calendar,
  Clock,
  Laptop,
  CheckCircle2,
  Lock,
  Edit2,
} from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import { ROLE_BADGE_VARIANTS, STATUS_BADGE_VARIANTS } from "../../../data/users";

export default function UserDetailsModal({
  isOpen,
  onClose,
  user,
  onEdit,
}) {
  if (!isOpen || !user) return null;

  const roleVariant = ROLE_BADGE_VARIANTS[user.role] || "default";
  const statusVariant = STATUS_BADGE_VARIANTS[user.status] || "default";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Account Details"
      subtitle={`Platform credentials and session telemetry for ${user.name}`}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onClose();
              if (onEdit) onEdit(user);
            }}
          >
            <Edit2 className="w-3.5 h-3.5 mr-1" />
            Edit Profile
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        {/* User Identity Banner */}
        <div className="p-4 rounded-xl bg-bg-main border border-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`w-12 h-12 rounded-xl ${
                user.avatarBg || "bg-primary"
              } text-white font-bold text-base flex items-center justify-center shrink-0 shadow-sm`}
            >
              {user.avatar}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-text-primary text-sm break-words">
                  {user.name}
                </h4>
                <Badge variant={roleVariant} size="sm">
                  {user.role}
                </Badge>
              </div>
              <p className="font-mono text-[11px] text-text-muted mt-0.5">
                ID: {user.id}
              </p>
            </div>
          </div>

          <Badge variant={statusVariant} size="sm" dot className="shrink-0">
            {user.status}
          </Badge>
        </div>

        {/* Credentials & Assignment Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-3.5 rounded-xl bg-bg-card border border-border min-w-0">
            <div className="flex items-center gap-1.5 text-text-muted mb-1 font-semibold">
              <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Email Address</span>
            </div>
            <p className="font-bold text-text-primary break-all">{user.email}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-bg-card border border-border min-w-0">
            <div className="flex items-center gap-1.5 text-text-muted mb-1 font-semibold">
              <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Contact Phone</span>
            </div>
            <p className="font-bold text-text-primary break-words">{user.phone || "Not provided"}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-bg-card border border-border min-w-0">
            <div className="flex items-center gap-1.5 text-text-muted mb-1 font-semibold">
              <Store className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Assigned Restaurant</span>
            </div>
            <p className="font-bold text-text-primary break-words">{user.restaurantName}</p>
            {user.restaurantId && (
              <span className="font-mono text-[10px] text-text-muted">
                {user.restaurantId}
              </span>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-bg-card border border-border min-w-0">
            <div className="flex items-center gap-1.5 text-text-muted mb-1 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Account Created</span>
            </div>
            <p className="font-bold text-text-primary break-words">{user.createdAt}</p>
          </div>
        </div>

        {/* Session & Security Telemetry */}
        <div className="p-4 rounded-xl bg-bg-main/70 border border-border space-y-2.5">
          <p className="font-bold text-text-primary flex items-center gap-1.5">
            <Laptop className="w-3.5 h-3.5 text-primary" />
            <span>Active Session & Device Security</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-text-secondary">
            <div>
              <span className="text-text-muted">Last Recorded Login:</span>{" "}
              <strong className="text-text-primary">{user.lastLogin}</strong>
            </div>
            <div>
              <span className="text-text-muted">Client & IP:</span>{" "}
              <strong className="text-text-primary break-words">{user.lastLoginIp || "N/A"}</strong>
            </div>
            <div>
              <span className="text-text-muted">Live Active Sessions:</span>{" "}
              <span className="font-bold text-emerald-600">
                {user.activeSessions || 0} Device(s)
              </span>
            </div>
            <div>
              <span className="text-text-muted">2FA Enforcement:</span>{" "}
              <span className="font-semibold text-text-primary">
                {user.role === "Super Admin" ? "Mandatory (Enforced)" : "Standard"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
