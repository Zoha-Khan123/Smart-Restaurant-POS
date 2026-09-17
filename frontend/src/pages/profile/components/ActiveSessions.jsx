import React from "react";
import { Laptop, Smartphone, Monitor, Globe, LogOut } from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";

export default function ActiveSessions({
  sessions = [],
  onRevokeSession,
  onRevokeAllOther,
}) {
  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case "mobile":
        return Smartphone;
      case "desktop":
      default:
        return Laptop;
    }
  };

  return (
    <Card
      title="Active Sessions"
      subtitle="Devices currently logged into your account."
      actions={
        sessions.length > 1 && (
          <Button
            variant="danger"
            size="sm"
            onClick={onRevokeAllOther}
            className="!py-1 !px-2.5 !text-[11px] font-semibold"
          >
            <LogOut className="w-3 h-3" />
            <span>Revoke Others</span>
          </Button>
        )
      }
    >
      <div className="divide-y divide-border min-w-0">
        {sessions.map((session) => {
          const Icon = getDeviceIcon(session.deviceType);
          return (
            <div
              key={session.id}
              className="py-3.5 first:pt-0 last:pb-0 flex flex-col gap-2 min-w-0"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    session.current
                      ? "bg-primary-light text-primary border border-primary/20"
                      : "bg-bg-main text-text-secondary border border-border"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-text-primary break-words">
                      {session.device}
                    </p>
                    {session.current && (
                      <Badge variant="success" size="sm" dot>
                        Current
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-text-muted mt-1 flex-wrap min-w-0">
                    <span className="flex items-center gap-1 font-mono shrink-0">
                      <Globe className="w-3 h-3 text-text-muted" />
                      {session.ip}
                    </span>
                    <span>•</span>
                    <span className="truncate max-w-[130px]">{session.location}</span>
                    <span>•</span>
                    <span className="font-semibold text-text-secondary shrink-0">
                      {session.lastActive}
                    </span>
                  </div>
                </div>
              </div>

              {!session.current && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => onRevokeSession(session.id)}
                    className="text-[11px] font-semibold text-danger hover:underline hover:text-danger-dark cursor-pointer px-2 py-0.5 rounded bg-danger/5 hover:bg-danger/10 border border-danger/20 transition-colors"
                  >
                    Revoke Session
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
