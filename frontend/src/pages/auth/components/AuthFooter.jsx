import React from "react";
import { ShieldCheck, Lock } from "lucide-react";

export default function AuthFooter() {
  return (
    <div className="pt-6 mt-6 border-t border-border/80 text-center space-y-2 select-none">
      <div className="flex items-center justify-center gap-4 text-xs text-text-muted flex-wrap">
        <span className="flex items-center gap-1">
          <Lock className="w-3 h-3 text-emerald-600" />
          <span>256-Bit TLS Encryption</span>
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-primary" />
          <span>Super Admin RBAC Protected</span>
        </span>
      </div>

      <p className="text-[11px] text-text-muted">
        Need emergency administrative access? Contact{" "}
        <a
          href="mailto:devops-support@smartpos-platform.io"
          className="text-primary hover:underline font-medium"
        >
          DevOps Support
        </a>
      </p>
    </div>
  );
}
