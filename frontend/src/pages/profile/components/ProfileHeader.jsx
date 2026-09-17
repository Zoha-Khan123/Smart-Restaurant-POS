import React from "react";
import { Shield, Calendar, Clock, MapPin, Briefcase } from "lucide-react";
import ProfileAvatar from "./ProfileAvatar";

export default function ProfileHeader({ profile, onUploadPhoto }) {
  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <div className="bg-bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
      {/* Decorative Top Banner */}
      <div className="h-28 sm:h-36 bg-gradient-to-r from-bg-sidebar via-slate-800 to-primary/90 p-4 sm:p-6 flex items-start sm:items-center justify-end relative">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md text-white text-xs font-semibold border border-white/10 shadow-sm">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Super Admin Authority Level 1</span>
        </div>
      </div>

      {/* Main Profile Info Section in Clean White Body */}
      <div className="px-4 sm:px-6 pb-6 pt-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <ProfileAvatar
            avatarUrl={profile.avatarUrl}
            initials={profile.initials}
            name={fullName}
            role={profile.designation}
            status={profile.status}
            securityScore={profile.securityScore}
            onUploadPhoto={onUploadPhoto}
          />

          {/* Quick Details Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 text-xs text-text-secondary shrink-0 pt-2 lg:pt-0">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-bg-main border border-border/80">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-text-muted uppercase font-bold">Joined</p>
                <p className="font-semibold text-text-primary truncate">{profile.joinedDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-bg-main border border-border/80">
              <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-text-muted uppercase font-bold">Last Login</p>
                <p className="font-semibold text-text-primary truncate max-w-[130px]">{profile.lastLogin}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-bg-main border border-border/80">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-text-muted uppercase font-bold">Location</p>
                <p className="font-semibold text-text-primary truncate max-w-[130px]">{profile.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-bg-main border border-border/80">
              <Briefcase className="w-4 h-4 text-purple-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-text-muted uppercase font-bold">Department</p>
                <p className="font-semibold text-text-primary truncate max-w-[130px]">Infrastructure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
