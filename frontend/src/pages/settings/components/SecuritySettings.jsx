import React from "react";
import { ShieldCheck, Lock, Key, Users, Clock, AlertTriangle, Network } from "lucide-react";
import SettingsSection from "./SettingsSection";
import Input from "../../../components/ui/Input";
import Badge from "../../../components/ui/Badge";

export default function SecuritySettings({ data, onChange }) {
  const handleToggle = (field) => {
    onChange("security", {
      ...data,
      [field]: !data[field],
    });
  };

  const handleInputChange = (field, value) => {
    onChange("security", {
      ...data,
      [field]: value,
    });
  };

  return (
    <SettingsSection
      icon={ShieldCheck}
      title="Security & Access Governance"
      description="Configure enterprise authentication policies, session timeouts, password strength, and IP restriction guards."
      badge={<Badge variant="primary">High Security</Badge>}
    >
      <div className="space-y-6">
        {/* Two-Factor Authentication Policies */}
        <div>
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-3">
            Two-Factor Authentication (2FA / MFA)
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-bg-main/40 hover:bg-bg-main transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    Enforce 2FA for Super Administrators
                  </p>
                  <p className="text-xs text-text-muted">
                    Mandates TOTP authenticator app verification upon login for all Super Admin tier users.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(data.require2FASuperAdmin)}
                  onChange={() => handleToggle("require2FASuperAdmin")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-bg-main/40 hover:bg-bg-main transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 mt-0.5 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    Enable 2FA Option for Restaurant Tenant Admins
                  </p>
                  <p className="text-xs text-text-muted">
                    Allows restaurant owners and managers to activate 2FA for their individual staff accounts.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(data.allow2FATenants)}
                  onChange={() => handleToggle("allow2FATenants")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Session & Lockout Policies */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-3">
            Session Lifecycle & Brute-Force Protection
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-text-primary mb-1.5 flex items-center justify-between">
                <span>Session Inactivity Timeout</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                  <Clock className="w-4 h-4" />
                </div>
                <select
                  value={data.sessionTimeoutMinutes || 60}
                  onChange={(e) => handleInputChange("sessionTimeoutMinutes", Number(e.target.value))}
                  className="w-full text-xs sm:text-sm rounded-lg bg-bg-card text-text-primary border border-border pl-9 pr-3 py-2.5 outline-none hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>1 Hour (Recommended)</option>
                  <option value={120}>2 Hours</option>
                  <option value={240}>4 Hours</option>
                  <option value={480}>8 Hours</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-text-primary mb-1.5 flex items-center justify-between">
                <span>Max Login Failures</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <select
                  value={data.maxLoginAttempts || 5}
                  onChange={(e) => handleInputChange("maxLoginAttempts", Number(e.target.value))}
                  className="w-full text-xs sm:text-sm rounded-lg bg-bg-card text-text-primary border border-border pl-9 pr-3 py-2.5 outline-none hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  <option value={3}>3 Attempts (Strict)</option>
                  <option value={5}>5 Attempts (Standard)</option>
                  <option value={10}>10 Attempts (Relaxed)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-text-primary mb-1.5 flex items-center justify-between">
                <span>Account Lockout Duration</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <select
                  value={data.lockoutDurationMinutes || 15}
                  onChange={(e) => handleInputChange("lockoutDurationMinutes", Number(e.target.value))}
                  className="w-full text-xs sm:text-sm rounded-lg bg-bg-card text-text-primary border border-border pl-9 pr-3 py-2.5 outline-none hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  <option value={5}>5 Minutes</option>
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Password Strength Constraints */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-3">
            Password Complexity Rules
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-bg-card cursor-pointer hover:bg-bg-hover">
              <input
                type="checkbox"
                checked={Boolean(data.requireUppercase)}
                onChange={() => handleToggle("requireUppercase")}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-border"
              />
              <span className="text-xs font-medium text-text-primary">Uppercase Letters</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-bg-card cursor-pointer hover:bg-bg-hover">
              <input
                type="checkbox"
                checked={Boolean(data.requireNumbers)}
                onChange={() => handleToggle("requireNumbers")}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-border"
              />
              <span className="text-xs font-medium text-text-primary">Numerical Digits (0-9)</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-bg-card cursor-pointer hover:bg-bg-hover">
              <input
                type="checkbox"
                checked={Boolean(data.requireSymbols)}
                onChange={() => handleToggle("requireSymbols")}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-border"
              />
              <span className="text-xs font-medium text-text-primary">Special Symbols (!@#$)</span>
            </label>

            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-bg-card">
              <span className="text-xs font-medium text-text-primary">Min Length</span>
              <select
                value={data.passwordMinLength || 10}
                onChange={(e) => handleInputChange("passwordMinLength", Number(e.target.value))}
                className="text-xs font-bold bg-transparent text-primary outline-none cursor-pointer"
              >
                <option value={8}>8 Chars</option>
                <option value={10}>10 Chars</option>
                <option value={12}>12 Chars</option>
                <option value={16}>16 Chars</option>
              </select>
            </div>
          </div>
        </div>

        {/* IP Whitelisting Guard */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-primary" />
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Admin IP Access Whitelisting
              </h4>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(data.ipWhitelistingEnabled)}
                onChange={() => handleToggle("ipWhitelistingEnabled")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {data.ipWhitelistingEnabled && (
            <div className="p-4 rounded-xl border border-primary/20 bg-primary-light/40 space-y-2 animate-in fade-in-50 duration-150">
              <Input
                label="Allowed IPv4 / IPv6 / CIDR Blocks (comma-separated)"
                placeholder="e.g. 192.168.1.0/24, 72.80.12.9"
                value={data.ipWhitelist || ""}
                onChange={(e) => handleInputChange("ipWhitelist", e.target.value)}
                helperText="Requests from non-whitelisted IPs will be rejected with HTTP 403 Forbidden."
              />
            </div>
          )}
        </div>
      </div>
    </SettingsSection>
  );
}
