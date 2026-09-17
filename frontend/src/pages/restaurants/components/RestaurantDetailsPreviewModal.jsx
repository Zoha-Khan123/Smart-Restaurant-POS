import React from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import {
  Store,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Layers,
  CreditCard,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

export default function RestaurantDetailsPreviewModal({
  isOpen,
  onClose,
  restaurant,
}) {
  if (!restaurant) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Restaurant Details"
      subtitle={`Tenant ID: ${restaurant.id}`}
      size="lg"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close Preview
        </Button>
      }
    >
      <div className="space-y-5">
        {/* Header Tenant Banner */}
        <div className="p-4 rounded-2xl bg-bg-main border border-border flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl ${restaurant.logoColor} text-white font-bold text-base flex items-center justify-center shadow-sm`}
            >
              {restaurant.initials}
            </div>
            <div>
              <h4 className="text-base font-bold text-text-primary">
                {restaurant.name}
              </h4>
              <p className="text-xs text-text-muted">{restaurant.category}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={restaurant.statusVariant} size="md" dot>
              {restaurant.status}
            </Badge>
            <Badge variant={restaurant.planVariant} size="md">
              {restaurant.subscriptionPlan} Plan
            </Badge>
          </div>
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Owner Details */}
          <div className="p-4 rounded-xl bg-bg-card border border-border shadow-2xs space-y-2.5">
            <h5 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primary" />
              <span>Admin / Owner Profile</span>
            </h5>
            <div className="text-xs space-y-1.5">
              <p className="font-semibold text-text-primary">
                Name: <span className="font-normal text-text-secondary">{restaurant.ownerName}</span>
              </p>
              <p className="font-semibold text-text-primary">
                Email: <span className="font-normal text-text-secondary">{restaurant.ownerEmail}</span>
              </p>
              <p className="font-semibold text-text-primary">
                Phone: <span className="font-normal text-text-secondary">{restaurant.phone}</span>
              </p>
              <p className="font-semibold text-text-primary">
                Address: <span className="font-normal text-text-secondary">{restaurant.address}</span>
              </p>
            </div>
          </div>

          {/* Subscription & Billing Details */}
          <div className="p-4 rounded-xl bg-bg-card border border-border shadow-2xs space-y-2.5">
            <h5 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-primary" />
              <span>Subscription & Billing</span>
            </h5>
            <div className="text-xs space-y-1.5">
              <p className="font-semibold text-text-primary">
                Tier: <span className="font-normal text-text-secondary">{restaurant.subscriptionPlan}</span>
              </p>
              <p className="font-semibold text-text-primary flex items-center gap-1.5">
                Payment Status:{" "}
                <Badge variant={restaurant.paymentVariant} size="sm" dot>
                  {restaurant.paymentStatus}
                </Badge>
              </p>
              <p className="font-semibold text-text-primary">
                Start Date: <span className="font-normal text-text-secondary">{restaurant.subscriptionStartDate || "2025-01-01"}</span>
              </p>
              <p className="font-semibold text-text-primary">
                Expiry Date: <span className="font-normal text-text-secondary">{restaurant.subscriptionEndDate || "2026-01-01"} ({restaurant.daysLeft})</span>
              </p>
              <p className="font-semibold text-text-primary">
                Registered On: <span className="font-normal text-text-secondary">{restaurant.createdAt}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Phase notice */}
        <div className="p-3 rounded-xl bg-primary-light/60 border border-primary/20 text-xs text-primary flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>
            Dedicated multi-tab Restaurant Details view (POS Terminals, Order History, Menu Sync, and Staff Accounts) will be linked in the next phase.
          </span>
        </div>
      </div>
    </Modal>
  );
}
