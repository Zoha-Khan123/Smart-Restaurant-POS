import React from "react";

/**
 * Reusable Responsive Table Component matching Restaurant Admin design system
 */
export default function Table({
  headers = [],
  children,
  className = "",
  tableClassName = "",
  empty = false,
  emptyMessage = "No records found",
}) {
  return (
    <div
      className={`w-full overflow-x-auto rounded-xl border border-border bg-bg-card shadow-xs ${className}`.trim()}
    >
      <table className={`w-full text-left text-xs sm:text-sm ${tableClassName}`.trim()}>
        {headers.length > 0 && (
          <thead className="bg-bg-main/70 border-b border-border text-text-muted uppercase text-[11px] font-bold tracking-wider select-none">
            <tr>
              {headers.map((h, i) => {
                const isObj = typeof h === "object" && h !== null;
                const label = isObj ? h.label : h;
                const align = isObj ? h.align || "left" : "left";
                const customClass = isObj ? h.className || "" : "";

                const alignClasses = {
                  left: "text-left",
                  center: "text-center",
                  right: "text-right",
                };

                return (
                  <th
                    key={i}
                    className={`px-4 py-3.5 font-semibold whitespace-nowrap ${alignClasses[align] || "text-left"} ${customClass}`}
                  >
                    {label}
                  </th>
                );
              })}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-border-light text-text-primary">
          {empty ? (
            <tr>
              <td
                colSpan={headers.length || 1}
                className="px-4 py-8 text-center text-text-muted text-xs sm:text-sm"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}
