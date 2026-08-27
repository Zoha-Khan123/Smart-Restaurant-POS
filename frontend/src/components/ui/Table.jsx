import React from "react";

/**
 * Reusable Responsive Table Component
 */
export default function Table({ headers = [], children, className = "" }) {
  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-border bg-bg-card shadow-xs ${className}`}>
      <table className="w-full text-left text-xs sm:text-sm">
        {headers.length > 0 && (
          <thead className="bg-bg-main/70 border-b border-border text-text-muted uppercase text-[11px] font-bold tracking-wider">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-border-light text-text-primary">
          {children}
        </tbody>
      </table>
    </div>
  );
}
