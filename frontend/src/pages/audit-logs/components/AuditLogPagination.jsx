import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function AuditLogPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  onPageSizeChange,
}) {
  if (totalItems === 0) return null;

  return (
    <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs bg-bg-card">
      {/* Rows Per Page & Counter */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-text-muted">
          Showing{" "}
          <strong className="text-text-primary">
            {totalItems === 0 ? 0 : startIndex + 1}
          </strong>{" "}
          to <strong className="text-text-primary">{endIndex}</strong> of{" "}
          <strong className="text-text-primary">{totalItems}</strong> audit logs
        </span>

        <div className="flex items-center gap-1.5 ml-2">
          <span className="text-text-muted">Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
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
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          className="!px-2.5 !py-1 text-xs"
        >
          <ChevronLeft className="w-3.5 h-3.5 mr-0.5" />
          <span>Prev</span>
        </Button>

        <div className="flex items-center gap-1 px-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                currentPage === pageNum
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-muted hover:text-text-primary hover:bg-bg-hover"
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          className="!px-2.5 !py-1 text-xs"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </Button>
      </div>
    </div>
  );
}
