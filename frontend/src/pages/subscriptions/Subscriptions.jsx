import React, { useState, useMemo } from "react";
import {
  RefreshCw,
  Download,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";

import SubscriptionStats from "./components/SubscriptionStats";
import SubscriptionFilters from "./components/SubscriptionFilters";
import SubscriptionsTable from "./components/SubscriptionsTable";
import SubscriptionDetailsModal from "./components/SubscriptionDetailsModal";
import ChangePlanModal from "./components/ChangePlanModal";
import ExtendSubscriptionModal from "./components/ExtendSubscriptionModal";
import CancelSubscriptionModal from "./components/CancelSubscriptionModal";
import ConfirmSubscriptionActionModal from "./components/ConfirmSubscriptionActionModal";

import {
  INITIAL_SUBSCRIPTIONS_DATA,
  calculateSubscriptionStats,
} from "../../data/subscriptions";

export default function Subscriptions() {
  // Main Subscriptions State
  const [subscriptions, setSubscriptions] = useState(INITIAL_SUBSCRIPTIONS_DATA);
  const [isLoading, setIsLoading] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    search: "",
    plan: "all",
    status: "all",
    billingCycle: "all",
    paymentStatus: "all",
    expiryWindow: "all",
  });

  // Toast Notification State
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Modal States
  const [selectedSubForDetails, setSelectedSubForDetails] = useState(null);
  const [selectedSubForPlan, setSelectedSubForPlan] = useState(null);
  const [selectedSubForExtend, setSelectedSubForExtend] = useState(null);
  const [selectedSubForCancel, setSelectedSubForCancel] = useState(null);
  const [confirmModalState, setConfirmModalState] = useState(null); // { sub, actionType }

  // KPI Statistics
  const stats = useMemo(() => {
    return calculateSubscriptionStats(subscriptions);
  }, [subscriptions]);

  // Filtered dataset
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      // 1. Search Query
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchesName = sub.restaurantName?.toLowerCase().includes(query);
        const matchesEmail = sub.restaurantEmail?.toLowerCase().includes(query);
        const matchesId = sub.id?.toLowerCase().includes(query);
        const matchesRestId = sub.restaurantId?.toLowerCase().includes(query);

        if (!matchesName && !matchesEmail && !matchesId && !matchesRestId) {
          return false;
        }
      }

      // 2. Plan Filter
      if (filters.plan !== "all" && sub.planName !== filters.plan) {
        return false;
      }

      // 3. Status Filter
      if (filters.status !== "all" && sub.status !== filters.status) {
        return false;
      }

      // 4. Billing Cycle Filter
      if (filters.billingCycle !== "all" && sub.billingCycle !== filters.billingCycle) {
        return false;
      }

      // 5. Payment Status Filter
      if (filters.paymentStatus !== "all" && sub.paymentStatus !== filters.paymentStatus) {
        return false;
      }

      // 6. Expiry Window Filter
      if (filters.expiryWindow !== "all") {
        const days = sub.daysRemaining;
        if (filters.expiryWindow === "7days" && (days <= 0 || days > 7)) {
          return false;
        }
        if (filters.expiryWindow === "30days" && (days <= 0 || days > 30)) {
          return false;
        }
        if (filters.expiryWindow === "90days" && (days <= 0 || days > 90)) {
          return false;
        }
        if (filters.expiryWindow === "expired" && days > 0 && sub.status !== "Expired" && sub.status !== "Past Due") {
          return false;
        }
      }

      return true;
    });
  }, [subscriptions, filters]);

  // Refresh handler
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast("Subscription records synchronized.");
    }, 450);
  };

  // Export CSV handler
  const handleExportCSV = () => {
    try {
      const headers = [
        "Subscription ID",
        "Restaurant Name",
        "Restaurant Email",
        "Plan",
        "Billing Cycle",
        "Amount",
        "Status",
        "Payment Status",
        "Start Date",
        "End Date",
        "Days Remaining",
        "Auto Renewal",
      ];

      const rows = filteredSubscriptions.map((s) => [
        s.id,
        `"${s.restaurantName.replace(/"/g, '""')}"`,
        s.restaurantEmail,
        s.planName,
        s.billingCycle,
        `"${s.amount}"`,
        s.status,
        s.paymentStatus,
        s.startDate,
        s.endDate,
        s.daysRemaining,
        s.autoRenewal ? "Enabled" : "Disabled",
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `tenant_subscriptions_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(`Exported ${filteredSubscriptions.length} subscriptions to CSV.`);
    } catch (err) {
      showToast("Failed to generate CSV export.", "danger");
    }
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      plan: "all",
      status: "all",
      billingCycle: "all",
      paymentStatus: "all",
      expiryWindow: "all",
    });
    showToast("Filters reset to default view.", "info");
  };

  // Change Plan Handler
  const handleSavePlanChange = (subId, updatedData) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, ...updatedData } : s))
    );
    showToast(`Subscription plan updated to ${updatedData.planName}.`);
  };

  // Extend Subscription Handler
  const handleSaveExtension = (subId, updatedData) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, ...updatedData } : s))
    );
    showToast(`Subscription validity extended to ${updatedData.endDate}.`);
  };

  // Toggle Auto-Renewal Handler
  const handleConfirmAutoRenew = (subId, updatedData) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, ...updatedData } : s))
    );
    showToast(
      `Auto-renewal ${updatedData.autoRenewal ? "enabled" : "disabled"} successfully.`
    );
  };

  // Cancel Subscription Handler
  const handleConfirmCancel = (subId, updatedData) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, ...updatedData } : s))
    );
    showToast("Subscription cancellation scheduled.", "info");
  };

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-white/10 text-xs sm:text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* 1. Page Header */}
      <PageHeader
        title="Subscriptions Management"
        subtitle="Monitor, renew, upgrade, and track platform tenant subscription agreements."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              loading={isLoading}
              className="!py-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportCSV}
              className="!py-2"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </Button>
          </>
        }
      />

      {/* 2. Subscription KPI Statistics */}
      <SubscriptionStats stats={stats} />

      {/* 3. Search & Filter Bar */}
      <SubscriptionFilters
        filters={filters}
        onFilterChange={(key, val) => setFilters((prev) => ({ ...prev, [key]: val }))}
        onReset={handleResetFilters}
        totalResults={subscriptions.length}
        filteredCount={filteredSubscriptions.length}
      />

      {/* 4. Subscriptions Data Table */}
      {isLoading ? (
        <div className="bg-bg-card rounded-2xl p-12 border border-border shadow-xs">
          <Loader size="lg" text="Loading subscription agreements..." />
        </div>
      ) : (
        <SubscriptionsTable
          subscriptions={filteredSubscriptions}
          onViewDetails={(s) => setSelectedSubForDetails(s)}
          onChangePlan={(s) => setSelectedSubForPlan(s)}
          onExtend={(s) => setSelectedSubForExtend(s)}
          onToggleAutoRenew={(s) =>
            setConfirmModalState({ sub: s, actionType: "toggle_autorenew" })
          }
          onCancel={(s) => setSelectedSubForCancel(s)}
          onResetFilters={handleResetFilters}
        />
      )}

      {/* Modal: View Subscription Details */}
      <SubscriptionDetailsModal
        isOpen={Boolean(selectedSubForDetails)}
        onClose={() => setSelectedSubForDetails(null)}
        subscription={selectedSubForDetails}
        onChangePlan={(s) => setSelectedSubForPlan(s)}
        onExtend={(s) => setSelectedSubForExtend(s)}
      />

      {/* Modal: Change / Upgrade Plan */}
      <ChangePlanModal
        isOpen={Boolean(selectedSubForPlan)}
        onClose={() => setSelectedSubForPlan(null)}
        subscription={selectedSubForPlan}
        onSave={handleSavePlanChange}
      />

      {/* Modal: Extend Subscription Validity */}
      <ExtendSubscriptionModal
        isOpen={Boolean(selectedSubForExtend)}
        onClose={() => setSelectedSubForExtend(null)}
        subscription={selectedSubForExtend}
        onSave={handleSaveExtension}
      />

      {/* Modal: Cancel Subscription */}
      <CancelSubscriptionModal
        isOpen={Boolean(selectedSubForCancel)}
        onClose={() => setSelectedSubForCancel(null)}
        subscription={selectedSubForCancel}
        onConfirm={handleConfirmCancel}
      />

      {/* Modal: Confirm Action (Auto Renewal toggle, etc.) */}
      <ConfirmSubscriptionActionModal
        isOpen={Boolean(confirmModalState)}
        onClose={() => setConfirmModalState(null)}
        actionType={confirmModalState?.actionType}
        subscription={confirmModalState?.sub}
        onConfirm={handleConfirmAutoRenew}
      />
    </div>
  );
}
