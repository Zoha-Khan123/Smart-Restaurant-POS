import React, { useState } from "react";
import { Layers, DollarSign, Sliders, ShieldCheck } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Dropdown from "../../../components/ui/Dropdown";
import PlanFeatureEditor from "./PlanFeatureEditor";

export default function AddPlanModal({ isOpen, onClose, onAddPlan }) {
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    status: "Active",
    monthlyPrice: "",
    yearlyPrice: "",
    maxBranches: "1",
    maxUsers: "3",
    maxStaff: "5",
    maxOrdersPerMonth: "1,500",
    isPopular: false,
    features: {
      pos: true,
      orders: true,
      tables: false,
      kot: false,
      billing: true,
      inventory: false,
      customers: false,
      reports: true,
      staff: false,
      multiBranch: false,
      analytics: false,
      apiAccess: false,
      prioritySupport: false,
    },
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Plan name is required";
    if (!formData.monthlyPrice || Number(formData.monthlyPrice) <= 0) {
      errs.monthlyPrice = "Monthly price must be greater than 0";
    }
    if (formData.yearlyPrice && Number(formData.yearlyPrice) < 0) {
      errs.yearlyPrice = "Yearly price cannot be negative";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const monthly = Number(formData.monthlyPrice);
    const yearly = formData.yearlyPrice
      ? Number(formData.yearlyPrice)
      : Math.round(monthly * 10);

    const newPlan = {
      id: `plan-${formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`,
      name: formData.name.trim(),
      tagline: formData.tagline.trim() || "Custom tailored multi-tenant subscription package.",
      monthlyPrice: monthly,
      yearlyPrice: yearly,
      status: formData.status,
      badgeVariant: "primary",
      colorTheme: "blue",
      isPopular: Boolean(formData.isPopular),
      maxBranches: formData.maxBranches || 1,
      maxUsers: formData.maxUsers || 3,
      maxStaff: formData.maxStaff || 5,
      maxOrdersPerMonth: formData.maxOrdersPerMonth || "1,500",
      restaurantsCount: 0,
      features: formData.features,
      createdAt: "Today",
      updatedAt: "Today",
    };

    onAddPlan(newPlan);
    onClose();
    // Reset
    setFormData({
      name: "",
      tagline: "",
      status: "Active",
      monthlyPrice: "",
      yearlyPrice: "",
      maxBranches: "1",
      maxUsers: "3",
      maxStaff: "5",
      maxOrdersPerMonth: "1,500",
      isPopular: false,
      features: {
        pos: true,
        orders: true,
        tables: false,
        kot: false,
        billing: true,
        inventory: false,
        customers: false,
        reports: true,
        staff: false,
        multiBranch: false,
        analytics: false,
        apiAccess: false,
        prioritySupport: false,
      },
    });
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Subscription Plan"
      subtitle="Define pricing tiers, hardware limits, and feature entitlements"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create Subscription Plan
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* 1. Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Plan Name *"
            placeholder="e.g. Enterprise Pro"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            error={errors.name}
            icon={Layers}
            required
          />

          <Dropdown
            label="Initial Availability Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            options={[
              { label: "Active (Available for Assignment)", value: "Active" },
              { label: "Inactive (Draft Mode)", value: "Inactive" },
            ]}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-text-primary mb-1.5 block">
            Plan Description & Tagline
          </label>
          <textarea
            rows={2}
            placeholder="Briefly describe target restaurant size and value proposition..."
            value={formData.tagline}
            onChange={(e) =>
              setFormData({ ...formData, tagline: e.target.value })
            }
            className="w-full text-xs sm:text-sm p-3 rounded-xl bg-bg-main border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
          />
        </div>

        {/* 2. Pricing Configuration */}
        <div className="pt-2 border-t border-border">
          <p className="text-xs font-bold text-text-primary mb-3 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-primary" />
            <span>Pricing & Billing Tiers</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Monthly Rate ($ USD) *"
              type="number"
              placeholder="e.g. 79"
              value={formData.monthlyPrice}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({
                  ...formData,
                  monthlyPrice: val,
                  yearlyPrice: val ? Math.round(Number(val) * 10).toString() : "",
                });
              }}
              error={errors.monthlyPrice}
              icon={DollarSign}
              required
            />

            <Input
              label="Yearly Rate ($ USD)"
              type="number"
              placeholder="e.g. 790 (Annual discount)"
              value={formData.yearlyPrice}
              onChange={(e) =>
                setFormData({ ...formData, yearlyPrice: e.target.value })
              }
              error={errors.yearlyPrice}
              icon={DollarSign}
            />
          </div>
        </div>

        {/* 3. Limits Configuration */}
        <div className="pt-2 border-t border-border">
          <p className="text-xs font-bold text-text-primary mb-3 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-primary" />
            <span>Resource Limitations</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              label="Max Branches"
              placeholder="e.g. 3 or Unlimited"
              value={formData.maxBranches}
              onChange={(e) =>
                setFormData({ ...formData, maxBranches: e.target.value })
              }
            />

            <Input
              label="Max Admin Users"
              placeholder="e.g. 10"
              value={formData.maxUsers}
              onChange={(e) =>
                setFormData({ ...formData, maxUsers: e.target.value })
              }
            />

            <Input
              label="Max Staff"
              placeholder="e.g. 25"
              value={formData.maxStaff}
              onChange={(e) =>
                setFormData({ ...formData, maxStaff: e.target.value })
              }
            />

            <Input
              label="Max Orders / Mo"
              placeholder="e.g. 10,000"
              value={formData.maxOrdersPerMonth}
              onChange={(e) =>
                setFormData({ ...formData, maxOrdersPerMonth: e.target.value })
              }
            />
          </div>
        </div>

        {/* 4. Features Selection */}
        <div className="pt-2 border-t border-border">
          <PlanFeatureEditor
            features={formData.features}
            onChange={(newFeatures) =>
              setFormData({ ...formData, features: newFeatures })
            }
          />
        </div>
      </form>
    </Modal>
  );
}
