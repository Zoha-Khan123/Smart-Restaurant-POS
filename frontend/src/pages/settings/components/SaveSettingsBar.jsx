import React from "react";
import { Save, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";
import Button from "../../../components/ui/Button";

/**
 * SaveSettingsBar - Floating or embedded notification bar for unsaved settings state
 */
export default function SaveSettingsBar({
  isDirty = false,
  isSaving = false,
  onSave,
  onDiscard,
  lastSavedAt,
}) {
  if (!isDirty) {
    return (
      <div className="flex items-center justify-between p-4 bg-bg-card rounded-2xl border border-border text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>All platform settings are synchronized and up-to-date.</span>
        </div>
        {lastSavedAt && <span>Last saved: {lastSavedAt}</span>}
      </div>
    );
  }

  return (
    <div className="sticky bottom-6 z-40 bg-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">
            You have unsaved changes
          </p>
          <p className="text-xs text-slate-300">
            Changes will take effect immediately across all multi-tenant nodes once saved.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={onDiscard}
          disabled={isSaving}
          className="!text-slate-300 hover:!text-white hover:!bg-white/10"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Discard
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={onSave}
          loading={isSaving}
          className="shadow-lg shadow-primary/30 font-bold"
        >
          <Save className="w-4 h-4 mr-1" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
