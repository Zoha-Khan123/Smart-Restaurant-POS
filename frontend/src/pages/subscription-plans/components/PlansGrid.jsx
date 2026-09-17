import React from "react";
import PlanCard from "./PlanCard";
import EmptyState from "../../../components/ui/EmptyState";
import Button from "../../../components/ui/Button";
import { FolderOpen } from "lucide-react";

export default function PlansGrid({
  plans = [],
  onViewDetails,
  onEdit,
  onToggleStatus,
  onDelete,
  onResetFilters,
}) {
  if (plans.length === 0) {
    return (
      <div className="bg-bg-card rounded-2xl p-8 border border-border shadow-xs">
        <EmptyState
          icon={FolderOpen}
          title="No subscription plans found"
          description="Try modifying your search keywords or status filters to locate configured plans."
          action={
            <Button variant="outline" size="sm" onClick={onResetFilters}>
              Reset Filters
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 min-w-0">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
