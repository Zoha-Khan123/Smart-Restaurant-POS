import React, { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Dropdown from "../../../components/ui/Dropdown";
import Button from "../../../components/ui/Button";
import { Store, User, Mail, DollarSign } from "lucide-react";

export default function AddRestaurantModal({ isOpen, onClose, onAddSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "Fine Dining & Café",
    ownerName: "",
    ownerEmail: "",
    plan: "Standard",
    billingCycle: "Monthly",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const initials = formData.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "NB";

      const newRestaurant = {
        id: `rst-${Date.now().toString().slice(-4)}`,
        name: formData.name || "New Bistro",
        category: formData.category,
        logoColor: "bg-primary",
        initials,
        owner: {
          name: formData.ownerName || "New Admin",
          email: formData.ownerEmail || "admin@restaurant.com",
          avatarBg: "bg-emerald-600",
        },
        plan: formData.plan,
        planVariant: formData.plan === "Premium" ? "purple" : formData.plan === "Standard" ? "primary" : "info",
        paymentStatus: "Paid",
        paymentVariant: "success",
        restaurantStatus: "Active",
        statusVariant: "success",
        expiryDate: "Mar 16, 2027",
        daysLeft: "365 days",
      };

      if (onAddSuccess) {
        onAddSuccess(newRestaurant);
      }
      setLoading(false);
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Onboard New Restaurant"
      subtitle="Register a new tenant account on the Smart POS platform"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            Create Tenant Account
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Restaurant Name"
          placeholder="e.g. Bella Italia Bistro"
          required
          icon={Store}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <Dropdown
          label="Cuisine / Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          options={[
            "Fine Dining & Café",
            "Italian & Pizzeria",
            "Indian & Asian Fusion",
            "Fast Food & Burgers",
            "Specialty Café & Bakery",
            "Seafood Bar & Grill",
          ]}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Owner / Admin Name"
            placeholder="e.g. John Doe"
            required
            icon={User}
            value={formData.ownerName}
            onChange={(e) =>
              setFormData({ ...formData, ownerName: e.target.value })
            }
          />
          <Input
            label="Admin Email Address"
            type="email"
            placeholder="admin@domain.com"
            required
            icon={Mail}
            value={formData.ownerEmail}
            onChange={(e) =>
              setFormData({ ...formData, ownerEmail: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Dropdown
            label="Subscription Tier"
            value={formData.plan}
            onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
            options={[
              { label: "Basic Plan ($29/mo)", value: "Basic" },
              { label: "Standard Plan ($79/mo)", value: "Standard" },
              { label: "Premium Plan ($199/mo)", value: "Premium" },
            ]}
          />
          <Dropdown
            label="Billing Interval"
            value={formData.billingCycle}
            onChange={(e) =>
              setFormData({ ...formData, billingCycle: e.target.value })
            }
            options={[
              { label: "Monthly Recurring", value: "Monthly" },
              { label: "Annual (20% Off)", value: "Annual" },
            ]}
          />
        </div>
      </form>
    </Modal>
  );
}
