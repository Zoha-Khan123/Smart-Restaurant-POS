import React, { useState } from "react";
import {
  Send,
  CalendarClock,
  AlertCircle,
  Eye,
  Sliders,
} from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import NotificationPreview from "./NotificationPreview";
import {
  NOTIF_TYPE_OPTIONS,
  NOTIF_PRIORITY_OPTIONS,
  NOTIF_AUDIENCE_OPTIONS,
} from "../../../data/notifications";

const RESTAURANTS_LIST = [
  { id: "rst-001", name: "Urban Bites Bistro" },
  { id: "rst-002", name: "Spice Symphony Grill" },
  { id: "rst-003", name: "Golden Crust Pizzeria" },
  { id: "rst-004", name: "Ocean Catch Seafood" },
  { id: "rst-005", name: "The Rustic Table" },
  { id: "rst-006", name: "Sakura Japanese Lounge" },
  { id: "rst-007", name: "Fire & Smoke BBQ" },
  { id: "rst-008", name: "Green Garden Organics" },
  { id: "rst-009", name: "Bella Vista Trattoria" },
  { id: "rst-010", name: "Taco Fiesta Cantina" },
];

export default function CreateNotificationModal({
  isOpen,
  onClose,
  onCreate,
  initialTemplate,
}) {
  const [title, setTitle] = useState(initialTemplate?.title || "");
  const [message, setMessage] = useState(initialTemplate?.message || "");
  const [type, setType] = useState(initialTemplate?.type || "Announcement");
  const [priority, setPriority] = useState(initialTemplate?.priority || "Normal");
  const [audience, setAudience] = useState(initialTemplate?.audience || "All Restaurants");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(initialTemplate?.restaurantId || "");
  const [deliveryMode, setDeliveryMode] = useState("send_now"); // 'send_now' | 'schedule'
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("09:00");
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const selectedRestaurant = RESTAURANTS_LIST.find((r) => r.id === selectedRestaurantId);

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = "Notification title is required.";
    if (!message.trim()) errs.message = "Notification message content is required.";
    if (audience === "Specific Restaurant" && !selectedRestaurantId) {
      errs.restaurant = "Please select a specific restaurant tenant.";
    }
    if (deliveryMode === "schedule") {
      if (!scheduledDate) errs.scheduledDate = "Scheduled date is required.";
      if (!scheduledTime) errs.scheduledTime = "Scheduled time is required.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    const scheduledAtStr = deliveryMode === "schedule" ? `${scheduledDate} ${scheduledTime}` : null;

    const newNotification = {
      id: `notif-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      message: message.trim(),
      type: type,
      priority: priority,
      audience: audience,
      restaurantId: audience === "Specific Restaurant" ? selectedRestaurantId : null,
      restaurantName: audience === "Specific Restaurant" ? selectedRestaurant?.name : null,
      status: deliveryMode === "schedule" ? "Scheduled" : "Sent",
      isRead: false,
      createdBy: "Super Admin",
      createdAt: nowStr,
      scheduledAt: scheduledAtStr,
      sentAt: deliveryMode === "send_now" ? nowStr : null,
      readAt: null,
      updatedAt: nowStr,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onCreate(newNotification);
      onClose();
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Broadcast Notification"
      subtitle="Dispatch announcements, alerts, and system telemetry to restaurant tenants"
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
            disabled={isSubmitting}
          >
            {deliveryMode === "schedule" ? (
              <>
                <CalendarClock className="w-3.5 h-3.5 mr-1" />
                {isSubmitting ? "Scheduling..." : "Schedule Notification"}
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 mr-1" />
                {isSubmitting ? "Broadcasting..." : "Send Notification Now"}
              </>
            )}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Basic Information */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">
              Notification Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Scheduled Cloud Database Indexing"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl bg-bg-main border text-text-primary text-xs focus:outline-none focus:ring-2 ${
                errors.title
                  ? "border-danger focus:ring-danger/20"
                  : "border-border focus:border-primary focus:ring-primary/20"
              }`}
            />
            {errors.title && (
              <p className="text-[11px] text-danger mt-0.5">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">
              Broadcast Message Body *
            </label>
            <textarea
              rows={3}
              placeholder="Provide complete communication, operational impact, and action instructions..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl bg-bg-main border text-text-primary text-xs focus:outline-none focus:ring-2 ${
                errors.message
                  ? "border-danger focus:ring-danger/20"
                  : "border-border focus:border-primary focus:ring-primary/20"
              }`}
            />
            {errors.message && (
              <p className="text-[11px] text-danger mt-0.5">{errors.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Category Type */}
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                Notification Category *
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
        </div>

        {/* Audience Target */}
        <div className="space-y-3 pt-2 border-t border-border/80">
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">
              Target Audience *
            </label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-bg-main border border-border text-text-primary text-xs focus:outline-none focus:border-primary cursor-pointer"
            >
              {NOTIF_AUDIENCE_OPTIONS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {audience === "Specific Restaurant" && (
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                Select Destination Restaurant *
              </label>
              <select
                value={selectedRestaurantId}
                onChange={(e) => setSelectedRestaurantId(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl bg-bg-main border text-text-primary text-xs focus:outline-none focus:ring-2 cursor-pointer ${
                  errors.restaurant
                    ? "border-danger focus:ring-danger/20"
                    : "border-border focus:border-primary focus:ring-primary/20"
                }`}
              >
                <option value="">-- Choose Tenant Outlet --</option>
                {RESTAURANTS_LIST.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.id})
                  </option>
                ))}
              </select>
              {errors.restaurant && (
                <p className="text-[11px] text-danger mt-0.5">{errors.restaurant}</p>
              )}
            </div>
          )}
        </div>

        {/* Delivery Options */}
        <div className="space-y-3 pt-2 border-t border-border/80">
          <label className="block text-xs font-bold text-text-primary">
            Dispatch Timing
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-bg-card hover:bg-bg-hover cursor-pointer transition-colors">
              <input
                type="radio"
                name="deliveryMode"
                value="send_now"
                checked={deliveryMode === "send_now"}
                onChange={(e) => setDeliveryMode(e.target.value)}
                className="text-primary focus:ring-primary h-4 w-4"
              />
              <div>
                <span className="font-semibold text-text-primary block text-xs">
                  Send Immediately
                </span>
                <span className="text-[10px] text-text-muted">
                  Broadcasts right away to active terminals.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-bg-card hover:bg-bg-hover cursor-pointer transition-colors">
              <input
                type="radio"
                name="deliveryMode"
                value="schedule"
                checked={deliveryMode === "schedule"}
                onChange={(e) => setDeliveryMode(e.target.value)}
                className="text-primary focus:ring-primary h-4 w-4"
              />
              <div>
                <span className="font-semibold text-text-primary block text-xs">
                  Schedule for Later
                </span>
                <span className="text-[10px] text-text-muted">
                  Queue for a specific future date and time.
                </span>
              </div>
            </label>
          </div>

          {deliveryMode === "schedule" && (
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-bg-main border border-border">
              <div>
                <label className="block text-[11px] font-semibold text-text-muted mb-1">
                  Scheduled Date *
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-bg-card border border-border text-text-primary text-xs focus:outline-none focus:border-primary"
                />
                {errors.scheduledDate && (
                  <p className="text-[10px] text-danger mt-0.5">{errors.scheduledDate}</p>
                )}
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-text-muted mb-1">
                  Scheduled Time *
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-bg-card border border-border text-text-primary text-xs focus:outline-none focus:border-primary"
                />
                {errors.scheduledTime && (
                  <p className="text-[10px] text-danger mt-0.5">{errors.scheduledTime}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Live Preview Toggle Panel */}
        {showPreview && (
          <NotificationPreview
            title={title}
            message={message}
            type={type}
            priority={priority}
            audience={audience}
            restaurantName={selectedRestaurant?.name}
          />
        )}
      </form>
    </Modal>
  );
}
