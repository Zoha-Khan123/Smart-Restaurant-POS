import React, { useState } from "react";
import { Server, Database, Activity, RefreshCw, AlertTriangle, ShieldCheck, HardDrive, CheckCircle2 } from "lucide-react";
import SettingsSection from "./SettingsSection";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";

export default function SystemSettings({ data, onChange }) {
  const [cacheClearStatus, setCacheClearStatus] = useState(null);

  const handleToggle = (field) => {
    onChange("system", {
      ...data,
      [field]: !data[field],
    });
  };

  const handleInputChange = (field, value) => {
    onChange("system", {
      ...data,
      [field]: value,
    });
  };

  const handleClearCache = () => {
    setCacheClearStatus("clearing");
    setTimeout(() => {
      setCacheClearStatus("success");
      setTimeout(() => setCacheClearStatus(null), 3500);
    }, 800);
  };

  return (
    <SettingsSection
      icon={Server}
      title="System Architecture & Database Maintenance"
      description="Manage platform runtime flags, scheduled backups, cluster caching layers, and maintenance schedules."
      badge={<Badge variant="default">{data.systemVersion || "v2.8.4"}</Badge>}
    >
      <div className="space-y-6">
        {/* Maintenance Mode Banner */}
        <div className={`p-4 rounded-xl border transition-colors ${
          data.maintenanceMode
            ? "border-danger/30 bg-danger-light/60"
            : "border-border bg-bg-main/40"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                data.maintenanceMode ? "bg-danger/10 text-danger" : "bg-primary/10 text-primary"
              }`}>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary flex items-center gap-2">
                  <span>Platform Maintenance Mode</span>
                  {data.maintenanceMode && (
                    <Badge variant="danger" size="sm" dot>Active</Badge>
                  )}
                </p>
                <p className="text-xs text-text-muted">
                  Temporarily lock tenant access for scheduled system upgrades. Super Admins retain full access.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(data.maintenanceMode)}
                onChange={() => handleToggle("maintenanceMode")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-danger"></div>
            </label>
          </div>

          {data.maintenanceMode && (
            <div className="mt-4 pt-4 border-t border-danger/20 space-y-2 animate-in fade-in-50 duration-150">
              <Input
                label="User-Facing Maintenance Notice Message"
                value={data.maintenanceMessage || ""}
                onChange={(e) => handleInputChange("maintenanceMessage", e.target.value)}
                placeholder="Scheduled database upgrades in progress. We will be back online at 04:00 UTC."
              />
            </div>
          )}
        </div>

        {/* Database & Rate Limit Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-text-primary mb-1.5 flex items-center justify-between">
              <span>Automated DB Backup</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                <Database className="w-4 h-4" />
              </div>
              <select
                value={data.autoBackupFrequency || "daily"}
                onChange={(e) => handleInputChange("autoBackupFrequency", e.target.value)}
                className="w-full text-xs sm:text-sm rounded-lg bg-bg-card text-text-primary border border-border pl-9 pr-3 py-2.5 outline-none hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              >
                <option value="hourly">Every Hour (Enterprise)</option>
                <option value="every_6_hours">Every 6 Hours</option>
                <option value="daily">Daily at 03:00 AM UTC (Default)</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <p className="text-[11px] text-text-muted mt-1">Last: {data.lastBackupAt || "Today, 03:00 AM UTC"}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-text-primary mb-1.5 flex items-center justify-between">
              <span>API Rate Limit (req/min)</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                <Activity className="w-4 h-4" />
              </div>
              <select
                value={data.apiRateLimit || 300}
                onChange={(e) => handleInputChange("apiRateLimit", Number(e.target.value))}
                className="w-full text-xs sm:text-sm rounded-lg bg-bg-card text-text-primary border border-border pl-9 pr-3 py-2.5 outline-none hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              >
                <option value={60}>60 req / min (Strict)</option>
                <option value={150}>150 req / min</option>
                <option value={300}>300 req / min (Standard)</option>
                <option value={600}>600 req / min</option>
                <option value={1200}>1,200 req / min (High Throughput)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-text-primary mb-1.5 flex items-center justify-between">
              <span>Audit & Log Retention</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                <HardDrive className="w-4 h-4" />
              </div>
              <select
                value={data.storageRetentionDays || 90}
                onChange={(e) => handleInputChange("storageRetentionDays", Number(e.target.value))}
                className="w-full text-xs sm:text-sm rounded-lg bg-bg-card text-text-primary border border-border pl-9 pr-3 py-2.5 outline-none hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              >
                <option value={30}>30 Days</option>
                <option value={90}>90 Days (Recommended)</option>
                <option value={180}>180 Days (6 Months)</option>
                <option value={365}>365 Days (1 Year)</option>
                <option value={730}>2 Years (Compliance)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cache Invalidation & Debugging */}
        <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Cache Operations & Telemetry
            </h4>
            <p className="text-xs text-text-muted mt-0.5">
              Purge Redis edge query caches and reload subscription tier catalogs globally.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {cacheClearStatus === "success" && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Purged 14.2 MB Cache
              </span>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClearCache}
              loading={cacheClearStatus === "clearing"}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${cacheClearStatus === "clearing" ? "animate-spin" : ""}`} />
              <span>Invalidate Edge Cache</span>
            </Button>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}
