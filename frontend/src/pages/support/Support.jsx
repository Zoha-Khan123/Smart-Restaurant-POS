import React, { useState, useMemo } from "react";
import { LifeBuoy, Plus, RefreshCw, CheckCircle2, FileSpreadsheet } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";

import SupportOverview from "./components/SupportOverview";
import SupportSearch from "./components/SupportSearch";
import SupportCategories from "./components/SupportCategories";
import FAQList from "./components/FAQList";
import SupportTickets from "./components/SupportTickets";
import ContactSupport from "./components/ContactSupport";
import CreateTicketModal from "./components/CreateTicketModal";
import TicketDetailsModal from "./components/TicketDetailsModal";

import {
  INITIAL_SUPPORT_TICKETS,
  calculateSupportStats,
} from "../../data/supportTickets";

export default function Support() {
  const [tickets, setTickets] = useState(INITIAL_SUPPORT_TICKETS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState(null);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicketForDetails, setSelectedTicketForDetails] = useState(null);

  const stats = useMemo(() => {
    return calculateSupportStats(tickets);
  }, [tickets]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("Support ticket queues synchronized.");
    }, 450);
  };

  const handleCreateTicket = (newTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
    showToast(`Support Ticket ${newTicket.ticketNumber} created successfully.`);
  };

  const handleUpdateTicketStatus = (ticketId, newStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus, updatedAt: "Just now" } : t))
    );
    if (selectedTicketForDetails && selectedTicketForDetails.id === ticketId) {
      setSelectedTicketForDetails((prev) => ({ ...prev, status: newStatus, updatedAt: "Just now" }));
    }
    showToast(`Ticket status updated to ${newStatus}.`);
  };

  const handleAddTicketReply = (ticketId, newMsg) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            updatedAt: "Just now",
            messages: [...(t.messages || []), newMsg],
          };
        }
        return t;
      })
    );

    if (selectedTicketForDetails && selectedTicketForDetails.id === ticketId) {
      setSelectedTicketForDetails((prev) => ({
        ...prev,
        updatedAt: "Just now",
        messages: [...(prev.messages || []), newMsg],
      }));
    }
    showToast("Response sent to requester email.");
  };

  const handleTagSelect = (tagId) => {
    if (tagId === "all") {
      setSelectedTag("all");
      setSelectedCategory("all");
    } else {
      setSelectedTag(tagId);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0 pb-12">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-white/10 text-xs sm:text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* 1. Page Header */}
      <PageHeader
        title="Help, Support & Knowledge Hub"
        subtitle="Manage customer support inquiries, SLA compliance, knowledge runbooks, and emergency platform channels."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              loading={isRefreshing}
              className="!py-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="!py-2 font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Ticket</span>
            </Button>
          </>
        }
      />

      {/* 2. KPI Support Metrics */}
      <SupportOverview stats={stats} />

      {/* 3. Search Hero Banner */}
      <SupportSearch
        query={searchQuery}
        onQueryChange={setSearchQuery}
        activeTag={selectedTag}
        onTagSelect={handleTagSelect}
      />

      {/* 4. Support Knowledge Categories */}
      <SupportCategories
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 5. Frequently Asked Questions & Runbooks */}
      <FAQList
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        selectedTag={selectedTag}
      />

      {/* 6. Support Tickets Table */}
      <SupportTickets
        tickets={tickets}
        onViewTicket={(t) => setSelectedTicketForDetails(t)}
        onCreateTicket={() => setIsCreateModalOpen(true)}
        onUpdateTicketStatus={handleUpdateTicketStatus}
      />

      {/* 7. Escalation Channels */}
      <ContactSupport />

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTicket={handleCreateTicket}
      />

      {/* Ticket Details & Discussion Modal */}
      <TicketDetailsModal
        isOpen={Boolean(selectedTicketForDetails)}
        onClose={() => setSelectedTicketForDetails(null)}
        ticket={selectedTicketForDetails}
        onUpdateStatus={handleUpdateTicketStatus}
        onAddReply={handleAddTicketReply}
      />
    </div>
  );
}
