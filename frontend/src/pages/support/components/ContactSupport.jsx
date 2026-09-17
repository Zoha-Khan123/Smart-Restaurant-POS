import React, { useState } from "react";
import { Phone, Mail, MessageSquare, ExternalLink, ShieldAlert, Check, Copy } from "lucide-react";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import { SUPPORT_CONTACT_CHANNELS } from "../../../data/support";

const ICON_MAP = {
  phone: Phone,
  email: Mail,
  chat: MessageSquare,
};

export default function ContactSupport() {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Card
      title="Direct Platform Escalation Channels"
      subtitle="Priority support routes reserved exclusively for Super Administrators and Infrastructure Engineers."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SUPPORT_CONTACT_CHANNELS.map((ch, idx) => {
          const Icon = ICON_MAP[ch.type] || Mail;
          const isCopied = copiedIndex === idx;

          return (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-border bg-bg-main/40 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-primary-light text-primary border border-primary/20 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant={ch.variant || "primary"} size="sm">
                    {ch.badge}
                  </Badge>
                </div>

                <h4 className="text-sm font-bold text-text-primary mb-1">
                  {ch.title}
                </h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  {ch.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-text-primary truncate">
                  {ch.actionText}
                </span>

                <button
                  type="button"
                  onClick={() => handleCopy(ch.actionText, idx)}
                  className="p-1.5 rounded-lg border border-border bg-bg-card hover:bg-bg-hover text-text-muted hover:text-primary transition-colors cursor-pointer"
                  title="Copy contact"
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
