import React from "react";
import {
  Printer,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Phone,
  Utensils,
  Receipt,
  CreditCard,
  Building2,
} from "lucide-react";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

/**
 * Helper to get badge variant for order status
 */
export const getOrderStatusBadgeVariant = (status) => {
  switch (status) {
    case "Completed":
      return "success";
    case "Pending":
      return "warning";
    case "Cancelled":
      return "danger";
    case "Refunded":
      return "purple";
    default:
      return "default";
  }
};

/**
 * Smart POS - Order Details & Receipt Modal Component
 */
export default function OrderDetails({
  order,
  isOpen,
  onClose,
  onReorder,
}) {
  if (!order) return null;

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order Details: ${order.orderNumber}`}
      subtitle={`Invoice: ${order.invoiceNumber || order.orderNumber} • ${order.date}`}
      size="lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-bg-hover rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>

          <Button
            type="button"
            variant="outline"
            onClick={handlePrintReceipt}
            className="py-2 px-4 text-xs font-semibold gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-primary" />
            <span>Print Receipt</span>
          </Button>

          {onReorder && (
            <Button
              type="button"
              onClick={() => onReorder(order)}
              className="py-2.5 px-5 text-xs font-bold gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reorder Items</span>
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-5">
        
        {/* Top Info Banner */}
        <div className="p-4 rounded-xl bg-bg-main border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold text-xs shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-text-primary text-sm">
                  {order.table}
                </h4>
                <Badge variant="primary">{order.orderType}</Badge>
                <Badge variant={getOrderStatusBadgeVariant(order.status)}>
                  {order.status}
                </Badge>
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">
                Waiter: {order.waiter || "Usman Ali"} • Cashier: {order.cashier || "Ali Raza"}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs">
            <span className="text-text-muted block text-[11px]">Guest Details</span>
            <span className="font-bold text-text-primary">{order.customer}</span>
            {order.phone && order.phone !== "—" && (
              <span className="text-text-muted block text-[11px]">{order.phone}</span>
            )}
          </div>
        </div>

        {/* Itemized Ordered Dishes Table */}
        <div>
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
            Ordered Items ({order.items?.length || 0})
          </h4>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-bg-main border-b border-border text-text-muted uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-4 py-3">Item Description</th>
                  <th className="px-4 py-3 text-center">Qty</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light text-text-primary">
                {order.items?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-bg-hover">
                    <td className="px-4 py-3 font-semibold">{item.name}</td>
                    <td className="px-4 py-3 text-center font-bold text-primary">
                      {item.quantity}×
                    </td>
                    <td className="px-4 py-3 text-right text-text-secondary">
                      Rs. {item.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-text-primary">
                      Rs. {(item.quantity * item.price).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Calculation Breakdown */}
        <div className="p-4 rounded-xl bg-bg-main border border-border space-y-2 text-xs">
          <div className="flex justify-between text-text-secondary">
            <span>Items Subtotal</span>
            <span className="font-semibold text-text-primary">
              Rs. {order.subtotal?.toLocaleString()}
            </span>
          </div>

          {order.discount > 0 && (
            <div className="flex justify-between text-danger font-medium">
              <span>Applied Discount</span>
              <span>- Rs. {order.discount?.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between text-text-secondary">
            <span>Sales Tax / GST (5%)</span>
            <span className="font-semibold text-text-primary">
              Rs. {order.tax?.toLocaleString()}
            </span>
          </div>

          {order.serviceCharge > 0 && (
            <div className="flex justify-between text-text-secondary">
              <span>Service Charge</span>
              <span className="font-semibold text-text-primary">
                Rs. {order.serviceCharge?.toLocaleString()}
              </span>
            </div>
          )}

          <div className="pt-2.5 border-t border-border flex justify-between items-baseline">
            <span className="font-bold text-text-primary uppercase tracking-wide text-xs">
              Grand Total Paid
            </span>
            <span className="text-xl font-extrabold text-emerald-600">
              Rs. {order.grandTotal?.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Payment Mode Footer Pill */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-bg-card border border-border text-xs">
          <div className="flex items-center gap-2 text-text-muted">
            <CreditCard className="w-4 h-4 text-primary" />
            <span>Settlement Method:</span>
          </div>
          <span className="font-bold text-primary uppercase">
            {order.paymentMethod}
          </span>
        </div>

      </div>
    </Modal>
  );
}
