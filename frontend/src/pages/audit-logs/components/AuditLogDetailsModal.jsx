import React from "react";
import {
  ShieldAlert,
  Clock,
  User,
  Store,
  Terminal,
  Globe,
  FileCode,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
} from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import {
  LOG_MODULE_VARIANTS,
  LOG_STATUS_VARIANTS,
  LOG_SEVERITY_VARIANTS,
  LOG_ROLE_VARIANTS,
} from "../../../data/auditLogs";

export default function AuditLogDetailsModal({
  isOpen,
  onClose,
  log,
}) {
  if (!isOpen || !log) return null;

  const moduleVariant = LOG_MODULE_VARIANTS[log.module] || "default";
  const statusVariant = LOG_STATUS_VARIANTS[log.status] || "default";
  const severityVariant = LOG_SEVERITY_VARIANTS[log.severity] || "default";
  const roleVariant = LOG_ROLE_VARIANTS[log.performedByRole] || "default";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Audit Event Telemetry"
      subtitle={`Detailed security log record for ID ${log.id}`}
      size="lg"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close Log
        </Button>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Top Summary Header */}
        <div className="p-4 rounded-xl bg-bg-main border border-border space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="font-mono text-[10px] text-text-muted bg-bg-card px-2 py-0.5 rounded border border-border">
              {log.id}
            </span>
            <div className="flex items-center gap-1.5">
              <Badge variant={moduleVariant} size="sm">
                {log.module}
              </Badge>
              <Badge variant={statusVariant} size="sm" dot>
                {log.status}
              </Badge>
              <Badge variant={severityVariant} size="sm">
                {log.severity}
              </Badge>
            </div>
          </div>

          <h3 className="text-sm font-bold text-text-primary leading-snug">
            {log.action}
          </h3>
          <p className="text-text-secondary leading-relaxed">
            {log.description}
          </p>
        </div>

        {/* Actor & Destination Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Performed By (Actor) */}
          <div className="p-3.5 rounded-xl bg-bg-card border border-border space-y-1.5">
            <span className="text-[10px] text-text-muted uppercase font-bold block">
              Initiating Actor
            </span>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-text-muted shrink-0" />
              <div>
                <p className="font-bold text-text-primary text-xs">{log.performedBy}</p>
                <div className="mt-0.5">
                  <Badge variant={roleVariant} size="sm">
                    {log.performedByRole}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Target Resource */}
          <div className="p-3.5 rounded-xl bg-bg-card border border-border space-y-1.5">
            <span className="text-[10px] text-text-muted uppercase font-bold block">
              Target Entity
            </span>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-text-muted shrink-0" />
              <div>
                <p className="font-bold text-text-primary text-xs truncate">
                  {log.targetName || log.targetId || "System Entity"}
                </p>
                <p className="text-[10px] text-text-muted font-mono">
                  {log.targetType} ({log.targetId})
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Network & Device Context */}
        <div className="p-3.5 rounded-xl bg-bg-main/60 border border-border space-y-2">
          <h4 className="font-bold text-text-primary flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-primary" />
            <span>Network Origin & Environment Telemetry</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-lg bg-bg-card border border-border">
              <span className="text-text-muted block">Client IP Address:</span>
              <span className="font-mono font-semibold text-text-primary">
                {log.ipAddress || "Internal System Loopback"}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-bg-card border border-border">
              <span className="text-text-muted block">Timestamp (UTC):</span>
              <span className="font-mono font-semibold text-text-primary">
                {log.createdAt}
              </span>
            </div>

            <div className="sm:col-span-2 p-2 rounded-lg bg-bg-card border border-border">
              <span className="text-text-muted block">Client User Agent:</span>
              <span className="font-mono text-text-secondary text-[10px] break-all">
                {log.userAgent}
              </span>
            </div>
          </div>
        </div>

        {/* Structured Metadata Diff Box */}
        {log.metadata && (
          <div className="p-3.5 rounded-xl bg-bg-main/80 border border-border space-y-2">
            <h4 className="font-bold text-text-primary flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-primary" />
              <span>Event Context & Metadata Snapshot</span>
            </h4>

            <div className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-48 border border-white/10">
              <pre className="whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
