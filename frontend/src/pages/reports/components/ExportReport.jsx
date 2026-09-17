import React, { useState, useRef, useEffect } from "react";
import {
  Download,
  FileSpreadsheet,
  Printer,
  ChevronDown,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import { SUMMARY_REPORTS_TABLE_ROWS } from "../../../data/reports";

export default function ExportReport({
  reportsData,
  onExportSuccess,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExportCSV = () => {
    setIsOpen(false);
    try {
      const headers = [
        "Period",
        "Total Restaurants",
        "New Outlets",
        "Active Subscriptions",
        "Monthly Revenue",
        "Settled Payments",
        "New Users Added",
        "Churn Rate",
      ];

      const rows = SUMMARY_REPORTS_TABLE_ROWS.map((r) => [
        `"${r.period}"`,
        r.restaurants,
        r.newRestaurants,
        r.activeSubscriptions,
        `"${r.revenue}"`,
        r.paymentsCount,
        r.newUsers,
        `"${r.churnRate}"`,
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `platform_analytics_report_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (onExportSuccess) {
        onExportSuccess("Full platform analytics report exported to CSV.");
      }
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  const handlePrint = () => {
    setIsOpen(false);
    window.print();
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <Button
        variant="primary"
        size="sm"
        onClick={() => setIsOpen((prev) => !prev)}
        className="!py-2 !px-3 text-xs flex items-center gap-1.5"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Export Report</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-bg-card border border-border shadow-xl z-50 py-1.5 animate-in fade-in-50 zoom-in-95 duration-100 text-left">
          <button
            type="button"
            onClick={handleExportCSV}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-primary transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <div className="text-left">
              <span className="font-semibold block">Export as CSV</span>
              <span className="text-[10px] text-text-muted">Metrics spreadsheet</span>
            </div>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-primary transition-colors cursor-pointer border-t border-border/60"
          >
            <Printer className="w-4 h-4 text-blue-600" />
            <div className="text-left">
              <span className="font-semibold block">Print / PDF Report</span>
              <span className="text-[10px] text-text-muted">Browser print view</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
