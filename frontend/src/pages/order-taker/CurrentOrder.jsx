import React from "react";
import { Plus, Minus, Trash2, Utensils } from "lucide-react";
import Button from "../../components/ui/Button";

/**
 * Order Taker - Current Order / Cart Panel
 */
export default function CurrentOrder({
  cart = [],
  orderNumber = "#1024",
  orderType = "Dine In",
  selectedTable = "Table: 05",
  orderNote = "",
  setOrderNote,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onHoldOrder,
  onSendToKitchen,
  onPayAndPrint,
  subtotal,
  discount,
  taxAmount,
  grandTotal,
}) {
  return (
    <div className="bg-bg-card rounded-2xl border border-border shadow-md overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-bg-main/50 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-text-primary text-sm tracking-wide">
            CURRENT ORDER
          </h3>
          <p className="text-[11px] text-text-muted">
            {orderNumber} • {orderType}
          </p>
        </div>

        <div className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
          {selectedTable}
        </div>
      </div>

      {/* Cart Item List (Scrollable) */}
      <div className="p-4 space-y-3 max-h-[320px] overflow-y-auto divide-y divide-border-light">
        {cart.map((item) => (
          <div key={item.id} className="pt-3 first:pt-0 flex items-start justify-between gap-2">
            {/* Item Details */}
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-text-primary truncate">
                {item.name}
              </h5>

              {/* Size & Addon tags */}
              {item.selectedSize && (
                <p className="text-[10px] text-text-muted">
                  Size: {item.selectedSize}
                </p>
              )}
              {item.addOns?.length > 0 && (
                <p className="text-[10px] text-primary">
                  +{item.addOns.map((a) => a.name).join(", ")}
                </p>
              )}
              {item.note && (
                <p className="text-[10px] text-amber-600 italic">
                  Note: "{item.note}"
                </p>
              )}

              {/* Quantity Controls */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center border border-border rounded-lg bg-bg-main">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="p-1 hover:bg-bg-hover text-text-secondary hover:text-text-primary rounded-l-lg transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-2.5 text-xs font-bold text-text-primary">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="p-1 hover:bg-bg-hover text-text-secondary hover:text-text-primary rounded-r-lg transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <span className="text-xs text-text-muted">
                  @ Rs. {item.price}
                </span>
              </div>
            </div>

            {/* Price & Delete */}
            <div className="flex flex-col items-end justify-between self-stretch">
              <span className="text-xs font-bold text-text-primary">
                Rs. {item.price * item.quantity}
              </span>

              <button
                type="button"
                onClick={() => onRemoveItem(item.id)}
                className="p-1 text-danger hover:bg-danger-light rounded-md transition-colors cursor-pointer"
                aria-label="Remove item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {cart.length === 0 && (
          <div className="py-8 text-center text-text-muted">
            <Utensils className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs font-medium">Cart is currently empty</p>
            <p className="text-[11px] text-text-muted mt-0.5">
              Select items from the menu to start order
            </p>
          </div>
        )}
      </div>

      {/* Order Note Input */}
      <div className="px-4 py-2 bg-bg-main border-t border-border">
        <input
          type="text"
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value)}
          placeholder="Note (Optional)..."
          className="w-full text-xs px-3 py-2 bg-bg-card border border-border rounded-lg placeholder:text-text-muted text-text-primary focus:outline-none focus:border-primary"
        />
      </div>

      {/* Calculation Breakdown */}
      <div className="p-4 bg-bg-main/70 border-t border-border space-y-2 text-xs">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal</span>
          <span className="font-semibold text-text-primary">
            Rs. {subtotal.toLocaleString()}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-danger font-medium">
            <span>Discount</span>
            <span>- Rs. {discount.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between text-text-secondary">
          <span>Tax (5%)</span>
          <span className="font-semibold text-text-primary">
            Rs. {taxAmount.toLocaleString()}
          </span>
        </div>

        <div className="pt-2 border-t border-border flex justify-between items-baseline">
          <span className="text-sm font-bold text-text-primary uppercase tracking-wide">
            TOTAL
          </span>
          <span className="text-xl font-bold text-emerald-600">
            Rs. {grandTotal.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-bg-card border-t border-border space-y-2.5">
        {/* Hold & Clear */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onHoldOrder}
            disabled={cart.length === 0}
            className="py-2.5 px-3 rounded-xl border border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed text-center"
          >
            Hold Order
          </button>

          <button
            type="button"
            onClick={onClearCart}
            disabled={cart.length === 0}
            className="py-2.5 px-3 rounded-xl border border-danger/30 text-danger bg-danger-light hover:bg-danger/10 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed text-center"
          >
            Clear
          </button>
        </div>

        {/* Kitchen Send Button */}
        <Button
          type="button"
          onClick={onSendToKitchen}
          disabled={cart.length === 0}
          fullWidth
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 text-xs tracking-wider uppercase shadow-sm"
        >
          SEND TO KITCHEN
        </Button>

        {/* Pay & Print Button */}
        <Button
          type="button"
          onClick={onPayAndPrint}
          disabled={cart.length === 0}
          fullWidth
          className="bg-primary hover:bg-primary-dark text-white font-bold py-3 text-xs tracking-wider uppercase shadow-sm"
        >
          PAY & PRINT
        </Button>
      </div>
    </div>
  );
}
