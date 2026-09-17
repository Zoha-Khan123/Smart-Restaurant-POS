import React, { useState } from "react";
import { Plus, LifeBuoy, AlertCircle, Building, User, Mail, Tag, AlertTriangle } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

const CATEGORIES = [
  "Hardware & Terminals",
  "Billing & Subscriptions",
  "Integrations & API",
  "Account & Permissions",
  "Technical & Performance",
  "General Inquiry",
];

const PRIORITIES = [
  { value: "Low", label: "Low (General guidance, < 24h SLA)" },
  { value: "Medium", label: "Medium (Standard operational issue, < 8h SLA)" },
  { value: "High", label: "High (Business impact on POS, < 4h SLA)" },
  { value: "Critical", label: "Critical (Production POS outage, < 1h SLA)" },
];

export default function CreateTicketModal({ isOpen, onClose, onCreateTicket }) {
  const [formData, setFormData] = useState({
    restaurantName: "Bella Italia Ristorante",
    requesterName: "Alexander Wright",
    requesterEmail: "admin@smartpos-platform.io",
    subject: "",
    category: "Hardware & Terminals",
    priority: "Medium",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.subject.trim()) newErrors.subject = "Subject title is required";
    if (!formData.description.trim()) newErrors.description = "Detailed incident description is required";
    if (!formData.restaurantName.trim()) newErrors.restaurantName = "Restaurant name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newTicket = {
        id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
        ticketNumber: `#${Math.floor(8900 + Math.random() * 1000)}`,
        restaurantId: "REST-MOCK",
        restaurantName: formData.restaurantName,
        requesterName: formData.requesterName,
        requesterEmail: formData.requesterEmail,
        requesterRole: "Super Administrator",
        subject: formData.subject,
        category: formData.category,
        priority: formData.priority,
        status: "Open",
        createdAt: new Date().toISOString().replace("T", " ").substring(0, 19),
        updatedAt: "Just now",
        assignedTo: "Alexander Wright (Super Admin)",
        description: formData.description,
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: formData.requesterName,
            senderRole: "Super Administrator",
            timestamp: "Just now",
            avatar: "SA",
            text: formData.description,
          },
        ],
      };

      onCreateTicket(newTicket);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Administrative Support Ticket"
      subtitle="Open an incident or support inquiry on behalf of a tenant or platform service."
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isSubmitting}
            className="font-bold"
          >
            <Plus className="w-4 h-4 mr-1" />
            Create Ticket
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Tenant Restaurant Name"
            placeholder="e.g. Bella Italia Ristorante"
            value={formData.restaurantName}
            onChange={(e) => handleChange("restaurantName", e.target.value)}
            error={errors.restaurantName}
            icon={Building}
            required
          />

          <Input
            label="Requester Name"
            placeholder="Requester Name"
            value={formData.requesterName}
            onChange={(e) => handleChange("requesterName", e.target.value)}
            icon={User}
            required
          />
        </div>

        <Input
          label="Ticket Subject"
          placeholder="Brief summary of the issue (e.g. Thermal Printer offline on POS 2)"
          value={formData.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
          error={errors.subject}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-text-primary mb-1.5 flex items-center justify-between">
              <span>Category</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                <Tag className="w-4 h-4" />
              </div>
              <select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full text-xs sm:text-sm rounded-lg bg-bg-card text-text-primary border border-border pl-9 pr-3 py-2.5 outline-none hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-text-primary mb-1.5 flex items-center justify-between">
              <span>Priority Level</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <select
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
                className="w-full text-xs sm:text-sm rounded-lg bg-bg-card text-text-primary border border-border pl-9 pr-3 py-2.5 outline-none hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-text-primary mb-1.5">
            Detailed Incident Description <span className="text-danger">*</span>
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Include error messages, steps to reproduce, affected terminal IDs..."
            className={`w-full text-xs sm:text-sm rounded-lg bg-bg-card text-text-primary border p-3 outline-none hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none ${
              errors.description ? "border-danger" : "border-border"
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-danger font-medium">{errors.description}</p>
          )}
        </div>
      </form>
    </Modal>
  );
}
