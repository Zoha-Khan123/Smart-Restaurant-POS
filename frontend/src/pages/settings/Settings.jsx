import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Globe,
  ShieldCheck,
  Bell,
  Server,
  Palette,
  RotateCcw,
  Save,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";

import GeneralSettings from "./components/GeneralSettings";
import SecuritySettings from "./components/SecuritySettings";
import NotificationSettings from "./components/NotificationSettings";
import SystemSettings from "./components/SystemSettings";
import AppearanceSettings from "./components/AppearanceSettings";
import SaveSettingsBar from "./components/SaveSettingsBar";

import { INITIAL_SETTINGS_DATA } from "../../data/settings";

const TABS = [
  { id: "general", label: "General", icon: Globe },
  { id: "security", label: "Security & Auth", icon: ShieldCheck },
  { id: "notifications", label: "Notifications & Alerts", icon: Bell },
  { id: "system", label: "System & Architecture", icon: Server },
  { id: "appearance", label: "Appearance", icon: Palette },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(INITIAL_SETTINGS_DATA);
  const [initialState, setInitialState] = useState(INITIAL_SETTINGS_DATA);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState("Today, 10:30 AM");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Check if form is dirty
  const isDirty = JSON.stringify(settings) !== JSON.stringify(initialState);

  const handleSectionChange = (sectionKey, updatedSectionData) => {
    setSettings((prev) => ({
      ...prev,
      [sectionKey]: updatedSectionData,
    }));
  };

  const handleSaveAll = () => {
    setIsSaving(true);
    setTimeout(() => {
      setInitialState(settings);
      setIsSaving(false);
      const now = new Date();
      setLastSavedAt(`Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      showToast("Platform configuration saved successfully.");
    }, 650);
  };

  const handleDiscard = () => {
    setSettings(initialState);
    showToast("Unsaved changes discarded.", "info");
  };

  const handleResetDefaults = () => {
    if (window.confirm("Are you sure you want to reset all platform settings to standard factory defaults?")) {
      setSettings(INITIAL_SETTINGS_DATA);
      showToast("Settings reset to defaults. Click 'Save Changes' to apply.", "warning");
    }
  };

  const handleExportJSON = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `platform_settings_${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("Settings configuration exported to JSON.");
    } catch (err) {
      showToast("Failed to export settings JSON.", "danger");
    }
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
        title="Platform Settings"
        subtitle="Configure global multi-tenant preferences, enterprise security policies, automated backups, and branding."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDefaults}
              className="!py-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Defaults</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportJSON}
              className="!py-2"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Config</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveAll}
              disabled={!isDirty}
              loading={isSaving}
              className="!py-2 font-bold"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </Button>
          </>
        }
      />

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border scrollbar-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer select-none ${
                isActive
                  ? "bg-primary text-white shadow-sm shadow-primary/20"
                  : "bg-bg-card text-text-secondary hover:text-text-primary hover:bg-bg-hover border border-border/60"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Content Panels */}
      <div className="space-y-6">
        {activeTab === "general" && (
          <GeneralSettings
            data={settings.general}
            onChange={handleSectionChange}
          />
        )}

        {activeTab === "security" && (
          <SecuritySettings
            data={settings.security}
            onChange={handleSectionChange}
          />
        )}

        {activeTab === "notifications" && (
          <NotificationSettings
            data={settings.notifications}
            onChange={handleSectionChange}
          />
        )}

        {activeTab === "system" && (
          <SystemSettings
            data={settings.system}
            onChange={handleSectionChange}
          />
        )}

        {activeTab === "appearance" && (
          <AppearanceSettings
            data={settings.appearance}
            onChange={handleSectionChange}
          />
        )}
      </div>

      {/* 4. Save Settings Bar / Persistent Indicator */}
      <SaveSettingsBar
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={handleSaveAll}
        onDiscard={handleDiscard}
        lastSavedAt={lastSavedAt}
      />
    </div>
  );
}
