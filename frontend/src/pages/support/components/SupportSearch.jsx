import React from "react";
import { Search, Sparkles } from "lucide-react";

export default function SupportSearch({
  query = "",
  onQueryChange,
  activeTag = "all",
  onTagSelect,
}) {
  const POPULAR_TAGS = [
    { id: "all", label: "All Topics" },
    { id: "printers", label: "Thermal Printers" },
    { id: "billing", label: "Stripe Billing" },
    { id: "webhooks", label: "Webhooks & API" },
    { id: "2fa", label: "2FA Auth" },
    { id: "qr", label: "QR Menus" },
  ];

  return (
    <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-xs relative overflow-hidden">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-semibold border border-primary/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Super Admin Knowledge Hub & Help Center</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
          How can we help resolve platform issues today?
        </h2>

        {/* Big Search Input */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search FAQs, troubleshooting guides, terminal codes, ticket IDs..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-bg-main border border-border hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-text-primary transition-all shadow-inner"
          />
        </div>

        {/* Quick Tag Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
          <span className="text-xs font-medium text-text-muted">Popular:</span>
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => onTagSelect(tag.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer select-none ${
                activeTag === tag.id
                  ? "bg-primary text-white shadow-2xs"
                  : "bg-bg-hover text-text-secondary hover:text-text-primary hover:bg-border"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
