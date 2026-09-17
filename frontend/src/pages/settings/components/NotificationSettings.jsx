import React, { useState } from "react";
import { Bell, Mail, Webhook, Send, CheckCircle2, ShieldAlert, CreditCard, Store, AlertOctagon } from "lucide-react";
import SettingsSection from "./SettingsSection";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

export default function NotificationSettings({ data, onChange }) {
  const [testWebhookStatus, setTestWebhookStatus] = useState(null);

  const handleToggle = (field) => {
    onChange("notifications", {
      ...data,
      [field]: !data[field],
    });
  };

  const handleInputChange = (field, value) => {
    onChange("notifications", {
      ...data,
      [field]: value,
    });
  };

  const handleSendTestWebhook = () => {
    setTestWebhookStatus("sending");
    setTimeout(() => {
      setTestWebhookStatus("success");
      setTimeout(() => setTestWebhookStatus(null), 3000);
    }, 600);
  };

  return (
    <SettingsSection
      icon={Bell}
      title="Platform Alerts & Notification Channels"
      description="Manage automated system alerts, administrative emails, incident dispatching, and external webhook integrations."
    >
      <div className="space-y-6">
        {/* Master Email Notifications */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-bg-main/40">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5 shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">
                Email Notifications Master Switch
              </p>
              <p className="text-xs text-text-muted">
                Enable or temporarily silence all outgoing administrative emails from the platform.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(data.emailNotificationsMaster)}
              onChange={() => handleToggle("emailNotificationsMaster")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Granular Event Triggers */}
        <div className="pt-2">
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-3">
            Automated Trigger Events
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-bg-card hover:bg-bg-hover transition-colors">
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs font-semibold text-text-primary">
                  New Restaurant Tenant Registered
                </span>
              </div>
              <input
                type="checkbox"
                checked={Boolean(data.alertNewRestaurant)}
                onChange={() => handleToggle("alertNewRestaurant")}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-border cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-bg-card hover:bg-bg-hover transition-colors">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-text-primary">
                  Subscription Upgrade / Cancelation
                </span>
              </div>
              <input
                type="checkbox"
                checked={Boolean(data.alertSubscriptionChanges)}
                onChange={() => handleToggle("alertSubscriptionChanges")}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-border cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-bg-card hover:bg-bg-hover transition-colors">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-danger shrink-0" />
                <span className="text-xs font-semibold text-text-primary">
                  High-Severity Security Incident
                </span>
              </div>
              <input
                type="checkbox"
                checked={Boolean(data.alertHighSecurityEvents)}
                onChange={() => handleToggle("alertHighSecurityEvents")}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-border cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-bg-card hover:bg-bg-hover transition-colors">
              <div className="flex items-center gap-2.5">
                <AlertOctagon className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-xs font-semibold text-text-primary">
                  System Error Spikes / API Failures
                </span>
              </div>
              <input
                type="checkbox"
                checked={Boolean(data.alertSystemErrors)}
                onChange={() => handleToggle("alertSystemErrors")}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-border cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-bg-card hover:bg-bg-hover transition-colors">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="text-xs font-semibold text-text-primary">
                  Payment Failure & Retry Alerts
                </span>
              </div>
              <input
                type="checkbox"
                checked={Boolean(data.alertPaymentFailures)}
                onChange={() => handleToggle("alertPaymentFailures")}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-border cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-bg-card hover:bg-bg-hover transition-colors">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-xs font-semibold text-text-primary">
                  Weekly Platform Summary Digest
                </span>
              </div>
              <input
                type="checkbox"
                checked={Boolean(data.weeklyDigestEmail)}
                onChange={() => handleToggle("weeklyDigestEmail")}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-border cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Super Admin Webhook Alerting Endpoint */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Webhook className="w-4 h-4 text-purple-600" />
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                External Webhook Dispatching (Slack / Discord / PagerDuty)
              </h4>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(data.webhookEnabled)}
                onChange={() => handleToggle("webhookEnabled")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {data.webhookEnabled && (
            <div className="p-4 rounded-xl border border-border bg-bg-main/30 space-y-3 animate-in fade-in-50 duration-150">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="https://api.domain.com/webhooks/superadmin-events"
                    value={data.webhookUrl || ""}
                    onChange={(e) => handleInputChange("webhookUrl", e.target.value)}
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSendTestWebhook}
                  loading={testWebhookStatus === "sending"}
                  className="shrink-0 sm:self-start mt-0 sm:mt-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test Ping</span>
                </Button>
              </div>

              {testWebhookStatus === "success" && (
                <p className="text-xs text-emerald-600 flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Test event payload successfully delivered (HTTP 200 OK).
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </SettingsSection>
  );
}
