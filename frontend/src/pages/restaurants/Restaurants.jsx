import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import RestaurantStats from "./components/RestaurantStats";
import RestaurantFilters from "./components/RestaurantFilters";
import RestaurantsTable from "./components/RestaurantsTable";
import AddRestaurantModal from "./components/AddRestaurantModal";
import ConfirmStatusModal from "./components/ConfirmStatusModal";
import DeleteRestaurantModal from "./components/DeleteRestaurantModal";
import EditRestaurantModal from "./components/EditRestaurantModal";
import RestaurantDetailsPreviewModal from "./components/RestaurantDetailsPreviewModal";

import {
  INITIAL_RESTAURANTS_DATA,
  calculateRestaurantStats,
} from "../../data/restaurants";
import { Plus, RefreshCw, CheckCircle2 } from "lucide-react";

/**
 * Super Admin Restaurants Management Page
 * Main page for Super Administrators to oversee, onboard, filter, manage, and configure all tenant branches.
 */
export default function Restaurants() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState(INITIAL_RESTAURANTS_DATA);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [expiryFilter, setExpiryFilter] = useState("all");

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
  const [statusModalData, setStatusModalData] = useState(null);
  const [deleteModalData, setDeleteModalData] = useState(null);
  const [editModalData, setEditModalData] = useState(null);
  const [previewModalData, setPreviewModalData] = useState(null);

  // Dynamic KPI Stats calculation based on live state
  const stats = useMemo(() => {
    return calculateRestaurantStats(restaurants);
  }, [restaurants]);

  // Filtered dataset
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((rst) => {
      // 1. Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        rst.name.toLowerCase().includes(q) ||
        rst.ownerEmail.toLowerCase().includes(q) ||
        rst.ownerName.toLowerCase().includes(q) ||
        rst.phone.toLowerCase().includes(q);

      // 2. Status filter
      const matchesStatus =
        statusFilter === "all" || rst.status === statusFilter;

      // 3. Plan filter
      const matchesPlan =
        planFilter === "all" || rst.subscriptionPlan === planFilter;

      // 4. Payment status filter
      const matchesPayment =
        paymentFilter === "all" || rst.paymentStatus === paymentFilter;

      // 5. Expiry filter
      let matchesExpiry = true;
      if (expiryFilter === "expired") {
        matchesExpiry = rst.daysLeft === "Expired";
      } else if (expiryFilter === "expiring_soon") {
        if (rst.daysLeft === "Expired") {
          matchesExpiry = true;
        } else {
          const days = parseInt(rst.daysLeft, 10);
          matchesExpiry = !isNaN(days) && days <= 30;
        }
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPlan &&
        matchesPayment &&
        matchesExpiry
      );
    });
  }, [
    restaurants,
    searchQuery,
    statusFilter,
    planFilter,
    paymentFilter,
    expiryFilter,
  ]);

  // Handlers
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("Restaurant list synchronized with platform API");
    }, 500);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPlanFilter("all");
    setPaymentFilter("all");
    setExpiryFilter("all");
  };

  const handleAddRestaurant = (newRst) => {
    setRestaurants((prev) => [newRst, ...prev]);
    showToast(`Restaurant "${newRst.name}" successfully onboarded!`);
  };

  const handleUpdateStatus = (restaurantId, newStatus) => {
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === restaurantId) {
          return {
            ...r,
            status: newStatus,
            statusVariant: newStatus === "Active" ? "success" : "danger",
          };
        }
        return r;
      })
    );
    showToast(
      `Restaurant status updated to ${newStatus === "Active" ? "Active (Operational)" : "Inactive (Disabled)"}`
    );
  };

  const handleDeleteRestaurant = (restaurantId) => {
    const target = restaurants.find((r) => r.id === restaurantId);
    setRestaurants((prev) => prev.filter((r) => r.id !== restaurantId));
    showToast(`Restaurant "${target?.name || restaurantId}" was deleted`, "info");
  };

  const handleUpdateRestaurant = (updatedRst) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === updatedRst.id ? updatedRst : r))
    );
    showToast(`Restaurant "${updatedRst.name}" updated successfully`);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Toast Notification Alert Banner */}
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
        title="Restaurants"
        subtitle="Manage and monitor all restaurants/tenants registered on the platform."
        badge={
          <Badge variant="primary" size="sm">
            {restaurants.length} Registered
          </Badge>
        }
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="!py-2"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="!py-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Restaurant</span>
            </Button>
          </>
        }
      />

      {/* 2. Restaurant Statistics KPI Cards */}
      <RestaurantStats stats={stats} />

      {/* 3. Search and Multi-Filter Bar */}
      <RestaurantFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        planFilter={planFilter}
        onPlanChange={setPlanFilter}
        paymentFilter={paymentFilter}
        onPaymentChange={setPaymentFilter}
        expiryFilter={expiryFilter}
        onExpiryChange={setExpiryFilter}
        onResetFilters={handleResetFilters}
        totalResults={restaurants.length}
        filteredCount={filteredRestaurants.length}
      />

      {/* 4. Main Restaurants Table with Actions & Pagination */}
      <RestaurantsTable
        restaurants={filteredRestaurants}
        onViewDetails={(rst) => navigate(`/super-admin/restaurants/${rst.id}`)}
        onEdit={(rst) => setEditModalData(rst)}
        onManageSubscription={(rst) => navigate(`/super-admin/restaurants/${rst.id}`)}
        onToggleStatus={(rst) => setStatusModalData(rst)}
        onDelete={(rst) => setDeleteModalData(rst)}
        onResetFilters={handleResetFilters}
      />

      {/* Modal: Add Restaurant */}
      <AddRestaurantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSuccess={handleAddRestaurant}
      />

      {/* Modal: Enable / Disable Status Confirmation */}
      <ConfirmStatusModal
        isOpen={Boolean(statusModalData)}
        onClose={() => setStatusModalData(null)}
        restaurant={statusModalData}
        onConfirm={handleUpdateStatus}
      />

      {/* Modal: Delete Confirmation */}
      <DeleteRestaurantModal
        isOpen={Boolean(deleteModalData)}
        onClose={() => setDeleteModalData(null)}
        restaurant={deleteModalData}
        onConfirmDelete={handleDeleteRestaurant}
      />

      {/* Modal: Edit Restaurant */}
      <EditRestaurantModal
        isOpen={Boolean(editModalData)}
        onClose={() => setEditModalData(null)}
        restaurant={editModalData}
        onUpdateSuccess={handleUpdateRestaurant}
      />

      {/* Modal: View Details Preview */}
      <RestaurantDetailsPreviewModal
        isOpen={Boolean(previewModalData)}
        onClose={() => setPreviewModalData(null)}
        restaurant={previewModalData}
      />
    </div>
  );
}
