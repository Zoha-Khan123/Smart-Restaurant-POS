import React, { useState } from "react";
import { Plus, Edit2, Trash2, Layers, CheckCircle2 } from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";

/**
 * Initial Sample Categories Data
 */
const INITIAL_CATEGORIES = [
  { id: "cat-1", name: "Burgers", itemCount: 4, status: true },
  { id: "cat-2", name: "Pizza", itemCount: 2, status: true },
  { id: "cat-3", name: "Drinks", itemCount: 2, status: true },
  { id: "cat-4", name: "Sides", itemCount: 2, status: true },
  { id: "cat-5", name: "Coffee", itemCount: 2, status: true },
  { id: "cat-6", name: "Desserts", itemCount: 1, status: true },
];

/**
 * Smart POS - Categories Management Component (Mobile Responsive)
 */
export default function Categories() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleStatus = (id) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: !c.status } : c))
    );
    showToast("Category status updated");
  };

  const handleOpenAdd = () => {
    setCategoryName("");
    setError("");
    setEditingCategory(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setCategoryName(cat.name);
    setError("");
    setEditingCategory(cat);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast("Category deleted");
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id ? { ...c, name: categoryName.trim() } : c
        )
      );
      showToast("Category updated successfully");
    } else {
      const newCat = {
        id: `cat-${Date.now()}`,
        name: categoryName.trim(),
        itemCount: 0,
        status: true,
      };
      setCategories((prev) => [...prev, newCat]);
      showToast(`Category "${newCat.name}" added`);
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-bg-card p-3.5 sm:p-4 rounded-2xl border border-border shadow-xs">
        <div>
          <h3 className="text-base font-bold text-text-primary">
            Menu Categories ({categories.length})
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Organize dishes into menu sections for fast POS ordering
          </p>
        </div>

        <Button
          type="button"
          onClick={handleOpenAdd}
          className="py-2.5 px-4 text-xs font-semibold gap-1.5 shadow-sm justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </Button>
      </div>

      {/* MOBILE VIEW: CATEGORY CARDS (SCREENS < 768px) */}
      <div className="block md:hidden space-y-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-bg-card rounded-2xl p-4 border border-border shadow-xs flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold text-xs shrink-0">
                <Layers className="w-5 h-5" />
              </div>

              <div>
                <h4 className="font-bold text-sm text-text-primary">
                  {cat.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="primary">{cat.itemCount} items</Badge>
                  <span
                    className={`text-[11px] font-semibold ${
                      cat.status ? "text-emerald-700" : "text-text-muted"
                    }`}
                  >
                    {cat.status ? "Active" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions & Switch */}
            <div className="flex items-center gap-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={cat.status}
                  onChange={() => handleToggleStatus(cat.id)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>

              <button
                type="button"
                onClick={() => handleOpenEdit(cat)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-primary bg-bg-main border border-border cursor-pointer transition-colors"
                title="Edit Category"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleDelete(cat.id)}
                className="p-1.5 rounded-lg text-danger hover:bg-danger-light bg-bg-main border border-border cursor-pointer transition-colors"
                title="Delete Category"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP & TABLET VIEW: CATEGORIES TABLE (SCREENS >= 768px) */}
      <div className="hidden md:block bg-bg-card rounded-2xl border border-border overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-bg-main border-b border-border text-text-muted uppercase text-[10px] font-bold tracking-wider">
            <tr>
              <th className="px-5 py-3.5">Category Name</th>
              <th className="px-5 py-3.5 text-center">Items Count</th>
              <th className="px-5 py-3.5 text-center">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light text-text-primary">
            {categories.map((cat) => (
              <tr
                key={cat.id}
                className="hover:bg-bg-hover transition-colors"
              >
                <td className="px-5 py-4 font-bold text-text-primary flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center font-bold text-xs">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span>{cat.name}</span>
                </td>

                <td className="px-5 py-4 text-center">
                  <Badge variant="primary">{cat.itemCount} items</Badge>
                </td>

                <td className="px-5 py-4 text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cat.status}
                      onChange={() => handleToggleStatus(cat.id)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </td>

                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-bg-main transition-colors cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id)}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-danger hover:bg-danger-light transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Category Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={editingCategory ? "Edit Category" : "Add New Category"}
          subtitle="Configure category display name in menu"
          size="sm"
          footer={
            <>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-bg-hover rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <Button
                type="button"
                onClick={handleSave}
                className="py-2 px-5 text-xs font-bold"
              >
                {editingCategory ? "Update Category" : "Save Category"}
              </Button>
            </>
          }
        >
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Category Name"
              placeholder="e.g. Pasta & Noodles"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              error={error}
              required
              autoFocus
            />
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
