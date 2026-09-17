import React, { useState } from "react";
import {
  Edit2,
  Ban,
  CheckCircle2,
  ShieldAlert,
  Trash2,
  AlertCircle,
  Shield,
  Key,
  RefreshCw,
  LogOut,
  Download,
  AlertTriangle,
  Lock,
  Radio,
  FileText,
  SlidersHorizontal,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Modal from "../../../components/ui/Modal";

export default function RestaurantActions({
  restaurant,
  onEdit,
  onToggleStatus,
  onSuspend,
  onDelete,
}) {
  if (!restaurant) return null;

  const isActive = restaurant.status === "Active";

  // Internal Action State
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
  const [isResetPassModalOpen, setIsResetPassModalOpen] = useState(false);
  const [isResyncing, setIsResyncing] = useState(false);

  const showFeedback = (message, type = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleForceResync = () => {
    setIsResyncing(true);
    setTimeout(() => {
      setIsResyncing(false);
      showFeedback(`Cloud database and POS terminal caches synchronized for "${restaurant.name}".`);
    }, 1200);
  };

  const handleTerminateSessions = () => {
    setIsTerminateModalOpen(false);
    showFeedback(`All active POS and staff sessions for "${restaurant.name}" were terminated.`, "warning");
  };

  const handleResetPassword = () => {
    setIsResetPassModalOpen(false);
    showFeedback(`Emergency password reset link sent to ${restaurant.ownerEmail || "owner"}.`);
  };

  const handleToggleMaintenance = () => {
    const next = !isMaintenanceMode;
    setIsMaintenanceMode(next);
    showFeedback(
      next
        ? `Maintenance Mode enabled for "${restaurant.name}". Terminals will display maintenance screen.`
        : `Maintenance Mode disabled for "${restaurant.name}". Operational access restored.`
    );
  };

  const handleExportData = () => {
    showFeedback(`Full tenant data archive (JSON) generated and downloaded for "${restaurant.name}".`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback Alert */}
      {feedback && (
        <div className="p-4 rounded-xl bg-slate-900 text-white border border-white/10 shadow-lg text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* 1. Operational & Configuration Controls */}
      <div className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs space-y-5">
        <div className="border-b border-border/80 pb-3.5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-text-primary text-base">
              Operational & Configuration Controls
            </h3>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Manage live terminal connectivity, store parameters, and synchronization.
          </p>
        </div>

        <div className="space-y-3.5">
          {/* Action: Edit Details */}
          <div className="p-4 rounded-xl bg-bg-main border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200 mt-0.5">
                <Edit2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-primary">
                  Edit Restaurant Details
                </h4>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Update business name, category, owner contacts, and physical address.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="shrink-0 sm:self-center"
            >
              <Edit2 className="w-3.5 h-3.5 mr-1" />
              <span>Edit Details</span>
            </Button>
          </div>

          {/* Action: POS Access Status Toggle */}
          <div className="p-4 rounded-xl bg-bg-main border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-xl ${
                  isActive
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : "bg-red-50 text-red-600 border-red-200"
                } flex items-center justify-center shrink-0 border mt-0.5`}
              >
                {isActive ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Ban className="w-4 h-4" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-text-primary">
                    POS Terminal Operational Status
                  </h4>
                  <Badge variant={isActive ? "success" : "danger"} size="sm" dot>
                    {isActive ? "Active (Enabled)" : "Disabled"}
                  </Badge>
                </div>
                <p className="text-[11px] text-text-muted mt-0.5">
                  {isActive
                    ? "Temporarily restrict POS terminal logins and live ordering across all branches."
                    : "Re-enable operational terminal access, hardware authentication, and cloud sync."}
                </p>
              </div>
            </div>
            <Button
              variant={isActive ? "secondary" : "primary"}
              size="sm"
              onClick={onToggleStatus}
              className="shrink-0 sm:self-center"
            >
              {isActive ? (
                <>
                  <Ban className="w-3.5 h-3.5 text-amber-600 mr-1" />
                  <span>Disable POS Access</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                  <span>Enable POS Access</span>
                </>
              )}
            </Button>
          </div>

          {/* Action: Force Cloud Sync */}
          <div className="p-4 rounded-xl bg-bg-main border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-200 mt-0.5">
                <RefreshCw className={`w-4 h-4 ${isResyncing ? "animate-spin" : ""}`} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-primary">
                  Force Cloud Cache Resynchronization
                </h4>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Purge offline terminal cache and push latest menu pricing, tax tables, and floor maps.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              loading={isResyncing}
              onClick={handleForceResync}
              className="shrink-0 sm:self-center"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              <span>Resync Cloud Data</span>
            </Button>
          </div>

          {/* Action: Maintenance Mode Toggle */}
          <div className="p-4 rounded-xl bg-bg-main border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200 mt-0.5">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-text-primary">
                    Maintenance Mode
                  </h4>
                  <Badge variant={isMaintenanceMode ? "warning" : "default"} size="sm">
                    {isMaintenanceMode ? "Maintenance On" : "Normal Mode"}
                  </Badge>
                </div>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Displays a maintenance screen to customers and pauses digital ordering.
                </p>
              </div>
            </div>
            <Button
              variant={isMaintenanceMode ? "secondary" : "outline"}
              size="sm"
              onClick={handleToggleMaintenance}
              className="shrink-0 sm:self-center"
            >
              <span>{isMaintenanceMode ? "Exit Maintenance" : "Enter Maintenance"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Security & Session Governance */}
      <div className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs space-y-5">
        <div className="border-b border-border/80 pb-3.5">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-text-primary text-base">
              Security & Session Governance
            </h3>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Administer credential resets, active hardware sessions, and security policies.
          </p>
        </div>

        <div className="space-y-3.5">
          {/* Terminate Sessions */}
          <div className="p-4 rounded-xl bg-bg-main border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200 mt-0.5">
                <LogOut className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-primary">
                  Terminate All Active Terminal Sessions
                </h4>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Immediately logs out all cashiers, kitchen displays (KOT), and manager terminals.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTerminateModalOpen(true)}
              className="shrink-0 sm:self-center text-amber-700 hover:bg-amber-50 !border-amber-200"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              <span>Terminate Sessions</span>
            </Button>
          </div>

          {/* Reset Admin Password */}
          <div className="p-4 rounded-xl bg-bg-main border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200 mt-0.5">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-primary">
                  Emergency Admin Password Reset
                </h4>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Send a one-time secure credential reset email directly to {restaurant.ownerEmail || "the owner"}.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsResetPassModalOpen(true)}
              className="shrink-0 sm:self-center"
            >
              <Key className="w-3.5 h-3.5 mr-1" />
              <span>Reset Password</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Data Export & Archives */}
      <div className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs space-y-5">
        <div className="border-b border-border/80 pb-3.5">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-text-primary text-base">
              Data Backup & Export
            </h3>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Download complete tenant records, sales histories, and configuration backups.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-bg-main border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200 mt-0.5">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-text-primary">
                Export Full Tenant Archive (JSON / CSV)
              </h4>
              <p className="text-[11px] text-text-muted mt-0.5">
                Includes menu catalog, billing receipts, order history, inventory logs, and staff permissions.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            className="shrink-0 sm:self-center"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            <span>Export Archive</span>
          </Button>
        </div>
      </div>

      {/* 4. Danger Zone */}
      <div className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-red-200 shadow-xs space-y-5">
        <div className="border-b border-red-100 pb-3.5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-danger" />
            <h3 className="font-bold text-danger text-base">Danger Zone</h3>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Destructive administrative actions that affect multi-tenant data retention and billing.
          </p>
        </div>

        <div className="space-y-3.5">
          {/* Suspend Action */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-900">
                  Suspend Tenant Account (Administrative Hold)
                </h4>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Locks all terminal logins, halts order processing, and freezes subscription billing.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onSuspend}
              className="!border-amber-300 text-amber-900 hover:bg-amber-100 shrink-0 sm:self-center font-bold"
            >
              <ShieldAlert className="w-3.5 h-3.5 mr-1" />
              <span>Suspend Tenant</span>
            </Button>
          </div>

          {/* Delete Action */}
          <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 border border-red-300 mt-0.5">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-red-900">
                  Permanently Delete Restaurant
                </h4>
                <p className="text-[11px] text-red-700 mt-0.5">
                  Permanently deletes <strong>{restaurant.name}</strong> ({restaurant.id}), removing all order logs, menu catalogs, and hardware terminal pairings.
                </p>
              </div>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={onDelete}
              className="shrink-0 sm:self-center"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              <span>Delete Restaurant</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Modal: Terminate Sessions */}
      <Modal
        isOpen={isTerminateModalOpen}
        onClose={() => setIsTerminateModalOpen(false)}
        title="Terminate All Active POS Sessions"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsTerminateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleTerminateSessions}
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Confirm Terminate
            </Button>
          </>
        }
      >
        <div className="text-xs text-text-secondary leading-relaxed space-y-2">
          <p>
            Are you sure you want to force log out all connected devices for{" "}
            <strong className="text-text-primary">{restaurant.name}</strong>?
          </p>
          <p className="text-text-muted">
            All cashier terminals and kitchen displays will be required to re-authenticate.
          </p>
        </div>
      </Modal>

      {/* Modal: Emergency Password Reset */}
      <Modal
        isOpen={isResetPassModalOpen}
        onClose={() => setIsResetPassModalOpen(false)}
        title="Send Emergency Password Reset"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsResetPassModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleResetPassword}
            >
              <Key className="w-3.5 h-3.5 mr-1" />
              Send Reset Link
            </Button>
          </>
        }
      >
        <div className="text-xs text-text-secondary leading-relaxed space-y-2">
          <p>
            A secure credential reset token will be dispatched to{" "}
            <strong className="text-text-primary">{restaurant.ownerEmail || "the owner"}</strong>.
          </p>
          <p className="text-text-muted">
            The administrator will be prompted to create a new password upon their next session.
          </p>
        </div>
      </Modal>
    </div>
  );
}
