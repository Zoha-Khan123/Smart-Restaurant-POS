import React from "react";
import { Camera, ShieldCheck } from "lucide-react";

export default function ProfileAvatar({
  avatarUrl,
  initials = "SA",
  name = "Super Admin",
  role = "Super Administrator",
  status = "Active",
  securityScore = 96,
  onUploadPhoto,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-5 min-w-0">
      {/* Avatar Container with Negative Top Margin (straddling banner) */}
      <div className="relative shrink-0 -mt-12 sm:-mt-14 z-10">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-bg-card shadow-lg bg-bg-card"
          />
        ) : (
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-primary via-blue-600 to-purple text-white flex items-center justify-center text-3xl font-extrabold shadow-lg ring-4 ring-bg-card select-none">
            {initials}
          </div>
        )}

        <button
          type="button"
          onClick={onUploadPhoto}
          className="absolute -bottom-1.5 -right-1.5 p-2 rounded-xl bg-bg-card border border-border shadow-md text-text-secondary hover:text-primary hover:bg-bg-hover transition-all cursor-pointer z-20"
          title="Change profile avatar"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* Profile Name & Role (Cleanly in the white body below banner) */}
      <div className="text-center sm:text-left min-w-0 pb-1 flex-1">
        <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap min-w-0">
          <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight break-words">
            {name}
          </h2>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {status}
          </span>
        </div>

        <p className="text-xs sm:text-sm font-semibold text-primary mt-1 break-words">
          {role}
        </p>

        {/* Security Health Score Pill */}
        <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-bg-main border border-border text-xs font-semibold text-text-primary">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Security Health Rating:</span>
          <span className="text-emerald-600 font-bold">{securityScore}% Strong</span>
        </div>
      </div>
    </div>
  );
}
