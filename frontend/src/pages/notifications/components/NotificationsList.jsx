import React, { useState, useEffect } from "react";
import { FolderOpen } from "lucide-react";
import NotificationItem from "./NotificationItem";
import NotificationPagination from "./NotificationPagination";
import EmptyState from "../../../components/ui/EmptyState";
import Button from "../../../components/ui/Button";

export default function NotificationsList({
  notifications = [],
  onViewDetails,
  onToggleRead,
  onEdit,
  onDuplicate,
  onCancelSchedule,
  onDelete,
  onResetFilters,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    setCurrentPage(1);
  }, [notifications.length]);

  const totalItems = notifications.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentNotifications = notifications.slice(startIndex, endIndex);

  if (totalItems === 0) {
    return (
      <div className="bg-bg-card rounded-2xl p-6 border border-border shadow-xs">
        <EmptyState
          icon={FolderOpen}
          title="No notifications match your filters"
          description="Try changing your search query, notification type, priority level, or delivery status."
          action={
            <Button variant="outline" size="sm" onClick={onResetFilters}>
              Reset All Filters
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-3.5 min-w-0">
      {/* List of Notification Cards */}
      <div className="space-y-3">
        {currentNotifications.map((n) => (
          <NotificationItem
            key={n.id}
            notification={n}
            onViewDetails={onViewDetails}
            onToggleRead={onToggleRead}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onCancelSchedule={onCancelSchedule}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Pagination Footer */}
      <NotificationPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
