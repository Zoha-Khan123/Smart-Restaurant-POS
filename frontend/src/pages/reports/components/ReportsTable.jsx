import React from "react";
import Table from "../../../components/ui/Table";
import Badge from "../../../components/ui/Badge";
import { SUMMARY_REPORTS_TABLE_ROWS } from "../../../data/reports";

export default function ReportsTable({
  data = SUMMARY_REPORTS_TABLE_ROWS,
}) {
  const headers = [
    { label: "Reporting Period", align: "left" },
    { label: "Total Restaurants", align: "center" },
    { label: "New Outlets", align: "center" },
    { label: "Active Subs", align: "center" },
    { label: "Gross Revenue", align: "left" },
    { label: "Invoices Settled", align: "center" },
    { label: "New Users", align: "center" },
    { label: "Churn Rate", align: "right" },
  ];

  return (
    <div className="bg-bg-card rounded-2xl border border-border shadow-xs overflow-hidden min-w-0">
      <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-bold text-text-primary text-sm sm:text-base">
            Multi-Period Platform Performance Summary
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Aggregated historical trends across revenue, tenant onboarding, and churn rates
          </p>
        </div>
      </div>

      <Table headers={headers}>
        {data.map((row, idx) => (
          <tr
            key={row.period || idx}
            className="hover:bg-bg-hover/60 transition-colors"
          >
            {/* 1. Reporting Period */}
            <td className="px-4 py-3.5 whitespace-nowrap">
              <span className="font-bold text-text-primary text-xs sm:text-sm">
                {row.period}
              </span>
              {idx === 0 && (
                <span className="ml-2 px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-primary-light text-primary border border-primary/20">
                  Current
                </span>
              )}
            </td>

            {/* 2. Total Restaurants */}
            <td className="px-4 py-3.5 text-center whitespace-nowrap text-xs font-semibold text-text-primary">
              {row.restaurants}
            </td>

            {/* 3. New Outlets */}
            <td className="px-4 py-3.5 text-center whitespace-nowrap text-xs font-semibold text-emerald-600">
              +{row.newRestaurants}
            </td>

            {/* 4. Active Subs */}
            <td className="px-4 py-3.5 text-center whitespace-nowrap text-xs font-semibold text-primary">
              {row.activeSubscriptions}
            </td>

            {/* 5. Gross Revenue */}
            <td className="px-4 py-3.5 whitespace-nowrap text-xs font-extrabold text-text-primary font-mono">
              {row.revenue}
            </td>

            {/* 6. Invoices Settled */}
            <td className="px-4 py-3.5 text-center whitespace-nowrap text-xs font-semibold text-text-primary">
              {row.paymentsCount}
            </td>

            {/* 7. New Users */}
            <td className="px-4 py-3.5 text-center whitespace-nowrap text-xs font-semibold text-indigo-600">
              +{row.newUsers}
            </td>

            {/* 8. Churn Rate */}
            <td className="px-4 py-3.5 text-right whitespace-nowrap text-xs">
              <Badge variant="default" size="sm">
                {row.churnRate}
              </Badge>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
