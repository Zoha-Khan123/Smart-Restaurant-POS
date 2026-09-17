import React, { useState, useMemo } from "react";
import { Plus, RefreshCw, CheckCircle2, AlertCircle, Users as UsersIcon } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import Loader from "../../components/ui/Loader";

import UserStats from "./components/UserStats";
import UserFilters from "./components/UserFilters";
import UsersTable from "./components/UsersTable";
import AddUserModal from "./components/AddUserModal";
import EditUserModal from "./components/EditUserModal";
import UserDetailsModal from "./components/UserDetailsModal";
import ConfirmStatusModal from "./components/ConfirmStatusModal";
import ConfirmActionModal from "./components/ConfirmActionModal";

import { INITIAL_USERS_DATA, calculateUserStats } from "../../data/users";
import { INITIAL_RESTAURANTS_DATA } from "../../data/restaurants";

export default function Users() {
  // Main Data States
  const [users, setUsers] = useState(INITIAL_USERS_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [restaurantFilter, setRestaurantFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Notification Toast State
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [statusModalState, setStatusModalState] = useState(null); // { user, newStatus }
  const [actionModalState, setActionModalState] = useState(null); // { user, actionType }

  // KPI Calculations
  const stats = useMemo(() => {
    return calculateUserStats(users);
  }, [users]);

  // Filtered dataset
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // 1. Search query (name, email, phone, role, restaurantName)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = u.name?.toLowerCase().includes(query);
        const matchesEmail = u.email?.toLowerCase().includes(query);
        const matchesPhone = u.phone?.toLowerCase().includes(query);
        const matchesRole = u.role?.toLowerCase().includes(query);
        const matchesRestaurant = u.restaurantName?.toLowerCase().includes(query);

        if (
          !matchesName &&
          !matchesEmail &&
          !matchesPhone &&
          !matchesRole &&
          !matchesRestaurant
        ) {
          return false;
        }
      }

      // 2. Role Filter
      if (roleFilter !== "all" && u.role !== roleFilter) {
        return false;
      }

      // 3. Restaurant Filter
      if (restaurantFilter !== "all") {
        if (restaurantFilter === "Platform" && u.role !== "Super Admin") {
          return false;
        }
        if (
          restaurantFilter !== "Platform" &&
          u.restaurantName !== restaurantFilter
        ) {
          return false;
        }
      }

      // 4. Status Filter
      if (statusFilter !== "all" && u.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [users, searchQuery, roleFilter, restaurantFilter, statusFilter]);

  // Refresh handler
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast("Users directory refreshed with latest tenant data.");
    }, 450);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setRestaurantFilter("all");
    setStatusFilter("all");
    showToast("Filters reset to default view.", "info");
  };

  // Action Handlers
  const handleAddUser = (newUser) => {
    setUsers((prev) => [newUser, ...prev]);
    showToast(`User account "${newUser.name}" provisioned successfully.`);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    showToast(`Profile for "${updatedUser.name}" updated successfully.`);
  };

  const handleChangeRole = (userId, { role }) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
    showToast(`Role updated to "${role}".`);
  };

  const handleToggleStatus = (userId, newStatus) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            status: newStatus,
          };
        }
        return u;
      })
    );
    showToast(`Account status set to "${newStatus}".`);
  };

  const handleResetPassword = (userId) => {
    const user = users.find((u) => u.id === userId);
    showToast(
      `Password reset instructions dispatched to ${user?.email || "user"}.`
    );
  };

  const handleForceLogout = (userId) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, activeSessions: 0 } : u))
    );
    showToast("Active user sessions terminated across all devices.", "warning");
  };

  const handleDeleteUser = (userId) => {
    const user = users.find((u) => u.id === userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast(
      `User account "${user?.name || userId}" was permanently deleted.`,
      "info"
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-white/10 text-xs sm:text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* 1. Page Header */}
      <PageHeader
        title="Users"
        subtitle="Manage users, roles and access across all restaurants on the platform."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              loading={isLoading}
              className="!py-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="!py-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </Button>
          </>
        }
      />

      {/* 2. User KPI Statistics */}
      <UserStats stats={stats} />

      {/* 3. Search & Filters */}
      <UserFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        roleFilter={roleFilter}
        onRoleChange={setRoleFilter}
        restaurantFilter={restaurantFilter}
        onRestaurantChange={setRestaurantFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onResetFilters={handleResetFilters}
        totalResults={users.length}
        filteredCount={filteredUsers.length}
        restaurantsList={INITIAL_RESTAURANTS_DATA}
      />

      {/* 4. Users Table / Loading / Error State */}
      {isLoading ? (
        <div className="bg-bg-card rounded-2xl p-12 border border-border shadow-xs">
          <Loader size="lg" text="Fetching platform users..." />
        </div>
      ) : hasError ? (
        <div className="bg-bg-card rounded-2xl p-8 sm:p-12 border border-border shadow-xs">
          <EmptyState
            icon={AlertCircle}
            title="Failed to Load Users"
            description="An unexpected network error occurred while retrieving user records."
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => setHasError(false)}
              >
                Retry
              </Button>
            }
          />
        </div>
      ) : (
        <UsersTable
          users={filteredUsers}
          onViewDetails={(u) => setSelectedUserDetails(u)}
          onEdit={(u) => setEditingUser(u)}
          onChangeRole={(u) =>
            setActionModalState({ user: u, actionType: "change_role" })
          }
          onToggleStatus={(u) =>
            setStatusModalState({
              user: u,
              newStatus: u.status === "Active" ? "Inactive" : "Active",
            })
          }
          onResetPassword={(u) =>
            setActionModalState({ user: u, actionType: "reset_password" })
          }
          onForceLogout={(u) =>
            setActionModalState({ user: u, actionType: "force_logout" })
          }
          onDelete={(u) =>
            setActionModalState({ user: u, actionType: "delete" })
          }
          onResetFilters={handleResetFilters}
        />
      )}

      {/* Modal: Add User */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddUser={handleAddUser}
        restaurantsList={INITIAL_RESTAURANTS_DATA}
      />

      {/* Modal: Edit User */}
      <EditUserModal
        isOpen={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        user={editingUser}
        onUpdateUser={handleUpdateUser}
        restaurantsList={INITIAL_RESTAURANTS_DATA}
      />

      {/* Modal: User Details */}
      <UserDetailsModal
        isOpen={Boolean(selectedUserDetails)}
        onClose={() => setSelectedUserDetails(null)}
        user={selectedUserDetails}
        onEdit={(u) => setEditingUser(u)}
      />

      {/* Modal: Status Confirmation */}
      <ConfirmStatusModal
        isOpen={Boolean(statusModalState)}
        onClose={() => setStatusModalState(null)}
        user={statusModalState?.user}
        newStatus={statusModalState?.newStatus}
        onConfirm={handleToggleStatus}
      />

      {/* Modal: Action Confirmations (Change Role, Reset Password, Force Logout, Delete) */}
      <ConfirmActionModal
        isOpen={Boolean(actionModalState)}
        onClose={() => setActionModalState(null)}
        actionType={actionModalState?.actionType}
        user={actionModalState?.user}
        onConfirm={(userId, payload) => {
          if (actionModalState?.actionType === "change_role") {
            handleChangeRole(userId, payload);
          } else if (actionModalState?.actionType === "reset_password") {
            handleResetPassword(userId);
          } else if (actionModalState?.actionType === "force_logout") {
            handleForceLogout(userId);
          } else if (actionModalState?.actionType === "delete") {
            handleDeleteUser(userId);
          }
        }}
      />
    </div>
  );
}
