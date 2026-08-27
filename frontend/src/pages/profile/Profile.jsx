import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Calendar,
  Clock,
  Lock,
  Camera,
  CheckCircle2,
  AlertCircle,
  Save,
  KeyRound,
  Sparkles,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";

/**
 * Smart POS - User Profile Page (Fully Mobile Responsive)
 */
export default function Profile() {
  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    name: "Muhammad Usman",
    email: "usman.admin@smartpos.com",
    phone: "0300-8881234",
    address: "House 42-B, Street 12, F-7/2, Islamabad",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    role: "System Administrator",
    employeeId: "EMP-001",
    joinDate: "15 Jan 2022",
    lastLogin: "Today, 11:42 AM (POS Terminal #1)",
    status: "Active",
  });

  // Password State
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirmPass: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [passwordError, setPasswordError] = useState("");

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditing(false);
    showToast("Profile details updated successfully!");
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!passwords.current) {
      setPasswordError("Please enter your current password");
      return;
    }
    if (!passwords.newPass || passwords.newPass.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    if (passwords.newPass !== passwords.confirmPass) {
      setPasswordError("New passwords do not match");
      return;
    }

    setPasswordError("");
    setPasswords({ current: "", newPass: "", confirmPass: "" });
    showToast("Security password updated successfully!");
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-6xl mx-auto">
      
      {/* =========================================================
          PROFILE HEADER CARD
      ========================================================== */}
      <div className="bg-bg-card rounded-2xl p-4 sm:p-6 border border-border shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
          
          {/* Avatar & Basic Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-primary bg-bg-main shadow-xs shrink-0">
                <img
                  src={personalInfo.avatar}
                  alt={personalInfo.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80";
                  }}
                />
              </div>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    const newUrl = prompt("Enter new profile photo image URL:", personalInfo.avatar);
                    if (newUrl) setPersonalInfo((p) => ({ ...p, avatar: newUrl }));
                  }}
                  className="absolute bottom-1 right-1 p-1.5 rounded-lg bg-primary text-white shadow-md hover:bg-primary-hover transition-colors cursor-pointer"
                  title="Change photo URL"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary">
                  {personalInfo.name}
                </h1>
                <Badge variant="purple">{personalInfo.role}</Badge>
                <Badge variant="success">{personalInfo.status}</Badge>
              </div>

              <p className="text-xs text-text-muted mt-1 flex items-center justify-center sm:justify-start gap-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{personalInfo.email}</span>
              </p>

              <p className="text-[11px] text-text-muted mt-0.5">
                ID: <span className="font-mono font-bold text-text-secondary">{personalInfo.employeeId}</span> • Member since {personalInfo.joinDate}
              </p>
            </div>
          </div>

          {/* Edit Profile Toggle Button */}
          <div className="shrink-0">
            <Button
              type="button"
              variant={isEditing ? "outline" : "primary"}
              onClick={() => setIsEditing(!isEditing)}
              className="py-2.5 px-4 text-xs font-bold gap-1.5 shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              <span>{isEditing ? "Exit Edit Mode" : "Edit Profile Info"}</span>
            </Button>
          </div>

        </div>
      </div>

      {/* =========================================================
          MAIN GRID: PERSONAL INFO & SECURITY
      ========================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        
        {/* LEFT COLUMN: PERSONAL & ACCOUNT INFORMATION (7 COLS) */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          
          {/* Personal Information Form Card */}
          <div className="bg-bg-card rounded-2xl p-4 sm:p-6 border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-base text-text-primary">
                  Personal Information
                </h3>
                <p className="text-xs text-text-muted">
                  Update your contact details and physical address
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Full Name"
                  name="name"
                  value={personalInfo.name}
                  onChange={handlePersonalChange}
                  disabled={!isEditing}
                  required
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  value={personalInfo.phone}
                  onChange={handlePersonalChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <Input
                label="Email Address"
                name="email"
                type="email"
                value={personalInfo.email}
                onChange={handlePersonalChange}
                disabled={!isEditing}
                required
              />

              <Input
                label="Home Address"
                name="address"
                value={personalInfo.address}
                onChange={handlePersonalChange}
                disabled={!isEditing}
              />

              {isEditing && (
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-bg-hover rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    className="py-2.5 px-6 text-xs font-bold gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </Button>
                </div>
              )}
            </form>
          </div>

          {/* Account System Details Card */}
          <div className="bg-bg-card rounded-2xl p-4 sm:p-6 border border-border shadow-xs space-y-3.5">
            <div className="border-b border-border pb-3">
              <h3 className="font-bold text-base text-text-primary flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Account & Permissions Overview</span>
              </h3>
              <p className="text-xs text-text-muted">
                System role privileges and session authentication details
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-bg-main border border-border">
                <span className="text-[10px] text-text-muted block font-medium">
                  Access Level
                </span>
                <span className="font-bold text-text-primary text-xs">
                  Full Administrative Privileges
                </span>
              </div>

              <div className="p-3 rounded-xl bg-bg-main border border-border">
                <span className="text-[10px] text-text-muted block font-medium">
                  Employee Reference
                </span>
                <span className="font-mono font-bold text-primary text-xs">
                  {personalInfo.employeeId}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-bg-main border border-border">
                <span className="text-[10px] text-text-muted block font-medium">
                  Account Registration
                </span>
                <span className="font-semibold text-text-secondary text-xs">
                  {personalInfo.joinDate}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-bg-main border border-border">
                <span className="text-[10px] text-text-muted block font-medium">
                  Active Session / Last Login
                </span>
                <span className="font-semibold text-text-secondary text-xs">
                  {personalInfo.lastLogin}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SECURITY & PASSWORD (5 COLS) */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6">
          
          <div className="bg-bg-card rounded-2xl p-4 sm:p-6 border border-border shadow-xs space-y-4">
            <div className="border-b border-border pb-3">
              <h3 className="font-bold text-base text-text-primary flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-primary" />
                <span>Change Password</span>
              </h3>
              <p className="text-xs text-text-muted">
                Update your login password to maintain account security
              </p>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-3.5">
              {passwordError && (
                <div className="p-3 rounded-xl bg-danger-light border border-danger/20 text-danger text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <Input
                label="Current Password"
                type="password"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords((p) => ({ ...p, current: e.target.value }))
                }
                placeholder="••••••••"
                required
              />

              <Input
                label="New Password"
                type="password"
                value={passwords.newPass}
                onChange={(e) =>
                  setPasswords((p) => ({ ...p, newPass: e.target.value }))
                }
                placeholder="••••••••"
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={passwords.confirmPass}
                onChange={(e) =>
                  setPasswords((p) => ({ ...p, confirmPass: e.target.value }))
                }
                placeholder="••••••••"
                required
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full py-2.5 text-xs font-bold justify-center"
                >
                  Update Password
                </Button>
              </div>
            </form>
          </div>

        </div>

      </div>

      {/* =========================================================
          TOAST FEEDBACK
      ========================================================== */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl text-white text-xs font-semibold flex items-center gap-2 ${
              toastMessage.type === "info" ? "bg-amber-600" : "bg-emerald-600"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

    </div>
  );
}
