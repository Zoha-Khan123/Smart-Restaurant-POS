import React, { useState, useMemo } from "react";
import {
  ShieldAlert,
  RefreshCw,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";

import AuditLogStats from "./components/AuditLogStats";
import AuditLogFilters from "./components/AuditLogFilters";
import AuditLogsTable from "./components/AuditLogsTable";
import AuditLogDetailsModal from "./components/AuditLogDetailsModal";
import ConfirmAuditLogActionModal from "./components/ConfirmAuditLogActionModal";

import {
  INITIAL_AUDIT_LOGS_DATA,
  calculateAuditLogStats,
} from "../../data/auditLogs";

export default function AuditLogs() {
  const [logs, setLogs] = useState(INITIAL_AUDIT_LOGS_DATA);
  const [isLoading, setIsLoading] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    search: "",
    module: "all",
    status: "all",
    severity: "all",
    role: "all",
    dateRange: "all",
  });

  // Notification Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Modal States
  const [selectedLogForDetails, setSelectedLogForDetails] = useState(null);
  const [confirmModalState, setConfirmModalState] = useState(null);

  // KPI Statistics
  const stats = useMemo(() => {
    return calculateAuditLogStats(logs);
  }, [logs]);

  // Filtered dataset
  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      // 1. Search Query
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchesAction = l.action?.toLowerCase().includes(query);
        const matchesDesc = l.description?.toLowerCase().includes(query);
        const matchesActor = l.performedBy?.toLowerCase().includes(query);
        const matchesTarget = l.targetName?.toLowerCase().includes(query);
        const matchesTargetId = l.targetId?.toLowerCase().includes(query);
        const matchesIp = l.ipAddress?.toLowerCase().includes(query);

        if (
          !matchesAction &&
          !matchesDesc &&
          !matchesActor &&
          !matchesTarget &&
          !matchesTargetId &&
          !matchesIp
        ) {
          return false;
        }
      }

      // 2. Module Filter
      if (filters.module !== "all" && l.module !== filters.module) {
        return false;
      }

      // 3. Status Filter
      if (filters.status !== "all" && l.status !== filters.status) {
        return false;
      }

      // 4. Severity Filter
      if (filters.severity !== "all" && l.severity !== filters.severity) {
        return false;
      }

      // 5. Role Filter
      if (filters.role !== "all" && l.performedByRole !== filters.role) {
        return false;
      }

      // 6. Date Range Filter
      if (filters.dateRange !== "all") {
        const dateStr = l.createdAt || "";
        if (filters.dateRange === "today" && !dateStr.startsWith("2026-03-28")) return false;
        if (filters.dateRange === "this_week" && !dateStr.startsWith("2026-03-2")) return false;
        if (filters.dateRange === "this_month" && !dateStr.startsWith("2026-03")) return false;
      }

      return true;
    });
  }, [logs, filters]);

  // Refresh handler
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast("Audit log telemetry synchronized.");
    }, 450);
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    try {
      const headers = [
        "Log ID",
        "Timestamp",
        "Action",
        "Module",
        "Description",
        "Actor",
        "Role",
        "Target Type",
        "Target ID",
        "Target Name",
        "Restaurant",
        "IP Address",
        "Status",
        "Severity",
      ];

      const rows = filteredLogs.map((l) => [
        l.id,
        l.createdAt,
        `"${l.action.replace(/"/g, '""')}"`,
        l.module,
        `"${(l.description || "").replace(/"/g, '""')}"`,
        `"${l.performedBy}"`,
        l.performedByRole,
        l.targetType,
        l.targetId,
        `"${(l.targetName || "").replace(/"/g, '""')}"`,
        `"${l.restaurantName || "Platform Root"}"`,
        l.ipAddress,
        l.status,
        l.severity,
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `platform_audit_logs_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(`Exported ${filteredLogs.length} audit records to CSV.`);
    } catch (err) {
      showToast("Failed to generate audit CSV export.", "danger");
    }
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      module: "all",
      status: "all",
      severity: "all",
      role: "all",
      dateRange: "all",
    });
    showToast("Audit filters reset to default view.", "info");
  };

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
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
        title="Audit Logs"
        subtitle="Track important administrative events, system operations, role changes, and platform security trails."
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
              <span>Export Logs</span>
            </Button>
          </>
        }
      />

      {/* 2. Audit Log Statistics */}
      <AuditLogStats stats={stats} />

      {/* 3. Search & Filter Bar */}
      <AuditLogFilters
        filters={filters}
        onFilterChange={(key, val) =>
          setFilters((prev) => ({ ...prev, [key]: val }))
        }
        onReset={handleResetFilters}
        totalResults={logs.length}
        filteredCount={filteredLogs.length}
      />

      {/* 4. Audit Logs Table */}
      {isLoading ? (
        <div className="bg-bg-card rounded-2xl p-12 border border-border shadow-xs">
          <Loader size="lg" text="Loading audit log events..." />
        </div>
      ) : (
        <AuditLogsTable
          logs={filteredLogs}
          onViewDetails={(l) => setSelectedLogForDetails(l)}
          onResetFilters={handleResetFilters}
        />
      )}

      {/* Modal: View Details */}
      <AuditLogDetailsModal
        isOpen={Boolean(selectedLogForDetails)}
        onClose={() => setSelectedLogForDetails(null)}
        log={selectedLogForDetails}
      />

      {/* Modal: Confirm Action */}
      <ConfirmAuditLogActionModal
        isOpen={Boolean(confirmModalState)}
        onClose={() => setConfirmModalState(null)}
        actionType={confirmModalState?.actionType}
        onConfirm={() => {}}
      />
    </div>
  );
}
