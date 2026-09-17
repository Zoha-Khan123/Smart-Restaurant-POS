import React from "react";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  Store,
  Receipt,
  BarChart3,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const ICON_MAP = {
  PlusCircle,
  Store,
  Receipt,
  BarChart3,
};

export default function QuickActions({ actions = [], onAddRestaurant }) {
  return (
    <div className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-text-primary text-base tracking-tight">
            Quick Actions
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-light text-primary border border-primary/20">
            Shortcuts
          </span>
        </div>
        <p className="text-xs text-text-muted hidden sm:block">
          Frequently used management tasks
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {actions.map((act) => {
          const IconComponent = ICON_MAP[act.icon] || Store;
          const isPrimary = act.primary;

          if (act.id === "qa-add-restaurant" && onAddRestaurant) {
            return (
              <button
                key={act.id}
                type="button"
                onClick={onAddRestaurant}
                className={`p-4 rounded-xl border text-left transition-all duration-150 group cursor-pointer flex flex-col justify-between ${
                  isPrimary
                    ? "bg-primary text-white border-primary shadow-sm hover:bg-primary-dark"
                    : "bg-bg-main border-border hover:border-primary/40 hover:bg-bg-hover text-text-primary"
                }`}
              >
                <div>
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                      isPrimary
                        ? "bg-white/20 text-white"
                        : "bg-primary-light text-primary border border-primary/20"
                    }`}
                  >
                    <IconComponent className="w-5 h-5 transition-transform duration-150 group-hover:scale-110" />
                  </div>
                  <h4
                    className={`text-sm font-bold tracking-tight ${
                      isPrimary ? "text-white" : "text-text-primary"
                    }`}
                  >
                    {act.title}
                  </h4>
                  <p
                    className={`text-xs mt-0.5 line-clamp-2 ${
                      isPrimary ? "text-white/80" : "text-text-muted"
                    }`}
                  >
                    {act.description}
                  </p>
                </div>

                <div
                  className={`flex items-center gap-1 text-xs font-semibold mt-3 pt-2 border-t ${
                    isPrimary
                      ? "text-white/90 border-white/20"
                      : "text-primary border-border-light"
                  }`}
                >
                  <span>Execute</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1" />
                </div>
              </button>
            );
          }

          return (
            <Link
              key={act.id}
              to={act.actionRoute}
              className={`p-4 rounded-xl border text-left transition-all duration-150 group flex flex-col justify-between ${
                isPrimary
                  ? "bg-primary text-white border-primary shadow-sm hover:bg-primary-dark"
                  : "bg-bg-main border-border hover:border-primary/40 hover:bg-bg-hover text-text-primary"
              }`}
            >
              <div>
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                    isPrimary
                      ? "bg-white/20 text-white"
                      : "bg-primary-light text-primary border border-primary/20"
                  }`}
                >
                  <IconComponent className="w-5 h-5 transition-transform duration-150 group-hover:scale-110" />
                </div>
                <h4
                  className={`text-sm font-bold tracking-tight ${
                    isPrimary ? "text-white" : "text-text-primary"
                  }`}
                >
                  {act.title}
                </h4>
                <p
                  className={`text-xs mt-0.5 line-clamp-2 ${
                    isPrimary ? "text-white/80" : "text-text-muted"
                  }`}
                >
                  {act.description}
                </p>
              </div>

              <div
                className={`flex items-center gap-1 text-xs font-semibold mt-3 pt-2 border-t ${
                  isPrimary
                    ? "text-white/90 border-white/20"
                    : "text-primary border-border-light"
                }`}
              >
                <span>Navigate</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
