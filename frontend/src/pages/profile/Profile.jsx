import React, { useState } from "react";
import { User, ShieldCheck, CheckCircle2 } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";

import ProfileHeader from "./components/ProfileHeader";
import ProfileInformation from "./components/ProfileInformation";
import ChangePasswordForm from "./components/ChangePasswordForm";
import TwoFactorAuthentication from "./components/TwoFactorAuthentication";
import ActiveSessions from "./components/ActiveSessions";
import SecurityActivity from "./components/SecurityActivity";
import ConfirmSecurityActionModal from "./components/ConfirmSecurityActionModal";

import { INITIAL_PROFILE_DATA, INITIAL_SESSIONS_DATA } from "../../data/profile";
import { INITIAL_SECURITY_ACTIVITIES } from "../../data/securityActivity";

export default function Profile() {
  const [profile, setProfile] = useState(INITIAL_PROFILE_DATA);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS_DATA);
  const [activities, setActivities] = useState(INITIAL_SECURITY_ACTIVITIES);
  const [toast, setToast] = useState(null);

  // Confirm Modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    actionType: null,
    targetId: null,
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleUpdateProfile = (updatedData) => {
    setProfile(updatedData);
    showToast("Profile details updated successfully.");
  };

  const handleUploadPhoto = () => {
    showToast("Avatar update dialog opened. (Simulated)", "info");
  };

  const handleToggle2FA = () => {
    if (profile.twoFactorEnabled) {
      setConfirmModal({
        isOpen: true,
        actionType: "disable_2fa",
      });
    } else {
      setProfile((prev) => ({
        ...prev,
        twoFactorEnabled: true,
        securityScore: 96,
      }));
      showToast("Two-factor authentication successfully enabled.");
    }
  };

  const handleRevokeSession = (sessionId) => {
    setConfirmModal({
      isOpen: true,
      actionType: "revoke_session",
      targetId: sessionId,
    });
  };

  const handleRevokeAllOther = () => {
    setConfirmModal({
      isOpen: true,
      actionType: "revoke_all",
    });
  };

  const handleConfirmAction = () => {
    const { actionType, targetId } = confirmModal;

    if (actionType === "revoke_session") {
      setSessions((prev) => prev.filter((s) => s.id !== targetId));
      showToast("Session successfully terminated.");
    } else if (actionType === "revoke_all") {
      setSessions((prev) => prev.filter((s) => s.current));
      showToast("All other active sessions have been terminated.");
    } else if (actionType === "disable_2fa") {
      setProfile((prev) => ({
        ...prev,
        twoFactorEnabled: false,
        securityScore: 68,
      }));
      showToast("2FA disabled. Re-enable recommended.", "warning");
    }

    setConfirmModal({ isOpen: false, actionType: null, targetId: null });
  };

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0 pb-12">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-white/10 text-xs sm:text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* 1. Page Header */}
      <PageHeader
        title="Super Admin Profile & Security"
        subtitle="Manage your personal administrator identity, password credentials, two-factor auth tokens, and active sessions."
      />

      {/* 2. Top Profile Hero Banner */}
      <ProfileHeader
        profile={profile}
        onUploadPhoto={handleUploadPhoto}
      />

      {/* 3. Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
        {/* Left Column (2 Cols): Personal Information & Password */}
        <div className="lg:col-span-2 space-y-6 min-w-0">
          <ProfileInformation
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
          />

          <ChangePasswordForm
            onPasswordChangeSuccess={() => {
              showToast("Account password updated successfully.");
            }}
          />
        </div>

        {/* Right Column (1 Col): 2FA, Active Sessions & Security Events */}
        <div className="lg:col-span-1 space-y-6 min-w-0">
          <TwoFactorAuthentication
            isEnabled={profile.twoFactorEnabled}
            method={profile.twoFactorMethod}
            onToggle2FA={handleToggle2FA}
          />

          <ActiveSessions
            sessions={sessions}
            onRevokeSession={handleRevokeSession}
            onRevokeAllOther={handleRevokeAllOther}
          />

          <SecurityActivity
            activities={activities}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmSecurityActionModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, actionType: null, targetId: null })}
        actionType={confirmModal.actionType}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
