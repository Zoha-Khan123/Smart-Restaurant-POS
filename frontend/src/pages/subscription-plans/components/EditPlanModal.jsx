import React, { useState, useEffect } from "react";
import { Layers, DollarSign, Sliders, ShieldCheck } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Dropdown from "../../../components/ui/Dropdown";
import PlanFeatureEditor from "./PlanFeatureEditor";

export default function EditPlanModal({
  isOpen,
  onClose,
  plan,
  onUpdatePlan,
}) {
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
    features: {},
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || "",
        tagline: plan.tagline || "",
        status: plan.status || "Active",
        monthlyPrice: plan.monthlyPrice !== undefined ? plan.monthlyPrice.toString() : "",
        yearlyPrice: plan.yearlyPrice !== undefined ? plan.yearlyPrice.toString() : "",
        maxBranches: plan.maxBranches !== undefined ? plan.maxBranches.toString() : "1",
        maxUsers: plan.maxUsers !== undefined ? plan.maxUsers.toString() : "3",
        maxStaff: plan.maxStaff !== undefined ? plan.maxStaff.toString() : "5",
        maxOrdersPerMonth: plan.maxOrdersPerMonth || "1,500",
        isPopular: Boolean(plan.isPopular),
        features: plan.features || {},
      });
      setErrors({});
    }
  }, [plan]);

  if (!isOpen || !plan) return null;

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

    const updatedPlan = {
      ...plan,
      name: formData.name.trim(),
      tagline: formData.tagline.trim(),
      monthlyPrice: Number(formData.monthlyPrice),
      yearlyPrice: formData.yearlyPrice
        ? Number(formData.yearlyPrice)
        : Math.round(Number(formData.monthlyPrice) * 10),
      status: formData.status,
      maxBranches: formData.maxBranches,
      maxUsers: formData.maxUsers,
      maxStaff: formData.maxStaff,
      maxOrdersPerMonth: formData.maxOrdersPerMonth,
      features: formData.features,
      updatedAt: "Today",
    };

    onUpdatePlan(updatedPlan);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Subscription Plan: ${plan.name}`}
      subtitle="Modify plan rates, hardware limits, and included features"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Plan Changes
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* 1. Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Plan Name *"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            error={errors.name}
            icon={Layers}
            required
          />

          <Dropdown
            label="Availability Status"
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
              value={formData.monthlyPrice}
              onChange={(e) =>
                setFormData({ ...formData, monthlyPrice: e.target.value })
              }
              error={errors.monthlyPrice}
              icon={DollarSign}
              required
            />

            <Input
              label="Yearly Rate ($ USD)"
              type="number"
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
              value={formData.maxBranches}
              onChange={(e) =>
                setFormData({ ...formData, maxBranches: e.target.value })
              }
            />

            <Input
              label="Max Admin Users"
              value={formData.maxUsers}
              onChange={(e) =>
                setFormData({ ...formData, maxUsers: e.target.value })
              }
            />

            <Input
              label="Max Staff"
              value={formData.maxStaff}
              onChange={(e) =>
                setFormData({ ...formData, maxStaff: e.target.value })
              }
            />

            <Input
              label="Max Orders / Mo"
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
