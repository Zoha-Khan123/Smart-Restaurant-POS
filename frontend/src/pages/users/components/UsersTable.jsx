import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Eye,
  Edit2,
  Shield,
  CheckCircle2,
  Ban,
  Trash2,
  Key,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  User,
  ShieldAlert,
  Mail,
  Phone,
  Store,
  Clock,
} from "lucide-react";
import Table from "../../../components/ui/Table";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import EmptyState from "../../../components/ui/EmptyState";
import { ROLE_BADGE_VARIANTS, STATUS_BADGE_VARIANTS } from "../../../data/users";

export default function UsersTable({
  users = [],
  onViewDetails,
  onEdit,
  onChangeRole,
  onToggleStatus,
  onResetPassword,
  onForceLogout,
  onDelete,
  onResetFilters,
}) {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Floating Action Menu State
  const [menuState, setMenuState] = useState(null); // { id, user, top, left }
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
  }, [users.length]);

  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentUsers = users.slice(startIndex, endIndex);

  // Handle opening floating menu calculated from button rect
  const handleToggleMenu = (e, usr) => {
    e.stopPropagation();
    if (menuState?.id === usr.id) {
      setMenuState(null);
      return;
    }

    const buttonRect = e.currentTarget.getBoundingClientRect();
    const menuWidth = 210;
    const menuHeight = 280;

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
      id: usr.id,
      user: usr,
      top,
      left,
    });
  };

  const headers = [
    { label: "User", align: "left" },
    { label: "Email & Contact", align: "left" },
    { label: "Role", align: "left" },
    { label: "Assigned Tenant", align: "left" },
    { label: "Status", align: "left" },
    { label: "Last Login", align: "left" },
    { label: "Created Date", align: "left" },
    { label: "Actions", align: "right" },
  ];

  if (totalItems === 0) {
    return (
      <div className="bg-bg-card rounded-2xl p-6 border border-border shadow-xs">
        <EmptyState
          icon={FolderOpen}
          title="No users match your criteria"
          description="Try adjusting your keywords, role selection, assigned restaurant, or status filter."
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
    <div className="space-y-4 min-w-0">
      {/* Table Container Card */}
      <div className="bg-bg-card rounded-2xl border border-border shadow-xs overflow-hidden min-w-0">
        <Table headers={headers}>
          {currentUsers.map((usr) => {
            const roleVariant = ROLE_BADGE_VARIANTS[usr.role] || "default";
            const statusVariant = STATUS_BADGE_VARIANTS[usr.status] || "default";
            const isActive = usr.status === "Active";

            return (
              <tr
                key={usr.id}
                className="hover:bg-bg-hover/60 transition-colors group"
              >
                {/* 1. User Column */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl ${
                        usr.avatarBg || "bg-primary"
                      } text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}
                    >
                      {usr.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-text-primary text-xs sm:text-sm">
                          {usr.name}
                        </span>
                        {usr.role === "Super Admin" && (
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                            Root
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-text-muted">
                        {usr.id}
                      </span>
                    </div>
                  </div>
                </td>

                {/* 2. Email & Contact */}
                <td className="px-4 py-3.5 whitespace-nowrap text-xs">
                  <div className="flex items-center gap-1 text-text-primary font-medium">
                    <Mail className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    <span className="break-all">{usr.email}</span>
                  </div>
                  {usr.phone && (
                    <div className="flex items-center gap-1 text-[11px] text-text-muted mt-0.5">
                      <Phone className="w-3 h-3 text-text-muted shrink-0" />
                      <span>{usr.phone}</span>
                    </div>
                  )}
                </td>

                {/* 3. Role */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <Badge variant={roleVariant} size="sm">
                    {usr.role}
                  </Badge>
                </td>

                {/* 4. Assigned Tenant / Restaurant */}
                <td className="px-4 py-3.5 whitespace-nowrap text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-text-primary">
                    <Store className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    <span>{usr.restaurantName}</span>
                  </div>
                  {usr.restaurantId && (
                    <span className="font-mono text-[10px] text-text-muted ml-5 block">
                      {usr.restaurantId}
                    </span>
                  )}
                </td>

                {/* 5. Status */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <Badge variant={statusVariant} size="sm" dot>
                    {usr.status}
                  </Badge>
                </td>

                {/* 6. Last Login */}
                <td className="px-4 py-3.5 whitespace-nowrap text-xs">
                  <p className="font-medium text-text-primary">{usr.lastLogin}</p>
                  <p className="text-[10px] text-text-muted">{usr.lastLoginIp?.split(" ")[0] || "Web"}</p>
                </td>

                {/* 7. Created Date */}
                <td className="px-4 py-3.5 whitespace-nowrap text-xs text-text-secondary">
                  {usr.createdAt}
                </td>

                {/* 8. Actions */}
                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={(e) => handleToggleMenu(e, usr)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer focus:outline-none"
                    title="User Actions"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </Table>

        {/* Floating Actions Portal / Layer */}
        {menuState && (
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: `${menuState.top}px`,
              left: `${menuState.left}px`,
              width: "210px",
              zIndex: 9999,
            }}
            className="bg-bg-card rounded-2xl border border-border shadow-2xl overflow-hidden py-1.5 animate-in fade-in-50 zoom-in-95 duration-100 text-left backdrop-blur-md"
          >
            {/* View Details */}
            <button
              type="button"
              onClick={() => {
                const u = menuState.user;
                setMenuState(null);
                onViewDetails(u);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-primary transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-text-muted" />
              <span>View User Details</span>
            </button>

            {/* Edit User */}
            <button
              type="button"
              onClick={() => {
                const u = menuState.user;
                setMenuState(null);
                onEdit(u);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-primary transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-text-muted" />
              <span>Edit Profile & Access</span>
            </button>

            {/* Change Role */}
            <button
              type="button"
              onClick={() => {
                const u = menuState.user;
                setMenuState(null);
                onChangeRole(u);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-text-muted" />
              <span>Change Assigned Role</span>
            </button>

            {/* Activate / Deactivate / Suspend Toggle */}
            <button
              type="button"
              onClick={() => {
                const u = menuState.user;
                setMenuState(null);
                onToggleStatus(u);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-amber-600 transition-colors cursor-pointer"
            >
              {menuState.user.status === "Active" ? (
                <>
                  <Ban className="w-3.5 h-3.5 text-amber-500" />
                  <span>Deactivate Account</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Activate Account</span>
                </>
              )}
            </button>

            {/* Password Reset */}
            <button
              type="button"
              onClick={() => {
                const u = menuState.user;
                setMenuState(null);
                onResetPassword(u);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-blue-600 transition-colors cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-text-muted" />
              <span>Reset Password</span>
            </button>

            {/* Force Logout */}
            <button
              type="button"
              onClick={() => {
                const u = menuState.user;
                setMenuState(null);
                onForceLogout(u);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-amber-700 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-text-muted" />
              <span>Terminate Sessions</span>
            </button>

            <div className="border-t border-border my-1" />

            {/* Delete User */}
            <button
              type="button"
              onClick={() => {
                const u = menuState.user;
                setMenuState(null);
                onDelete(u);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-danger hover:bg-danger-light transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-danger" />
              <span>Delete User Account</span>
            </button>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs bg-bg-card">
          {/* Rows Per Page & Counter */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-text-muted">
              Showing{" "}
              <strong className="text-text-primary">
                {totalItems === 0 ? 0 : startIndex + 1}
              </strong>{" "}
              to <strong className="text-text-primary">{endIndex}</strong> of{" "}
              <strong className="text-text-primary">{totalItems}</strong> entries
            </span>

            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-text-muted">Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 rounded-md bg-bg-main border border-border text-text-primary text-xs focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={8}>8</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          {/* Page Buttons */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="!px-2.5 !py-1 text-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-0.5" />
              <span>Prev</span>
            </Button>

            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-primary text-white shadow-xs"
                        : "text-text-muted hover:text-text-primary hover:bg-bg-hover"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="!px-2.5 !py-1 text-xs"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
