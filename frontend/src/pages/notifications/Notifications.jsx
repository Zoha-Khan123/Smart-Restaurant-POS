import React, { useState, useMemo } from "react";
import {
  Plus,
  MailOpen,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Bell,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";

import NotificationStats from "./components/NotificationStats";
import NotificationFilters from "./components/NotificationFilters";
import NotificationsList from "./components/NotificationsList";
import NotificationDetailsModal from "./components/NotificationDetailsModal";
import CreateNotificationModal from "./components/CreateNotificationModal";
import EditNotificationModal from "./components/EditNotificationModal";
import ConfirmNotificationActionModal from "./components/ConfirmNotificationActionModal";

import {
  INITIAL_NOTIFICATIONS_DATA,
  calculateNotificationStats,
} from "../../data/notifications";

export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS_DATA);
  const [isLoading, setIsLoading] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    status: "all",
    priority: "all",
    audience: "all",
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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [duplicateTemplate, setDuplicateTemplate] = useState(null);
  const [selectedForDetails, setSelectedForDetails] = useState(null);
  const [selectedForEdit, setSelectedForEdit] = useState(null);
  const [confirmState, setConfirmState] = useState(null); // { notif, actionType }

  // KPI Statistics
  const stats = useMemo(() => {
    return calculateNotificationStats(notifications);
  }, [notifications]);

  // Filtered dataset
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      // 1. Search Query
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchesTitle = n.title?.toLowerCase().includes(query);
        const matchesMessage = n.message?.toLowerCase().includes(query);
        const matchesAudience = n.audience?.toLowerCase().includes(query);
        const matchesRestName = n.restaurantName?.toLowerCase().includes(query);

        if (!matchesTitle && !matchesMessage && !matchesAudience && !matchesRestName) {
          return false;
        }
      }

      // 2. Type Filter
      if (filters.type !== "all" && n.type !== filters.type) {
        return false;
      }

      // 3. Status Filter
      if (filters.status !== "all") {
        if (filters.status === "Unread" && (n.isRead || n.status === "Read")) return false;
        if (filters.status === "Read" && !n.isRead && n.status !== "Read") return false;
        if (filters.status === "Sent" && n.status !== "Sent") return false;
        if (filters.status === "Scheduled" && n.status !== "Scheduled") return false;
        if (filters.status === "Failed" && n.status !== "Failed") return false;
      }

      // 4. Priority Filter
      if (filters.priority !== "all" && n.priority !== filters.priority) {
        return false;
      }

      // 5. Audience Filter
      if (filters.audience !== "all" && n.audience !== filters.audience) {
        return false;
      }

      // 6. Date Range Filter
      if (filters.dateRange !== "all") {
        const dateStr = n.createdAt || "";
        if (filters.dateRange === "today" && !dateStr.startsWith("2026-03-28")) return false;
        if (filters.dateRange === "this_week" && !dateStr.startsWith("2026-03-2")) return false;
        if (filters.dateRange === "this_month" && !dateStr.startsWith("2026-03")) return false;
      }

      return true;
    });
  }, [notifications, filters]);

  // Refresh handler
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast("Notification queue synchronized.");
    }, 450);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      type: "all",
      status: "all",
      priority: "all",
      audience: "all",
      dateRange: "all",
    });
    showToast("Filters reset to default view.", "info");
  };

  // Create Notification
  const handleCreateNotification = (newNotif) => {
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`Notification "${newNotif.title}" created successfully.`);
    setDuplicateTemplate(null);
  };

  // Update Notification
  const handleUpdateNotification = (id, updatedData) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updatedData } : n))
    );
    showToast("Notification updated successfully.");
  };

  // Toggle Read / Unread
  const handleToggleRead = (notif) => {
    const newIsRead = !notif.isRead;
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notif.id
          ? {
              ...n,
              isRead: newIsRead,
              status: newIsRead ? "Read" : "Unread",
              readAt: newIsRead ? new Date().toISOString() : null,
            }
          : n
      )
    );
    showToast(`Notification marked as ${newIsRead ? "read" : "unread"}.`);
  };

  // Mark All As Read
  const handleConfirmMarkAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        isRead: true,
        status: n.status === "Unread" ? "Read" : n.status,
        readAt: new Date().toISOString(),
      }))
    );
    showToast("All notifications marked as read.");
  };

  // Cancel Schedule
  const handleConfirmCancelSchedule = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notifId
          ? { ...n, status: "Cancelled", scheduledAt: null }
          : n
      )
    );
    showToast("Scheduled notification broadcast cancelled.");
  };

  // Delete Notification
  const handleConfirmDelete = (notifId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
    showToast("Notification deleted from system log.", "info");
  };

  // Duplicate Action
  const handleDuplicate = (notif) => {
    setDuplicateTemplate({
      title: `Copy of ${notif.title}`,
      message: notif.message,
      type: notif.type,
      priority: notif.priority,
      audience: notif.audience,
      restaurantId: notif.restaurantId,
    });
    setIsCreateOpen(true);
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
        title="Notifications"
        subtitle="Manage platform notifications, alerts and communication with restaurant administrators."
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
              onClick={() =>
                setConfirmState({ actionType: "mark_all_read" })
              }
              className="!py-2"
            >
              <MailOpen className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setDuplicateTemplate(null);
                setIsCreateOpen(true);
              }}
              className="!py-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Notification</span>
            </Button>
          </>
        }
      />

      {/* 2. Notification Statistics */}
      <NotificationStats stats={stats} />

      {/* 3. Search & Filter Bar */}
      <NotificationFilters
        filters={filters}
        onFilterChange={(key, val) =>
          setFilters((prev) => ({ ...prev, [key]: val }))
        }
        onReset={handleResetFilters}
        totalResults={notifications.length}
        filteredCount={filteredNotifications.length}
      />

      {/* 4. Notifications List */}
      {isLoading ? (
        <div className="bg-bg-card rounded-2xl p-12 border border-border shadow-xs">
          <Loader size="lg" text="Loading notification alerts..." />
        </div>
      ) : (
        <NotificationsList
          notifications={filteredNotifications}
          onViewDetails={(n) => setSelectedForDetails(n)}
          onToggleRead={handleToggleRead}
          onEdit={(n) => setSelectedForEdit(n)}
          onDuplicate={handleDuplicate}
          onCancelSchedule={(n) =>
            setConfirmState({ notif: n, actionType: "cancel_schedule" })
          }
          onDelete={(n) =>
            setConfirmState({ notif: n, actionType: "delete" })
          }
          onResetFilters={handleResetFilters}
        />
      )}

      {/* Modal: Create Notification */}
      <CreateNotificationModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setDuplicateTemplate(null);
        }}
        onCreate={handleCreateNotification}
        initialTemplate={duplicateTemplate}
      />

      {/* Modal: Edit Notification */}
      <EditNotificationModal
        isOpen={Boolean(selectedForEdit)}
        onClose={() => setSelectedForEdit(null)}
        notification={selectedForEdit}
        onUpdate={handleUpdateNotification}
      />

      {/* Modal: View Details */}
      <NotificationDetailsModal
        isOpen={Boolean(selectedForDetails)}
        onClose={() => setSelectedForDetails(null)}
        notification={selectedForDetails}
        onToggleRead={handleToggleRead}
      />

      {/* Modal: Confirm Actions (Delete / Cancel Schedule / Mark All Read) */}
      <ConfirmNotificationActionModal
        isOpen={Boolean(confirmState)}
        onClose={() => setConfirmState(null)}
        actionType={confirmState?.actionType}
        notification={confirmState?.notif}
        onConfirm={(id) => {
          if (confirmState?.actionType === "delete") {
            handleConfirmDelete(id);
          } else if (confirmState?.actionType === "cancel_schedule") {
            handleConfirmCancelSchedule(id);
          } else if (confirmState?.actionType === "mark_all_read") {
            handleConfirmMarkAllRead();
          }
        }}
      />
    </div>
  );
}
