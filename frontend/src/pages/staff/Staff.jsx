import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Users,
  ShieldCheck,
  UserCheck,
  UserX,
  Phone,
  Mail,
  Clock,
  Calendar,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  STAFF_ROLES,
  INITIAL_STAFF,
} from "../../data/staff";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import ConfirmModal from "../../components/common/ConfirmModal";
import AddStaff from "./AddStaff";
import EditStaff from "./EditStaff";

/**
 * Smart POS - Staff Management Dashboard (Fully Responsive)
 */
export default function Staff() {
  // Staff State & Filters
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Metrics Calculation
  const metrics = useMemo(() => {
    const total = staffList.length;
    const active = staffList.filter((s) => s.status === "Active").length;
    const inactive = staffList.filter((s) => s.status === "Inactive").length;
    const managers = staffList.filter(
      (s) => s.role === "Admin" || s.role === "Manager"
    ).length;
    return { total, active, inactive, managers };
  }, [staffList]);

  // Filtered List
  const filteredStaff = useMemo(() => {
    return staffList.filter((st) => {
      const matchesRole =
        selectedRole === "All Roles" || st.role === selectedRole;
      const matchesStatus =
        statusFilter === "All" || st.status === statusFilter;
      const matchesSearch =
        st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [staffList, selectedRole, statusFilter, searchQuery]);

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------

  const handleToggleStatus = (staffId) => {
    setStaffList((prev) =>
      prev.map((st) => {
        if (st.id === staffId) {
          const newStatus = st.status === "Active" ? "Inactive" : "Active";
          return { ...st, status: newStatus };
        }
        return st;
      })
    );
    showToast("Staff duty status toggled");
  };

  const handleSaveNewStaff = (newStaff) => {
    setStaffList((prev) => [newStaff, ...prev]);
    showToast(`Added "${newStaff.name}" (${newStaff.role}) to staff!`);
  };

  const handleUpdateStaff = (updatedStaff) => {
    setStaffList((prev) =>
      prev.map((st) => (st.id === updatedStaff.id ? updatedStaff : st))
    );
    showToast(`Updated "${updatedStaff.name}" successfully!`);
  };

  const handleConfirmDelete = () => {
    if (!deleteCandidate) return;
    setStaffList((prev) => prev.filter((st) => st.id !== deleteCandidate.id));
    showToast(`Removed "${deleteCandidate.name}" from staff accounts`, "info");
    setDeleteCandidate(null);
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "Admin":
        return "purple";
      case "Manager":
        return "primary";
      case "Kitchen Staff":
        return "warning";
      case "Cashier":
        return "success";
      case "Waiter":
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* =========================================================
          SUMMARY METRICS CARDS
      ========================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Staff */}
        <button
          type="button"
          onClick={() => {
            setSelectedRole("All Roles");
            setStatusFilter("All");
          }}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === "All" && selectedRole === "All Roles"
              ? "bg-bg-sidebar text-text-white border-bg-sidebar shadow-xs"
              : "bg-bg-card text-text-primary border-border hover:bg-bg-hover"
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] sm:text-xs font-medium opacity-80">
              Total Staff
            </span>
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-70" />
          </div>
          <p className="text-xl sm:text-2xl font-bold">{metrics.total}</p>
        </button>

        {/* Active Staff */}
        <button
          type="button"
          onClick={() => setStatusFilter("Active")}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === "Active"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
              : "bg-emerald-50/70 border-emerald-200 text-emerald-800 hover:bg-emerald-100/70"
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] sm:text-xs font-semibold">
              Active on Duty
            </span>
            <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-bold">{metrics.active}</p>
        </button>

        {/* Inactive Staff */}
        <button
          type="button"
          onClick={() => setStatusFilter("Inactive")}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === "Inactive"
              ? "bg-danger text-white border-danger shadow-xs"
              : "bg-danger-light border-danger/20 text-danger hover:bg-danger/10"
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] sm:text-xs font-semibold">
              Off Duty / Inactive
            </span>
            <UserX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-bold">{metrics.inactive}</p>
        </button>

        {/* Managers & Admins */}
        <button
          type="button"
          onClick={() => setSelectedRole("Manager")}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedRole === "Manager"
              ? "bg-purple-700 text-white border-purple-700 shadow-xs"
              : "bg-purple-50/70 border-purple-200 text-purple-800 hover:bg-purple-100/70"
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] sm:text-xs font-semibold">
              Managers & Admins
            </span>
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-bold">{metrics.managers}</p>
        </button>
      </div>

      {/* =========================================================
          HEADER CONTROLS & MULTI-FILTER BAR
      ========================================================== */}
      <div className="bg-bg-card rounded-2xl p-3.5 sm:p-4 border border-border shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search staff name, role, email, or phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-bg-main border border-border rounded-xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
          />
        </div>

        {/* Role & Add Staff CTA */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:flex-initial min-w-[140px]">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-xl bg-bg-main border border-border text-text-primary font-semibold text-xs cursor-pointer focus:outline-none focus:border-primary"
            >
              {STAFF_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
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
            className="py-2.5 px-4 text-xs font-bold gap-1.5 shadow-sm shrink-0 whitespace-nowrap justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff Member</span>
          </Button>
        </div>
      </div>

      {/* =========================================================
          MOBILE VIEW: STAFF CARDS (SCREENS < 768px)
      ========================================================== */}
      <div className="block md:hidden space-y-3">
        {filteredStaff.map((staff) => {
          const isActive = staff.status === "Active";

          return (
            <div
              key={staff.id}
              className="bg-bg-card rounded-2xl p-4 border border-border shadow-xs space-y-3"
            >
              {/* Top: Avatar, Name & Role */}
              <div className="flex items-start justify-between gap-2 border-b border-border-light pb-2.5">
                <div className="flex items-center gap-3">
                  <img
                    src={staff.avatar}
                    alt={staff.name}
                    className="w-11 h-11 rounded-xl object-cover bg-bg-main border border-border shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80";
                    }}
                  />
                  <div>
                    <h4 className="font-bold text-text-primary text-sm leading-tight">
                      {staff.name}
                    </h4>
                    <p className="text-[11px] text-text-muted flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-text-muted" />
                      <span>{staff.email}</span>
                    </p>
                  </div>
                </div>

                <Badge variant={getRoleBadgeVariant(staff.role)}>
                  {staff.role}
                </Badge>
              </div>

              {/* Body: Contact & Shift Info */}
              <div className="grid grid-cols-2 gap-2 bg-bg-main p-2.5 rounded-xl border border-border text-xs">
                <div>
                  <span className="text-[10px] text-text-muted block font-medium">
                    Phone
                  </span>
                  <span className="font-semibold text-text-primary text-xs">
                    {staff.phone}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-text-muted block font-medium">
                    Joined
                  </span>
                  <span className="text-text-secondary text-xs">
                    {staff.joinDate}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-text-muted flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">{staff.shift}</span>
              </div>

              {/* Bottom: Status Switch & Action Buttons */}
              <div className="pt-2.5 border-t border-border-light flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => handleToggleStatus(staff.id)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                  <span
                    className={`text-xs font-semibold ${
                      isActive ? "text-emerald-700" : "text-text-muted"
                    }`}
                  >
                    {staff.status}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditingStaff(staff)}
                    className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary bg-bg-main border border-border cursor-pointer transition-colors"
                    title="Edit Staff"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteCandidate(staff)}
                    className="p-1.5 rounded-lg text-danger hover:bg-danger-light bg-bg-main border border-border cursor-pointer transition-colors"
                    title="Delete Staff"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredStaff.length === 0 && (
          <div className="py-12 text-center bg-bg-card rounded-2xl border border-border p-6 text-text-muted">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-semibold text-text-primary">
              No staff members found
            </p>
            <p className="text-xs text-text-muted mt-1">
              Try adjusting the role filter or search keyword.
            </p>
          </div>
        )}
      </div>

      {/* =========================================================
          DESKTOP & TABLET VIEW: STAFF TABLE (SCREENS >= 768px)
      ========================================================== */}
      <div className="hidden md:block bg-bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[780px]">
            <thead className="bg-bg-main border-b border-border text-text-muted uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Staff Member</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Contact Details</th>
                <th className="px-5 py-3.5">Assigned Shift</th>
                <th className="px-5 py-3.5">Joining Date</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light text-text-primary">
              {filteredStaff.map((staff) => {
                const isActive = staff.status === "Active";

                return (
                  <tr
                    key={staff.id}
                    className="hover:bg-bg-hover/80 transition-colors"
                  >
                    {/* Name & Avatar */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={staff.avatar}
                          alt={staff.name}
                          className="w-10 h-10 rounded-xl object-cover bg-bg-main border border-border shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80";
                          }}
                        />
                        <div>
                          <p className="font-bold text-text-primary text-xs sm:text-sm">
                            {staff.name}
                          </p>
                          <p className="text-[11px] text-text-muted">
                            Salary: Rs. {staff.salary}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <Badge variant={getRoleBadgeVariant(staff.role)}>
                        {staff.role}
                      </Badge>
                    </td>

                    {/* Contact Info */}
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="font-semibold text-text-primary">
                          {staff.phone}
                        </p>
                        <p className="text-[11px] text-text-muted">
                          {staff.email}
                        </p>
                      </div>
                    </td>

                    {/* Assigned Shift */}
                    <td className="px-5 py-3.5 text-text-secondary whitespace-nowrap text-[11px] font-medium">
                      {staff.shift}
                    </td>

                    {/* Joining Date */}
                    <td className="px-5 py-3.5 text-text-muted whitespace-nowrap text-xs">
                      {staff.joinDate}
                    </td>

                    {/* Status Toggle Switch */}
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={() => handleToggleStatus(staff.id)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                        <span
                          className={`text-[11px] font-semibold ${
                            isActive ? "text-emerald-700" : "text-text-muted"
                          }`}
                        >
                          {staff.status}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingStaff(staff)}
                          className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer"
                          title="Edit Staff Member"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteCandidate(staff)}
                          className="p-1.5 rounded-lg text-text-secondary hover:text-danger hover:bg-danger-light transition-colors cursor-pointer"
                          title="Delete Staff Member"
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

        {filteredStaff.length === 0 && (
          <div className="py-16 text-center text-text-muted">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-semibold text-text-primary">
              No staff members found
            </p>
            <p className="text-xs text-text-muted mt-1">
              Try adjusting your search query or role filter.
            </p>
          </div>
        )}
      </div>

      {/* =========================================================
          MODAL: ADD STAFF MEMBER
      ========================================================== */}
      <AddStaff
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewStaff}
      />

      {/* =========================================================
          MODAL: EDIT STAFF MEMBER
      ========================================================== */}
      <EditStaff
        staff={editingStaff}
        isOpen={Boolean(editingStaff)}
        onClose={() => setEditingStaff(null)}
        onUpdate={handleUpdateStaff}
      />

      {/* =========================================================
          MODAL: CONFIRM DELETE
      ========================================================== */}
      <ConfirmModal
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Staff Account"
        message={`Are you sure you want to remove "${deleteCandidate?.name}" (${deleteCandidate?.role})? They will lose POS login access.`}
        confirmText="Delete Account"
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
