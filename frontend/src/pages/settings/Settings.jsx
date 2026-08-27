import React, { useState } from "react";
import {
  Building2,
  Receipt,
  DollarSign,
  Bell,
  Palette,
  ShieldCheck,
  Save,
  CheckCircle2,
  Printer,
  Smartphone,
  Sliders,
  Store,
  Lock,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Dropdown from "../../components/ui/Dropdown";

/**
 * Smart POS - Settings Page (Multi-Tab Responsive Architecture)
 */
export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [toastMessage, setToastMessage] = useState(null);

  // Settings State
  const [settings, setSettings] = useState({
    // General
    restaurantName: "Smart POS Café & Restaurant",
    phone: "051-2894567",
    email: "contact@smartposrestaurant.com",
    address: "Plot 14-A, Beverly Center, Blue Area, Islamabad",
    currency: "PKR (Rs.)",
    timezone: "(GMT+05:00) Islamabad, Karachi",

    // Order & Kitchen
    defaultOrderType: "Dine In",
    autoPrintKOT: true,
    autoPrintReceipt: true,
    soundAlerts: true,
    orderPrefix: "ORD-",

    // Tax & Billing
    taxPercent: "5.0",
    serviceChargePercent: "0.0",
    receiptFooter: "Thank you for dining with us! Visit again soon.",
    paperWidth: "80mm (Standard POS)",
    printNTN: true,
    ntnNumber: "NTN-7845129-3",

    // Notifications
    notifyNewOrder: true,
    notifyLowStock: true,
    notifyDailySummary: false,
    notifyOrderCancelled: true,

    // Appearance
    gridDensity: "Comfortable",
    gridColumns: "4 Columns",
    showThumbnails: true,
    highContrast: false,

    // Security
    autoLockTimeout: "15 Minutes",
    requirePinForDiscount: true,
    requirePinForCancel: true,
    managerPin: "1234",
  });

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleChange = (name, value) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAll = (e) => {
    e.preventDefault();
    showToast("Settings configuration saved successfully!");
  };

  const SETTINGS_TABS = [
    { id: "general", label: "General Settings", icon: Store, desc: "Café info & location" },
    { id: "orders", label: "Order & KOT", icon: Receipt, desc: "Workflow & printing" },
    { id: "billing", label: "Tax & Billing", icon: DollarSign, desc: "GST & receipt format" },
    { id: "notifications", label: "Notifications", icon: Bell, desc: "Alerts & audio chimes" },
    { id: "appearance", label: "POS Layout", icon: Palette, desc: "Grid size & display" },
    { id: "security", label: "Security & PIN", icon: ShieldCheck, desc: "Lockout & supervisor PIN" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* =========================================================
          TOP HEADER
      ========================================================== */}
      <div className="bg-bg-card rounded-2xl p-3.5 sm:p-5 border border-border shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            System Settings
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Configure restaurant identity, hardware printers, taxes, and system preferences
          </p>
        </div>

        <Button
          type="button"
          onClick={handleSaveAll}
          className="py-2.5 px-6 text-xs font-bold gap-1.5 shadow-sm self-end md:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </Button>
      </div>

      {/* =========================================================
          SETTINGS GRID: LEFT SIDEBAR TABS + CONTENT
      ========================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        
        {/* LEFT SETTINGS TABS (HORIZONTAL SWIPEABLE ON MOBILE, VERTICAL ON DESKTOP) */}
        <div className="lg:col-span-4 bg-bg-card rounded-2xl p-2.5 sm:p-3 border border-border shadow-xs">
          {/* Mobile Swipeable Tab Bar */}
          <div className="flex lg:flex-col gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {SETTINGS_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all shrink-0 lg:shrink cursor-pointer ${
                    isActive
                      ? "bg-primary text-white shadow-xs font-bold"
                      : "text-text-primary hover:bg-bg-hover font-medium"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-bg-main text-text-secondary border border-border"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="hidden lg:block min-w-0">
                    <p className="text-xs leading-tight truncate">{tab.label}</p>
                    <p
                      className={`text-[10px] mt-0.5 truncate ${
                        isActive ? "text-white/80" : "text-text-muted"
                      }`}
                    >
                      {tab.desc}
                    </p>
                  </div>

                  <span className="lg:hidden text-xs font-semibold whitespace-nowrap">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT CONTENT PANEL (8 COLS) */}
        <div className="lg:col-span-8 bg-bg-card rounded-2xl p-4 sm:p-6 border border-border shadow-xs">
          
          {/* 1. GENERAL SETTINGS */}
          {activeTab === "general" && (
            <div className="space-y-5">
              <div className="border-b border-border pb-3">
                <h3 className="font-bold text-base text-text-primary">
                  General Restaurant Profile
                </h3>
                <p className="text-xs text-text-muted">
                  Basic restaurant details printed on receipts and customer invoices
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Restaurant / Café Name"
                  value={settings.restaurantName}
                  onChange={(e) => handleChange("restaurantName", e.target.value)}
                  placeholder="e.g. Smart POS Café & Grill"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
                    label="Official Phone Number"
                    value={settings.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="e.g. 051-2894567"
                  />

                  <Input
                    label="Official Email Address"
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="e.g. info@restaurant.com"
                  />
                </div>

                <Input
                  label="Physical Street Address"
                  value={settings.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="e.g. Plot 14-A, Beverly Center, Blue Area, Islamabad"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Dropdown
                    label="System Currency"
                    value={settings.currency}
                    onChange={(e) => handleChange("currency", e.target.value)}
                    options={["PKR (Rs.)", "USD ($)", "AED (AED)", "EUR (€)"]}
                  />

                  <Dropdown
                    label="Timezone"
                    value={settings.timezone}
                    onChange={(e) => handleChange("timezone", e.target.value)}
                    options={[
                      "(GMT+05:00) Islamabad, Karachi",
                      "(GMT+04:00) Dubai, Abu Dhabi",
                      "(GMT+00:00) London (GMT)",
                    ]}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. ORDER & KOT SETTINGS */}
          {activeTab === "orders" && (
            <div className="space-y-5">
              <div className="border-b border-border pb-3">
                <h3 className="font-bold text-base text-text-primary">
                  Order Workflow & Kitchen Display
                </h3>
                <p className="text-xs text-text-muted">
                  Configure default dining behavior and thermal KOT triggers
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Dropdown
                    label="Default Order Dining Type"
                    value={settings.defaultOrderType}
                    onChange={(e) => handleChange("defaultOrderType", e.target.value)}
                    options={["Dine In", "Takeaway", "Delivery"]}
                  />

                  <Input
                    label="Order Numbering Prefix"
                    value={settings.orderPrefix}
                    onChange={(e) => handleChange("orderPrefix", e.target.value)}
                    placeholder="ORD-"
                  />
                </div>

                {/* Toggles */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-bg-main border border-border">
                    <div>
                      <p className="font-bold text-xs text-text-primary">
                        Auto-Print KOT to Kitchen
                      </p>
                      <p className="text-[11px] text-text-muted">
                        Automatically print thermal kitchen slip when order is placed
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoPrintKOT}
                        onChange={(e) => handleChange("autoPrintKOT", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-bg-main border border-border">
                    <div>
                      <p className="font-bold text-xs text-text-primary">
                        Auto-Print Receipt on Settlement
                      </p>
                      <p className="text-[11px] text-text-muted">
                        Trigger customer bill print immediately upon payment success
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoPrintReceipt}
                        onChange={(e) => handleChange("autoPrintReceipt", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. TAX & BILLING SETTINGS */}
          {activeTab === "billing" && (
            <div className="space-y-5">
              <div className="border-b border-border pb-3">
                <h3 className="font-bold text-base text-text-primary">
                  Tax, Service Charges & Receipts
                </h3>
                <p className="text-xs text-text-muted">
                  Configure government sales tax, NTN, and thermal receipt width
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
                    label="Sales Tax / GST Percentage (%)"
                    type="number"
                    value={settings.taxPercent}
                    onChange={(e) => handleChange("taxPercent", e.target.value)}
                    placeholder="5.0"
                  />

                  <Input
                    label="Service Charge (%)"
                    type="number"
                    value={settings.serviceChargePercent}
                    onChange={(e) =>
                      handleChange("serviceChargePercent", e.target.value)
                    }
                    placeholder="0.0"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Dropdown
                    label="Thermal Receipt Paper Width"
                    value={settings.paperWidth}
                    onChange={(e) => handleChange("paperWidth", e.target.value)}
                    options={["80mm (Standard POS)", "58mm (Compact Mobile)"]}
                  />

                  <Input
                    label="National Tax Number (NTN / STRN)"
                    value={settings.ntnNumber}
                    onChange={(e) => handleChange("ntnNumber", e.target.value)}
                    placeholder="NTN-7845129-3"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-text-primary mb-1.5 block">
                    Receipt Footer Thank You Message
                  </label>
                  <textarea
                    value={settings.receiptFooter}
                    onChange={(e) => handleChange("receiptFooter", e.target.value)}
                    rows={2}
                    className="w-full text-xs p-3 bg-bg-card border border-border rounded-xl placeholder:text-text-muted text-text-primary focus:outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="space-y-5">
              <div className="border-b border-border pb-3">
                <h3 className="font-bold text-base text-text-primary">
                  System Alerts & Notifications
                </h3>
                <p className="text-xs text-text-muted">
                  Control real-time notifications for orders and inventory alerts
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-bg-main border border-border">
                  <div>
                    <p className="font-bold text-xs text-text-primary">
                      New Order Audio Chime
                    </p>
                    <p className="text-[11px] text-text-muted">
                      Play alert chime when a new table or online order is placed
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifyNewOrder}
                      onChange={(e) => handleChange("notifyNewOrder", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-bg-main border border-border">
                  <div>
                    <p className="font-bold text-xs text-text-primary">
                      Low Stock Level Warnings
                    </p>
                    <p className="text-[11px] text-text-muted">
                      Alert managers when inventory raw ingredients fall below threshold
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifyLowStock}
                      onChange={(e) => handleChange("notifyLowStock", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-bg-main border border-border">
                  <div>
                    <p className="font-bold text-xs text-text-primary">
                      Order Void & Cancellation Alerts
                    </p>
                    <p className="text-[11px] text-text-muted">
                      Notify admin when an order is cancelled or refunded
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifyOrderCancelled}
                      onChange={(e) =>
                        handleChange("notifyOrderCancelled", e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* 5. POS LAYOUT & APPEARANCE */}
          {activeTab === "appearance" && (
            <div className="space-y-5">
              <div className="border-b border-border pb-3">
                <h3 className="font-bold text-base text-text-primary">
                  POS Grid & Visual Preferences
                </h3>
                <p className="text-xs text-text-muted">
                  Customize card sizes, image displays, and screen density
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Dropdown
                    label="Grid Spacing Density"
                    value={settings.gridDensity}
                    onChange={(e) => handleChange("gridDensity", e.target.value)}
                    options={["Comfortable", "Compact"]}
                  />

                  <Dropdown
                    label="Desktop Product Grid Columns"
                    value={settings.gridColumns}
                    onChange={(e) => handleChange("gridColumns", e.target.value)}
                    options={["3 Columns", "4 Columns", "5 Columns"]}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-bg-main border border-border">
                  <div>
                    <p className="font-bold text-xs text-text-primary">
                      Show Dish Thumbnails on Order Taker
                    </p>
                    <p className="text-[11px] text-text-muted">
                      Display appetizing product food pictures in grid cards
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showThumbnails}
                      onChange={(e) => handleChange("showThumbnails", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* 6. SECURITY & PIN */}
          {activeTab === "security" && (
            <div className="space-y-5">
              <div className="border-b border-border pb-3">
                <h3 className="font-bold text-base text-text-primary">
                  Security, Lockout & Supervisor PIN
                </h3>
                <p className="text-xs text-text-muted">
                  Configure PIN protection for discounts and screen auto-lock timeouts
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Dropdown
                    label="Screen Inactivity Auto-Lock"
                    value={settings.autoLockTimeout}
                    onChange={(e) => handleChange("autoLockTimeout", e.target.value)}
                    options={["5 Minutes", "15 Minutes", "30 Minutes", "Never"]}
                  />

                  <Input
                    label="Manager Authorization PIN"
                    type="password"
                    value={settings.managerPin}
                    onChange={(e) => handleChange("managerPin", e.target.value)}
                    placeholder="1234"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-bg-main border border-border">
                    <div>
                      <p className="font-bold text-xs text-text-primary">
                        Require Manager PIN for Discounts
                      </p>
                      <p className="text-[11px] text-text-muted">
                        Cashiers must input supervisor PIN to apply manual discounts
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.requirePinForDiscount}
                        onChange={(e) =>
                          handleChange("requirePinForDiscount", e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-bg-main border border-border">
                    <div>
                      <p className="font-bold text-xs text-text-primary">
                        Require Manager PIN for Order Cancellation
                      </p>
                      <p className="text-[11px] text-text-muted">
                        Protect against unauthorized bill cancellations and void orders
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.requirePinForCancel}
                        onChange={(e) =>
                          handleChange("requirePinForCancel", e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Bottom Save Actions */}
          <div className="pt-5 mt-6 border-t border-border flex justify-end gap-2.5">
            <Button
              type="button"
              onClick={handleSaveAll}
              className="py-2.5 px-6 text-xs font-bold gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save {SETTINGS_TABS.find((t) => t.id === activeTab)?.label}</span>
            </Button>
          </div>

        </div>

      </div>

      {/* =========================================================
          TOAST FEEDBACK
      ========================================================== */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl text-white text-xs font-semibold flex items-center gap-2 ${
              toastMessage.type === "info" ? "bg-amber-600" : "bg-emerald-600"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

    </div>
  );
}
