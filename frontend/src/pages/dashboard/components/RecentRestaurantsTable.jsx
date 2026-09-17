import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Store,
  Search,
  ExternalLink,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Settings,
} from "lucide-react";
import Table from "../../../components/ui/Table";
import Badge from "../../../components/ui/Badge";

export default function RecentRestaurantsTable({ restaurants = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredRestaurants = restaurants.filter((rst) => {
    const matchesSearch =
      rst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rst.owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rst.owner.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      rst.restaurantStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const headers = [
    { label: "Restaurant", align: "left" },
    { label: "Admin / Owner", align: "left" },
    { label: "Plan", align: "left" },
    { label: "Payment Status", align: "left" },
    { label: "Restaurant Status", align: "left" },
    { label: "Expiry Date", align: "left" },
    { label: "Action", align: "right" },
  ];

  return (
    <div className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs">
      {/* Table Header & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-bold text-text-primary text-base tracking-tight">
              Recent Restaurants
            </h3>
            <Badge variant="primary" size="sm">
              {filteredRestaurants.length} Onboarded
            </Badge>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Latest tenant registrations and active subscription statuses
          </p>
        </div>

        {/* Search & Status Filters */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Search Input */}
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center bg-bg-main p-1 rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === "all"
                  ? "bg-bg-card text-text-primary shadow-2xs"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("active")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === "active"
                  ? "bg-bg-card text-emerald-600 shadow-2xs"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("inactive")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === "inactive"
                  ? "bg-bg-card text-danger shadow-2xs"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              Inactive
            </button>
          </div>

          <Link
            to="/super-admin/restaurants"
            className="text-xs font-semibold text-primary hover:text-primary-dark whitespace-nowrap ml-1 flex items-center gap-1"
          >
            <span>View All</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Table Component */}
      <Table headers={headers} empty={filteredRestaurants.length === 0}>
        {filteredRestaurants.map((rst) => (
          <tr
            key={rst.id}
            className="hover:bg-bg-hover/60 transition-colors group"
          >
            {/* Restaurant Column */}
            <td className="px-4 py-3.5 whitespace-nowrap">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl ${rst.logoColor} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}
                >
                  {rst.initials}
                </div>
                <div>
                  <p className="font-bold text-text-primary group-hover:text-primary transition-colors text-sm">
                    {rst.name}
                  </p>
                  <p className="text-[11px] text-text-muted">{rst.category}</p>
                </div>
              </div>
            </td>

            {/* Admin / Owner Column */}
            <td className="px-4 py-3.5 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full ${rst.owner.avatarBg} text-white font-semibold text-[10px] flex items-center justify-center shrink-0`}
                >
                  {rst.owner.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-xs">
                    {rst.owner.name}
                  </p>
                  <p className="text-[11px] text-text-muted">{rst.owner.email}</p>
                </div>
              </div>
            </td>

            {/* Plan Column */}
            <td className="px-4 py-3.5 whitespace-nowrap">
              <Badge variant={rst.planVariant} size="sm">
                {rst.plan}
              </Badge>
            </td>

            {/* Payment Status */}
            <td className="px-4 py-3.5 whitespace-nowrap">
              <Badge variant={rst.paymentVariant} size="sm" dot>
                {rst.paymentStatus}
              </Badge>
            </td>

            {/* Restaurant Status */}
            <td className="px-4 py-3.5 whitespace-nowrap">
              <Badge variant={rst.statusVariant} size="sm">
                {rst.restaurantStatus}
              </Badge>
            </td>

            {/* Expiry Date (Cleanly formatted & never wrapping) */}
            <td className="px-4 py-3.5 whitespace-nowrap">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 font-medium text-text-primary text-xs whitespace-nowrap">
                  <Calendar className="w-3.5 h-3.5 text-text-muted shrink-0" />
                  <span>{rst.expiryDate}</span>
                </div>
                <span
                  className={`text-[11px] font-semibold mt-0.5 ${
                    rst.daysLeft === "Expired"
                      ? "text-danger font-bold"
                      : rst.daysLeft.includes("15")
                      ? "text-amber-600"
                      : "text-text-muted"
                  }`}
                >
                  {rst.daysLeft}
                </span>
              </div>
            </td>

            {/* Action Buttons */}
            <td className="px-4 py-3.5 text-right whitespace-nowrap">
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  title="View Restaurant Details"
                  className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary-light transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Edit Settings"
                  className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
