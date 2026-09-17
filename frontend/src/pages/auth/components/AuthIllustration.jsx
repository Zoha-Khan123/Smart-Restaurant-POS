import React from "react";
import { ShieldCheck, Store, Activity, Lock, Users, Sparkles } from "lucide-react";

export default function AuthIllustration() {
  const HIGHLIGHTS = [
    {
      icon: Store,
      title: "Multi-Tenant Orchestration",
      description: "Manage thousands of restaurant chains, franchises, and cloud kitchens in unified isolation.",
    },
    {
      icon: ShieldCheck,
      title: "Zero-Trust Architecture",
      description: "Enforced Two-Factor Authentication, granular RBAC, and immutable audit telemetry.",
    },
    {
      icon: Activity,
      title: "Real-Time Revenue & SLA Monitoring",
      description: "Global WebSocket streaming, automated billing subscriptions, and failover diagnostics.",
    },
  ];

  return (
    <div className="hidden lg:flex lg:w-1/2 bg-bg-sidebar text-white p-12 flex-col justify-between relative overflow-hidden select-none">
      {/* Background Subtle Gradient Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Branding */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-purple flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white leading-none">
              Smart POS Platform
            </h2>
            <p className="text-xs font-semibold text-primary-light/80 mt-1">
              Enterprise Root Operations Console
            </p>
          </div>
        </div>
      </div>

      {/* Center Highlights Card */}
      <div className="relative z-10 space-y-6 my-auto max-w-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-emerald-400 border border-white/10">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Platform Version 2.8.4 Enterprise</span>
        </div>

        <h3 className="text-3xl font-extrabold leading-tight tracking-tight text-white">
          Secure, resilient multi-tenant infrastructure.
        </h3>

        <div className="space-y-4 pt-2">
          {HIGHLIGHTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-4 transition-all hover:bg-white/10"
              >
                <div className="p-2.5 rounded-xl bg-primary/20 text-primary-light shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Security Compliance Tagline */}
      <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-text-muted">
        <span>© 2026 Smart POS Inc. All rights reserved.</span>
        <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Systems Operational
        </span>
      </div>
    </div>
  );
}
