import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Key,
  Calendar,
  Clock,
  Edit2,
  Ban,
  CheckCircle2,
  Lock,
  Send,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";

export default function RestaurantAdmin({ restaurant, onUpdateAdmin }) {
  const [isAdminActive, setIsAdminActive] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [adminData, setAdminData] = useState({
    name: restaurant.ownerName || "Alexander Hayes",
    email: restaurant.ownerEmail || "alex.hayes@urbanbites.io",
    phone: restaurant.phone || "+1 (555) 234-5678",
    role: "Primary Tenant Owner & Administrator",
    lastLogin: restaurant.lastLogin || "Today, 02:45 PM",
    createdAt: restaurant.createdAt || "Jan 12, 2025",
  });

  const showFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleToggleAdminStatus = () => {
    const nextState = !isAdminActive;
    setIsAdminActive(nextState);
    showFeedback(
      nextState
        ? "Admin account activated successfully."
        : "Admin account access disabled."
    );
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setIsEditModalOpen(false);
    showFeedback("Admin profile updated successfully.");
    if (onUpdateAdmin) {
      onUpdateAdmin(adminData);
    }
  };

  const handleResetPassword = () => {
    setIsResetModalOpen(false);
    showFeedback(`Temporary password reset link sent to ${adminData.email}`);
  };

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Admin Profile Main Card */}
      <div className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-border/80 pb-5">
          <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
            <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-gradient-to-tr from-primary to-purple text-white font-bold text-base sm:text-lg flex items-center justify-center shadow-md shrink-0">
              {adminData.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-text-primary break-words">
                  {adminData.name}
                </h3>
                <Badge variant={isAdminActive ? "success" : "danger"} size="sm" dot className="shrink-0">
                  {isAdminActive ? "Active" : "Disabled"}
                </Badge>
              </div>
              <p className="text-xs text-text-muted break-words">{adminData.role}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="!py-2"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </Button>

            <Button
              variant={isAdminActive ? "secondary" : "primary"}
              size="sm"
              onClick={handleToggleAdminStatus}
              className="!py-2"
            >
              {isAdminActive ? (
                <>
                  <Ban className="w-3.5 h-3.5 text-amber-600" />
                  <span>Disable Access</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Enable Access</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsResetModalOpen(true)}
              className="!py-2 text-text-secondary"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Reset Password</span>
            </Button>
          </div>
        </div>

        {/* Credentials & Activity Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          <div className="p-4 rounded-xl bg-bg-main border border-border min-w-0">
            <div className="flex items-center gap-2 text-text-muted mb-1 text-xs font-semibold">
              <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Email Address</span>
            </div>
            <p className="font-bold text-text-primary text-sm break-all">{adminData.email}</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              Verified Primary Inbox
            </p>
          </div>

          <div className="p-4 rounded-xl bg-bg-main border border-border min-w-0">
            <div className="flex items-center gap-2 text-text-muted mb-1 text-xs font-semibold">
              <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Contact Phone</span>
            </div>
            <p className="font-bold text-text-primary text-sm break-words">{adminData.phone}</p>
            <p className="text-[11px] text-text-muted mt-1">SMS Alerts Enabled</p>
          </div>

          <div className="p-4 rounded-xl bg-bg-main border border-border min-w-0">
            <div className="flex items-center gap-2 text-text-muted mb-1 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Security Privilege</span>
            </div>
            <p className="font-bold text-text-primary text-sm break-words">Tenant Super Admin</p>
            <p className="text-[11px] text-text-muted mt-1">Full Root Access</p>
          </div>

          <div className="p-4 rounded-xl bg-bg-main border border-border min-w-0">
            <div className="flex items-center gap-2 text-text-muted mb-1 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Last Login Session</span>
            </div>
            <p className="font-bold text-text-primary text-sm break-words">{adminData.lastLogin}</p>
            <p className="text-[11px] text-text-muted mt-1">IP: 192.168.1.45 (Web)</p>
          </div>

          <div className="p-4 rounded-xl bg-bg-main border border-border min-w-0">
            <div className="flex items-center gap-2 text-text-muted mb-1 text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Account Provisioned</span>
            </div>
            <p className="font-bold text-text-primary text-sm break-words">{adminData.createdAt}</p>
            <p className="text-[11px] text-text-muted mt-1">Created on Onboarding</p>
          </div>

          <div className="p-4 rounded-xl bg-bg-main border border-border min-w-0">
            <div className="flex items-center gap-2 text-text-muted mb-1 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Two-Factor Auth</span>
            </div>
            <p className="font-bold text-emerald-600 text-sm">2FA Enforced</p>
            <p className="text-[11px] text-text-muted mt-1">Authenticator App</p>
          </div>
        </div>
      </div>

      {/* Modal: Edit Admin */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Administrator Profile"
        subtitle={`Update primary contact credentials for ${restaurant.name}`}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveEdit}>
              Save Admin Changes
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <Input
            label="Administrator Full Name"
            value={adminData.name}
            onChange={(e) =>
              setAdminData({ ...adminData, name: e.target.value })
            }
            required
            icon={User}
          />

          <Input
            label="Email Address"
            type="email"
            value={adminData.email}
            onChange={(e) =>
              setAdminData({ ...adminData, email: e.target.value })
            }
            required
            icon={Mail}
          />

          <Input
            label="Phone Number"
            value={adminData.phone}
            onChange={(e) =>
              setAdminData({ ...adminData, phone: e.target.value })
            }
            required
            icon={Phone}
          />
        </form>
      </Modal>

      {/* Modal: Password Reset Confirmation */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Send Password Reset"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsResetModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleResetPassword}>
              <Send className="w-3.5 h-3.5 mr-1" />
              Send Reset Link
            </Button>
          </>
        }
      >
        <div className="text-xs text-text-secondary leading-relaxed space-y-2">
          <p>
            A secure one-time password reset token will be dispatched to{" "}
            <strong className="text-text-primary break-all">{adminData.email}</strong>.
          </p>
          <p className="text-text-muted">
            The administrator will be prompted to create a new secure password upon their next login.
          </p>
        </div>
      </Modal>
    </div>
  );
}
