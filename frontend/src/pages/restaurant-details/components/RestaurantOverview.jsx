import React from "react";
import {
  Store,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Layers,
  Monitor,
  ShoppingBag,
  TrendingUp,
  Clock,
} from "lucide-react";
import Badge from "../../../components/ui/Badge";

export default function RestaurantOverview({ restaurant }) {
  if (!restaurant) return null;

  return (
    <div className="space-y-6">
      {/* 4 Tenant KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-bg-card rounded-2xl p-5 border border-border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Total Revenue
            </p>
            <h3 className="text-2xl font-extrabold text-text-primary mt-1 tracking-tight">
              {restaurant.totalRevenue || "$184,200"}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
              +18.4% vs last qtr
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders Processed */}
        <div className="bg-bg-card rounded-2xl p-5 border border-border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Orders Processed
            </p>
            <h3 className="text-2xl font-extrabold text-text-primary mt-1 tracking-tight">
              {restaurant.totalOrders || "12,450"}
            </h3>
            <span className="text-[11px] text-text-muted font-medium mt-1 inline-block">
              Lifetime volume
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Active POS Terminals */}
        <div className="bg-bg-card rounded-2xl p-5 border border-border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Connected Devices
            </p>
            <h3 className="text-2xl font-extrabold text-text-primary mt-1 tracking-tight">
              {restaurant.posTerminals || 4} Terminals
            </h3>
            <span className="text-[11px] text-primary font-semibold mt-1 inline-block">
              KOT + Front POS
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-200">
            <Monitor className="w-6 h-6" />
          </div>
        </div>

        {/* Last Login & Activity */}
        <div className="bg-bg-card rounded-2xl p-5 border border-border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Last Terminal Sync
            </p>
            <h3 className="text-base sm:text-lg font-bold text-text-primary mt-1 tracking-tight">
              {restaurant.lastLogin || "Today, 02:45 PM"}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Online (Live)
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Restaurant Profile & Location */}
        <div className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 pb-3.5">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-text-primary text-base">
                Restaurant Information
              </h3>
            </div>
            <Badge variant={restaurant.statusVariant} size="sm" dot>
              {restaurant.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
            <div>
              <p className="text-text-muted font-medium mb-0.5">Restaurant Name</p>
              <p className="font-bold text-text-primary text-sm">{restaurant.name}</p>
            </div>

            <div>
              <p className="text-text-muted font-medium mb-0.5">Tenant / Branch ID</p>
              <p className="font-mono font-bold text-primary">{restaurant.id}</p>
            </div>

            <div>
              <p className="text-text-muted font-medium mb-0.5">Category & Cuisine</p>
              <p className="font-semibold text-text-primary">{restaurant.category}</p>
            </div>

            <div>
              <p className="text-text-muted font-medium mb-0.5">Registered Date</p>
              <p className="font-semibold text-text-primary flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-text-muted" />
                {restaurant.createdAt}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-text-muted font-medium mb-0.5">Physical Address</p>
              <p className="font-semibold text-text-primary flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0" />
                {restaurant.address}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Contact & Administrator */}
        <div className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 pb-3.5">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-text-primary text-base">
                Owner & Contact Credentials
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-text-muted">
              Primary Contact
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
            <div className="min-w-0">
              <p className="text-text-muted font-medium mb-0.5">Owner / Admin Name</p>
              <p className="font-bold text-text-primary text-sm break-words">{restaurant.ownerName}</p>
            </div>

            <div className="min-w-0">
              <p className="text-text-muted font-medium mb-0.5">Email Address</p>
              <p className="font-semibold text-text-primary flex items-center gap-1.5 break-all">
                <Mail className="w-3.5 h-3.5 text-text-muted shrink-0" />
                <span>{restaurant.ownerEmail}</span>
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-text-muted font-medium mb-0.5">Phone Number</p>
              <p className="font-semibold text-text-primary flex items-center gap-1.5 break-words">
                <Phone className="w-3.5 h-3.5 text-text-muted shrink-0" />
                <span>{restaurant.phone}</span>
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-text-muted font-medium mb-0.5">Admin Role</p>
              <p className="font-semibold text-text-primary break-words">
                Tenant Owner (Super Privilege)
              </p>
            </div>

            <div className="sm:col-span-2 min-w-0">
              <p className="text-text-muted font-medium mb-0.5">Security Clearance</p>
              <p className="font-medium text-text-secondary leading-relaxed break-words">
                Two-factor authentication (2FA) enabled with encrypted hardware authorization tokens.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Subscription & Billing Summary */}
        <div className="sm:col-span-2 bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 pb-3.5">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-text-primary text-base">
                Subscription & Billing Lifecycle
              </h3>
            </div>
            <Badge variant={restaurant.planVariant} size="sm">
              {restaurant.subscriptionPlan} Plan
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-bg-main border border-border">
              <p className="text-text-muted font-medium">Subscription Tier</p>
              <p className="font-bold text-text-primary text-sm mt-0.5">
                {restaurant.subscriptionPlan} ({restaurant.planPrice || "$79/mo"})
              </p>
              <p className="text-[11px] text-text-muted mt-1">
                {restaurant.billingCycle || "Monthly Recurring"}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-bg-main border border-border">
              <p className="text-text-muted font-medium">Payment Status</p>
              <div className="mt-1">
                <Badge variant={restaurant.paymentVariant} size="sm" dot>
                  {restaurant.paymentStatus}
                </Badge>
              </div>
              <p className="text-[11px] text-text-muted mt-1">
                Settled via Stripe Gateway
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-bg-main border border-border">
              <p className="text-text-muted font-medium">Subscription Period</p>
              <p className="font-semibold text-text-primary mt-0.5">
                {restaurant.subscriptionStartDate} to {restaurant.subscriptionEndDate}
              </p>
              <p className="text-[11px] text-text-muted mt-1">
                Auto-Renew: {restaurant.autoRenew ? "Enabled" : "Disabled"}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-bg-main border border-border">
              <p className="text-text-muted font-medium">Days Remaining</p>
              <p
                className={`font-bold text-sm mt-0.5 ${
                  restaurant.daysLeft === "Expired"
                    ? "text-danger"
                    : restaurant.daysLeft?.includes("15") || restaurant.daysLeft?.includes("18")
                    ? "text-amber-600"
                    : "text-emerald-600"
                }`}
              >
                {restaurant.daysLeft}
              </p>
              <p className="text-[11px] text-text-muted mt-1">
                Next invoice on {restaurant.subscriptionEndDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
