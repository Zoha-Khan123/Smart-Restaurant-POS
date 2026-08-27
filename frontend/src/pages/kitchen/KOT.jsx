import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  RefreshCw,
  Clock,
  ChefHat,
  Filter,
  CheckCircle2,
  AlertCircle,
  Flame,
  Printer,
  BellRing,
  UtensilsCrossed,
} from "lucide-react";
import { KITCHEN_STATIONS, INITIAL_KOT_ORDERS } from "../../data/kot";
import KOTCard from "./KOTCard";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";

/**
 * Status tabs configuration
 */
const STATUS_TABS = ["All", "New", "Preparing", "Ready", "Served"];

/**
 * Smart POS - KOT / Kitchen Display Screen (Screen 5 from Blueprint)
 */
export default function KOT() {
  // State: Orders & Filters
  const [orders, setOrders] = useState(INITIAL_KOT_ORDERS);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedStation, setSelectedStation] = useState("All Stations");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // State: Clock
  const [currentTime, setCurrentTime] = useState(new Date());

  // State: Modal & Notification
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Live Clock Updater
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Status Tab Counts
  const tabCounts = useMemo(() => {
    return {
      All: orders.length,
      New: orders.filter((o) => o.status === "New").length,
      Preparing: orders.filter((o) => o.status === "Preparing").length,
      Ready: orders.filter((o) => o.status === "Ready").length,
      Served: orders.filter((o) => o.status === "Served").length,
    };
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesTab = activeTab === "All" || order.status === activeTab;
      const matchesStation =
        selectedStation === "All Stations" ||
        order.station === selectedStation;
      const matchesSearch =
        order.kotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.table.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.waiter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesTab && matchesStation && matchesSearch;
    });
  }, [orders, activeTab, selectedStation, searchQuery]);

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order status updated to "${newStatus}"!`);
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm("Are you sure you want to cancel this Kitchen Ticket?")) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      showToast("Kitchen Ticket cancelled", "info");
    }
  };

  const handlePrint = (kot) => {
    showToast(`Printing Kitchen Slip for ${kot.kotNumber}...`, "info");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("Kitchen feed refreshed!");
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* =========================================================
          HEADER: TITLE, SEARCH, STATION SELECTOR & REFRESH
      ========================================================== */}
      <div className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Left: Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search KOT #, Table, or dish name..."
            className="w-full pl-10 pr-4 py-2.5 bg-bg-main border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Right: Station Selector, Clock, Refresh */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
          
          {/* Station Filter Dropdown */}
          <div className="relative shrink-0">
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2.5 rounded-xl bg-bg-main border border-border text-text-primary font-semibold text-xs cursor-pointer focus:outline-none focus:border-primary"
            >
              {KITCHEN_STATIONS.map((st) => (
                <option key={st} value={st}>
                  Station: {st}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-[10px]">
              ▼
            </div>
          </div>

          {/* Live Kitchen Clock Display */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bg-main border border-border text-xs font-semibold text-text-primary">
            <Clock className="w-3.5 h-3.5 text-text-muted" />
            <span>
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            className="p-2.5 rounded-xl bg-bg-main border border-border text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer"
            title="Refresh Kitchen Orders"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin text-primary" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* =========================================================
          STATUS TABS WITH LIVE ORDER COUNTERS (SCREEN 5 BLUEPRINT)
      ========================================================== */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {STATUS_TABS.map((tab) => {
          const isActive = activeTab === tab;
          const count = tabCounts[tab] || 0;

          // Color Badges for tab counters
          const countBadgeStyles =
            tab === "New"
              ? "bg-danger text-white"
              : tab === "Preparing"
              ? "bg-warning text-slate-950 font-bold"
              : tab === "Ready"
              ? "bg-emerald-600 text-white"
              : "bg-bg-hover text-text-secondary";

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center gap-2 shrink-0 cursor-pointer select-none border ${
                isActive
                  ? "bg-bg-sidebar text-text-white border-bg-sidebar shadow-sm"
                  : "bg-bg-card text-text-secondary hover:text-text-primary hover:bg-bg-hover border-border"
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? "bg-white/20 text-white" : countBadgeStyles
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* =========================================================
          KOT CARDS GRID
      ========================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredOrders.map((kot) => (
          <KOTCard
            key={kot.id}
            kot={kot}
            onStatusChange={handleStatusChange}
            onViewDetails={setSelectedOrderDetails}
            onCancel={handleCancelOrder}
            onPrint={handlePrint}
          />
        ))}

        {filteredOrders.length === 0 && (
          <div className="col-span-full py-16 text-center bg-bg-card rounded-2xl border border-border p-6">
            <ChefHat className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-40" />
            <h4 className="text-base font-bold text-text-primary">
              No Kitchen Tickets Found
            </h4>
            <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
              There are no orders matching "{activeTab}" status or the selected station.
            </p>
          </div>
        )}
      </div>

      {/* =========================================================
          MODAL: FULL KOT DETAILS & CHEF SLIP
      ========================================================== */}
      {selectedOrderDetails && (
        <Modal
          isOpen={Boolean(selectedOrderDetails)}
          onClose={() => setSelectedOrderDetails(null)}
          title={`Kitchen Order Slip: ${selectedOrderDetails.kotNumber}`}
          subtitle={`${selectedOrderDetails.table} (${selectedOrderDetails.orderType}) • Placed at ${selectedOrderDetails.time}`}
          footer={
            <>
              <button
                type="button"
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-2 text-xs font-medium text-text-secondary hover:bg-bg-hover rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  handlePrint(selectedOrderDetails);
                }}
                className="py-2 px-3 text-xs gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Ticket</span>
              </Button>

              {selectedOrderDetails.status === "New" && (
                <Button
                  type="button"
                  onClick={() => {
                    handleStatusChange(selectedOrderDetails.id, "Preparing");
                    setSelectedOrderDetails(null);
                  }}
                  className="py-2 px-4 text-xs font-semibold bg-warning text-slate-950 hover:opacity-90"
                >
                  Start Preparing
                </Button>
              )}

              {selectedOrderDetails.status === "Preparing" && (
                <Button
                  type="button"
                  onClick={() => {
                    handleStatusChange(selectedOrderDetails.id, "Ready");
                    setSelectedOrderDetails(null);
                  }}
                  className="py-2 px-4 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Mark Order Ready
                </Button>
              )}

              {selectedOrderDetails.status === "Ready" && (
                <Button
                  type="button"
                  onClick={() => {
                    handleStatusChange(selectedOrderDetails.id, "Served");
                    setSelectedOrderDetails(null);
                  }}
                  className="py-2 px-4 text-xs font-semibold bg-primary hover:bg-primary-dark text-white"
                >
                  Mark Served
                </Button>
              )}
            </>
          }
        >
          <div className="space-y-4">
            {/* Meta info card */}
            <div className="p-3.5 rounded-xl bg-bg-main border border-border grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-text-muted block text-[11px]">Waiter</span>
                <span className="font-bold text-text-primary">
                  {selectedOrderDetails.waiter}
                </span>
              </div>
              <div>
                <span className="text-text-muted block text-[11px]">Customer</span>
                <span className="font-bold text-text-primary">
                  {selectedOrderDetails.customer || "Walk-in Guest"}
                </span>
              </div>
              <div>
                <span className="text-text-muted block text-[11px]">Station</span>
                <span className="font-bold text-text-primary">
                  {selectedOrderDetails.station}
                </span>
              </div>
            </div>

            {/* Itemized list */}
            <div>
              <h5 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                Order Items ({selectedOrderDetails.items.length})
              </h5>

              <div className="bg-bg-main rounded-xl border border-border p-3 divide-y divide-border-light space-y-2">
                {selectedOrderDetails.items.map((item, idx) => (
                  <div key={idx} className="pt-2 first:pt-0">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-primary-light text-primary font-bold text-xs flex items-center justify-center">
                        {item.quantity}×
                      </span>
                      <span className="text-xs font-bold text-text-primary">
                        {item.name}
                      </span>
                      {item.size && (
                        <span className="text-[11px] text-text-muted font-medium">
                          ({item.size})
                        </span>
                      )}
                    </div>

                    {item.modifiers?.length > 0 && (
                      <div className="ml-7 mt-1 flex flex-wrap gap-1">
                        {item.modifiers.map((mod, mi) => (
                          <span
                            key={mi}
                            className="text-[10px] font-medium bg-bg-card border border-border px-1.5 py-0.5 rounded text-text-secondary"
                          >
                            + {mod}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.itemNote && (
                      <p className="ml-7 mt-1 text-[11px] text-amber-700 italic">
                        Note: {item.itemNote}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Special cooking instructions */}
            {selectedOrderDetails.specialInstructions && (
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                <span className="font-bold text-amber-900 block text-[11px] uppercase tracking-wider mb-0.5">
                  Chef Instructions:
                </span>
                <p className="text-amber-950 font-medium italic">
                  "{selectedOrderDetails.specialInstructions}"
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* =========================================================
          TOAST FEEDBACK NOTIFICATION
      ========================================================== */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl text-white text-xs font-semibold flex items-center gap-2 ${
              toastMessage.type === "error"
                ? "bg-danger"
                : toastMessage.type === "info"
                ? "bg-amber-600"
                : "bg-emerald-600"
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
