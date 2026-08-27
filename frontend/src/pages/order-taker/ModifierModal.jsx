import React from "react";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";

/**
 * Order Taker - Product Modifier & Customization Modal
 */
export default function ModifierModal({
  product,
  isOpen,
  onClose,
  selectedSize,
  setSelectedSize,
  selectedAddOns = [],
  onToggleAddOn,
  modifierNote = "",
  setModifierNote,
  onConfirm,
  currentPrice,
}) {
  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Customize ${product.name}`}
      subtitle={`Category: ${product.category}`}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-text-secondary hover:bg-bg-hover rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <Button
            type="button"
            onClick={onConfirm}
            className="py-2 px-5 text-xs font-semibold"
          >
            Add to Order • Rs. {currentPrice}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Dish Summary Preview */}
        <div className="flex gap-4 items-center bg-bg-main p-3 rounded-xl border border-border">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80";
            }}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <h4 className="font-bold text-text-primary text-sm">
              {product.name}
            </h4>
            <p className="text-xs text-text-muted mt-0.5">
              {product.description}
            </p>
            <p className="text-xs font-bold text-primary mt-1">
              Base: Rs. {product.price}
            </p>
          </div>
        </div>

        {/* Size / Portion Selection */}
        {product.sizes?.length > 0 && (
          <div>
            <label className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-2">
              Choose Size / Portion
            </label>
            <div className="grid grid-cols-2 gap-2">
              {product.sizes.map((sz) => {
                const isSelected = selectedSize?.name === sz.name;
                return (
                  <button
                    key={sz.name}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary-light/50 text-primary font-bold shadow-xs"
                        : "border-border bg-bg-card text-text-secondary hover:border-text-muted"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{sz.name}</span>
                      <span className="text-[11px] font-semibold">
                        {sz.priceDelta > 0
                          ? `+Rs. ${sz.priceDelta}`
                          : sz.priceDelta < 0
                          ? `-Rs. ${Math.abs(sz.priceDelta)}`
                          : "Standard"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Add-ons Selection */}
        {product.addOns?.length > 0 && (
          <div>
            <label className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-2">
              Extra Add-ons
            </label>
            <div className="space-y-2">
              {product.addOns.map((addon) => {
                const isChecked = selectedAddOns.some((a) => a.id === addon.id);
                return (
                  <label
                    key={addon.id}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                      isChecked
                        ? "border-primary bg-primary-light/30"
                        : "border-border bg-bg-card hover:bg-bg-hover"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleAddOn(addon)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                      />
                      <span className="font-medium text-text-primary">
                        {addon.name}
                      </span>
                    </div>
                    <span className="font-semibold text-text-primary">
                      +Rs. {addon.price}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Special Instructions Note */}
        <div>
          <label className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-1.5">
            Special Instructions
          </label>
          <textarea
            value={modifierNote}
            onChange={(e) => setModifierNote(e.target.value)}
            placeholder="e.g. Extra spicy, sauce on the side, no onions..."
            rows={2}
            className="w-full text-xs p-3 bg-bg-main border border-border rounded-xl placeholder:text-text-muted text-text-primary focus:outline-none focus:border-primary resize-none"
          />
        </div>
      </div>
    </Modal>
  );
}
