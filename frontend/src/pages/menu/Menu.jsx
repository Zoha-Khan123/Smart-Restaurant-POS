import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Utensils,
  Layers,
  SlidersHorizontal,
  CheckCircle2,
} from "lucide-react";
import { PRODUCTS } from "../../data/products";
import { CATEGORIES } from "../../data/categories";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import ConfirmModal from "../../components/common/ConfirmModal";
import AddMenuItem from "./AddMenuItem";
import EditMenuItem from "./EditMenuItem";
import Categories from "./Categories";
import Modifiers from "./Modifiers";

/**
 * Smart POS - Menu Management Screen (Fully Mobile Responsive)
 */
export default function Menu() {
  // Navigation Tabs: 'items' | 'categories' | 'modifiers'
  const [activeTab, setActiveTab] = useState("items");

  // Items State & Filters
  const [menuItems, setMenuItems] = useState(
    PRODUCTS.map((p) => ({ ...p, status: p.status !== false }))
  );
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Filtered Menu Items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: menuItems.length };
    CATEGORIES.forEach((cat) => {
      if (cat !== "All") {
        counts[cat] = menuItems.filter(
          (m) => m.category.toLowerCase() === cat.toLowerCase()
        ).length;
      }
    });
    return counts;
  }, [menuItems]);

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------

  const handleToggleStatus = (itemId) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, status: !item.status } : item
      )
    );
    showToast("Menu item availability updated");
  };

  const handleSaveNewItem = (newItem) => {
    setMenuItems((prev) => [newItem, ...prev]);
    showToast(`Added "${newItem.name}" to menu!`);
  };

  const handleUpdateItem = (updatedItem) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    showToast(`Updated "${updatedItem.name}" successfully!`);
  };

  const handleConfirmDelete = () => {
    if (!deleteCandidate) return;
    setMenuItems((prev) => prev.filter((item) => item.id !== deleteCandidate.id));
    showToast(`Removed "${deleteCandidate.name}" from menu`, "info");
    setDeleteCandidate(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* =========================================================
          TOP BAR: TITLE & MODULE TABS (ITEMS / CATEGORIES / MODIFIERS)
      ========================================================== */}
      <div className="bg-bg-card rounded-2xl p-3.5 sm:p-5 border border-border shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Module Sub-tabs (Swipeable on Mobile) */}
        <div className="bg-bg-main p-1 rounded-xl border border-border flex items-center gap-1 shrink-0 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("items")}
            className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "items"
                ? "bg-bg-card text-primary shadow-xs"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Menu Items ({menuItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "categories"
                ? "bg-bg-card text-primary shadow-xs"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Categories</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("modifiers")}
            className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "modifiers"
                ? "bg-bg-card text-primary shadow-xs"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Modifiers & Add-ons</span>
          </button>
        </div>

        {/* Action Button (Add Item) */}
        {activeTab === "items" && (
          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto py-2.5 px-4 text-xs font-bold gap-1.5 shadow-sm justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>Add Menu Item</span>
            </Button>
          </div>
        )}
      </div>

      {/* =========================================================
          TAB 1: MENU ITEMS VIEW (RESPONSIVE BLUEPRINT)
      ========================================================== */}
      {activeTab === "items" && (
        <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start">
          
          {/* MOBILE ONLY: HORIZONTAL SWIPEABLE CATEGORIES PILLS */}
          <div className="block lg:hidden overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                const count = categoryCounts[cat] || 0;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                      isActive
                        ? "bg-primary text-text-white border-primary shadow-xs"
                        : "bg-bg-card text-text-secondary border-border hover:bg-bg-hover"
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-bg-main text-text-muted"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DESKTOP ONLY: LEFT SIDEBAR CATEGORY LIST (3 COLS) */}
          <div className="hidden lg:block lg:col-span-3 bg-bg-card rounded-2xl p-4 border border-border shadow-xs space-y-1.5">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider px-3 py-2">
              Categories
            </h4>

            <div className="space-y-1">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                const count = categoryCounts[cat] || 0;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary text-text-white shadow-xs"
                        : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-md font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-bg-main border border-border text-text-muted"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE: SEARCH & MENU ITEMS (9 COLS) */}
          <div className="lg:col-span-9 space-y-4">
            
            {/* Search Bar */}
            <div className="bg-bg-card p-3 rounded-2xl border border-border shadow-xs">
              <div className="relative">
                <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search item by name or category..."
                  className="w-full pl-10 pr-4 py-2 bg-bg-main border border-border rounded-xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* =========================================================
                MOBILE VIEW: MENU ITEM CARDS (SCREENS < 768px)
            ========================================================== */}
            <div className="block md:hidden space-y-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-bg-card rounded-2xl p-4 border border-border shadow-xs space-y-3"
                >
                  {/* Top: Image, Name, Category & Price */}
                  <div className="flex items-start gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover bg-bg-main border border-border shrink-0 shadow-2xs"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80";
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-text-primary text-sm leading-tight truncate">
                          {item.name}
                        </h4>
                        <span className="font-bold text-primary text-sm whitespace-nowrap">
                          Rs. {item.price.toLocaleString()}
                        </span>
                      </div>

                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-bg-main text-[10px] font-semibold text-text-secondary border border-border">
                        {item.category}
                      </span>

                      <p className="text-[11px] text-text-muted line-clamp-1 mt-1">
                        {item.description || "Freshly prepared POS item"}
                      </p>
                    </div>
                  </div>

                  {/* Bottom: Status Switch & Action Buttons */}
                  <div className="pt-3 border-t border-border-light flex items-center justify-between">
                    {/* Status Toggle with clear label */}
                    <div className="flex items-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.status}
                          onChange={() => handleToggleStatus(item.id)}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                      <span
                        className={`text-xs font-semibold ${
                          item.status ? "text-emerald-700" : "text-text-muted"
                        }`}
                      >
                        {item.status ? "Available" : "Disabled"}
                      </span>
                    </div>

                    {/* Edit & Delete Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingItem(item)}
                        className="px-2.5 py-1.5 rounded-lg text-text-secondary hover:text-text-primary bg-bg-main border border-border text-xs font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-primary" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteCandidate(item)}
                        className="p-1.5 rounded-lg text-danger hover:bg-danger-light bg-bg-main border border-border cursor-pointer"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredItems.length === 0 && (
                <div className="py-12 text-center bg-bg-card rounded-2xl border border-border p-6 text-text-muted">
                  <Utensils className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-semibold text-text-primary">
                    No menu items found
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    Try switching categories or adjusting your search.
                  </p>
                </div>
              )}
            </div>

            {/* =========================================================
                DESKTOP & TABLET VIEW: DATA TABLE (SCREENS >= 768px)
            ========================================================== */}
            <div className="hidden md:block bg-bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead className="bg-bg-main border-b border-border text-text-muted uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Item Name</th>
                      <th className="px-5 py-3.5">Category</th>
                      <th className="px-5 py-3.5">Price</th>
                      <th className="px-5 py-3.5 text-center">Status</th>
                      <th className="px-5 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light text-text-primary">
                    {filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-bg-hover/80 transition-colors"
                      >
                        {/* Item Name + Thumbnail */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-11 h-11 rounded-xl object-cover bg-bg-main border border-border shrink-0 shadow-2xs"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80";
                              }}
                            />
                            <div>
                              <p className="font-bold text-text-primary text-xs sm:text-sm leading-tight">
                                {item.name}
                              </p>
                              <p className="text-[11px] text-text-muted line-clamp-1 mt-0.5">
                                {item.description || "Freshly prepared POS item"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="font-medium text-text-secondary">
                            {item.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="font-bold text-text-primary text-xs sm:text-sm">
                            Rs. {item.price.toLocaleString()}
                          </span>
                        </td>

                        {/* Status Toggle Switch */}
                        <td className="px-5 py-3.5 text-center whitespace-nowrap">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.status}
                              onChange={() => handleToggleStatus(item.id)}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                          </label>
                        </td>

                        {/* Action Icons */}
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingItem(item)}
                              className="p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-bg-main transition-colors cursor-pointer"
                              title="Edit Item"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteCandidate(item)}
                              className="p-1.5 rounded-lg text-text-secondary hover:text-danger hover:bg-danger-light transition-colors cursor-pointer"
                              title="Delete Item"
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

              {filteredItems.length === 0 && (
                <div className="py-12 text-center text-text-muted">
                  <Utensils className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-semibold text-text-primary">
                    No menu items found
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    Try switching categories or adjusting your search term.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* =========================================================
          TAB 2: CATEGORIES VIEW
      ========================================================== */}
      {activeTab === "categories" && <Categories />}

      {/* =========================================================
          TAB 3: MODIFIERS & ADD-ONS VIEW
      ========================================================== */}
      {activeTab === "modifiers" && <Modifiers />}

      {/* =========================================================
          MODAL: ADD MENU ITEM (SCREEN 8)
      ========================================================== */}
      <AddMenuItem
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewItem}
      />

      {/* =========================================================
          MODAL: EDIT MENU ITEM
      ========================================================== */}
      <EditMenuItem
        item={editingItem}
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        onUpdate={handleUpdateItem}
      />

      {/* =========================================================
          MODAL: CONFIRM DELETE
      ========================================================== */}
      <ConfirmModal
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Menu Item"
        message={`Are you sure you want to delete "${deleteCandidate?.name}"? This item will no longer appear on POS terminals.`}
        confirmText="Delete Item"
        variant="danger"
      />

      {/* =========================================================
          TOAST FEEDBACK NOTIFICATION
      ========================================================== */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl text-white text-xs font-semibold flex items-center gap-2 ${
              toastMessage.type === "info"
                ? "bg-amber-600"
                : toastMessage.type === "error"
                ? "bg-danger"
                : "bg-emerald-600"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

    </div>
  );
}
