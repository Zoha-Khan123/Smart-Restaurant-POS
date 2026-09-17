import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Store, Shield } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Dropdown from "../../../components/ui/Dropdown";
import { AVAILABLE_ROLES, ALL_ROLES } from "../../../data/users";

export default function EditUserModal({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  restaurantsList = [],
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    restaurantName: "",
    role: "Admin",
    status: "Active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        restaurantName: user.restaurantName || "",
        role: user.role || "Admin",
        status: user.status || "Active",
      });
      setErrors({});
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full name is required";
    if (!formData.email.trim()) {
      errs.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (user.role !== "Super Admin" && !formData.restaurantName) {
      errs.restaurantName = "Please assign a restaurant";
    }
    if (!formData.role) {
      errs.role = "Please select an account role";
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

    const updatedUser = {
      ...user,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      role: formData.role,
      restaurantId:
        formData.role === "Super Admin"
          ? null
          : matchedRestaurant
          ? matchedRestaurant.id
          : user.restaurantId,
      restaurantName:
        formData.role === "Super Admin" ? "Platform" : formData.restaurantName,
      status: formData.status,
    };

    onUpdateUser(updatedUser);
    onClose();
  };

  const restaurantOptions = [
    ...(user.role === "Super Admin"
      ? [{ label: "Platform (Root Scope)", value: "Platform" }]
      : []),
    ...restaurantsList.map((r) => ({
      label: r.name,
      value: r.name,
    })),
  ];

  const roleOptions = (
    user.role === "Super Admin" ? ALL_ROLES : AVAILABLE_ROLES
  ).map((role) => ({
    label: role,
    value: role,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit User Profile & Access"
      subtitle={`Modify profile details and tenant assignment for ${user.name}`}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name *"
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
            label="Contact Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            icon={Phone}
          />

          <Dropdown
            label="Assigned Tenant / Restaurant *"
            value={formData.restaurantName}
            onChange={(e) =>
              setFormData({ ...formData, restaurantName: e.target.value })
            }
            options={restaurantOptions}
            error={errors.restaurantName}
            disabled={user.role === "Super Admin"}
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
            label="Account Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            options={[
              { label: "Active (Operational)", value: "Active" },
              { label: "Inactive (Disabled)", value: "Inactive" },
              { label: "Suspended (Locked)", value: "Suspended" },
            ]}
          />
        </div>

        <div className="p-3 rounded-xl bg-bg-main border border-border text-text-muted text-[11px] leading-relaxed">
          <p>
            Security Note: Password credentials cannot be edited here. Use the <strong>Reset Password</strong> action to send secure credential reset links.
          </p>
        </div>
      </form>
    </Modal>
  );
}
