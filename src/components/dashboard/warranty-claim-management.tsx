"use client";

import { useState } from "react";
import { FileText, PenLine, Wrench } from "lucide-react";
import { ItemSerialStatusLookup } from "@/components/dashboard/item-serial-status-lookup";
import { WarrantyDealerClaimPanel } from "@/components/dashboard/warranty-dealer-claim-panel";
import { WarrantyRepairWorkflowPanel } from "@/components/dashboard/warranty-repair-workflow-panel";
import { ClaimDocumentStagingPanel } from "@/components/dashboard/claim-document-staging-panel";
import { InternalClaimsTable } from "@/components/dashboard/internal-claims-table";

type View = "intake" | "repair" | "documents";

const views: { id: View; label: string; icon: typeof Wrench; desc: string }[] = [
  {
    id: "intake",
    label: "Register claim",
    icon: PenLine,
    desc: "Repair, refund, or inline replace workspace",
  },
  {
    id: "repair",
    label: "Repair pipeline",
    icon: Wrench,
    desc: "Received → In repair → QC → Repaired → Return (or reroute)",
  },
  {
    id: "documents",
    label: "Claim documents",
    icon: FileText,
    desc: "Staging log and open claims register",
  },
];

type WarrantyClaimManagementProps = {
  initialClaimSubType?: "repair" | "replace" | "refund";
};

export function WarrantyClaimManagement({
  initialClaimSubType,
}: WarrantyClaimManagementProps) {
  const [view, setView] = useState<View>("intake");

  return (
    <div className="space-y-6">
      <ItemSerialStatusLookup compact title="Check item serial status" />

      <div className="grid gap-3 sm:grid-cols-3">
        {views.map((v) => {
          const Icon = v.icon;
          const active = view === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setView(v.id)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                active
                  ? "border-orange-300 bg-orange-50 ring-1 ring-orange-200"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <Icon
                className={`mb-2 h-5 w-5 ${active ? "text-orange-600" : "text-slate-400"}`}
              />
              <p className={`text-sm font-semibold ${active ? "text-orange-900" : "text-slate-800"}`}>
                {v.label}
              </p>
              <p className="mt-1 text-xs text-slate-500">{v.desc}</p>
            </button>
          );
        })}
      </div>

      {view === "intake" && (
        <WarrantyDealerClaimPanel initialSubType={initialClaimSubType} />
      )}
      {view === "repair" && <WarrantyRepairWorkflowPanel />}
      {view === "documents" && (
        <div className="space-y-6">
          <ClaimDocumentStagingPanel />
          <InternalClaimsTable />
        </div>
      )}
    </div>
  );
}
