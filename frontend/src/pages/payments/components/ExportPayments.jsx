import React, { useState, useRef, useEffect } from "react";
import {
  Download,
  FileSpreadsheet,
  Printer,
  FileText,
  ChevronDown,
} from "lucide-react";
import Button from "../../../components/ui/Button";

export default function ExportPayments({
  payments = [],
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

  // 1. Export CSV
  const handleExportCSV = () => {
    setIsOpen(false);
    try {
      const headers = [
        "Invoice ID",
        "Payment ID",
        "Restaurant Name",
        "Restaurant Email",
        "Plan",
        "Billing Cycle",
        "Amount",
        "Currency",
        "Payment Method",
        "Payment Status",
        "Invoice Status",
        "Transaction Reference",
        "Payment Date",
        "Invoice Date",
        "Due Date",
        "Subtotal",
        "Tax",
        "Discount",
        "Total",
      ];

      const rows = payments.map((p) => [
        p.invoiceId,
        p.paymentId,
        `"${(p.restaurantName || "").replace(/"/g, '""')}"`,
        p.restaurantEmail,
        p.planName,
        p.billingCycle,
        `"${p.amount}"`,
        p.currency,
        p.paymentMethod,
        p.paymentStatus,
        p.invoiceStatus,
        `"${p.transactionReference || ""}"`,
        p.paymentDate,
        p.invoiceDate,
        p.dueDate,
        `"${p.subtotal}"`,
        `"${p.tax}"`,
        `"${p.discount}"`,
        `"${p.total}"`,
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `platform_payments_report_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (onExportSuccess) {
        onExportSuccess(`Exported ${payments.length} payment records to CSV.`);
      }
    } catch (err) {
      console.error("CSV Export error:", err);
    }
  };

  // 2. Print / PDF Summary View
  const handlePrintSummary = () => {
    setIsOpen(false);
    window.print();
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen((prev) => !prev)}
        className="!py-2 !px-3 text-xs flex items-center gap-1.5"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Export</span>
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
              <span className="text-[10px] text-text-muted">Spreadsheet format</span>
            </div>
          </button>

          <button
            type="button"
            onClick={handlePrintSummary}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-primary transition-colors cursor-pointer border-t border-border/60"
          >
            <Printer className="w-4 h-4 text-blue-600" />
            <div className="text-left">
              <span className="font-semibold block">Print / PDF Summary</span>
              <span className="text-[10px] text-text-muted">Browser print view</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
