import React, { useState } from "react";
import { User, Mail, Phone, Lock, Store, Shield, AlertCircle } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Dropdown from "../../../components/ui/Dropdown";
import { AVAILABLE_ROLES } from "../../../data/users";

export default function AddUserModal({
  isOpen,
  onClose,
  onAddUser,
  restaurantsList = [],
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    restaurantName: "",
    role: "Admin",
    status: "Active",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full name is required";
    if (!formData.email.trim()) {
      errs.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!formData.restaurantName) {
      errs.restaurantName = "Please assign a restaurant tenant";
    }
    if (!formData.role) {
      errs.role = "Please select an account role";
    }
    if (!formData.password) {
      errs.password = "Password is required";
    } else if (formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const matchedRestaurant = restaurantsList.find(
      (r) => r.name === formData.restaurantName
    );

    const newUser = {
      id: `usr-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || "+1 (555) 000-0000",
      avatar: formData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "US",
      avatarBg: "bg-blue-600",
      role: formData.role,
      restaurantId: matchedRestaurant ? matchedRestaurant.id : "rst-001",
      restaurantName: formData.restaurantName,
      status: formData.status,
      lastLogin: "Never",
      lastLoginIp: "None (Newly provisioned)",
      activeSessions: 0,
      createdAt: "Today",
    };

    onAddUser(newUser);
    onClose();
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      restaurantName: "",
      role: "Admin",
      status: "Active",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  const restaurantOptions = restaurantsList.map((r) => ({
    label: r.name,
    value: r.name,
  }));

  const roleOptions = AVAILABLE_ROLES.map((role) => ({
    label: role,
    value: role,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Provision New User Account"
      subtitle="Create credentials and assign role permissions to a tenant restaurant"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create User Account
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Basic Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name *"
            placeholder="e.g. Liam Anderson"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            error={errors.name}
            icon={User}
            required
          />

          <Input
            label="Email Address *"
            type="email"
            placeholder="e.g. liam@bistrocafes.io"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={errors.email}
            icon={Mail}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            placeholder="+1 (555) 234-5678"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            icon={Phone}
          />

          <Dropdown
            label="Assign Tenant / Restaurant *"
            value={formData.restaurantName}
            onChange={(e) =>
              setFormData({ ...formData, restaurantName: e.target.value })
            }
            options={restaurantOptions}
            placeholder="Select restaurant..."
            error={errors.restaurantName}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Dropdown
            label="Account Role *"
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
            options={roleOptions}
            error={errors.role}
          />

          <Dropdown
            label="Initial Account Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            options={[
              { label: "Active (Immediate Access)", value: "Active" },
              { label: "Inactive (Disabled)", value: "Inactive" },
            ]}
          />
        </div>

        {/* Password Credentials */}
        <div className="pt-2 border-t border-border">
          <p className="text-xs font-bold text-text-primary mb-3 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span>Security Credentials</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Account Password *"
              type="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={errors.password}
              icon={Lock}
              required
            />

            <Input
              label="Confirm Password *"
              type="password"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              error={errors.confirmPassword}
              icon={Lock}
              required
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-[11px] leading-relaxed">
          <p className="font-semibold mb-0.5">Role Governance Notice</p>
          <p>
            The newly registered user will receive login instructions via email.
            Super Administrator accounts cannot be created via the standard tenant provisioning modal.
          </p>
        </div>
      </form>
    </Modal>
  );
}
