import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Eye,
  CheckCircle2,
  Mail,
  MailOpen,
  Edit2,
  Copy,
  Trash2,
  CalendarClock,
  Ban,
  Cpu,
  CreditCard,
  Layers,
  Store,
  Users,
  ShieldAlert,
  Megaphone,
  Clock,
  Send,
} from "lucide-react";
import Badge from "../../../components/ui/Badge";
import {
  NOTIF_TYPE_VARIANTS,
  NOTIF_PRIORITY_VARIANTS,
  NOTIF_STATUS_VARIANTS,
} from "../../../data/notifications";

const TYPE_ICONS = {
  System: Cpu,
  Payment: CreditCard,
  Subscription: Layers,
  Restaurant: Store,
  User: Users,
  Security: ShieldAlert,
  Announcement: Megaphone,
};

export default function NotificationItem({
  notification,
  onViewDetails,
  onToggleRead,
  onEdit,
  onDuplicate,
  onCancelSchedule,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Close floating menu on outside click or scroll
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }
    function handleScrollOrResize() {
      setMenuOpen(false);
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

  const handleToggleMenu = (e) => {
    e.stopPropagation();
    if (menuOpen) {
      setMenuOpen(false);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const menuWidth = 200;
    const menuHeight = 220;

    const spaceBelow = window.innerHeight - rect.bottom;
    const shouldOpenUp = spaceBelow < menuHeight && rect.top > menuHeight;

    const top = shouldOpenUp ? rect.top - menuHeight - 4 : rect.bottom + 4;
    let left = rect.right - menuWidth;
    if (left < 10) left = 10;
    if (left + menuWidth > window.innerWidth - 10) {
      left = window.innerWidth - menuWidth - 10;
    }

    setMenuPos({ top, left });
    setMenuOpen(true);
  };

  const IconComponent = TYPE_ICONS[notification.type] || Megaphone;
  const isUnread = !notification.isRead || notification.status === "Unread";
  const isScheduled = notification.status === "Scheduled";
  const typeVariant = NOTIF_TYPE_VARIANTS[notification.type] || "primary";
  const priorityVariant = NOTIF_PRIORITY_VARIANTS[notification.priority] || "default";
  const statusVariant = NOTIF_STATUS_VARIANTS[notification.status] || "default";

  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-150 flex flex-col sm:flex-row sm:items-start justify-between gap-3.5 group ${
        isUnread
          ? "bg-bg-card border-primary/30 shadow-xs ring-1 ring-primary/10"
          : "bg-bg-card border-border hover:border-text-muted/40"
      }`}
    >
      {/* Left Icon & Message Block */}
      <div className="flex items-start gap-3.5 min-w-0 flex-1">
        {/* Category Icon */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
            notification.priority === "Critical"
              ? "bg-rose-50 text-rose-600 border border-rose-200"
              : notification.type === "Payment"
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
              : notification.type === "Subscription"
              ? "bg-purple-50 text-purple-600 border border-purple-200"
              : "bg-primary/10 text-primary border border-primary/20"
          }`}
        >
          <IconComponent className="w-5 h-5" />
        </div>

        {/* Content Details */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              onClick={() => onViewDetails(notification)}
              className="text-xs sm:text-sm font-bold text-text-primary hover:text-primary transition-colors cursor-pointer leading-snug"
            >
              {notification.title}
            </h4>

            {isUnread && (
              <span className="w-2 h-2 rounded-full bg-primary shrink-0 ring-2 ring-primary/20" />
            )}
          </div>

          <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
            {notification.message}
          </p>

          {/* Badges and Target Info */}
          <div className="flex items-center gap-2 pt-1 flex-wrap text-[11px]">
            <Badge variant={typeVariant} size="sm">
              {notification.type}
            </Badge>

            <Badge variant={priorityVariant} size="sm">
              {notification.priority}
            </Badge>

            <Badge variant={statusVariant} size="sm" dot>
              {notification.status}
            </Badge>

            <span className="text-text-muted">
              • To:{" "}
              <strong className="text-text-primary font-medium">
                {notification.restaurantName || notification.audience}
              </strong>
            </span>

            {notification.scheduledAt && (
              <span className="text-purple-600 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" /> Scheduled: {notification.scheduledAt}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Date and Actions */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
        <span className="text-[11px] text-text-muted whitespace-nowrap">
          {notification.sentAt || notification.createdAt}
        </span>

        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggleMenu}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer focus:outline-none"
          title="Notification Actions"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Action Portal Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: `${menuPos.top}px`,
            left: `${menuPos.left}px`,
            width: "200px",
            zIndex: 9999,
          }}
          className="bg-bg-card rounded-2xl border border-border shadow-2xl overflow-hidden py-1.5 animate-in fade-in-50 zoom-in-95 duration-100 text-left backdrop-blur-md"
        >
          {/* View Details */}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onViewDetails(notification);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-primary transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-text-muted" />
            <span>View Full Details</span>
          </button>

          {/* Toggle Read / Unread */}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onToggleRead(notification);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-primary transition-colors cursor-pointer"
          >
            {notification.isRead ? (
              <>
                <Mail className="w-3.5 h-3.5 text-text-muted" />
                <span>Mark as Unread</span>
              </>
            ) : (
              <>
                <MailOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mark as Read</span>
              </>
            )}
          </button>

          {/* Edit (If Scheduled) */}
          {isScheduled && (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onEdit(notification);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-primary transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-text-muted" />
              <span>Edit Scheduled</span>
            </button>
          )}

          {/* Cancel Schedule (If Scheduled) */}
          {isScheduled && (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onCancelSchedule(notification);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
            >
              <Ban className="w-3.5 h-3.5 text-amber-600" />
              <span>Cancel Schedule</span>
            </button>
          )}

          {/* Duplicate Template */}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onDuplicate(notification);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-primary transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-text-muted" />
            <span>Duplicate Template</span>
          </button>

          <div className="border-t border-border my-1" />

          {/* Delete Action */}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onDelete(notification);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-danger hover:bg-danger-light transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-danger" />
            <span>Delete Notification</span>
          </button>
        </div>
      )}
    </div>
  );
}
