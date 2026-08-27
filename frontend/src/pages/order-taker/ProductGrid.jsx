import React from "react";
import { Plus, Utensils } from "lucide-react";

/**
 * Order Taker - Product Cards Grid
 */
export default function ProductGrid({
  products = [],
  onProductClick,
}) {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center bg-bg-card rounded-2xl border border-border p-6">
        <Utensils className="w-10 h-10 text-text-muted mx-auto mb-2 opacity-50" />
        <p className="text-sm font-semibold text-text-primary">No items found</p>
        <p className="text-xs text-text-muted mt-1">
          Try searching for something else or switch categories.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => onProductClick(product)}
          className="group bg-bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-md transition-all duration-150 p-3 flex flex-col justify-between cursor-pointer relative overflow-hidden"
        >
          {/* Food Image Container */}
          <div className="relative w-full h-28 sm:h-32 rounded-xl overflow-hidden bg-bg-main mb-3">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80";
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            {product.hasModifiers && (
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-bg-sidebar/80 backdrop-blur-xs text-[10px] font-medium text-amber-300">
                Customizable
              </span>
            )}
          </div>

          {/* Title & Category */}
          <div>
            <h4 className="font-bold text-text-primary text-sm line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h4>
            <p className="text-[11px] text-text-muted mt-0.5">
              {product.category}
            </p>
          </div>

          {/* Price & Add Button */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-border-light">
            <div>
              <span className="text-xs text-text-muted">Rs.</span>{" "}
              <span className="font-bold text-text-primary text-sm">
                {product.price}
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onProductClick(product);
              }}
              className="w-8 h-8 rounded-full bg-primary text-text-white flex items-center justify-center hover:bg-primary-dark active:scale-95 transition-all shadow-xs cursor-pointer"
              aria-label={`Add ${product.name}`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
