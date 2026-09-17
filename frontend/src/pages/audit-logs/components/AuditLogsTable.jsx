import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Eye,
  Calendar,
  Clock,
  Shield,
  User,
  Store,
  FolderOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import Table from "../../../components/ui/Table";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import EmptyState from "../../../components/ui/EmptyState";
import AuditLogPagination from "./AuditLogPagination";
import {
  LOG_MODULE_VARIANTS,
  LOG_STATUS_VARIANTS,
  LOG_SEVERITY_VARIANTS,
  LOG_ROLE_VARIANTS,
} from "../../../data/auditLogs";

export default function AuditLogsTable({
  logs = [],
  onViewDetails,
  onResetFilters,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Floating Action Menu State
  const [menuState, setMenuState] = useState(null); // { id, log, top, left }
  const menuRef = useRef(null);

  // Close floating menu on click outside, window scroll, or resize
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuState(null);
      }
    }
    function handleScrollOrResize() {
      setMenuState(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [logs.length]);

  const totalItems = logs.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentLogs = logs.slice(startIndex, endIndex);

  const handleToggleMenu = (e, log) => {
    e.stopPropagation();
    if (menuState?.id === log.id) {
      setMenuState(null);
      return;
    }

    const buttonRect = e.currentTarget.getBoundingClientRect();
    const menuWidth = 180;
    const menuHeight = 110;

    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const shouldOpenUp = spaceBelow < menuHeight && buttonRect.top > menuHeight;

    const top = shouldOpenUp
      ? buttonRect.top - menuHeight - 4
      : buttonRect.bottom + 4;

    let left = buttonRect.right - menuWidth;
    if (left < 10) left = 10;
    if (left + menuWidth > window.innerWidth - 10) {
      left = window.innerWidth - menuWidth - 10;
    }

    setMenuState({
      id: log.id,
      log: log,
      top,
      left,
    });
  };

  const headers = [
    { label: "Timestamp & Log ID", align: "left" },
    { label: "Action & Module", align: "left" },
    { label: "Actor & Role", align: "left" },
    { label: "Target Entity", align: "left" },
    { label: "Tenant Context", align: "left" },
    { label: "Status", align: "center" },
    { label: "Severity", align: "center" },
    { label: "Actions", align: "right" },
  ];

  if (totalItems === 0) {
    return (
      <div className="bg-bg-card rounded-2xl p-6 border border-border shadow-xs">
        <EmptyState
          icon={FolderOpen}
          title="No audit logs match your filters"
          description="Try adjusting your keyword search, module selection, severity level, or timeframe."
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
    <div className="space-y-4 min-w-0">
      <div className="bg-bg-card rounded-2xl border border-border shadow-xs overflow-hidden min-w-0">
        <Table headers={headers}>
          {currentLogs.map((log) => {
            const moduleVariant = LOG_MODULE_VARIANTS[log.module] || "default";
            const statusVariant = LOG_STATUS_VARIANTS[log.status] || "default";
            const severityVariant = LOG_SEVERITY_VARIANTS[log.severity] || "default";
            const roleVariant = LOG_ROLE_VARIANTS[log.performedByRole] || "default";

            return (
              <tr
                key={log.id}
                className="hover:bg-bg-hover/60 transition-colors group"
              >
                {/* 1. Timestamp & Log ID */}
                <td className="px-4 py-3.5 whitespace-nowrap text-xs">
                  <div className="flex items-center gap-1.5 font-mono text-text-primary font-medium">
                    <Clock className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    <span>{log.createdAt}</span>
                  </div>
                  <span className="font-mono text-[10px] text-text-muted block mt-0.5 ml-5">
                    {log.id}
                  </span>
                </td>

                {/* 2. Action & Module */}
                <td className="px-4 py-3.5 whitespace-nowrap text-xs">
                  <span className="font-bold text-text-primary block truncate max-w-[200px]">
                    {log.action}
                  </span>
                  <div className="mt-1">
                    <Badge variant={moduleVariant} size="sm">
                      {log.module}
                    </Badge>
                  </div>
                </td>

                {/* 3. Actor & Role */}
                <td className="px-4 py-3.5 whitespace-nowrap text-xs">
                  <span className="font-semibold text-text-primary block">
                    {log.performedBy}
                  </span>
                  <div className="mt-1">
                    <Badge variant={roleVariant} size="sm">
                      {log.performedByRole}
                    </Badge>
                  </div>
                </td>

                {/* 4. Target Entity */}
                <td className="px-4 py-3.5 whitespace-nowrap text-xs">
                  <span className="font-medium text-text-primary block truncate max-w-[160px]">
                    {log.targetName || log.targetId || "N/A"}
                  </span>
                  <span className="text-[10px] text-text-muted font-mono block">
                    {log.targetType} ({log.targetId})
                  </span>
                </td>

                {/* 5. Tenant Context */}
                <td className="px-4 py-3.5 whitespace-nowrap text-xs">
                  <div className="flex items-center gap-1 text-text-primary font-medium">
                    <Store className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    <span className="truncate max-w-[140px]">
                      {log.restaurantName || "Global Platform"}
                    </span>
                  </div>
                  {log.ipAddress && (
                    <span className="text-[10px] text-text-muted font-mono block ml-4.5">
                      IP: {log.ipAddress}
                    </span>
                  )}
                </td>

                {/* 6. Status */}
                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                  <Badge variant={statusVariant} size="sm" dot>
                    {log.status}
                  </Badge>
                </td>

                {/* 7. Severity */}
                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                  <Badge variant={severityVariant} size="sm">
                    {log.severity}
                  </Badge>
                </td>

                {/* 8. Actions */}
                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={(e) => handleToggleMenu(e, log)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer focus:outline-none"
                    title="Audit Log Actions"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </Table>

        {/* Floating Actions Portal / Layer */}
        {menuState && (
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: `${menuState.top}px`,
              left: `${menuState.left}px`,
              width: "180px",
              zIndex: 9999,
            }}
            className="bg-bg-card rounded-2xl border border-border shadow-2xl overflow-hidden py-1.5 animate-in fade-in-50 zoom-in-95 duration-100 text-left backdrop-blur-md"
          >
            {/* View Details */}
            <button
              type="button"
              onClick={() => {
                const l = menuState.log;
                setMenuState(null);
                onViewDetails(l);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-primary transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-text-muted" />
              <span>View Log Telemetry</span>
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        <AuditLogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={(p) => setCurrentPage(p)}
          onPageSizeChange={(sz) => {
            setPageSize(sz);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );
}
