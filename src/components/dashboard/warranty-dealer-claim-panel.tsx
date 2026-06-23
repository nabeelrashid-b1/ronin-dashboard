"use client";

import { ArrowRightLeft, Banknote, Wrench } from "lucide-react";
import { ReturnReplacementWorkspace } from "@/components/dashboard/return-replacement-workspace";
import { useEffect, useMemo, useState } from "react";
import { useAppDataContext } from "@/components/providers/app-data-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkflowStepper } from "@/components/ui/workflow-stepper";
import { StagingTable } from "@/components/ui/staging-table";
import { FIELDS, INTERNAL_CLAIM_CATEGORY, WARRANTY_SUB_TYPE } from "@/config/fields";
import { postDealerRefundClaim, postDealerRepairClaim } from "@/lib/claim-service";
import {
  canReceiveDealerWarrantyClaim,
  getNewClaimIneligibilityReason,
  lookupSerialForClaim,
} from "@/lib/claim-utils";
import { DEFAULT_SAP_CARD_CODE } from "@/lib/sap-customers";
import { saveAppData, generateId } from "@/lib/storage";
import type { WarrantySubType } from "@/lib/types";
import { SapCardCodeSelect } from "./sap-card-code-select";

type StagedRepair = { id: string; serialNumber: string; remarks: string };
type StagedRefund = {
  id: string;
  serialNumber: string;
  creditNote: string;
  remarks: string;
  returnedUnitSaleable: boolean;
};

type WarrantyDealerClaimPanelProps = {
  initialSubType?: WarrantySubType;
};

