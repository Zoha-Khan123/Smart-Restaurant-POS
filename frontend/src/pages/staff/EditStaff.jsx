import React, { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Dropdown from "../../components/ui/Dropdown";
import { STAFF_ROLES, STAFF_SHIFTS } from "../../data/staff";

/**
 * Smart POS - Edit Staff Member Modal Component
 */
export default function EditStaff({ staff, isOpen, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Waiter",
    shift: "Evening (04:00 PM - 12:00 AM)",
    joinDate: "",
    status: "Active",
    salary: "",
    avatar: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name || "",
        email: staff.email || "",
        phone: staff.phone || "",
        role: staff.role || "Waiter",
        shift: staff.shift || STAFF_SHIFTS[0],
        joinDate: staff.joinDate || "",
        status: staff.status || "Active",
        salary: staff.salary || "35,000",
        avatar:
          staff.avatar ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80",
      });
      setErrors({});
    }
  }, [staff]);

  if (!staff) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full name is required";
    if (!formData.email.trim()) errs.email = "Email address is required";
    if (!formData.phone.trim()) errs.phone = "Phone number is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const updated = {
      ...staff,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      role: formData.role,
      shift: formData.shift,
      joinDate: formData.joinDate,
      status: formData.status,
      salary: formData.salary,
      avatar: formData.avatar,
    };

    onUpdate(updated);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Staff: ${staff.name}`}
      subtitle="Update role, assigned shift, salary, or contact info"
      size="lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-bg-hover rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="py-2.5 px-6 text-xs font-bold"
          >
            Update Staff Member
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Profile Avatar & Image URL */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 rounded-xl bg-bg-main border border-border">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-bg-card border border-border shrink-0 shadow-xs">
            <img
              src={formData.avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80";
              }}
            />
          </div>

          <div className="flex-1 w-full space-y-1.5 text-center sm:text-left">
            <div>
              <h4 className="text-xs font-bold text-text-primary">
                Update Photo URL
              </h4>
              <p className="text-[11px] text-text-muted">
                Change staff member profile photo
              </p>
            </div>
            <input
              type="text"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full text-xs px-3 py-2 bg-bg-card border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Name & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
          />
        </div>

        {/* Email & Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Dropdown
            label="Role & Permissions"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={STAFF_ROLES.filter((r) => r !== "All Roles")}
          />
        </div>

        {/* Shift & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Dropdown
            label="Assigned Shift"
            name="shift"
            value={formData.shift}
            onChange={handleChange}
            options={STAFF_SHIFTS}
          />

          <div>
            <label className="text-xs font-medium text-text-primary mb-1.5 block">
              Employment Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full text-sm px-3.5 py-2.5 bg-bg-card border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="Active">Active (On Duty)</option>
              <option value="Inactive">Inactive (Off Duty)</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>

        {/* Joining Date & Monthly Salary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Joining Date"
            name="joinDate"
            value={formData.joinDate}
            onChange={handleChange}
          />

          <Input
            label="Monthly Salary (Rs.)"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
          />
        </div>

      </form>
    </Modal>
  );
}
