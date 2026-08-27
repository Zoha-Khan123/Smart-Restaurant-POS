import React, { useState } from "react";
import { Plus, Edit2, Trash2, SlidersHorizontal, CheckCircle2 } from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";

/**
 * Initial Sample Modifiers Data
 */
const INITIAL_MODIFIER_GROUPS = [
  {
    id: "mod-1",
    name: "Burger Size / Portion",
    type: "Single Choice (Required)",
    options: [
      { name: "Single Patty", price: 0 },
      { name: "Double Patty", price: 150 },
    ],
    status: true,
  },
  {
    id: "mod-2",
    name: "Pizza Crust & Sizes",
    type: "Single Choice (Required)",
    options: [
      { name: "Small (8-inch)", price: -200 },
      { name: "Medium (11-inch)", price: 0 },
      { name: "Large (14-inch)", price: 350 },
      { name: "Cheese Burst Crust", price: 180 },
    ],
    status: true,
  },
  {
    id: "mod-3",
    name: "Extra Toppings & Dips",
    type: "Multiple Choice (Optional)",
    options: [
      { name: "Extra Cheese Slice", price: 50 },
      { name: "Spicy Garlic Dip", price: 40 },
      { name: "Jalapenos", price: 30 },
      { name: "Crispy Bacon / Beef Strip", price: 120 },
    ],
    status: true,
  },
  {
    id: "mod-4",
    name: "Beverage Add-ons",
    type: "Multiple Choice (Optional)",
    options: [
      { name: "Whipped Cream", price: 50 },
      { name: "Vanilla Ice Cream Scoop", price: 70 },
    ],
    status: true,
  },
];

/**
 * Smart POS - Modifiers Management Component
 */
export default function Modifiers() {
  const [groups, setGroups] = useState(INITIAL_MODIFIER_GROUPS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [selectionType, setSelectionType] = useState("Multiple Choice (Optional)");
  const [options, setOptions] = useState([
    { name: "", price: 0 },
    { name: "", price: 0 },
  ]);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleStatus = (id) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: !g.status } : g))
    );
    showToast("Modifier status updated");
  };

  const handleOpenAdd = () => {
    setGroupName("");
    setSelectionType("Multiple Choice (Optional)");
    setOptions([
      { name: "", price: 0 },
      { name: "", price: 0 },
    ]);
    setError("");
    setEditingGroup(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (group) => {
    setGroupName(group.name);
    setSelectionType(group.type);
    setOptions(group.options || []);
    setError("");
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this modifier group?")) {
      setGroups((prev) => prev.filter((g) => g.id !== id));
      showToast("Modifier group removed");
    }
  };

  const handleOptionChange = (idx, field, value) => {
    setOptions((prev) => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        [field]: field === "price" ? parseFloat(value) || 0 : value,
      };
      return updated;
    });
  };

  const handleAddOptionRow = () => {
    setOptions((prev) => [...prev, { name: "", price: 0 }]);
  };

  const handleRemoveOptionRow = (idx) => {
    setOptions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }

    const validOptions = options.filter((o) => o.name.trim().length > 0);
    if (validOptions.length === 0) {
      setError("At least one modifier option is required");
      return;
    }

    if (editingGroup) {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === editingGroup.id
            ? {
                ...g,
                name: groupName.trim(),
                type: selectionType,
                options: validOptions,
              }
            : g
        )
      );
      showToast("Modifier group updated");
    } else {
      const newGrp = {
        id: `mod-${Date.now()}`,
        name: groupName.trim(),
        type: selectionType,
        options: validOptions,
        status: true,
      };
      setGroups((prev) => [...prev, newGrp]);
      showToast(`Modifier "${newGrp.name}" added`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between bg-bg-card p-4 rounded-2xl border border-border shadow-xs">
        <div>
          <h3 className="text-base font-bold text-text-primary">
            Modifier Groups ({groups.length})
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Configure sizes, extra toppings, sauces, and customizable dish options
          </p>
        </div>

        <Button
          type="button"
          onClick={handleOpenAdd}
          className="py-2.5 px-4 text-xs font-semibold gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Modifier Group</span>
        </Button>
      </div>

      {/* Modifier Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-bg-card p-5 rounded-2xl border border-border shadow-xs flex flex-col justify-between space-y-4 hover:border-primary/40 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2 border-b border-border-light pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-text-primary">
                      {group.name}
                    </h4>
                    <span className="text-[11px] text-text-muted font-medium">
                      {group.type}
                    </span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={group.status}
                    onChange={() => handleToggleStatus(group.id)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Options Pills */}
              <div className="mt-4 space-y-2">
                <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                  Options ({group.options.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.options.map((opt, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-bg-main border border-border text-xs font-semibold text-text-primary flex items-center gap-1.5"
                    >
                      <span>{opt.name}</span>
                      <span className="text-primary font-bold">
                        {opt.price > 0
                          ? `+Rs. ${opt.price}`
                          : opt.price < 0
                          ? `-Rs. ${Math.abs(opt.price)}`
                          : "Free"}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-border-light flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleOpenEdit(group)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-bg-hover transition-colors cursor-pointer text-xs font-medium flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(group.id)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-danger hover:bg-danger-light transition-colors cursor-pointer text-xs font-medium flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modifier Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingGroup ? "Edit Modifier Group" : "Add Modifier Group"}
          subtitle="Configure customizable options and extra pricing"
          size="md"
          footer={
            <>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-bg-hover rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <Button
                type="button"
                onClick={handleSave}
                className="py-2 px-5 text-xs font-bold"
              >
                {editingGroup ? "Update Group" : "Save Group"}
              </Button>
            </>
          }
        >
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Modifier Group Name"
              placeholder="e.g. Cheese & Toppings"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              error={error}
              required
            />

            <div>
              <label className="text-xs font-medium text-text-primary mb-1.5 block">
                Selection Rule
              </label>
              <select
                value={selectionType}
                onChange={(e) => setSelectionType(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 bg-bg-card border border-border rounded-lg"
              >
                <option value="Single Choice (Required)">
                  Single Choice (Required) — e.g. Portion Size
                </option>
                <option value="Multiple Choice (Optional)">
                  Multiple Choice (Optional) — e.g. Extra Add-ons
                </option>
              </select>
            </div>

            {/* Options List Builder */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  Options & Extra Price
                </label>
                <button
                  type="button"
                  onClick={handleAddOptionRow}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  + Add Option Row
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={opt.name}
                      onChange={(e) =>
                        handleOptionChange(idx, "name", e.target.value)
                      }
                      placeholder="Option name (e.g. Extra Mayo)"
                      className="flex-1 text-xs px-3 py-2 bg-bg-main border border-border rounded-lg"
                    />
                    <div className="w-28 relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-text-muted">
                        Rs.
                      </span>
                      <input
                        type="number"
                        value={opt.price}
                        onChange={(e) =>
                          handleOptionChange(idx, "price", e.target.value)
                        }
                        placeholder="0"
                        className="w-full text-xs pl-8 pr-2 py-2 bg-bg-main border border-border rounded-lg font-bold"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveOptionRow(idx)}
                      disabled={options.length <= 1}
                      className="p-2 text-danger hover:bg-danger-light rounded-lg disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Feedback Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="px-4 py-3 rounded-xl shadow-xl text-white text-xs font-semibold bg-emerald-600 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}
