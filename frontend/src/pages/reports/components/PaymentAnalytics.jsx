import React from "react";
import { CreditCard, CheckCircle2, Clock, AlertTriangle, RotateCcw } from "lucide-react";
import Badge from "../../../components/ui/Badge";
import PaymentChart from "./PaymentChart";
import { PAYMENT_ANALYTICS_DATA } from "../../../data/reports";

export default function PaymentAnalytics({ data = PAYMENT_ANALYTICS_DATA }) {
  return (
    <div className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-text-primary text-base tracking-tight">
              Payment Settlement Health
            </h3>
            <Badge variant="success" size="sm">
              {data.successRate} Success
            </Badge>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Invoice settlement performance, arrears, and refund distributions
          </p>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
        <div className="p-3 rounded-xl bg-bg-main border border-border">
          <span className="text-[10px] text-text-muted uppercase font-bold block">
            Success Rate
          </span>
          <span className="text-base font-extrabold text-emerald-600 mt-0.5 block">
            {data.successRate}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-bg-main border border-border">
          <span className="text-[10px] text-text-muted uppercase font-bold block">
            Outstanding
          </span>
          <span className="text-base font-extrabold text-amber-600 mt-0.5 block">
            {data.outstandingAmount}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-bg-main border border-border">
          <span className="text-[10px] text-text-muted uppercase font-bold block">
            Refunded
          </span>
          <span className="text-base font-extrabold text-purple-600 mt-0.5 block">
            {data.refundedAmount}
          </span>
        </div>
      </div>

      {/* Horizontal Bar Chart */}
      <PaymentChart data={data.distribution} />

      {/* Methods Breakdown */}
      <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between gap-2 text-xs flex-wrap">
        {data.methods.map((m) => (
          <div key={m.method} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: m.color }}
            />
            <span className="text-text-secondary">{m.method}:</span>
            <strong className="text-text-primary">{m.percentage}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
