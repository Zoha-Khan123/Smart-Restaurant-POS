import React, { useState } from "react";
import { Boxes, AlertTriangle, FileText } from "lucide-react";
import Stock from "./Stock";
import LowStock from "./LowStock";
import Purchases from "./Purchases";

/**
 * Smart POS - Inventory & Stock Management Main Wrapper (Fully Responsive)
 */
export default function Inventory() {
  const [activeTab, setActiveTab] = useState("stock"); // 'stock' | 'low-stock' | 'purchases'

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Module Sub-Navigation Bar */}
      <div className="bg-bg-card rounded-2xl p-3 sm:p-4 border border-border shadow-xs flex items-center justify-between overflow-x-auto scrollbar-none">
        <div className="bg-bg-main p-1 rounded-xl border border-border flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("stock")}
            className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "stock"
                ? "bg-bg-card text-primary shadow-xs"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Stock Items</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("low-stock")}
            className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "low-stock"
                ? "bg-bg-card text-primary shadow-xs"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Low Stock Alerts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("purchases")}
            className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "purchases"
                ? "bg-bg-card text-primary shadow-xs"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Purchase Orders</span>
          </button>
        </div>
      </div>

      {/* Render Active View */}
      {activeTab === "stock" && <Stock />}
      {activeTab === "low-stock" && <LowStock />}
      {activeTab === "purchases" && <Purchases />}
    </div>
  );
}