export function WarrantyDealerClaimPanel({
  initialSubType = "repair",
}: WarrantyDealerClaimPanelProps) {
  const { data, updateData } = useAppDataContext();
  const [subType, setSubType] = useState<WarrantySubType>(initialSubType);

  useEffect(() => {
    if (initialSubType) setSubType(initialSubType);
  }, [initialSubType]);

  const [cardCode, setCardCode] = useState(DEFAULT_SAP_CARD_CODE);
  const [scan, setScan] = useState("");
  const [creditNote, setCreditNote] = useState("");
  const [remarks, setRemarks] = useState("");
  const [repairStaged, setRepairStaged] = useState<StagedRepair[]>([]);
  const [refundStaged, setRefundStaged] = useState<StagedRefund[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [intakeStep, setIntakeStep] = useState(0);

  const repairSteps = [
    { id: "card", label: "Dealer / card", description: "SAP card code" },
    { id: "scan", label: "Scan unit", description: "Defective serial" },
    { id: "post", label: "Post claim", description: "Status → Received" },
  ];
  const refundSteps = [
    { id: "card", label: "Card code", description: "Dealer account" },
    { id: "scan", label: "Scan & CN", description: "Serial + credit note" },
    { id: "post", label: "Post refund", description: "Close claim" },
  ];

  const activeSteps = subType === "repair" ? repairSteps : refundSteps;
  const activeStepId = activeSteps[Math.min(intakeStep, activeSteps.length - 1)]?.id ?? "card";

  function addRepairRow() {
    setError(null);
    if (!data || !cardCode.trim()) return;
    const serial = lookupSerialForClaim(data.serials, scan);
    if (!serial) {
      setError("Serial not found.");
      return;
    }
    if (!canReceiveDealerWarrantyClaim(serial)) {
      setError(getNewClaimIneligibilityReason(serial) ?? "Item not eligible for warranty claim.");
      return;
    }
    if (repairStaged.some((r) => r.serialNumber === serial.serialNumber)) {
      setError("Already in grid.");
      return;
    }
    setRepairStaged((r) => [...r, { id: generateId(), serialNumber: serial.serialNumber, remarks }]);
    setScan("");
    setRemarks("");
  }

  function addRefundRow() {
    setError(null);
    if (!data || !creditNote.trim()) {
      setError("Credit note required.");
      return;
    }
    const serial = lookupSerialForClaim(data.serials, scan);
    if (!serial) {
      setError("Serial not found.");
      return;
    }
    if (!canReceiveDealerWarrantyClaim(serial)) {
      setError(getNewClaimIneligibilityReason(serial) ?? "Serial not eligible.");
      return;
    }
    setRefundStaged((r) => [
      ...r,
      {
        id: generateId(),
        serialNumber: serial.serialNumber,
        creditNote,
        remarks,
        returnedUnitSaleable: false,
      },
    ]);
    setScan("");
    setCreditNote("");
    setRemarks("");
  }

  function handlePost() {
    setError(null);
    setSuccess(null);
    if (!data || !cardCode.trim()) {
      setError("Card Code required.");
      return;
    }

    let next = data;
    if (subType === "repair") {
      if (repairStaged.length === 0) {
        setError("Add at least one repair row to the grid.");
        return;
      }
      for (const row of repairStaged) {
        const serial = data.serials.find((s) => s.serialNumber === row.serialNumber)!;
        next = postDealerRepairClaim(next, serial, cardCode.trim(), row.remarks);
      }
      setRepairStaged([]);
      setSuccess(`Posted ${repairStaged.length} repair claim(s) — status Received.`);
    } else {
      if (refundStaged.length === 0) {
        setError("Add refund row(s) to grid.");
        return;
      }
      for (const row of refundStaged) {
        const serial = next.serials.find((s) => s.serialNumber === row.serialNumber)!;
        next = postDealerRefundClaim(
          next,
          serial,
          cardCode.trim(),
          row.creditNote,
          row.remarks,
          row.returnedUnitSaleable,
        );
      }
      setRefundStaged([]);
      setSuccess(`Posted ${refundStaged.length} refund claim(s).`);
    }

    saveAppData(next);
    updateData(() => next);
  }

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{INTERNAL_CLAIM_CATEGORY.warrantyClaim.label}</CardTitle>
        <p className="text-sm text-slate-500">
          Register repair, refund, or replacement claims. Use Replace for routed requests and
          direct scan (credit note, new serial, dispatch).
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-3">
          {(
            [
              { id: "repair" as const, label: WARRANTY_SUB_TYPE.repair.label, icon: Wrench, hint: "Received → repair pipeline" },
              {
                id: "replace" as const,
                label: WARRANTY_SUB_TYPE.replace.label,
                icon: ArrowRightLeft,
                hint: "Routed + direct scan",
              },
              { id: "refund" as const, label: WARRANTY_SUB_TYPE.refund.label, icon: Banknote, hint: "Credit note + return" },
            ] as const
          ).map((t) => {
            const Icon = t.icon;
            const active = subType === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setSubType(t.id);
                  setIntakeStep(0);
                  setError(null);
                }}
                className={`rounded-xl border p-4 text-left ${
                  active
                    ? "border-orange-300 bg-orange-50 ring-1 ring-orange-200"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <Icon className={`mb-2 h-5 w-5 ${active ? "text-orange-600" : "text-slate-400"}`} />
                <p className="text-sm font-semibold">{t.label}</p>
                <p className="mt-1 text-xs text-slate-500">{t.hint}</p>
              </button>
            );
          })}
        </div>

        {subType === "replace" ? (
          <ReturnReplacementWorkspace embedded />
        ) : (
          <>
        <WorkflowStepper steps={activeSteps} currentStepId={activeStepId} />

        <SapCardCodeSelect
          value={cardCode}
          onChange={(code) => {
            setCardCode(code);
            if (code.trim()) setIntakeStep(1);
          }}
          required
        />

        {subType === "repair" && (
          <>
            <div>
              <label className="mb-1 block text-xs font-medium">{FIELDS.qrCode.label}</label>
              <input
                value={scan}
                onChange={(e) => setScan(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRepairRow())}
                className={inputClass}
                placeholder="Scan defective unit"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">{FIELDS.remarks.label}</label>
              <input value={remarks} onChange={(e) => setRemarks(e.target.value)} className={inputClass} placeholder="Issue description" />
            </div>
            <button
              type="button"
              onClick={() => {
                addRepairRow();
                setIntakeStep(2);
              }}
              className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-800 hover:bg-orange-100"
            >
              Add to staging grid
            </button>
            {repairStaged.length > 0 && (
              <StagingTable
                rows={repairStaged}
                onRemove={(id) => setRepairStaged((r) => r.filter((x) => x.id !== id))}
                columns={[
                  { id: "sn", header: "Serial", className: "font-mono text-xs", cell: (r) => r.serialNumber },
                  { id: "rm", header: "Remarks", cell: (r) => r.remarks || "—" },
                ]}
              />
            )}
          </>
        )}

        {subType === "refund" && (
          <>
            <input value={scan} onChange={(e) => setScan(e.target.value)} placeholder="Serial / QR" className={inputClass} />
            <input
              value={creditNote}
              onChange={(e) => setCreditNote(e.target.value)}
              placeholder={FIELDS.creditNote.label}
              className={inputClass}
            />
            <input value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Remarks" className={inputClass} />
            <button
              type="button"
              onClick={() => {
                addRefundRow();
                setIntakeStep(2);
              }}
              className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-800 hover:bg-orange-100"
            >
              Add to staging grid
            </button>
            {refundStaged.length > 0 && (
              <StagingTable
                rows={refundStaged}
                onRemove={(id) => setRefundStaged((r) => r.filter((x) => x.id !== id))}
                columns={[
                  { id: "sn", header: "Serial", className: "font-mono text-xs", cell: (r) => r.serialNumber },
                  { id: "cn", header: "Credit note", cell: (r) => r.creditNote },
                ]}
              />
            )}
          </>
        )}

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="mb-2 text-xs font-medium text-slate-600">Confirm &amp; post</p>
            <button
              type="button"
              onClick={handlePost}
              className="w-full rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 sm:w-auto"
            >
              Post to Warranty_claim
            </button>
          </div>

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {success && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{success}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );
}
