import React from "react";
import {
  Bell,
  Mail,
  MailOpen,
  Calendar,
  Clock,
  User,
  Store,
  Layers,
  ShieldCheck,
  Send,
} from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import {
  NOTIF_TYPE_VARIANTS,
  NOTIF_PRIORITY_VARIANTS,
  NOTIF_STATUS_VARIANTS,
} from "../../../data/notifications";

export default function NotificationDetailsModal({
  isOpen,
  onClose,
  notification,
  onToggleRead,
}) {
  if (!isOpen || !notification) return null;

  const typeVariant = NOTIF_TYPE_VARIANTS[notification.type] || "primary";
  const priorityVariant = NOTIF_PRIORITY_VARIANTS[notification.priority] || "default";
  const statusVariant = NOTIF_STATUS_VARIANTS[notification.status] || "default";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Notification Specifications"
      subtitle={`Broadcast message & delivery metadata`}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onToggleRead(notification);
            }}
          >
            {notification.isRead ? (
              <>
                <Mail className="w-3.5 h-3.5 mr-1" />
                Mark as Unread
              </>
            ) : (
              <>
                <MailOpen className="w-3.5 h-3.5 mr-1" />
                Mark as Read
              </>
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Top Header Identity */}
        <div className="p-4 rounded-xl bg-bg-main border border-border space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="font-mono text-[10px] text-text-muted bg-bg-card px-2 py-0.5 rounded border border-border">
              {notification.id}
            </span>
            <div className="flex items-center gap-1.5">
              <Badge variant={typeVariant} size="sm">
                {notification.type}
              </Badge>
              <Badge variant={priorityVariant} size="sm">
                {notification.priority}
              </Badge>
              <Badge variant={statusVariant} size="sm" dot>
                {notification.status}
              </Badge>
            </div>
          </div>

          <h3 className="text-sm font-bold text-text-primary leading-snug">
            {notification.title}
          </h3>
        </div>

        {/* Full Message Body */}
        <div className="p-4 rounded-xl bg-bg-card border border-border space-y-1.5">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
            Broadcast Message Body
          </span>
          <p className="text-xs text-text-primary leading-relaxed whitespace-pre-wrap">
            {notification.message}
          </p>
        </div>

        {/* Audience & Destination Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-bg-main border border-border">
            <span className="text-[10px] text-text-muted uppercase font-bold block">
              Target Audience
            </span>
            <span className="font-bold text-text-primary text-xs mt-0.5 block">
              {notification.audience}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-bg-main border border-border">
            <span className="text-[10px] text-text-muted uppercase font-bold block">
              Target Tenant
            </span>
            <span className="font-bold text-text-primary text-xs mt-0.5 block truncate">
              {notification.restaurantName || "All Platform Outlets"}
            </span>
            {notification.restaurantId && (
              <span className="text-[10px] font-mono text-text-muted">
                {notification.restaurantId}
              </span>
            )}
          </div>
        </div>

        {/* Delivery & Lifecycle Timeline */}
        <div className="p-3.5 rounded-xl bg-bg-main/60 border border-border space-y-2">
          <h4 className="font-bold text-text-primary flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>Delivery & Audit Timeline</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2 rounded-lg bg-bg-card border border-border">
              <span className="text-text-muted block">Created By:</span>
              <span className="font-semibold text-text-primary">{notification.createdBy}</span>
            </div>

            <div className="p-2 rounded-lg bg-bg-card border border-border">
              <span className="text-text-muted block">Created Date:</span>
              <span className="font-semibold text-text-primary">{notification.createdAt}</span>
            </div>

            <div className="p-2 rounded-lg bg-bg-card border border-border">
              <span className="text-text-muted block">Delivery Timestamp:</span>
              <span className="font-semibold text-text-primary">
                {notification.sentAt || notification.scheduledAt || "Pending"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
