import React, { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Dropdown from "../../../components/ui/Dropdown";
import Button from "../../../components/ui/Button";
import { Store, User, Mail, Phone, MapPin, Calendar } from "lucide-react";

export default function EditRestaurantModal({
  isOpen,
  onClose,
  restaurant,
  onUpdateSuccess,
}) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    ownerName: "",
    ownerEmail: "",
    phone: "",
    address: "",
    subscriptionPlan: "Standard",
    paymentStatus: "Paid",
    subscriptionStartDate: "",
    subscriptionEndDate: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || "",
        category: restaurant.category || "Fine Dining & Café",
        ownerName: restaurant.ownerName || "",
        ownerEmail: restaurant.ownerEmail || "",
        phone: restaurant.phone || "",
        address: restaurant.address || "",
        subscriptionPlan: restaurant.subscriptionPlan || "Standard",
        paymentStatus: restaurant.paymentStatus || "Paid",
        subscriptionStartDate: restaurant.subscriptionStartDate || "",
        subscriptionEndDate: restaurant.subscriptionEndDate || "",
        status: restaurant.status || "Active",
      });
      setErrors({});
    }
  }, [restaurant]);

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

      const updated = {
        ...restaurant,
        name: formData.name.trim(),
        category: formData.category,
        initials,
        ownerName: formData.ownerName.trim(),
        ownerEmail: formData.ownerEmail.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
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
      };

      if (onUpdateSuccess) {
        onUpdateSuccess(updated);
      }

      setLoading(false);
      onClose();
    }, 400);
  };

  if (!restaurant) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${restaurant.name}`}
      subtitle="Update tenant configuration and subscription status"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            Save Changes
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Restaurant Name"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Owner / Admin Name"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Contact Phone"
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
            icon={MapPin}
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>

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
            label="Current Status"
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
