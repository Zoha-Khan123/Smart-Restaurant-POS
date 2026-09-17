import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Eye,
  Edit2,
  CreditCard,
  CheckCircle2,
  Ban,
  Trash2,
  Calendar,
  Phone,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
} from "lucide-react";
import Table from "../../../components/ui/Table";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import EmptyState from "../../../components/ui/EmptyState";

export default function RestaurantsTable({
  restaurants = [],
  onViewDetails,
  onEdit,
  onManageSubscription,
  onToggleStatus,
  onDelete,
  onResetFilters,
}) {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Floating Action Menu State
  const [menuState, setMenuState] = useState(null); // { id, restaurant, top, left }
  const menuRef = useRef(null);

  // Close floating menu on click outside, window scroll, or resize
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuState(null);
      }
    }

    function handleScrollOrResize() {
      setMenuState(null);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, []);

  // Reset to page 1 when data length changes
  useEffect(() => {
    setCurrentPage(1);
  }, [restaurants.length]);

  const totalItems = restaurants.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentRestaurants = restaurants.slice(startIndex, endIndex);

  // Handle opening floating menu calculated from button rect
  const handleToggleMenu = (e, rst) => {
    e.stopPropagation();
    if (menuState?.id === rst.id) {
      setMenuState(null);
      return;
    }

    const buttonRect = e.currentTarget.getBoundingClientRect();
    const menuWidth = 208; // w-52 = 13rem = 208px
    const menuHeight = 220; // approximate menu height

    // Check if opening downward exceeds window height
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const shouldOpenUp = spaceBelow < menuHeight && buttonRect.top > menuHeight;

    const top = shouldOpenUp
      ? buttonRect.top - menuHeight - 4
      : buttonRect.bottom + 4;

    let left = buttonRect.right - menuWidth;
    if (left < 10) left = 10;
    if (left + menuWidth > window.innerWidth - 10) {
      left = window.innerWidth - menuWidth - 10;
    }

    setMenuState({
      id: rst.id,
      restaurant: rst,
      top,
      left,
    });
  };

  const headers = [
    { label: "Restaurant", align: "left" },
    { label: "Admin / Owner", align: "left" },
    { label: "Contact", align: "left" },
    { label: "Plan", align: "left" },
    { label: "Payment Status", align: "left" },
    { label: "Restaurant Status", align: "left" },
    { label: "Subscription Expiry", align: "left" },
    { label: "Created Date", align: "left" },
    { label: "Actions", align: "right" },
  ];

  if (totalItems === 0) {
    return (
      <div className="bg-bg-card rounded-2xl p-6 border border-border shadow-xs">
        <EmptyState
          icon={FolderOpen}
          title="No restaurants match your search"
          description="Try adjusting your keywords, subscription tier, payment, or status filters."
          action={
            <Button variant="outline" size="sm" onClick={onResetFilters}>
              Reset All Filters
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="bg-bg-card rounded-2xl border border-border shadow-xs overflow-hidden flex flex-col justify-between relative">
      {/* Table Render */}
      <Table headers={headers}>
        {currentRestaurants.map((rst) => {
          const isMenuOpen = menuState?.id === rst.id;

          return (
            <tr
              key={rst.id}
              className={`hover:bg-bg-hover/60 transition-colors group ${
                isMenuOpen ? "bg-bg-hover/70" : ""
              }`}
            >
              {/* 1. Restaurant Column */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl ${rst.logoColor || "bg-primary"} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}
                  >
                    {rst.initials}
                  </div>
                  <div>
                    <p className="font-bold text-text-primary group-hover:text-primary transition-colors text-xs sm:text-sm">
                      {rst.name}
                    </p>
                    <p className="text-[11px] text-text-muted">{rst.category}</p>
                  </div>
                </div>
              </td>

              {/* 2. Admin / Owner Column */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <div>
                  <p className="font-semibold text-text-primary text-xs">
                    {rst.ownerName}
                  </p>
                  <p className="text-[11px] text-text-muted">{rst.ownerEmail}</p>
                </div>
              </td>

              {/* 3. Contact Column */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-xs text-text-secondary font-medium">
                  <Phone className="w-3.5 h-3.5 text-text-muted shrink-0" />
                  <span>{rst.phone}</span>
                </div>
              </td>

              {/* 4. Subscription Plan Column */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <Badge variant={rst.planVariant} size="sm">
                  {rst.subscriptionPlan}
                </Badge>
              </td>

              {/* 5. Payment Status Column */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <Badge variant={rst.paymentVariant} size="sm" dot>
                  {rst.paymentStatus}
                </Badge>
              </td>

              {/* 6. Restaurant Status Column */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <Badge variant={rst.statusVariant} size="sm" dot>
                  {rst.status}
                </Badge>
              </td>

              {/* 7. Subscription Expiry Column */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 font-medium text-text-primary text-xs whitespace-nowrap">
                    <Calendar className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    <span>{rst.subscriptionEndDate || "2026-03-28"}</span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold mt-0.5 ${
                      rst.daysLeft === "Expired"
                        ? "text-danger font-bold"
                        : rst.daysLeft?.includes("15") || rst.daysLeft?.includes("18") || rst.daysLeft?.includes("23")
                        ? "text-amber-600"
                        : "text-text-muted"
                    }`}
                  >
                    {rst.daysLeft}
                  </span>
                </div>
              </td>

              {/* 8. Created Date Column */}
              <td className="px-4 py-3.5 whitespace-nowrap text-xs text-text-secondary">
                {rst.createdAt}
              </td>

              {/* 9. Actions Button */}
              <td className="px-4 py-3.5 text-right whitespace-nowrap">
                <button
                  type="button"
                  onClick={(e) => handleToggleMenu(e, rst)}
                  className={`p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer focus:outline-none ${
                    isMenuOpen ? "bg-bg-hover text-text-primary ring-2 ring-primary/20" : ""
                  }`}
                  title="Actions Menu"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </td>
            </tr>
          );
        })}
      </Table>

      {/* Floating Action Menu (Detached Fixed Overlay - No Layout Shift, No Clipping, No Blank Space) */}
      {menuState && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: `${menuState.top}px`,
            left: `${menuState.left}px`,
            zIndex: 9999,
          }}
          className="w-52 bg-bg-card rounded-2xl border border-border shadow-2xl overflow-hidden py-1.5 animate-in fade-in-50 duration-150 text-left"
        >
          <div className="px-3.5 py-1.5 border-b border-border text-[10px] font-bold text-text-muted uppercase tracking-wider bg-bg-main/50 truncate">
            {menuState.restaurant.name}
          </div>

          {/* View Details */}
          <button
            type="button"
            onClick={() => {
              const r = menuState.restaurant;
              setMenuState(null);
              onViewDetails(r);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-primary transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-text-muted shrink-0" />
            <span>View Details</span>
          </button>

          {/* Edit */}
          <button
            type="button"
            onClick={() => {
              const r = menuState.restaurant;
              setMenuState(null);
              onEdit(r);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-primary transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4 text-text-muted shrink-0" />
            <span>Edit Restaurant</span>
          </button>

          {/* Manage Subscription */}
          <button
            type="button"
            onClick={() => {
              const r = menuState.restaurant;
              setMenuState(null);
              onManageSubscription(r);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-primary transition-colors cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-text-muted shrink-0" />
            <span>Manage Subscription</span>
          </button>

          <div className="border-t border-border my-1" />

          {/* Enable / Disable */}
          <button
            type="button"
            onClick={() => {
              const r = menuState.restaurant;
              setMenuState(null);
              onToggleStatus(r);
            }}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs transition-colors cursor-pointer ${
              menuState.restaurant.status === "Active"
                ? "text-amber-700 hover:bg-amber-50"
                : "text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            {menuState.restaurant.status === "Active" ? (
              <>
                <Ban className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Disable Access</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Enable Access</span>
              </>
            )}
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => {
              const r = menuState.restaurant;
              setMenuState(null);
              onDelete(r);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-danger hover:bg-danger-light transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-danger shrink-0" />
            <span>Delete Restaurant</span>
          </button>
        </div>
      )}

      {/* Pagination Footer Bar */}
      <div className="px-5 py-4 border-t border-border bg-bg-card flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
        {/* Left: Range text & page size selector */}
        <div className="flex items-center gap-3">
          <span>
            Showing <span className="font-semibold text-text-primary">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-text-primary">{endIndex}</span> of{" "}
            <span className="font-semibold text-text-primary">{totalItems}</span> results
          </span>

          <div className="flex items-center gap-1.5">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 rounded-md bg-bg-main border border-border text-text-primary font-medium focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={8}>8</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
            </select>
          </div>
        </div>

        {/* Right: Page Navigation Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="!p-1.5 !px-2.5"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </Button>

          {/* Page number buttons */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => setCurrentPage(pageNum)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentPage === pageNum
                  ? "bg-primary text-white shadow-2xs font-bold"
                  : "bg-bg-main border border-border text-text-primary hover:bg-bg-hover"
              }`}
            >
              {pageNum}
            </button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="!p-1.5 !px-2.5"
            title="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
