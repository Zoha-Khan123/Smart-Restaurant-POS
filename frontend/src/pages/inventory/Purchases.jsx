import React, { useState } from "react";
import { Plus, ShoppingCart, CheckCircle2, FileText } from "lucide-react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

const SAMPLE_PURCHASES = [
  {
    id: "po-101",
    poNumber: "PO-2024-00101",
    supplier: "Al-Raza Farm Poultry",
    itemsSummary: "Chicken Boneless (50 KG)",
    totalAmount: 37500,
    date: "20 May 2024",
    status: "Received",
  },
  {
    id: "po-102",
    poNumber: "PO-2024-00102",
    supplier: "Dawn Bakery Ltd",
    itemsSummary: "Burger Buns (200 Pcs)",
    totalAmount: 5000,
    date: "19 May 2024",
    status: "Received",
  },
  {
    id: "po-103",
    poNumber: "PO-2024-00103",
    supplier: "Coca-Cola Bottlers",
    itemsSummary: "Coke 500ml (100 Bottles)",
    totalAmount: 7500,
    date: "20 May 2024",
    status: "Pending",
  },
];

/**
 * Smart POS - Inventory Purchases Log Component
 */
export default function Purchases() {
  const [purchases, setPurchases] = useState(SAMPLE_PURCHASES);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between bg-bg-card p-4 rounded-2xl border border-border shadow-xs">
        <div>
          <h3 className="text-base font-bold text-text-primary">
            Supplier Purchase Orders
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Log and track ingredient procurement and wholesale restocks
          </p>
        </div>

        <Button
          type="button"
          onClick={() => alert("New Purchase Order creator will open.")}
          className="py-2.5 px-4 text-xs font-bold gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Purchase Order</span>
        </Button>
      </div>

      {/* Purchases Table */}
      <div className="bg-bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[600px]">
          <thead className="bg-bg-main border-b border-border text-text-muted uppercase text-[10px] font-bold tracking-wider">
            <tr>
              <th className="px-5 py-3.5">PO Number</th>
              <th className="px-5 py-3.5">Supplier</th>
              <th className="px-5 py-3.5">Items Summary</th>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5 text-right">Total Amount</th>
              <th className="px-5 py-3.5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light text-text-primary">
            {purchases.map((po) => (
              <tr key={po.id} className="hover:bg-bg-hover transition-colors">
                <td className="px-5 py-4 font-mono font-bold text-primary">
                  {po.poNumber}
                </td>
                <td className="px-5 py-4 font-semibold text-text-primary">
                  {po.supplier}
                </td>
                <td className="px-5 py-4 text-text-secondary">
                  {po.itemsSummary}
                </td>
                <td className="px-5 py-4 text-text-muted">
                  {po.date}
                </td>
                <td className="px-5 py-4 text-right font-bold text-text-primary">
                  Rs. {po.totalAmount.toLocaleString()}
                </td>
                <td className="px-5 py-4 text-center">
                  <Badge
                    variant={po.status === "Received" ? "success" : "warning"}
                  >
                    {po.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
