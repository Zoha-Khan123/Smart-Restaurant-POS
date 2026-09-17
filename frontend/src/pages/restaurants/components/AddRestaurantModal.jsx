import React, { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Dropdown from "../../../components/ui/Dropdown";
import Button from "../../../components/ui/Button";
import {
  Store,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Layers,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

export default function AddRestaurantModal({ isOpen, onClose, onAddSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "Fine Dining & Café",
    ownerName: "",
    ownerEmail: "",
    phone: "",
    address: "",
    subscriptionPlan: "Standard",
    paymentStatus: "Paid",
    subscriptionStartDate: new Date().toISOString().split("T")[0],
    subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    status: "Active",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Restaurant name is required";
    if (!formData.ownerName.trim()) errs.ownerName = "Owner name is required";
    if (!formData.ownerEmail.trim()) {
      errs.ownerEmail = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.ownerEmail)) {
      errs.ownerEmail = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) errs.phone = "Phone number is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

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
        name: formData.name.trim(),
        category: formData.category,
        logoColor: "bg-blue-600",
        initials,
        ownerName: formData.ownerName.trim(),
        ownerEmail: formData.ownerEmail.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim() || "Main Street Plaza, District 1",
        subscriptionPlan: formData.subscriptionPlan,
        planVariant:
          formData.subscriptionPlan === "Premium"
            ? "purple"
            : formData.subscriptionPlan === "Standard"
            ? "primary"
            : "info",
        paymentStatus: formData.paymentStatus,
        paymentVariant:
          formData.paymentStatus === "Paid"
            ? "success"
            : formData.paymentStatus === "Pending"
            ? "warning"
            : "danger",
        status: formData.status,
        statusVariant: formData.status === "Active" ? "success" : "danger",
        subscriptionStartDate: formData.subscriptionStartDate,
        subscriptionEndDate: formData.subscriptionEndDate,
        createdAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        daysLeft: "365 days",
      };

      if (onAddSuccess) {
        onAddSuccess(newRestaurant);
      }

      setLoading(false);
      onClose();
      // Reset form
      setFormData({
        name: "",
        category: "Fine Dining & Café",
        ownerName: "",
        ownerEmail: "",
        phone: "",
        address: "",
        subscriptionPlan: "Standard",
        paymentStatus: "Paid",
        subscriptionStartDate: new Date().toISOString().split("T")[0],
        subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        status: "Active",
      });
      setErrors({});
    }, 500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Restaurant"
      subtitle="Onboard a new restaurant/tenant account to the Smart POS platform"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            Create Restaurant
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Restaurant Name & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Restaurant Name"
            placeholder="e.g. Bella Italia Bistro"
            required
            icon={Store}
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: "" });
            }}
            error={errors.name}
          />

          <Dropdown
            label="Category / Cuisine"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            options={[
              "Fine Dining & Café",
              "Italian & Pizzeria",
              "Indian & Asian Fusion",
              "Fast Food & Burgers",
              "Specialty Café & Bakery",
              "Seafood Bar & Grill",
              "Japanese & Noodle Bar",
              "Mexican & Taco Bar",
              "Middle Eastern & Halal",
              "Organic & Healthy Bowls",
            ]}
          />
        </div>

        {/* Row 2: Owner Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Owner / Admin Name"
            placeholder="e.g. John Doe"
            required
            icon={User}
            value={formData.ownerName}
            onChange={(e) => {
              setFormData({ ...formData, ownerName: e.target.value });
              if (errors.ownerName) setErrors({ ...errors, ownerName: "" });
            }}
            error={errors.ownerName}
          />

          <Input
            label="Owner Email Address"
            type="email"
            placeholder="admin@restaurant.com"
            required
            icon={Mail}
            value={formData.ownerEmail}
            onChange={(e) => {
              setFormData({ ...formData, ownerEmail: e.target.value });
              if (errors.ownerEmail) setErrors({ ...errors, ownerEmail: "" });
            }}
            error={errors.ownerEmail}
          />
        </div>

        {/* Row 3: Phone & Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Contact Phone"
            placeholder="+1 (555) 000-0000"
            required
            icon={Phone}
            value={formData.phone}
            onChange={(e) => {
              setFormData({ ...formData, phone: e.target.value });
              if (errors.phone) setErrors({ ...errors, phone: "" });
            }}
            error={errors.phone}
          />

          <Input
            label="Physical Address / Location"
            placeholder="e.g. 742 Evergreen Terrace, Downtown"
            icon={MapPin}
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>

        {/* Row 4: Plan & Payment Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Dropdown
            label="Subscription Plan"
            value={formData.subscriptionPlan}
            onChange={(e) =>
              setFormData({ ...formData, subscriptionPlan: e.target.value })
            }
            options={[
              { label: "Basic Plan ($29/mo)", value: "Basic" },
              { label: "Standard Plan ($79/mo)", value: "Standard" },
              { label: "Premium Plan ($199/mo)", value: "Premium" },
            ]}
          />

          <Dropdown
            label="Payment Status"
            value={formData.paymentStatus}
            onChange={(e) =>
              setFormData({ ...formData, paymentStatus: e.target.value })
            }
            options={[
              { label: "Paid (Settled)", value: "Paid" },
              { label: "Pending Verification", value: "Pending" },
              { label: "Overdue", value: "Overdue" },
            ]}
          />
        </div>

        {/* Row 5: Dates & Initial Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Start Date"
            type="date"
            icon={Calendar}
            value={formData.subscriptionStartDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                subscriptionStartDate: e.target.value,
              })
            }
          />

          <Input
            label="End Date / Expiry"
            type="date"
            icon={Calendar}
            value={formData.subscriptionEndDate}
            onChange={(e) =>
              setFormData({ ...formData, subscriptionEndDate: e.target.value })
            }
          />

          <Dropdown
            label="Initial Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            options={[
              { label: "Active (Operational)", value: "Active" },
              { label: "Inactive (Disabled)", value: "Inactive" },
            ]}
          />
        </div>
      </form>
    </Modal>
  );
}
