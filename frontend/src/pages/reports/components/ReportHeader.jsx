import React from "react";
import { RefreshCw, Download, FileSpreadsheet, Printer } from "lucide-react";
import PageHeader from "../../../components/layout/PageHeader";
import Button from "../../../components/ui/Button";
import ExportReport from "./ExportReport";

export default function ReportHeader({
  onRefresh,
  isLoading,
  reportsData,
  onExportSuccess,
}) {
  return (
    <PageHeader
      title="Reports & Analytics"
      subtitle="Analyze platform revenue, restaurants, subscriptions, users and payment performance."
      actions={
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            loading={isLoading}
            className="!py-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <ExportReport
            reportsData={reportsData}
            onExportSuccess={onExportSuccess}
          />
        </div>
      }
    />
  );
}
