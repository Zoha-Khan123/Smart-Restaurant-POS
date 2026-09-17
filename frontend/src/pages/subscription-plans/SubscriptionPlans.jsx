import React, { useState, useMemo } from "react";
import {
  Plus,
  RefreshCw,
  Search,
  RotateCcw,
  X,
  CheckCircle2,
  AlertCircle,
  Layers,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import Loader from "../../components/ui/Loader";

import PlanStats from "./components/PlanStats";
import PlansGrid from "./components/PlansGrid";
import PlanComparisonTable from "./components/PlanComparisonTable";
import AddPlanModal from "./components/AddPlanModal";
import EditPlanModal from "./components/EditPlanModal";
import PlanDetailsModal from "./components/PlanDetailsModal";
import ConfirmPlanActionModal from "./components/ConfirmPlanActionModal";

import {
  INITIAL_PLANS_DATA,
  calculatePlanStats,
} from "../../data/subscriptionPlans";

export default function SubscriptionPlans() {
  // Main Plans State
  const [plans, setPlans] = useState(INITIAL_PLANS_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Notification Toast State
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [actionModalState, setActionModalState] = useState(null); // { plan, actionType }

  // KPI Stats
  const stats = useMemo(() => {
    return calculatePlanStats(plans);
  }, [plans]);

  // Filtered dataset
  const filteredPlans = useMemo(() => {
    return plans.filter((p) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = p.name?.toLowerCase().includes(query);
        const matchesTagline = p.tagline?.toLowerCase().includes(query);

        if (!matchesName && !matchesTagline) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== "all" && p.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [plans, searchQuery, statusFilter]);

  const isFiltered = searchQuery.trim() !== "" || statusFilter !== "all";

  // Refresh handler
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast("Subscription plans catalog synchronized.");
    }, 450);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    showToast("Filters reset to default view.", "info");
  };

  // Plan Handlers
  const handleAddPlan = (newPlan) => {
    setPlans((prev) => [...prev, newPlan]);
    showToast(`Subscription plan "${newPlan.name}" created successfully.`);
  };

  const handleUpdatePlan = (updatedPlan) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
    );
    showToast(`Subscription plan "${updatedPlan.name}" updated successfully.`);
  };

  const handleToggleStatus = (planId, { status }) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, status } : p))
    );
    showToast(`Plan status updated to "${status}".`);
  };

  const handleDeletePlan = (planId) => {
    const target = plans.find((p) => p.id === planId);
    setPlans((prev) => prev.filter((p) => p.id !== planId));
    showToast(`Plan "${target?.name || planId}" was permanently deleted.`, "info");
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
        title="Subscription Plans"
        subtitle="Create and manage subscription plans available to restaurants on the platform."
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
              variant="primary"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="!py-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Plan</span>
            </Button>
          </>
        }
      />

      {/* 2. Plan KPI Statistics */}
      <PlanStats stats={stats} />

      {/* 3. Search & Filter Bar */}
      <div className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search plans by tier name or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 rounded-xl bg-bg-main border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-1 rounded-md transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-medium px-3 py-2.5 rounded-xl bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all"
          >
            <option value="all">All Plan Statuses</option>
            <option value="Active">Active Plans Only</option>
            <option value="Inactive">Inactive / Drafts</option>
          </select>

          {isFiltered && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="!py-2 text-xs shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* 4. Plans Grid Cards View */}
      {isLoading ? (
        <div className="bg-bg-card rounded-2xl p-12 border border-border shadow-xs">
          <Loader size="lg" text="Loading subscription plans..." />
        </div>
      ) : hasError ? (
        <div className="bg-bg-card rounded-2xl p-8 sm:p-12 border border-border shadow-xs">
          <EmptyState
            icon={AlertCircle}
            title="Failed to Load Plans"
            description="Could not synchronize subscription tier configurations."
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => setHasError(false)}
              >
                Retry
              </Button>
            }
          />
        </div>
      ) : (
        <PlansGrid
          plans={filteredPlans}
          onViewDetails={(p) => setSelectedPlanDetails(p)}
          onEdit={(p) => setEditingPlan(p)}
          onToggleStatus={(p) =>
            setActionModalState({ plan: p, actionType: "toggle_status" })
          }
          onDelete={(p) =>
            setActionModalState({ plan: p, actionType: "delete" })
          }
          onResetFilters={handleResetFilters}
        />
      )}

      {/* 5. Comprehensive Feature Comparison Table */}
      {!isLoading && !hasError && plans.length > 0 && (
        <PlanComparisonTable plans={plans} />
      )}

      {/* Modal: Add Plan */}
      <AddPlanModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPlan={handleAddPlan}
      />

      {/* Modal: Edit Plan */}
      <EditPlanModal
        isOpen={Boolean(editingPlan)}
        onClose={() => setEditingPlan(null)}
        plan={editingPlan}
        onUpdatePlan={handleUpdatePlan}
      />

      {/* Modal: Plan Details */}
      <PlanDetailsModal
        isOpen={Boolean(selectedPlanDetails)}
        onClose={() => setSelectedPlanDetails(null)}
        plan={selectedPlanDetails}
        onEdit={(p) => setEditingPlan(p)}
      />

      {/* Modal: Confirm Action (Toggle Status, Delete with Protection Rule) */}
      <ConfirmPlanActionModal
        isOpen={Boolean(actionModalState)}
        onClose={() => setActionModalState(null)}
        actionType={actionModalState?.actionType}
        plan={actionModalState?.plan}
        onConfirm={(planId, payload) => {
          if (actionModalState?.actionType === "toggle_status") {
            handleToggleStatus(planId, payload);
          } else if (actionModalState?.actionType === "delete") {
            handleDeletePlan(planId);
          }
        }}
      />
    </div>
  );
}
