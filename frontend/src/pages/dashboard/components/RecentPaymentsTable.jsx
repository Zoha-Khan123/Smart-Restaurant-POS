import React from "react";
import { Link } from "react-router-dom";
import {
  Receipt,
  Download,
  ExternalLink,
  CreditCard,
  Eye,
} from "lucide-react";
import Table from "../../../components/ui/Table";
import Badge from "../../../components/ui/Badge";

export default function RecentPaymentsTable({ payments = [] }) {
  const headers = [
    { label: "Invoice ID", align: "left" },
    { label: "Restaurant", align: "left" },
    { label: "Amount", align: "left" },
    { label: "Method", align: "left" },
    { label: "Status", align: "left" },
    { label: "Date & Time", align: "left" },
    { label: "Action", align: "right" },
  ];

  return (
    <div className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs">
      {/* Table Header */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-bold text-text-primary text-base tracking-tight">
              Recent Payments & Invoices
            </h3>
            <Badge variant="teal" size="sm">
              Settlements
            </Badge>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Latest multi-tenant billing transactions and subscription payments
          </p>
        </div>

        <Link
          to="/super-admin/payments"
          className="text-xs font-semibold text-primary hover:text-primary-dark flex items-center gap-1 shrink-0"
        >
          <span>View All Invoices</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Table Component */}
      <Table headers={headers} empty={payments.length === 0}>
        {payments.map((pay) => (
          <tr
            key={pay.id}
            className="hover:bg-bg-hover/60 transition-colors group"
          >
            {/* Invoice ID */}
            <td className="px-4 py-3.5 font-mono text-xs font-bold text-primary whitespace-nowrap">
              <span className="bg-primary-light px-2 py-1 rounded-md border border-primary/20">
                {pay.invoiceId}
              </span>
            </td>

            {/* Restaurant */}
            <td className="px-4 py-3.5 whitespace-nowrap">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-bg-hover border border-border text-text-primary font-bold text-[10px] flex items-center justify-center shrink-0">
                  {pay.restaurantInitials}
                </div>
                <div>
                  <p className="font-bold text-text-primary text-xs">
                    {pay.restaurant}
                  </p>
                  <p className="text-[11px] text-text-muted">{pay.billingCycle}</p>
                </div>
              </div>
            </td>

            {/* Amount */}
            <td className="px-4 py-3.5 whitespace-nowrap">
              <span className="font-bold text-text-primary text-sm">
                {pay.amount}
              </span>
            </td>

            {/* Method */}
            <td className="px-4 py-3.5 whitespace-nowrap">
              <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary font-medium bg-bg-main px-2 py-0.5 rounded-md border border-border">
                <CreditCard className="w-3.5 h-3.5 text-text-muted" />
                {pay.paymentMethod}
              </span>
            </td>

            {/* Status */}
            <td className="px-4 py-3.5 whitespace-nowrap">
              <Badge variant={pay.statusVariant} size="sm" dot>
                {pay.status}
              </Badge>
            </td>

            {/* Date & Time */}
            <td className="px-4 py-3.5 whitespace-nowrap">
              <p className="font-medium text-text-primary text-xs">{pay.date}</p>
              <p className="text-[10px] text-text-muted">{pay.time}</p>
            </td>

            {/* Actions */}
            <td className="px-4 py-3.5 text-right whitespace-nowrap">
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  title="View Receipt"
                  className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary-light transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Download Invoice PDF"
                  className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
