import React from "react";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function AuthBranding({ className = "" }) {
  return (
    <Link to="/super-admin/login" className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Super Admin Shield Logo */}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple flex items-center justify-center shadow-md shadow-primary/30 shrink-0">
        <Shield className="w-5 h-5 text-white" />
      </div>

      <div>
        <div className="flex items-center gap-1.5">
          <h1 className="text-lg font-extrabold text-text-primary tracking-tight leading-none">
            Smart POS
          </h1>
          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
            Super Admin
          </span>
        </div>
        <p className="text-[11px] font-medium text-text-muted tracking-wide mt-0.5">
          Central Platform Control Center
        </p>
      </div>
    </Link>
  );
}
