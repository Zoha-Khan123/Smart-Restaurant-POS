import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  PackageCheck,
  AlertTriangle,
  PackageX,
  Boxes,
  CheckCircle2,
  ArrowUpDown,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { INVENTORY_CATEGORIES, INITIAL_INVENTORY } from "../../data/inventory";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Dropdown from "../../components/ui/Dropdown";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/common/ConfirmModal";

/**
 * Smart POS - Stock Management Page (Fully Mobile Responsive)
 */
export default function Stock() {
  // State: Inventory Records
  const [stockItems, setStockItems] = useState(INITIAL_INVENTORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [adjustingItem, setAdjustingItem] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Stock Adjustment Form State
  const [adjustmentType, setAdjustmentType] = useState("add"); // 'add' | 'remove'
  const [adjustmentQty, setAdjustmentQty] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("");

  // Add Item Form State
  const [newStockData, setNewStockData] = useState({
    name: "",
    sku: `ING-${Math.floor(100 + Math.random() * 900)}`,
    category: "Poultry & Meat",
    stock: "",
    unit: "KG",
    minStock: "",
    costPerUnit: "",
    supplier: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Metrics Calculation
  const metrics = useMemo(() => {
    const total = stockItems.length;
    const inStock = stockItems.filter((i) => i.status === "In Stock").length;
    const lowStock = stockItems.filter((i) => i.status === "Low Stock").length;
    const outOfStock = stockItems.filter((i) => i.status === "Out of Stock").length;
    return { total, inStock, lowStock, outOfStock };
  }, [stockItems]);

  // Filtered List
  const filteredItems = useMemo(() => {
    return stockItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "All Categories" ||
        item.category === selectedCategory;
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [stockItems, selectedCategory, statusFilter, searchQuery]);

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------

  const handleOpenAdjust = (item) => {
    setAdjustingItem(item);
    setAdjustmentType("add");
    setAdjustmentQty("");
    setAdjustmentReason("");
  };

  const handleSaveAdjustment = (e) => {
    e.preventDefault();
    const qty = parseFloat(adjustmentQty);
    if (!qty || qty <= 0) {
      alert("Please enter a valid positive quantity to adjust.");
      return;
    }

    setStockItems((prev) =>
      prev.map((item) => {
        if (item.id === adjustingItem.id) {
          let newStock =
            adjustmentType === "add"
              ? item.stock + qty
              : Math.max(0, item.stock - qty);

          let newStatus = "In Stock";
          if (newStock === 0) {
            newStatus = "Out of Stock";
          } else if (newStock <= item.minStock) {
            newStatus = "Low Stock";
          }

          return {
            ...item,
            stock: Number(newStock.toFixed(2)),
            status: newStatus,
            lastUpdated: "Just now",
          };
        }
        return item;
      })
    );

    showToast(
      `Stock adjusted for "${adjustingItem.name}" (${
        adjustmentType === "add" ? "+" : "-"
      }${qty} ${adjustingItem.unit})`
    );
    setAdjustingItem(null);
  };

  const handleSaveNewStock = (e) => {
    e.preventDefault();
    const errs = {};
    if (!newStockData.name.trim()) errs.name = "Item name is required";
    if (!newStockData.stock || Number(newStockData.stock) < 0)
      errs.stock = "Initial stock is required";
    if (!newStockData.minStock || Number(newStockData.minStock) <= 0)
      errs.minStock = "Minimum stock threshold is required";

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    const stockNum = parseFloat(newStockData.stock);
    const minNum = parseFloat(newStockData.minStock);

    let status = "In Stock";
    if (stockNum === 0) status = "Out of Stock";
    else if (stockNum <= minNum) status = "Low Stock";

    const newItem = {
      id: `inv-${Date.now()}`,
      name: newStockData.name.trim(),
      sku: newStockData.sku.trim(),
      category: newStockData.category,
      stock: stockNum,
      unit: newStockData.unit,
      minStock: minNum,
      costPerUnit: parseFloat(newStockData.costPerUnit) || 100,
      supplier: newStockData.supplier.trim() || "Local Wholesaler",
      lastUpdated: "Just now",
      status: status,
    };

    setStockItems((prev) => [newItem, ...prev]);
    setIsAddModalOpen(false);
    setNewStockData({
      name: "",
      sku: `ING-${Math.floor(100 + Math.random() * 900)}`,
      category: "Poultry & Meat",
      stock: "",
      unit: "KG",
      minStock: "",
      costPerUnit: "",
      supplier: "",
    });
    setFormErrors({});
    showToast(`Added "${newItem.name}" to inventory!`);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingItem.name.trim()) return;

    setStockItems((prev) =>
      prev.map((i) => (i.id === editingItem.id ? editingItem : i))
    );
    showToast(`Updated "${editingItem.name}" successfully!`);
    setEditingItem(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteCandidate) return;
    setStockItems((prev) => prev.filter((i) => i.id !== deleteCandidate.id));
    showToast(`Deleted "${deleteCandidate.name}" from stock`, "info");
    setDeleteCandidate(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* =========================================================
          SUMMARY METRICS CARDS (MOBILE OPTIMIZED GRID)
      ========================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Items */}
        <button
          type="button"
          onClick={() => setStatusFilter("All")}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === "All"
              ? "bg-bg-sidebar text-text-white border-bg-sidebar shadow-xs"
              : "bg-bg-card text-text-primary border-border hover:bg-bg-hover"
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] sm:text-xs font-medium opacity-80">Total Items</span>
            <Boxes className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-70" />
          </div>
          <p className="text-xl sm:text-2xl font-bold">{metrics.total}</p>
        </button>

        {/* In Stock */}
        <button
          type="button"
          onClick={() => setStatusFilter("In Stock")}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === "In Stock"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
              : "bg-emerald-50/70 border-emerald-200 text-emerald-800 hover:bg-emerald-100/70"
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] sm:text-xs font-semibold">In Stock</span>
            <PackageCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-bold">{metrics.inStock}</p>
        </button>

        {/* Low Stock */}
        <button
          type="button"
          onClick={() => setStatusFilter("Low Stock")}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === "Low Stock"
              ? "bg-amber-600 text-white border-amber-600 shadow-xs"
              : "bg-amber-50/70 border-amber-200 text-amber-800 hover:bg-amber-100/70"
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] sm:text-xs font-semibold">Low Stock</span>
            <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-bold">{metrics.lowStock}</p>
        </button>

        {/* Out of Stock */}
        <button
          type="button"
          onClick={() => setStatusFilter("Out of Stock")}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === "Out of Stock"
              ? "bg-danger text-white border-danger shadow-xs"
              : "bg-danger-light border-danger/20 text-danger hover:bg-danger/10"
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] sm:text-xs font-semibold">Out of Stock</span>
            <PackageX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-bold">{metrics.outOfStock}</p>
        </button>
      </div>

      {/* =========================================================
          HEADER CONTROLS & FILTER BAR (RESPONSIVE WRAPPING)
      ========================================================== */}
      <div className="bg-bg-card rounded-2xl p-3.5 sm:p-4 border border-border shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stock item, SKU, or supplier..."
            className="w-full pl-10 pr-4 py-2.5 bg-bg-main border border-border rounded-xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
          />
        </div>

        {/* Category Filter & Add Stock CTA */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:flex-initial min-w-[150px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl bg-bg-main border border-border text-text-primary font-semibold text-xs cursor-pointer focus:outline-none focus:border-primary"
            >
              {INVENTORY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-[10px]">
              ▼
            </div>
          </div>

          <Button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="py-2.5 px-3.5 sm:px-4 text-xs font-bold gap-1.5 shadow-sm shrink-0 whitespace-nowrap justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Add Stock Item</span>
          </Button>
        </div>
      </div>

      {/* =========================================================
          MOBILE VIEW: STOCK CARDS LIST (VISIBLE ON SCREENS < 768px)
      ========================================================== */}
      <div className="block md:hidden space-y-3">
        {filteredItems.map((item) => {
          const isInStock = item.status === "In Stock";
          const isLowStock = item.status === "Low Stock";
          const isOutOfStock = item.status === "Out of Stock";

          return (
            <div
              key={item.id}
              className="bg-bg-card rounded-2xl p-4 border border-border shadow-xs space-y-3"
            >
              {/* Header: Title, SKU & Status Badge */}
              <div className="flex items-start justify-between gap-2 border-b border-border-light pb-2.5">
                <div>
                  <h4 className="font-bold text-text-primary text-sm leading-snug">
                    {item.name}
                  </h4>
                  <p className="text-[11px] font-mono text-text-muted mt-0.5">
                    {item.sku} • {item.category}
                  </p>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                    isInStock
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : isLowStock
                      ? "bg-amber-50 text-amber-700 border-amber-200 animate-pulse"
                      : "bg-danger-light text-danger border-danger/20"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isInStock
                        ? "bg-emerald-500"
                        : isLowStock
                        ? "bg-amber-500"
                        : "bg-danger"
                    }`}
                  />
                  <span>{item.status}</span>
                </span>
              </div>

              {/* Body: Current Stock & Minimum Threshold */}
              <div className="grid grid-cols-2 gap-2 bg-bg-main p-2.5 rounded-xl border border-border text-xs">
                <div>
                  <span className="text-[10px] text-text-muted block font-medium">
                    Available Stock
                  </span>
                  <span
                    className={`font-bold text-sm ${
                      isOutOfStock
                        ? "text-danger"
                        : isLowStock
                        ? "text-amber-600"
                        : "text-emerald-700"
                    }`}
                  >
                    {item.stock} {item.unit}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-text-muted block font-medium">
                    Min. Alert Level
                  </span>
                  <span className="font-semibold text-text-primary text-xs">
                    {item.minStock} {item.unit}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-text-muted flex justify-between items-center">
                <span>Supplier: {item.supplier}</span>
                <span>{item.lastUpdated}</span>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-border-light flex items-center justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenAdjust(item)}
                  className="py-1.5 px-3 text-xs font-semibold gap-1.5 flex-1 justify-center"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
                  <span>Adjust Stock</span>
                </Button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingItem(item)}
                    className="p-2 rounded-lg text-text-secondary hover:text-text-primary bg-bg-main border border-border cursor-pointer transition-colors"
                    title="Edit Item"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteCandidate(item)}
                    className="p-2 rounded-lg text-danger hover:bg-danger-light bg-bg-main border border-border cursor-pointer transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="py-12 text-center bg-bg-card rounded-2xl border border-border p-6 text-text-muted">
            <Boxes className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-semibold text-text-primary">
              No inventory records found
            </p>
            <p className="text-xs text-text-muted mt-1">
              Try searching with another keyword.
            </p>
          </div>
        )}
      </div>

      {/* =========================================================
          DESKTOP & TABLET VIEW: STOCK DATA TABLE (SCREENS >= 768px)
      ========================================================== */}
      <div className="hidden md:block bg-bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-bg-main border-b border-border text-text-muted uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Item Name</th>
                <th className="px-5 py-3.5">SKU</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5 text-center">Unit</th>
                <th className="px-5 py-3.5 text-center">Current Stock</th>
                <th className="px-5 py-3.5 text-center">Min. Alert</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light text-text-primary">
              {filteredItems.map((item) => {
                const isInStock = item.status === "In Stock";
                const isLowStock = item.status === "Low Stock";
                const isOutOfStock = item.status === "Out of Stock";

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-bg-hover/80 transition-colors"
                  >
                    {/* Name & Supplier */}
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="font-bold text-text-primary text-xs sm:text-sm">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-text-muted">
                          Supplier: {item.supplier}
                        </p>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="px-5 py-3.5 font-mono text-[11px] text-text-secondary whitespace-nowrap">
                      {item.sku}
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="font-medium text-text-secondary">
                        {item.category}
                      </span>
                    </td>

                    {/* Unit */}
                    <td className="px-5 py-3.5 text-center font-semibold text-text-secondary">
                      {item.unit}
                    </td>

                    {/* Stock Value */}
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      <span
                        className={`text-sm font-bold ${
                          isOutOfStock
                            ? "text-danger"
                            : isLowStock
                            ? "text-amber-600"
                            : "text-emerald-700"
                        }`}
                      >
                        {item.stock} {item.unit}
                      </span>
                    </td>

                    {/* Min Stock */}
                    <td className="px-5 py-3.5 text-center text-text-muted font-medium whitespace-nowrap">
                      {item.minStock} {item.unit}
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          isInStock
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : isLowStock
                            ? "bg-amber-50 text-amber-700 border-amber-200 animate-pulse"
                            : "bg-danger-light text-danger border-danger/20"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isInStock
                              ? "bg-emerald-500"
                              : isLowStock
                              ? "bg-amber-500"
                              : "bg-danger"
                          }`}
                        />
                        <span>{item.status}</span>
                      </span>
                    </td>

                    {/* Actions (Adjust, Edit, Delete) */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenAdjust(item)}
                          className="p-1.5 rounded-lg text-primary hover:bg-primary-light transition-colors cursor-pointer"
                          title="Adjust Stock"
                        >
                          <ArrowUpDown className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingItem(item)}
                          className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer"
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
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="py-16 text-center text-text-muted">
            <Boxes className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-semibold text-text-primary">
              No inventory records found
            </p>
            <p className="text-xs text-text-muted mt-1">
              Try adjusting the category filter or searching with a different term.
            </p>
          </div>
        )}
      </div>

      {/* =========================================================
          MODAL: STOCK ADJUSTMENT
      ========================================================== */}
      {adjustingItem && (
        <Modal
          isOpen={Boolean(adjustingItem)}
          onClose={() => setAdjustingItem(null)}
          title={`Adjust Stock: ${adjustingItem.name}`}
          subtitle={`Current Stock: ${adjustingItem.stock} ${adjustingItem.unit}`}
          size="md"
          footer={
            <>
              <button
                type="button"
                onClick={() => setAdjustingItem(null)}
                className="px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-bg-hover rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <Button
                type="button"
                onClick={handleSaveAdjustment}
                className="py-2.5 px-6 text-xs font-bold"
              >
                Confirm Adjustment
              </Button>
            </>
          }
        >
          <form onSubmit={handleSaveAdjustment} className="space-y-4">
            
            {/* Adjustment Type Tabs */}
            <div>
              <label className="text-xs font-medium text-text-primary mb-1.5 block">
                Adjustment Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustmentType("add")}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    adjustmentType === "add"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs"
                      : "border-border bg-bg-main text-text-secondary hover:bg-bg-hover"
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">Add Stock (Restock)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdjustmentType("remove")}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    adjustmentType === "remove"
                      ? "border-danger bg-danger-light text-danger shadow-xs"
                      : "border-border bg-bg-main text-text-secondary hover:bg-bg-hover"
                  }`}
                >
                  <TrendingDown className="w-4 h-4 text-danger shrink-0" />
                  <span className="truncate">Remove (Wastage)</span>
                </button>
              </div>
            </div>

            {/* Quantity Input */}
            <Input
              label={`Quantity to ${
                adjustmentType === "add" ? "Add" : "Deduct"
              } (${adjustingItem.unit})`}
              type="number"
              value={adjustmentQty}
              onChange={(e) => setAdjustmentQty(e.target.value)}
              placeholder="e.g. 5.0"
              required
              autoFocus
            />

            {/* Reason */}
            <div>
              <label className="text-xs font-medium text-text-primary mb-1.5 block">
                Reason / Note (Optional)
              </label>
              <input
                type="text"
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                placeholder="e.g. Received new shipment from supplier / Daily kitchen usage"
                className="w-full text-xs px-3.5 py-2.5 bg-bg-card border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
              />
            </div>

            {/* Live New Stock Result Box */}
            {adjustmentQty && Number(adjustmentQty) > 0 && (
              <div className="p-3 rounded-xl bg-bg-main border border-border flex justify-between items-center text-xs">
                <span className="text-text-muted">New Stock Level:</span>
                <span className="font-extrabold text-sm text-text-primary">
                  {adjustmentType === "add"
                    ? (adjustingItem.stock + parseFloat(adjustmentQty)).toFixed(2)
                    : Math.max(
                        0,
                        adjustingItem.stock - parseFloat(adjustmentQty)
                      ).toFixed(2)}{" "}
                  {adjustingItem.unit}
                </span>
              </div>
            )}
          </form>
        </Modal>
      )}

      {/* =========================================================
          MODAL: ADD NEW STOCK ITEM
      ========================================================== */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Stock Item"
          subtitle="Add raw ingredient or packaged item to inventory"
          size="lg"
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
                onClick={handleSaveNewStock}
                className="py-2.5 px-6 text-xs font-bold"
              >
                Save Stock Item
              </Button>
            </>
          }
        >
          <form onSubmit={handleSaveNewStock} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Item Name"
                value={newStockData.name}
                onChange={(e) =>
                  setNewStockData((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Chicken Boneless"
                error={formErrors.name}
                required
              />

              <Input
                label="SKU / Barcode"
                value={newStockData.sku}
                onChange={(e) =>
                  setNewStockData((p) => ({ ...p, sku: e.target.value }))
                }
                placeholder="e.g. ING-CHK-01"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Dropdown
                label="Category"
                value={newStockData.category}
                onChange={(e) =>
                  setNewStockData((p) => ({ ...p, category: e.target.value }))
                }
                options={INVENTORY_CATEGORIES.filter(
                  (c) => c !== "All Categories"
                )}
              />

              <div>
                <label className="text-xs font-medium text-text-primary mb-1.5 block">
                  Measurement Unit
                </label>
                <select
                  value={newStockData.unit}
                  onChange={(e) =>
                    setNewStockData((p) => ({ ...p, unit: e.target.value }))
                  }
                  className="w-full text-sm px-3.5 py-2.5 bg-bg-card border border-border rounded-lg"
                >
                  <option value="KG">KG (Kilograms)</option>
                  <option value="Grams">Grams</option>
                  <option value="Pcs">Pcs (Pieces)</option>
                  <option value="Liters">Liters</option>
                  <option value="Packets">Packets</option>
                  <option value="Bottles">Bottles</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <Input
                label="Initial Stock Quantity"
                type="number"
                value={newStockData.stock}
                onChange={(e) =>
                  setNewStockData((p) => ({ ...p, stock: e.target.value }))
                }
                placeholder="e.g. 20"
                error={formErrors.stock}
                required
              />

              <Input
                label="Min. Stock Alert Level"
                type="number"
                value={newStockData.minStock}
                onChange={(e) =>
                  setNewStockData((p) => ({ ...p, minStock: e.target.value }))
                }
                placeholder="e.g. 5"
                error={formErrors.minStock}
                required
              />

              <Input
                label="Cost Per Unit (Rs.)"
                type="number"
                value={newStockData.costPerUnit}
                onChange={(e) =>
                  setNewStockData((p) => ({ ...p, costPerUnit: e.target.value }))
                }
                placeholder="e.g. 750"
              />
            </div>

            <Input
              label="Supplier Name"
              value={newStockData.supplier}
              onChange={(e) =>
                setNewStockData((p) => ({ ...p, supplier: e.target.value }))
              }
              placeholder="e.g. Al-Raza Poultry Farms"
            />
          </form>
        </Modal>
      )}

      {/* =========================================================
          MODAL: EDIT STOCK ITEM
      ========================================================== */}
      {editingItem && (
        <Modal
          isOpen={Boolean(editingItem)}
          onClose={() => setEditingItem(null)}
          title={`Edit Stock Item: ${editingItem.name}`}
          subtitle="Update supplier, SKU, threshold, or unit cost"
          size="lg"
          footer={
            <>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-bg-hover rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <Button
                type="button"
                onClick={handleSaveEdit}
                className="py-2.5 px-6 text-xs font-bold"
              >
                Update Item
              </Button>
            </>
          }
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Item Name"
                value={editingItem.name}
                onChange={(e) =>
                  setEditingItem((p) => ({ ...p, name: e.target.value }))
                }
                required
              />

              <Input
                label="SKU"
                value={editingItem.sku}
                onChange={(e) =>
                  setEditingItem((p) => ({ ...p, sku: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <Dropdown
                label="Category"
                value={editingItem.category}
                onChange={(e) =>
                  setEditingItem((p) => ({ ...p, category: e.target.value }))
                }
                options={INVENTORY_CATEGORIES.filter(
                  (c) => c !== "All Categories"
                )}
              />

              <Input
                label={`Min. Alert (${editingItem.unit})`}
                type="number"
                value={editingItem.minStock}
                onChange={(e) =>
                  setEditingItem((p) => ({
                    ...p,
                    minStock: parseFloat(e.target.value) || 0,
                  }))
                }
              />

              <Input
                label="Cost Per Unit (Rs.)"
                type="number"
                value={editingItem.costPerUnit}
                onChange={(e) =>
                  setEditingItem((p) => ({
                    ...p,
                    costPerUnit: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>

            <Input
              label="Supplier"
              value={editingItem.supplier}
              onChange={(e) =>
                setEditingItem((p) => ({ ...p, supplier: e.target.value }))
              }
            />
          </form>
        </Modal>
      )}

      {/* =========================================================
          MODAL: CONFIRM DELETE
      ========================================================== */}
      <ConfirmModal
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Stock Item"
        message={`Are you sure you want to remove "${deleteCandidate?.name}" from your inventory tracking?`}
        confirmText="Delete Stock Item"
        variant="danger"
      />

      {/* =========================================================
          TOAST NOTIFICATION
      ========================================================== */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl text-white text-xs font-semibold flex items-center gap-2 ${
              toastMessage.type === "info" ? "bg-amber-600" : "bg-emerald-600"
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
