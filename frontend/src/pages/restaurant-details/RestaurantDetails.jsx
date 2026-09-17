import React, { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Store,
  User,
  CreditCard,
  Receipt,
  Clock,
  Shield,
  FolderOpen,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";

import RestaurantHeader from "./components/RestaurantHeader";
import RestaurantOverview from "./components/RestaurantOverview";
import RestaurantAdmin from "./components/RestaurantAdmin";
import RestaurantSubscription from "./components/RestaurantSubscription";
import RestaurantPayments from "./components/RestaurantPayments";
import RestaurantActivity from "./components/RestaurantActivity";
import RestaurantActions from "./components/RestaurantActions";

import EditRestaurantModal from "../restaurants/components/EditRestaurantModal";
import ConfirmStatusModal from "../restaurants/components/ConfirmStatusModal";
import DeleteRestaurantModal from "../restaurants/components/DeleteRestaurantModal";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";

import { INITIAL_RESTAURANTS_DATA } from "../../data/restaurants";

export default function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Active Tab State ('overview' | 'admin' | 'subscription' | 'payments' | 'activity' | 'actions')
  const [activeTab, setActiveTab] = useState("overview");

  // Local Restaurant Dataset State
  const [restaurants, setRestaurants] = useState(INITIAL_RESTAURANTS_DATA);

  // Toast Notification State
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Find the target restaurant by id
  const restaurant = useMemo(() => {
    return restaurants.find(
      (r) => r.id.toLowerCase() === id?.toLowerCase()
    );
  }, [restaurants, id]);

  // Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Update handlers
  const handleUpdateRestaurant = (updated) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
    showToast(`Restaurant "${updated.name}" updated successfully.`);
  };

  const handleToggleStatus = (restaurantId, newStatus) => {
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
      `Restaurant status set to ${
        newStatus === "Active" ? "Active (Operational)" : "Inactive (Disabled)"
      }.`
    );
  };

  const handleConfirmSuspend = () => {
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === restaurant.id) {
          return {
            ...r,
            status: "Inactive",
            statusVariant: "danger",
          };
        }
        return r;
      })
    );
    setIsSuspendOpen(false);
    showToast(`Restaurant "${restaurant.name}" has been suspended.`, "info");
  };

  const handleDeleteRestaurant = (deletedId) => {
    setRestaurants((prev) => prev.filter((r) => r.id !== deletedId));
    showToast(`Restaurant "${restaurant.name}" was permanently deleted.`, "info");
    setTimeout(() => {
      navigate("/super-admin/restaurants");
    }, 600);
  };

  // NOT FOUND STATE
  if (!restaurant) {
    return (
      <div className="space-y-6">
        <div>
          <button
            type="button"
            onClick={() => navigate("/super-admin/restaurants")}
            className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-primary transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Restaurants</span>
          </button>
        </div>

        <div className="bg-bg-card rounded-2xl p-8 sm:p-12 border border-border shadow-xs">
          <EmptyState
            icon={FolderOpen}
            title="Restaurant Not Found"
            description={`No registered tenant could be found matching ID "${id}". It may have been deleted or the link is invalid.`}
            action={
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate("/super-admin/restaurants")}
              >
                Return to Restaurants Directory
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  // TABS CONFIGURATION
  const TABS = [
    { id: "overview", label: "Overview", icon: Store },
    { id: "admin", label: "Admin Profile", icon: User },
    { id: "subscription", label: "Subscription", icon: CreditCard },
    { id: "payments", label: "Payments & Invoices", icon: Receipt },
    { id: "activity", label: "Platform Activity", icon: Clock },
    { id: "actions", label: "Management & Actions", icon: Shield },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Toast Notification Alert */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-white/10 text-xs sm:text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* 1. Restaurant Header */}
      <RestaurantHeader
        restaurant={restaurant}
        onEdit={() => setIsEditOpen(true)}
        onToggleStatus={() => setIsStatusOpen(true)}
        onSuspend={() => setIsSuspendOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
      />

      {/* 2. Navigation Tabs Bar */}
      <div className="bg-bg-card rounded-2xl p-2 sm:p-2.5 border border-border shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer select-none ${
                  isActive
                    ? "bg-primary text-white shadow-xs font-bold"
                    : "text-text-muted hover:text-text-primary hover:bg-bg-hover font-medium"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-white" : "text-text-muted"
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Tab Content View */}
      <div>
        {activeTab === "overview" && (
          <RestaurantOverview restaurant={restaurant} />
        )}

        {activeTab === "admin" && (
          <RestaurantAdmin
            restaurant={restaurant}
            onUpdateAdmin={(admin) => {
              setRestaurants((prev) =>
                prev.map((r) =>
                  r.id === restaurant.id
                    ? {
                        ...r,
                        ownerName: admin.name,
                        ownerEmail: admin.email,
                        phone: admin.phone,
                      }
                    : r
                )
              );
            }}
          />
        )}

        {activeTab === "subscription" && (
          <RestaurantSubscription
            restaurant={restaurant}
            onUpdateSubscription={(sub) => {
              setRestaurants((prev) =>
                prev.map((r) =>
                  r.id === restaurant.id ? { ...r, ...sub } : r
                )
              );
            }}
          />
        )}

        {activeTab === "payments" && (
          <RestaurantPayments restaurant={restaurant} />
        )}

        {activeTab === "activity" && (
          <RestaurantActivity restaurant={restaurant} />
        )}

        {activeTab === "actions" && (
          <RestaurantActions
            restaurant={restaurant}
            onEdit={() => setIsEditOpen(true)}
            onToggleStatus={() => setIsStatusOpen(true)}
            onSuspend={() => setIsSuspendOpen(true)}
            onDelete={() => setIsDeleteOpen(true)}
          />
        )}
      </div>

      {/* Modal: Edit Restaurant */}
      <EditRestaurantModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        restaurant={restaurant}
        onUpdateSuccess={handleUpdateRestaurant}
      />

      {/* Modal: Enable / Disable Confirmation */}
      <ConfirmStatusModal
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        restaurant={restaurant}
        onConfirm={handleToggleStatus}
      />

      {/* Modal: Suspend Confirmation */}
      <Modal
        isOpen={isSuspendOpen}
        onClose={() => setIsSuspendOpen(false)}
        title="Suspend Tenant Account"
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsSuspendOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmSuspend}
            >
              <ShieldAlert className="w-4 h-4 mr-1" />
              Confirm Suspension
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 leading-relaxed">
            <p className="font-bold mb-1">Administrative Hold Notice</p>
            <p>
              Suspending <strong>{restaurant.name}</strong> will lock all POS terminal sessions,
              halt order processing, and freeze billing until manually re-enabled by a Super Admin.
            </p>
          </div>
        </div>
      </Modal>

      {/* Modal: Delete Confirmation */}
      <DeleteRestaurantModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        restaurant={restaurant}
        onConfirmDelete={handleDeleteRestaurant}
      />
    </div>
  );
}
