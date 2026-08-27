import React, { useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Dropdown from "../../components/ui/Dropdown";
import { CATEGORIES } from "../../data/categories";

/**
 * Smart POS - Add Menu Item Modal Component (Screen 8 Reference)
 */
export default function AddMenuItem({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "Burgers",
    price: "",
    cost: "",
    description: "",
    prepTime: "15",
    sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    status: true,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Item name is required";
    if (!formData.price || Number(formData.price) <= 0)
      errs.price = "Valid selling price is required";
    if (!formData.cost || Number(formData.cost) <= 0)
      errs.cost = "Cost price is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newItem = {
      id: `p-${Date.now()}`,
      name: formData.name.trim(),
      category: formData.category,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      description: formData.description.trim(),
      prepTime: formData.prepTime,
      sku: formData.sku,
      status: formData.status,
      image: formData.image,
      hasModifiers: false,
    };

    onSave(newItem);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Menu Item"
      subtitle="Configure a new dish or drink for your POS menu"
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
            Save Item
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Top: Image Upload & Preview Section */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-bg-main border border-border">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-bg-card border border-border shrink-0 shadow-xs">
            <img
              src={formData.image}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80";
              }}
            />
          </div>

          <div className="flex-1 w-full text-center sm:text-left space-y-2">
            <div>
              <h4 className="text-xs font-bold text-text-primary">
                Dish Image URL / Photo
              </h4>
              <p className="text-[11px] text-text-muted">
                Paste an image web URL or use realistic default photography
              </p>
            </div>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full text-xs px-3 py-2 bg-bg-card border border-border rounded-lg placeholder:text-text-muted text-text-primary focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Item Name & Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Item Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Zinger Burger"
            error={errors.name}
            required
          />

          <Dropdown
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={CATEGORIES.filter((c) => c !== "All")}
          />
        </div>

        {/* Price & Cost Price Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Selling Price (Rs.)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g. 450"
            error={errors.price}
            required
          />

          <Input
            label="Cost Price (Rs.)"
            name="cost"
            type="number"
            value={formData.cost}
            onChange={handleChange}
            placeholder="e.g. 250"
            error={errors.cost}
            required
          />
        </div>

        {/* Prep Time & SKU */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Est. Prep Time (Minutes)"
            name="prepTime"
            type="number"
            value={formData.prepTime}
            onChange={handleChange}
            placeholder="e.g. 15"
          />

          <Input
            label="Item SKU / Barcode"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="e.g. SKU-1024"
          />
        </div>

        {/* Description Textarea */}
        <div>
          <label className="text-xs font-medium text-text-primary mb-1.5 block">
            Item Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Crispy patty with signature sauce and fresh vegetables..."
            className="w-full text-xs p-3 bg-bg-card border border-border rounded-xl placeholder:text-text-muted text-text-primary focus:outline-none focus:border-primary resize-none"
          />
        </div>

        {/* Active Availability Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-bg-main border border-border">
          <div>
            <p className="text-xs font-bold text-text-primary">
              Available in Menu (Active Status)
            </p>
            <p className="text-[11px] text-text-muted">
              When toggled off, this item cannot be ordered in the POS
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      </form>
    </Modal>
  );
}
