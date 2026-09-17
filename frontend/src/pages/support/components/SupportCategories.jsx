import React from "react";
import {
  Store,
  CreditCard,
  Laptop,
  ShieldAlert,
  Code,
  Activity,
  ChevronRight,
} from "lucide-react";
import { SUPPORT_CATEGORIES_DATA } from "../../../data/support";

const ICON_MAP = {
  Store,
  CreditCard,
  Laptop,
  ShieldAlert,
  Code,
  Activity,
};

export default function SupportCategories({
  selectedCategory = "all",
  onSelectCategory,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-text-primary tracking-tight">
            Browse Support Categories
          </h3>
          <p className="text-xs text-text-muted">
            Select a specialized knowledge module to inspect guides and operational FAQs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUPPORT_CATEGORIES_DATA.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || Store;
          const isSelected = selectedCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id === selectedCategory ? "all" : cat.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between select-none ${
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                  : "border-border bg-bg-card hover:bg-bg-hover hover:border-text-muted"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? "bg-primary text-white"
                        : "bg-primary-light text-primary border border-primary/20"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-text-muted">
                    {cat.articleCount} articles
                  </span>
                </div>

                <h4 className="text-sm font-bold text-text-primary mb-1">
                  {cat.title}
                </h4>
                <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                  {cat.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-border flex items-center justify-between text-xs font-semibold text-primary">
                <span>{isSelected ? "Active Filter" : "Explore Guides"}</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? "rotate-90" : ""}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
