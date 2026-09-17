import React, { useState, useMemo } from "react";
import {
  LifeBuoy,
  Plus,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MoreVertical,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import EmptyState from "../../../components/ui/EmptyState";

export default function SupportTickets({
  tickets = [],
  onViewTicket,
  onCreateTicket,
  onUpdateTicketStatus,
}) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const STATUS_TABS = [
    { id: "all", label: "All Tickets" },
    { id: "Open", label: "Open" },
    { id: "In Progress", label: "In Progress" },
    { id: "Waiting Customer", label: "Waiting" },
    { id: "Resolved", label: "Resolved" },
    { id: "Closed", label: "Closed" },
  ];

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      // 1. Status Filter
      if (statusFilter !== "all" && t.status !== statusFilter) {
        return false;
      }

      // 2. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = t.ticketNumber?.toLowerCase().includes(q);
        const matchesSub = t.subject?.toLowerCase().includes(q);
        const matchesRest = t.restaurantName?.toLowerCase().includes(q);
        const matchesReq = t.requesterName?.toLowerCase().includes(q);
        const matchesCat = t.category?.toLowerCase().includes(q);
        if (!matchesId && !matchesSub && !matchesRest && !matchesReq && !matchesCat) {
          return false;
        }
      }

      return true;
    });
  }, [tickets, statusFilter, searchQuery]);

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Critical":
        return <Badge variant="danger" dot>Critical</Badge>;
      case "High":
        return <Badge variant="orange" dot>High</Badge>;
      case "Medium":
        return <Badge variant="warning" dot>Medium</Badge>;
      case "Low":
      default:
        return <Badge variant="info" dot>Low</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Open":
        return <Badge variant="warning" dot>Open</Badge>;
      case "In Progress":
        return <Badge variant="primary" dot>In Progress</Badge>;
      case "Waiting Customer":
        return <Badge variant="purple" dot>Waiting</Badge>;
      case "Resolved":
        return <Badge variant="success" dot>Resolved</Badge>;
      case "Closed":
        return <Badge variant="default" dot>Closed</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <Card
      title="Tenant Incident & Support Tickets"
      subtitle="Track customer tickets, dispatch platform engineers, and meet SLA resolution thresholds."
      actions={
        <Button
          variant="primary"
          size="sm"
          onClick={onCreateTicket}
          className="font-bold"
        >
          <Plus className="w-4 h-4 mr-1" />
          <span>New Ticket</span>
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Controls: Status Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
            {STATUS_TABS.map((tab) => {
              const isSelected = statusFilter === tab.id;
              const count =
                tab.id === "all"
                  ? tickets.length
                  : tickets.filter((t) => t.status === tab.id).length;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer select-none flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-primary text-white"
                      : "bg-bg-main text-text-secondary hover:text-text-primary hover:bg-bg-hover border border-border"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-border text-text-muted"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter tickets..."
              className="w-full text-xs rounded-lg bg-bg-main border border-border pl-8 pr-3 py-2 text-text-primary placeholder:text-text-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Tickets Table */}
        {filteredTickets.length === 0 ? (
          <EmptyState
            title="No Tickets Found"
            message="No support tickets match the selected status filter or search parameters."
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-bg-main/60 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Subject & Restaurant</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {filteredTickets.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-bg-hover/60 transition-colors"
                  >
                    {/* Ticket Number */}
                    <td className="py-3.5 px-4 font-mono font-bold text-primary whitespace-nowrap">
                      {t.ticketNumber}
                    </td>

                    {/* Subject & Restaurant */}
                    <td className="py-3.5 px-4 min-w-[200px] max-w-xs">
                      <p
                        onClick={() => onViewTicket(t)}
                        className="font-bold text-text-primary hover:text-primary cursor-pointer truncate"
                      >
                        {t.subject}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-text-muted truncate mt-0.5">
                        <span className="font-semibold text-text-secondary">
                          {t.restaurantName}
                        </span>
                        <span>•</span>
                        <span>{t.requesterName}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-text-secondary font-medium">
                        {t.category}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getPriorityBadge(t.priority)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(t.status)}
                    </td>

                    {/* Last Updated */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-text-muted">
                      {t.updatedAt}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <button
                        type="button"
                        onClick={() => onViewTicket(t)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-bg-card border border-border text-xs font-semibold text-text-primary hover:text-primary hover:border-primary/40 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}
