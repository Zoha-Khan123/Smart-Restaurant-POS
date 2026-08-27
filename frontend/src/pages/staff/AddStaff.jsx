import React, { useState } from "react";
import { User, Mail, Phone, Lock, Calendar, Clock, ShieldCheck, Image as ImageIcon } from "lucide-react";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Dropdown from "../../components/ui/Dropdown";
import { STAFF_ROLES, STAFF_SHIFTS } from "../../data/staff";

/**
 * Smart POS - Add Staff Member Modal Component
 */
export default function AddStaff({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Waiter",
    shift: "Evening (04:00 PM - 12:00 AM)",
    password: "",
    confirmPassword: "",
    joinDate: new Date().toISOString().split("T")[0],
    status: "Active",
    salary: "35,000",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80",
  });

  const [errors, setErrors] = useState({});

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
    if (formData.password && formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newStaff = {
      id: `st-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      role: formData.role,
      shift: formData.shift,
      joinDate: formData.joinDate,
      status: formData.status,
      salary: formData.salary,
      avatar: formData.avatar,
      ordersHandled: 0,
    };

    onSave(newStaff);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Staff Member"
      subtitle="Create an employee profile with role permissions and shift timings"
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
            Add Staff Member
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
                Profile Photo Web Link
              </h4>
              <p className="text-[11px] text-text-muted">
                Paste an image URL for the staff avatar badge
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
            placeholder="e.g. Usman Ali"
            error={errors.name}
            required
          />

          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. 0300-1234567"
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
            placeholder="e.g. usman@smartpos.com"
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
            type="date"
            value={formData.joinDate}
            onChange={handleChange}
          />

          <Input
            label="Monthly Salary (Rs.)"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="e.g. 45,000"
          />
        </div>

        {/* Passwords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Login Password (Optional)"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.confirmPassword}
          />
        </div>

      </form>
    </Modal>
  );
}
