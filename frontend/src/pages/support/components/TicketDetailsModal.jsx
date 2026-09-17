import React, { useState } from "react";
import {
  LifeBuoy,
  Send,
  Building,
  User,
  Clock,
  Tag,
  AlertTriangle,
  CheckCircle2,
  Paperclip,
} from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";

export default function TicketDetailsModal({
  isOpen,
  onClose,
  ticket,
  onUpdateStatus,
  onAddReply,
}) {
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!isOpen || !ticket) return null;

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      const newMsg = {
        id: `msg-${Date.now()}`,
        sender: "Alexander Wright",
        senderRole: "Super Administrator",
        timestamp: "Just now",
        avatar: "AW",
        text: replyText.trim(),
      };
      onAddReply(ticket.id, newMsg);
      setReplyText("");
      setIsSending(false);
    }, 350);
  };

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ticket ${ticket.ticketNumber} — ${ticket.subject}`}
      subtitle={`Reported by ${ticket.requesterName} (${ticket.restaurantName})`}
      size="xl"
      footer={
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-text-muted">Change Status:</span>
            <select
              value={ticket.status}
              onChange={(e) => onUpdateStatus(ticket.id, e.target.value)}
              className="text-xs font-semibold rounded-lg bg-bg-card border border-border px-2.5 py-1 text-text-primary outline-none focus:border-primary cursor-pointer"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Waiting Customer">Waiting Customer</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <Button variant="secondary" onClick={onClose}>
            Close Window
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Ticket Metadata Header Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-bg-main border border-border text-xs">
          <div>
            <p className="text-[10px] text-text-muted uppercase font-bold">Priority</p>
            <div className="mt-1">{getPriorityBadge(ticket.priority)}</div>
          </div>

          <div>
            <p className="text-[10px] text-text-muted uppercase font-bold">Category</p>
            <p className="font-semibold text-text-primary mt-1 truncate">{ticket.category}</p>
          </div>

          <div>
            <p className="text-[10px] text-text-muted uppercase font-bold">Assigned Engineer</p>
            <p className="font-semibold text-primary mt-1 truncate">{ticket.assignedTo}</p>
          </div>

          <div>
            <p className="text-[10px] text-text-muted uppercase font-bold">Created</p>
            <p className="font-semibold text-text-primary mt-1 truncate">{ticket.createdAt}</p>
          </div>
        </div>

        {/* Conversation Message Feed */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Discussion & Activity Log
          </h4>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {ticket.messages &&
              ticket.messages.map((msg) => {
                const isSuperAdmin = msg.senderRole.includes("Super Admin") || msg.senderRole.includes("Support");
                return (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      isSuperAdmin
                        ? "bg-primary-light/40 border-primary/20 ml-4 sm:ml-8"
                        : "bg-bg-card border-border mr-4 sm:mr-8"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] select-none ${
                            isSuperAdmin
                              ? "bg-primary text-white"
                              : "bg-slate-700 text-white"
                          }`}
                        >
                          {msg.avatar || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-text-primary">
                            {msg.sender}
                          </p>
                          <p className="text-[10px] text-text-muted leading-none">
                            {msg.senderRole}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] text-text-muted">
                        {msg.timestamp}
                      </span>
                    </div>

                    <p className="text-text-secondary leading-relaxed pt-1 whitespace-pre-line">
                      {msg.text}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Reply Composer */}
        <form onSubmit={handleSendReply} className="pt-3 border-t border-border space-y-3">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-text-primary mb-1.5 flex items-center justify-between">
              <span>Reply to Requester</span>
              <span className="text-[11px] text-text-muted">Dispatches email to {ticket.requesterEmail}</span>
            </label>
            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your official administrative response or resolution steps..."
              className="w-full text-xs sm:text-sm rounded-lg bg-bg-card text-text-primary border border-border p-3 outline-none hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              className="text-xs text-text-muted hover:text-text-primary flex items-center gap-1 cursor-pointer"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>Attach Log / Diagnostic File</span>
            </button>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={isSending}
              disabled={!replyText.trim()}
              className="font-bold"
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              Send Response
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
