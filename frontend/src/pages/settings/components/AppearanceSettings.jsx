import React from "react";
import { Palette, Sun, Moon, Monitor, Layout, Rows3, Check } from "lucide-react";
import SettingsSection from "./SettingsSection";
import { BRAND_COLORS } from "../../../data/settings";

export default function AppearanceSettings({ data, onChange }) {
  const handleInputChange = (field, value) => {
    onChange("appearance", {
      ...data,
      [field]: value,
    });
  };

  return (
    <SettingsSection
      icon={Palette}
      title="Appearance & Visual Customization"
      description="Configure UI theme preferences, brand accent palette, navigation layout style, and data grid density."
    >
      <div className="space-y-6">
        {/* Theme Mode Selector */}
        <div>
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-3">
            Interface Theme Mode
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "light", label: "Light Clean", icon: Sun, desc: "Clean white workspace" },
              { id: "dark", label: "Dark Navy", icon: Moon, desc: "High contrast dark mode" },
              { id: "system", label: "System Sync", icon: Monitor, desc: "Matches device settings" },
            ].map((theme) => {
              const Icon = theme.icon;
              const isSelected = data.themeMode === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => handleInputChange("themeMode", theme.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                      : "border-border bg-bg-card hover:bg-bg-hover hover:border-text-muted"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      isSelected
                        ? "bg-primary text-white"
                        : "bg-bg-hover text-text-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-text-primary">
                        {theme.label}
                      </p>
                      {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                    </div>
                    <p className="text-[11px] text-text-muted mt-0.5">{theme.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary Accent Color Palette */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-3">
            Primary Accent Color
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {BRAND_COLORS.map((color) => {
              const isSelected = data.primaryBrandColor === color.hex;
              return (
                <div
                  key={color.hex}
                  onClick={() => handleInputChange("primaryBrandColor", color.hex)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col items-center gap-2 select-none text-center ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border bg-bg-card hover:bg-bg-hover"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full shadow-sm flex items-center justify-center text-white ${color.bgClass}`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-[11px] font-semibold text-text-primary truncate w-full">
                    {color.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Layout & Density Preferences */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-3">
            Density & Layout Preferences
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-text-primary mb-1.5 flex items-center justify-between">
                <span>Sidebar Navigation Style</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                  <Layout className="w-4 h-4" />
                </div>
                <select
                  value={data.sidebarDensity || "expanded"}
                  onChange={(e) => handleInputChange("sidebarDensity", e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-lg bg-bg-card text-text-primary border border-border pl-9 pr-3 py-2.5 outline-none hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  <option value="expanded">Expanded Full Width (Default)</option>
                  <option value="compact">Icon Only (Compact Rail)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-text-primary mb-1.5 flex items-center justify-between">
                <span>Data Grid & Table Row Density</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                  <Rows3 className="w-4 h-4" />
                </div>
                <select
                  value={data.tableRowDensity || "comfortable"}
                  onChange={(e) => handleInputChange("tableRowDensity", e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-lg bg-bg-card text-text-primary border border-border pl-9 pr-3 py-2.5 outline-none hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  <option value="comfortable">Comfortable Spacing (Default)</option>
                  <option value="compact">Compact Dense (High Information Density)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}
