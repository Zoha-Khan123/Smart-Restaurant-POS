import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  Utensils,
  Building2,
} from "lucide-react";
import { FLOOR_AREAS, INITIAL_TABLES } from "../../data/tables";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import TableCard from "./TableCard";
import TableDetails from "./TableDetails";

/**
 * Smart POS - Table Management Screen (Screen 4 from Blueprint)
 */
export default function Tables() {
  const navigate = useNavigate();

  // State: Tables & Filtering
  const [tables, setTables] = useState(INITIAL_TABLES);
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // State: Modals
  const [activeTableModal, setActiveTableModal] = useState(null);
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [targetTransferTable, setTargetTransferTable] = useState("");

  // State: Add Table Form
  const [newTableData, setNewTableData] = useState({
    number: "",
    seats: 4,
    area: "Main Hall",
    status: "Available",
  });
  const [formError, setFormError] = useState("");

  // State: Toast Feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Status Metrics Calculation
  const stats = useMemo(() => {
    const total = tables.length;
    const available = tables.filter((t) => t.status === "Available").length;
    const occupied = tables.filter((t) => t.status === "Occupied").length;
    const reserved = tables.filter((t) => t.status === "Reserved").length;
    const cleaning = tables.filter((t) => t.status === "Cleaning").length;
    return { total, available, occupied, reserved, cleaning };
  }, [tables]);

  // Filtered Tables
  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      const matchesArea =
        selectedArea === "All Areas" || table.area === selectedArea;
      const matchesStatus =
        statusFilter === "All" || table.status === statusFilter;
      const matchesSearch =
        table.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        table.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (table.customerName &&
          table.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (table.waiter &&
          table.waiter.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesArea && matchesStatus && matchesSearch;
    });
  }, [tables, selectedArea, statusFilter, searchQuery]);

  // -------------------------------------------------------------
  // TABLE ACTIONS HANDLERS
  // -------------------------------------------------------------

  const handleUpdateStatus = (tableId, newStatus) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === tableId) {
          if (newStatus === "Available") {
            return {
              ...t,
              status: "Available",
              orderId: null,
              amount: null,
              waiter: null,
              customerName: null,
              orderItems: [],
              elapsedTime: null,
            };
          }
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
    setActiveTableModal(null);
    showToast(`Table status updated to ${newStatus}`);
  };

  const handleStartOrder = (table) => {
    setActiveTableModal(null);
    navigate("/order-taker");
  };

  const handleTransferTable = () => {
    if (!targetTransferTable) {
      showToast("Please select a target table to transfer", "error");
      return;
    }

    setTables((prev) => {
      const source = prev.find((t) => t.id === activeTableModal.id);
      const target = prev.find((t) => t.id === targetTransferTable);
      if (!source || !target) return prev;

      return prev.map((t) => {
        if (t.id === target.id) {
          return {
            ...t,
            status: "Occupied",
            orderId: source.orderId,
            amount: source.amount,
            waiter: source.waiter,
            customerName: source.customerName,
            orderItems: source.orderItems,
            elapsedTime: source.elapsedTime,
          };
        }
        if (t.id === source.id) {
          return {
            ...t,
            status: "Available",
            orderId: null,
            amount: null,
            waiter: null,
            customerName: null,
            orderItems: [],
            elapsedTime: null,
          };
        }
        return t;
      });
    });

    setIsTransferModalOpen(false);
    setActiveTableModal(null);
    showToast(`Order transferred to selected table successfully!`);
  };

  const handleAddTableSubmit = (e) => {
    e.preventDefault();
    if (!newTableData.number.trim()) {
      setFormError("Table number is required (e.g. Table 17)");
      return;
    }

    const newId = `t-${Date.now()}`;
    const newEntry = {
      id: newId,
      number: newTableData.number.trim(),
      seats: Number(newTableData.seats) || 4,
      area: newTableData.area,
      status: newTableData.status,
      orderId: null,
      amount: null,
      waiter: null,
      customerName: null,
      orderItems: [],
      elapsedTime: null,
    };

    setTables((prev) => [...prev, newEntry]);
    setIsAddTableOpen(false);
    setNewTableData({
      number: "",
      seats: 4,
      area: "Main Hall",
      status: "Available",
    });
    setFormError("");
    showToast(`Added ${newEntry.number} to ${newEntry.area}!`);
  };

  return (
    <div className="space-y-6">
      {/* HEADER & TOP CONTROLS */}
      <div className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search table, waiter, or guest name..."
            className="w-full pl-10 pr-4 py-2.5 bg-bg-main border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Area Dropdown & Add Button */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
          <div className="relative shrink-0">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2.5 rounded-xl bg-bg-main border border-border text-text-primary font-semibold text-xs cursor-pointer focus:outline-none focus:border-primary"
            >
              {FLOOR_AREAS.map((area) => (
                <option key={area} value={area}>
                  Floor: {area}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-[10px]">
              ▼
            </div>
          </div>

          <Button
            type="button"
            onClick={() => setIsAddTableOpen(true)}
            className="py-2.5 px-4 text-xs font-semibold shrink-0 gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Table</span>
          </Button>
        </div>
      </div>

      {/* STATUS METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <button
          type="button"
          onClick={() => setStatusFilter("All")}
          className={`p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer ${
            statusFilter === "All"
              ? "bg-bg-sidebar text-text-white border-bg-sidebar shadow-sm"
              : "bg-bg-card text-text-primary border-border hover:bg-bg-hover"
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium opacity-80">All Tables</span>
            <Building2 className="w-4 h-4 opacity-70" />
          </div>
          <p className="text-2xl font-bold">{stats.total}</p>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("Available")}
          className={`p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer ${
            statusFilter === "Available"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
              : "bg-emerald-50/70 border-emerald-200 text-emerald-800 hover:bg-emerald-100/70"
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold">Available</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold">{stats.available}</p>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("Occupied")}
          className={`p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer ${
            statusFilter === "Occupied"
              ? "bg-orange-600 text-white border-orange-600 shadow-sm"
              : "bg-orange-50/70 border-orange-200 text-orange-800 hover:bg-orange-100/70"
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold">Occupied</span>
            <Utensils className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold">{stats.occupied}</p>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("Reserved")}
          className={`p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer ${
            statusFilter === "Reserved"
              ? "bg-purple-600 text-white border-purple-600 shadow-sm"
              : "bg-purple-50/70 border-purple-200 text-purple-800 hover:bg-purple-100/70"
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold">Reserved</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold">{stats.reserved}</p>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("Cleaning")}
          className={`col-span-2 sm:col-span-1 p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer ${
            statusFilter === "Cleaning"
              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
              : "bg-blue-50/70 border-blue-200 text-blue-800 hover:bg-blue-100/70"
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold">Cleaning</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold">{stats.cleaning}</p>
        </button>
      </div>

      {/* FLOOR AREA TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {FLOOR_AREAS.map((area) => {
          const isActive = selectedArea === area;
          return (
            <button
              key={area}
              type="button"
              onClick={() => setSelectedArea(area)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-150 whitespace-nowrap cursor-pointer select-none ${
                isActive
                  ? "bg-primary text-text-white font-semibold shadow-xs"
                  : "bg-bg-card text-text-secondary hover:text-text-primary hover:bg-bg-hover border border-border"
              }`}
            >
              {area}
            </button>
          );
        })}
      </div>

      {/* TABLE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredTables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onClick={setActiveTableModal}
          />
        ))}

        {filteredTables.length === 0 && (
          <div className="col-span-full py-12 text-center bg-bg-card rounded-2xl border border-border p-6">
            <Building2 className="w-10 h-10 text-text-muted mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-text-primary">
              No tables found in this category
            </p>
            <p className="text-xs text-text-muted mt-1">
              Try adjusting the floor area or status filter.
            </p>
          </div>
        )}
      </div>

      {/* MODAL: TABLE DETAILS */}
      <TableDetails
        table={activeTableModal}
        isOpen={Boolean(activeTableModal)}
        onClose={() => setActiveTableModal(null)}
        onUpdateStatus={handleUpdateStatus}
        onStartOrder={handleStartOrder}
        onOpenTransfer={() => setIsTransferModalOpen(true)}
      />

      {/* MODAL: ADD NEW TABLE */}
      {isAddTableOpen && (
        <Modal
          isOpen={isAddTableOpen}
          onClose={() => setIsAddTableOpen(false)}
          title="Add New Restaurant Table"
          subtitle="Create and configure a new dining table on the floor map"
          footer={
            <>
              <button
                type="button"
                onClick={() => setIsAddTableOpen(false)}
                className="px-4 py-2 text-xs font-medium text-text-secondary hover:bg-bg-hover rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <Button
                type="button"
                onClick={handleAddTableSubmit}
                className="py-2 px-5 text-xs font-semibold"
              >
                Save Table
              </Button>
            </>
          }
        >
          <form onSubmit={handleAddTableSubmit} className="space-y-4">
            <Input
              label="Table Name / Number"
              placeholder="e.g. Table 17 or VIP-02"
              value={newTableData.number}
              onChange={(e) =>
                setNewTableData((p) => ({ ...p, number: e.target.value }))
              }
              error={formError}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-text-primary mb-1.5 block">
                  Seating Capacity
                </label>
                <select
                  value={newTableData.seats}
                  onChange={(e) =>
                    setNewTableData((p) => ({
                      ...p,
                      seats: Number(e.target.value),
                    }))
                  }
                  className="w-full text-sm px-3.5 py-2.5 bg-bg-card border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                >
                  <option value={2}>2 Persons (Couple)</option>
                  <option value={4}>4 Persons (Standard)</option>
                  <option value={6}>6 Persons (Family)</option>
                  <option value={8}>8 Persons (Large Group)</option>
                  <option value={12}>12 Persons (Party / Banquet)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-text-primary mb-1.5 block">
                  Floor Area
                </label>
                <select
                  value={newTableData.area}
                  onChange={(e) =>
                    setNewTableData((p) => ({ ...p, area: e.target.value }))
                  }
                  className="w-full text-sm px-3.5 py-2.5 bg-bg-card border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                >
                  <option value="Main Hall">Main Hall</option>
                  <option value="Outdoor">Outdoor Patio</option>
                  <option value="VIP Lounge">VIP Lounge</option>
                  <option value="Upstairs">Upstairs Hall</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-text-primary mb-1.5 block">
                Initial Status
              </label>
              <select
                value={newTableData.status}
                onChange={(e) =>
                  setNewTableData((p) => ({ ...p, status: e.target.value }))
                }
                className="w-full text-sm px-3.5 py-2.5 bg-bg-card border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
              >
                <option value="Available">Available (Ready)</option>
                <option value="Occupied">Occupied</option>
                <option value="Reserved">Reserved</option>
                <option value="Cleaning">Cleaning</option>
              </select>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL: TRANSFER TABLE */}
      {isTransferModalOpen && activeTableModal && (
        <Modal
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          title={`Transfer ${activeTableModal.number}`}
          subtitle={`Move current order (${activeTableModal.orderId}) to another available table`}
          footer={
            <>
              <button
                type="button"
                onClick={() => setIsTransferModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-text-secondary hover:bg-bg-hover rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <Button
                type="button"
                onClick={handleTransferTable}
                className="py-2 px-5 text-xs font-semibold"
              >
                Confirm Transfer
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <p className="text-xs text-text-secondary">
              Select an available destination table to transfer order items and bill:
            </p>

            <select
              value={targetTransferTable}
              onChange={(e) => setTargetTransferTable(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 bg-bg-card border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="">-- Choose Available Destination Table --</option>
              {tables
                .filter(
                  (t) =>
                    t.status === "Available" && t.id !== activeTableModal.id
                )
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.number} ({t.area} - {t.seats} Seats)
                  </option>
                ))}
            </select>
          </div>
        </Modal>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl text-white text-xs font-semibold flex items-center gap-2 ${
              toastMessage.type === "error" ? "bg-danger" : "bg-emerald-600"
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
