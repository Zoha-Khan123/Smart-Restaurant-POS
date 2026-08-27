import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Users,
  Award,
  DollarSign,
  UserCheck,
  Phone,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { CUSTOMER_STATUSES, INITIAL_CUSTOMERS } from "../../data/customers";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Dropdown from "../../components/ui/Dropdown";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/common/ConfirmModal";
import CustomerDetails from "./CustomerDetails";

/**
 * Smart POS - Customers Directory Page (Fully Mobile Responsive)
 */
export default function Customers() {
  // State: Customers List
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Active Selected Customer for Profile View
  const [viewingCustomerId, setViewingCustomerId] = useState(null);

  // Modals State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    status: "Regular",
    loyaltyPoints: 0,
    notes: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Active viewing customer derived from list
  const activeViewingCustomer = useMemo(() => {
    if (!viewingCustomerId) return null;
    return customers.find((c) => c.id === viewingCustomerId) || null;
  }, [customers, viewingCustomerId]);

  // Metrics Calculation
  const metrics = useMemo(() => {
    const total = customers.length;
    const vip = customers.filter((c) => c.status === "VIP").length;
    const regular = customers.filter((c) => c.status === "Regular").length;
    const totalSpend = customers.reduce((sum, c) => sum + (c.totalSpend || 0), 0);
    return { total, vip, regular, totalSpend };
  }, [customers]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      const matchesStatus =
        selectedStatus === "All" || cust.status === selectedStatus;
      const matchesSearch =
        cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cust.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cust.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cust.address &&
          cust.address.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [customers, selectedStatus, searchQuery]);

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      status: "Regular",
      loyaltyPoints: 50,
      notes: "",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cust) => {
    setEditingCustomer(cust);
    setFormData({
      name: cust.name,
      phone: cust.phone,
      email: cust.email || "",
      address: cust.address || "",
      status: cust.status || "Regular",
      loyaltyPoints: cust.loyaltyPoints || 0,
      notes: cust.notes || "",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.name.trim()) errs.name = "Customer name is required";
    if (!formData.phone.trim()) errs.phone = "Contact phone number is required";

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    if (editingCustomer) {
      const updated = {
        ...editingCustomer,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        status: formData.status,
        loyaltyPoints: Number(formData.loyaltyPoints) || 0,
        notes: formData.notes.trim(),
      };

      setCustomers((prev) =>
        prev.map((c) => (c.id === editingCustomer.id ? updated : c))
      );
      showToast(`Updated "${updated.name}" successfully!`);
    } else {
      const newCust = {
        id: `cust-${Date.now()}`,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        status: formData.status,
        loyaltyPoints: Number(formData.loyaltyPoints) || 50,
        totalOrders: 0,
        totalSpend: 0,
        lastVisit: "New Customer",
        customerSince: "Just now",
        notes: formData.notes.trim(),
        orderHistory: [],
      };

      setCustomers((prev) => [newCust, ...prev]);
      showToast(`Added "${newCust.name}" to directory!`);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteCandidate) return;
    const removedId = deleteCandidate.id;
    setCustomers((prev) => prev.filter((c) => c.id !== removedId));
    if (viewingCustomerId === removedId) {
      setViewingCustomerId(null);
    }
    showToast(`Removed "${deleteCandidate.name}" from directory`, "info");
    setDeleteCandidate(null);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "VIP":
        return "purple";
      case "Regular":
        return "success";
      case "New":
        return "primary";
      case "Inactive":
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* =========================================================
          VIEW 1: DETAILED CUSTOMER PROFILE
      ========================================================== */}
      {activeViewingCustomer ? (
        <CustomerDetails
          customer={activeViewingCustomer}
          onBack={() => setViewingCustomerId(null)}
          onEdit={(c) => handleOpenEdit(c)}
          onDelete={(c) => setDeleteCandidate(c)}
        />
      ) : (
        /* =========================================================
            VIEW 2: CUSTOMERS DIRECTORY LIST & METRICS
        ========================================================== */
        <>
          {/* SUMMARY METRICS CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {/* Total Customers */}
            <button
              type="button"
              onClick={() => setSelectedStatus("All")}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedStatus === "All"
                  ? "bg-bg-sidebar text-text-white border-bg-sidebar shadow-xs"
                  : "bg-bg-card text-text-primary border-border hover:bg-bg-hover"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] sm:text-xs font-medium opacity-80">
                  Total Guests
                </span>
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-70" />
              </div>
              <p className="text-xl sm:text-2xl font-bold">{metrics.total}</p>
            </button>

            {/* VIP Members */}
            <button
              type="button"
              onClick={() => setSelectedStatus("VIP")}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedStatus === "VIP"
                  ? "bg-purple-700 text-white border-purple-700 shadow-xs"
                  : "bg-purple-50/70 border-purple-200 text-purple-800 hover:bg-purple-100/70"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] sm:text-xs font-semibold">VIP Members</span>
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <p className="text-xl sm:text-2xl font-bold">{metrics.vip}</p>
            </button>

            {/* Regular Patrons */}
            <button
              type="button"
              onClick={() => setSelectedStatus("Regular")}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedStatus === "Regular"
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                  : "bg-emerald-50/70 border-emerald-200 text-emerald-800 hover:bg-emerald-100/70"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] sm:text-xs font-semibold">Regular Patrons</span>
                <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <p className="text-xl sm:text-2xl font-bold">{metrics.regular}</p>
            </button>

            {/* Total Member Revenue */}
            <div className="p-3.5 sm:p-4 rounded-2xl border bg-bg-card border-border">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] sm:text-xs font-medium text-text-muted">
                  Member Revenue
                </span>
                <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-emerald-600">
                Rs. {metrics.totalSpend.toLocaleString()}
              </p>
            </div>
          </div>

          {/* HEADER CONTROLS & FILTER BAR */}
          <div className="bg-bg-card rounded-2xl p-3.5 sm:p-4 border border-border shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
              <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer name, phone, email, or address..."
                className="w-full pl-10 pr-4 py-2.5 bg-bg-main border border-border rounded-xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
              />
            </div>

            {/* Status Dropdown & Add Customer CTA */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              <div className="relative flex-1 sm:flex-initial min-w-[140px]">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-xl bg-bg-main border border-border text-text-primary font-semibold text-xs cursor-pointer focus:outline-none focus:border-primary"
                >
                  {CUSTOMER_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st === "All" ? "All Statuses" : `${st} Tier`}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-[10px]">
                  ▼
                </div>
              </div>

              <Button
                type="button"
                onClick={handleOpenAdd}
                className="py-2.5 px-4 text-xs font-bold gap-1.5 shadow-sm shrink-0 whitespace-nowrap justify-center"
              >
                <Plus className="w-4 h-4" />
                <span>Add Customer</span>
              </Button>
            </div>
          </div>

          {/* MOBILE VIEW: CUSTOMER CARDS (SCREENS < 768px) */}
          <div className="block md:hidden space-y-3">
            {filteredCustomers.map((cust) => {
              const initials = cust.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={cust.id}
                  className="bg-bg-card rounded-2xl p-4 border border-border shadow-xs space-y-3"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-border-light pb-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                        {initials}
                      </div>
                      <div>
                        <h4
                          onClick={() => setViewingCustomerId(cust.id)}
                          className="font-bold text-text-primary text-sm hover:text-primary transition-colors cursor-pointer"
                        >
                          {cust.name}
                        </h4>
                        <p className="text-[11px] text-text-muted flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-text-muted" />
                          <span>{cust.phone}</span>
                        </p>
                      </div>
                    </div>

                    <Badge variant={getStatusBadgeVariant(cust.status)}>
                      {cust.status}
                    </Badge>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 bg-bg-main p-2.5 rounded-xl border border-border text-center text-xs">
                    <div>
                      <span className="text-[10px] text-text-muted block font-medium">
                        Orders
                      </span>
                      <span className="font-bold text-text-primary text-xs">
                        {cust.totalOrders}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-text-muted block font-medium">
                        Total Spent
                      </span>
                      <span className="font-bold text-emerald-600 text-xs">
                        Rs. {cust.totalSpend?.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-text-muted block font-medium">
                        Points
                      </span>
                      <span className="font-bold text-purple-700 text-xs">
                        {cust.loyaltyPoints || 0}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-border-light flex items-center justify-between gap-2">
                    <Button
                      type="button"
                      onClick={() => setViewingCustomerId(cust.id)}
                      className="py-1.5 px-3 text-xs font-semibold gap-1.5 flex-1 justify-center"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Profile & History</span>
                    </Button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cust)}
                        className="p-2 rounded-lg text-text-secondary hover:text-primary bg-bg-main border border-border cursor-pointer transition-colors"
                        title="Edit Customer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteCandidate(cust)}
                        className="p-2 rounded-lg text-danger hover:bg-danger-light bg-bg-main border border-border cursor-pointer transition-colors"
                        title="Delete Customer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredCustomers.length === 0 && (
              <div className="py-12 text-center bg-bg-card rounded-2xl border border-border p-6 text-text-muted">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-semibold text-text-primary">
                  No customers found
                </p>
                <p className="text-xs text-text-muted mt-1">
                  Try searching with another phone or customer name.
                </p>
              </div>
            )}
          </div>

          {/* DESKTOP & TABLET VIEW: CUSTOMERS TABLE (SCREENS >= 768px) */}
          <div className="hidden md:block bg-bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[750px]">
                <thead className="bg-bg-main border-b border-border text-text-muted uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Customer</th>
                    <th className="px-5 py-3.5">Contact Info</th>
                    <th className="px-5 py-3.5 text-center">Orders</th>
                    <th className="px-5 py-3.5 text-right">Total Spending</th>
                    <th className="px-5 py-3.5">Last Visit</th>
                    <th className="px-5 py-3.5 text-center">Tier</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light text-text-primary">
                  {filteredCustomers.map((cust) => {
                    const initials = cust.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <tr
                        key={cust.id}
                        className="hover:bg-bg-hover/80 transition-colors"
                      >
                        {/* Customer Name & Avatar */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-primary text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                              {initials}
                            </div>
                            <div>
                              <p
                                onClick={() => setViewingCustomerId(cust.id)}
                                className="font-bold text-text-primary text-xs sm:text-sm hover:text-primary cursor-pointer transition-colors"
                              >
                                {cust.name}
                              </p>
                              <p className="text-[11px] text-text-muted line-clamp-1 max-w-[200px]">
                                {cust.address || "Member"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Contact Info */}
                        <td className="px-5 py-3.5">
                          <div>
                            <p className="font-semibold text-text-primary">
                              {cust.phone}
                            </p>
                            <p className="text-[11px] text-text-muted">
                              {cust.email || "—"}
                            </p>
                          </div>
                        </td>

                        {/* Orders Count */}
                        <td className="px-5 py-3.5 text-center whitespace-nowrap">
                          <span className="font-bold text-text-primary text-xs">
                            {cust.totalOrders}
                          </span>
                        </td>

                        {/* Spending */}
                        <td className="px-5 py-3.5 text-right font-bold text-emerald-600 whitespace-nowrap text-xs sm:text-sm">
                          Rs. {cust.totalSpend?.toLocaleString()}
                        </td>

                        {/* Last Visit */}
                        <td className="px-5 py-3.5 text-text-muted whitespace-nowrap text-xs">
                          {cust.lastVisit}
                        </td>

                        {/* Status Badge */}
                        <td className="px-5 py-3.5 text-center whitespace-nowrap">
                          <Badge variant={getStatusBadgeVariant(cust.status)}>
                            {cust.status}
                          </Badge>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setViewingCustomerId(cust.id)}
                              className="p-1.5 rounded-lg text-primary hover:bg-primary-light transition-colors cursor-pointer"
                              title="View Profile & Orders"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEdit(cust)}
                              className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer"
                              title="Edit Customer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteCandidate(cust)}
                              className="p-1.5 rounded-lg text-text-secondary hover:text-danger hover:bg-danger-light transition-colors cursor-pointer"
                              title="Delete Customer"
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

            {filteredCustomers.length === 0 && (
              <div className="py-16 text-center text-text-muted">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-semibold text-text-primary">
                  No customers found
                </p>
                <p className="text-xs text-text-muted mt-1">
                  Try adjusting your search query or status filter.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* =========================================================
          GLOBAL MODAL: ADD / EDIT CUSTOMER
      ========================================================== */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingCustomer ? `Edit: ${editingCustomer.name}` : "Add New Customer"}
          subtitle="Configure customer profile, tier, and contact details"
          size="lg"
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
                onClick={handleSaveCustomer}
                className="py-2.5 px-6 text-xs font-bold"
              >
                {editingCustomer ? "Update Customer" : "Save Customer"}
              </Button>
            </>
          }
        >
          <form onSubmit={handleSaveCustomer} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Zainab Shah"
                error={formErrors.name}
                required
              />

              <Input
                label="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, phone: e.target.value }))
                }
                placeholder="e.g. 0300-1234567"
                error={formErrors.phone}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Email Address (Optional)"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="e.g. zainab@gmail.com"
              />

              <div>
                <label className="text-xs font-medium text-text-primary mb-1.5 block">
                  Customer Status / Tier
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, status: e.target.value }))
                  }
                  className="w-full text-sm px-3.5 py-2.5 bg-bg-card border border-border rounded-lg"
                >
                  <option value="Regular">Regular Customer</option>
                  <option value="VIP">VIP Gold Member</option>
                  <option value="New">New Registered Guest</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <Input
              label="Delivery Address"
              value={formData.address}
              onChange={(e) =>
                setFormData((p) => ({ ...p, address: e.target.value }))
              }
              placeholder="e.g. House 42-B, Street 12, F-7/2, Islamabad"
            />

            <div>
              <label className="text-xs font-medium text-text-primary mb-1.5 block">
                Special Preferences / Dining Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, notes: e.target.value }))
                }
                rows={2}
                placeholder="e.g. Prefers window table, allergic to mushrooms, extra spice..."
                className="w-full text-xs p-3 bg-bg-card border border-border rounded-xl placeholder:text-text-muted text-text-primary focus:outline-none focus:border-primary resize-none"
              />
            </div>
          </form>
        </Modal>
      )}

      {/* =========================================================
          GLOBAL MODAL: CONFIRM DELETE
      ========================================================== */}
      <ConfirmModal
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete "${deleteCandidate?.name}" from your customer directory?`}
        confirmText="Delete Customer"
        variant="danger"
      />

      {/* =========================================================
          TOAST FEEDBACK
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
