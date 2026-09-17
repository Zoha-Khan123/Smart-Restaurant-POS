import React, { useState, useEffect } from "react";
import {
  Edit2,
  CalendarClock,
  AlertCircle,
  Eye,
  Info,
} from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import NotificationPreview from "./NotificationPreview";
import {
  NOTIF_TYPE_OPTIONS,
  NOTIF_PRIORITY_OPTIONS,
  NOTIF_AUDIENCE_OPTIONS,
} from "../../../data/notifications";

export default function EditNotificationModal({
  isOpen,
  onClose,
  notification,
  onUpdate,
}) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("Announcement");
  const [priority, setPriority] = useState("Normal");
  const [audience, setAudience] = useState("All Restaurants");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("09:00");
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (notification) {
      setTitle(notification.title || "");
      setMessage(notification.message || "");
      setType(notification.type || "Announcement");
      setPriority(notification.priority || "Normal");
      setAudience(notification.audience || "All Restaurants");

      if (notification.scheduledAt) {
        const parts = notification.scheduledAt.split(" ");
        setScheduledDate(parts[0] || "");
        setScheduledTime(parts[1] || "09:00");
      }
      setShowPreview(false);
    }
  }, [notification, isOpen]);

  if (!isOpen || !notification) return null;

  const isSent = notification.status === "Sent";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsSubmitting(true);

    const updatedData = {
      title: title.trim(),
      message: message.trim(),
      type: type,
      priority: priority,
      audience: audience,
      scheduledAt: notification.status === "Scheduled" ? `${scheduledDate} ${scheduledTime}` : notification.scheduledAt,
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onUpdate(notification.id, updatedData);
      onClose();
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Notification"
      subtitle={`Configure notification properties for ID ${notification.id}`}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowPreview((p) => !p)}
            type="button"
          >
            <Eye className="w-3.5 h-3.5 mr-1" />
            {showPreview ? "Hide Preview" : "Preview Alert"}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!title.trim() || !message.trim() || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Sent Notification Policy Banner */}
        {isSent && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Historical Dispatch Record:</strong> This notification has already been broadcast to terminals. Updating properties will adjust platform dashboard logs without re-dispatching duplicate messages.
            </div>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-text-primary mb-1">
            Notification Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-bg-main border border-border text-text-primary text-xs focus:outline-none focus:border-primary"
            required
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-bold text-text-primary mb-1">
            Message Body *
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-bg-main border border-border text-text-primary text-xs focus:outline-none focus:border-primary"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Type */}
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">
              Category Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-bg-main border border-border text-text-primary text-xs focus:outline-none focus:border-primary cursor-pointer"
            >
              {NOTIF_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">
              Priority Urgency
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-bg-main border border-border text-text-primary text-xs focus:outline-none focus:border-primary cursor-pointer"
            >
              {NOTIF_PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p} Priority
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Schedule adjustments if scheduled */}
        {notification.status === "Scheduled" && (
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-bg-main border border-border">
            <div>
              <label className="block text-[11px] font-semibold text-text-muted mb-1">
                Scheduled Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-bg-card border border-border text-text-primary text-xs focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-text-muted mb-1">
                Scheduled Time
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-bg-card border border-border text-text-primary text-xs focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        )}

        {/* Live Preview Toggle */}
        {showPreview && (
          <NotificationPreview
            title={title}
            message={message}
            type={type}
            priority={priority}
            audience={audience}
            restaurantName={notification.restaurantName}
          />
        )}
      </form>
    </Modal>
  );
}
