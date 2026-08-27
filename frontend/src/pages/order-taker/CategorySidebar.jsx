import React from "react";

/**
 * Order Taker - Category Filter Bar / Sidebar
 */
export default function CategorySidebar({
  categories = [],
  selectedCategory = "All",
  onSelectCategory,
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {categories.map((cat) => {
        const isActive = selectedCategory === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`px-5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 whitespace-nowrap cursor-pointer select-none ${
              isActive
                ? "bg-primary text-text-white font-semibold shadow-sm shadow-primary/30"
                : "bg-bg-card text-text-secondary hover:text-text-primary hover:bg-bg-hover border border-border"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
