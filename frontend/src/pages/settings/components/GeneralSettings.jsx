import React from "react";
import { Globe, Building, Mail, Phone, Clock, DollarSign, Languages, Calendar, Upload, Image as ImageIcon } from "lucide-react";
import SettingsSection from "./SettingsSection";
import Input from "../../../components/ui/Input";
import {
  CURRENCY_OPTIONS,
  TIMEZONE_OPTIONS,
  LANGUAGE_OPTIONS,
} from "../../../data/settings";

export default function GeneralSettings({ data, onChange }) {
  const handleInputChange = (field, value) => {
    onChange("general", {
      ...data,
      [field]: value,
    });
  };

  return (
    <SettingsSection
      icon={Globe}
      title="General Platform Configuration"
      description="Configure core multi-tenant platform details, global localization, and brand identifiers."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Platform Name */}
        <Input
          label="Platform Name"
          placeholder="e.g. Smart POS Enterprise"
          value={data.platformName || ""}
          onChange={(e) => handleInputChange("platformName", e.target.value)}
          icon={Building}
          required
        />

        {/* Platform Tagline */}
        <Input
          label="Platform Tagline / Description"
          placeholder="e.g. Multi-Tenant Restaurant Cloud OS"
          value={data.platformTagline || ""}
          onChange={(e) => handleInputChange("platformTagline", e.target.value)}
        />

        {/* Support Email */}
        <Input
          label="Global Support Email"
          type="email"
          placeholder="support@smartpos-platform.io"
          value={data.supportEmail || ""}
          onChange={(e) => handleInputChange("supportEmail", e.target.value)}
          icon={Mail}
          helperText="Used as default sender for platform alerts and ticket dispatch."
          required
        />

        {/* Admin Contact Phone */}
        <Input
          label="Emergency Admin Phone"
          placeholder="+1 (800) 555-0199"
          value={data.adminContactPhone || ""}
          onChange={(e) => handleInputChange("adminContactPhone", e.target.value)}
          icon={Phone}
        />

        {/* Primary Default Currency */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-text-primary mb-1.5 flex items-center justify-between">
            <span>
              Default Billing Currency <span className="text-danger">*</span>
            </span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              <DollarSign className="w-4 h-4" />
            </div>
            <select
              value={data.defaultCurrency || "USD"}
              onChange={(e) => handleInputChange("defaultCurrency", e.target.value)}
              className="w-full text-xs sm:text-sm rounded-lg bg-bg-card text-text-primary border border-border pl-9 pr-3 py-2.5 outline-none hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
            >
              {CURRENCY_OPTIONS.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-1 text-[11px] text-text-muted">
            Used as the default currency for subscription billing plans.
          </p>
        </div>

        {/* Default Platform Timezone */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-text-primary mb-1.5 flex items-center justify-between">
            <span>
              Default Timezone <span className="text-danger">*</span>
            </span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              <Clock className="w-4 h-4" />
            </div>
            <select
              value={data.defaultTimezone || "America/New_York"}
              onChange={(e) => handleInputChange("defaultTimezone", e.target.value)}
              className="w-full text-xs sm:text-sm rounded-lg bg-bg-card text-text-primary border border-border pl-9 pr-3 py-2.5 outline-none hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
            >
              {TIMEZONE_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-1 text-[11px] text-text-muted">
            Standard time zone for analytics aggregations and automated cron jobs.
          </p>
        </div>

        {/* Default Language */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-text-primary mb-1.5 flex items-center justify-between">
            <span>Default Interface Language</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              <Languages className="w-4 h-4" />
            </div>
            <select
              value={data.defaultLanguage || "en"}
              onChange={(e) => handleInputChange("defaultLanguage", e.target.value)}
              className="w-full text-xs sm:text-sm rounded-lg bg-bg-card text-text-primary border border-border pl-9 pr-3 py-2.5 outline-none hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
            >
              {LANGUAGE_OPTIONS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Format */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-text-primary mb-1.5 flex items-center justify-between">
            <span>Date Display Format</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              <Calendar className="w-4 h-4" />
            </div>
            <select
              value={data.dateFormat || "YYYY-MM-DD"}
              onChange={(e) => handleInputChange("dateFormat", e.target.value)}
              className="w-full text-xs sm:text-sm rounded-lg bg-bg-card text-text-primary border border-border pl-9 pr-3 py-2.5 outline-none hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
            >
              <option value="YYYY-MM-DD">YYYY-MM-DD (2026-03-28)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (28/03/2026)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (03/28/2026)</option>
              <option value="MMM D, YYYY">MMM D, YYYY (Mar 28, 2026)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Brand Assets Upload Simulation */}
      <div className="pt-4 border-t border-border">
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-3">
          Platform Brand Assets
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-dashed border-border hover:border-primary transition-colors flex items-center gap-4 bg-bg-main/50">
            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 font-bold text-sm">
              POS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text-primary truncate">Main Logo</p>
              <p className="text-[11px] text-text-muted">PNG, SVG or WEBP (Max 2MB)</p>
            </div>
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-text-primary hover:bg-bg-hover cursor-pointer"
            >
              Change
            </button>
          </div>

          <div className="p-4 rounded-xl border border-dashed border-border hover:border-primary transition-colors flex items-center gap-4 bg-bg-main/50">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text-primary truncate">Browser Favicon</p>
              <p className="text-[11px] text-text-muted">ICO, PNG (32x32px or 64x64px)</p>
            </div>
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-text-primary hover:bg-bg-hover cursor-pointer"
            >
              Change
            </button>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}
