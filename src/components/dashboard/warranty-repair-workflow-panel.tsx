"use client";

import { useMemo, useState } from "react";
import { useAppDataContext } from "@/components/providers/app-data-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkflowStepper } from "@/components/ui/workflow-stepper";
import { FIELDS, INTERNAL_CLAIM_STATUS } from "@/config/fields";
import {
  canRerouteRepair,
  getReplacementChain,
  getRepairWorkflowStep,
  isClaimOpen,
  lookupSerialForClaim,
} from "@/lib/claim-utils";
import { getReplacementSalesOrders, getSalesOrder } from "@/lib/sales-orders";
import { getDispatchedSalesOrderNumbers } from "@/lib/dispatch-service";
import {
  advanceRepairToInRepair,
  markRepairQcPassed,
  rerouteRepairToRefund,
  rerouteRepairToReplace,
  returnRepairedToCustomer,
  sendRepairToInQc,
} from "@/lib/claim-service";
import { saveAppData } from "@/lib/storage";
import type { WarrantyClaimRecord } from "@/lib/types";

const REPAIR_STEPS = [
  { id: "received", label: INTERNAL_CLAIM_STATUS.received.label, description: "Unit received at service" },
  { id: "in-repair", label: INTERNAL_CLAIM_STATUS.inRepair.label, description: "Technician working" },
  { id: "in-qc", label: INTERNAL_CLAIM_STATUS.inQc.label, description: "Quality check" },
  { id: "repaired", label: INTERNAL_CLAIM_STATUS.repaired.label, description: "Ready to return" },
  { id: "closed", label: INTERNAL_CLAIM_STATUS.closed.label, description: "Returned to customer" },
] as const;

const statusLabel = (s: string) =>
  Object.values(INTERNAL_CLAIM_STATUS).find((x) => x.value === s)?.label ?? s;

export function WarrantyRepairWorkflowPanel() {
  const { data, updateData } = useAppDataContext();
  const [selectedId, setSelectedId] = useState("");
  const [accessory, setAccessory] = useState("");
  const [notes, setNotes] = useState("");
  const [creditNote, setCreditNote] = useState("");
  const [newScan, setNewScan] = useState("");
  const [replaceSo, setReplaceSo] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openSos = useMemo(
    () => (data ? getReplacementSalesOrders(getDispatchedSalesOrderNumbers(data)) : []),
    [data],
  );

  const openClaims = useMemo(
    () =>
      data?.claims.filter(
        (c) => c.warrantySubType === "repair" && isClaimOpen(c),
      ) ?? [],
    [data],
  );

  const selected = useMemo(
    () => openClaims.find((c) => c.claimId === selectedId),
    [openClaims, selectedId],
  );

  function persist(next: typeof data) {
    if (!next) return;
    saveAppData(next);
    updateData(() => next);
  }

  function run(action: () => void) {
    setError(null);
    action();
  }

  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Standard repair workflow</CardTitle>
        <p className="text-sm text-slate-500">
          Select an open repair claim, follow the pipeline step by step, or reroute to refund / replace if not repairable.
        </p>
      </CardHeader>
      <CardContent>
        {openClaims.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            No open repair claims. Register a repair claim in <strong>Register claim</strong> first.
          </p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Open repair claims ({openClaims.length})
              </p>
              <ul className="max-h-[420px] space-y-1 overflow-y-auto rounded-lg border border-slate-200 p-1">
                {openClaims.map((claim) => (
                  <li key={claim.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(claim.claimId);
                        setMessage(null);
                        setError(null);
                      }}
                      className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                        selectedId === claim.claimId
                          ? "bg-orange-100 text-orange-900"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <span className="block font-mono text-xs font-semibold">{claim.claimId}</span>
                      <span className="text-xs text-slate-500">{claim.serialNumber}</span>
                      <Badge variant="info" className="mt-1">
                        {statusLabel(claim.claimStatus)}
                      </Badge>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {selected ? (
              <ClaimWorkflowDetail
                claim={selected}
                data={data}
                openSos={openSos}
                accessory={accessory}
                setAccessory={setAccessory}
                notes={notes}
                setNotes={setNotes}
                creditNote={creditNote}
                setCreditNote={setCreditNote}
                newScan={newScan}
                setNewScan={setNewScan}
                replaceSo={replaceSo}
                setReplaceSo={setReplaceSo}
                error={error}
                setError={setError}
                message={message}
                setMessage={setMessage}
                persist={persist}
                run={run}
              />
            ) : (
              <p className="flex h-full min-h-[200px] items-center justify-center text-sm text-slate-400">
                Select a claim from the list
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ClaimWorkflowDetail({
  claim,
  data,
  openSos,
  accessory,
  setAccessory,
  notes,
  setNotes,
  creditNote,
  setCreditNote,
  newScan,
  setNewScan,
  replaceSo,
  setReplaceSo,
  error,
  setError,
  message,
  setMessage,
  persist,
  run,
}: {
  claim: WarrantyClaimRecord;
  data: NonNullable<ReturnType<typeof useAppDataContext>["data"]>;
  openSos: ReturnType<typeof getReplacementSalesOrders>;
  accessory: string;
  setAccessory: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  creditNote: string;
  setCreditNote: (v: string) => void;
  newScan: string;
  setNewScan: (v: string) => void;
  replaceSo: string;
  setReplaceSo: (v: string) => void;
  error: string | null;
  setError: (v: string | null) => void;
  message: string | null;
  setMessage: (v: string | null) => void;
  persist: (next: typeof data) => void;
  run: (action: () => void) => void;
}) {
  const step = getRepairWorkflowStep(claim);
  const chain = getReplacementChain(data.serials, claim.serialNumber);
  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20";

  const currentStepId =
    step === "rerouted" ? "closed" : step === "closed" ? "closed" : step;

  return (
    <div className="space-y-5 rounded-xl border border-slate-200 bg-slate-50/50 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-sm font-bold text-slate-900">{claim.claimId}</span>
        <Badge variant="info">{statusLabel(claim.claimStatus)}</Badge>
        <span className="text-xs text-slate-500">
          {claim.serialNumber}
          {claim.cardCode ? ` · ${claim.cardCode}` : ""}
        </span>
      </div>

      <WorkflowStepper steps={[...REPAIR_STEPS]} currentStepId={currentStepId} />

      {chain.length > 1 && (
        <p className="text-xs text-slate-600">
          {FIELDS.replacementChain.label}: {chain.map((s) => s.serialNumber).join(" → ")}
        </p>
      )}

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">
          {FIELDS.remarks.label} / workflow notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className={inputClass}
          placeholder="Notes for this step…"
        />
      </div>

      <div className="rounded-lg border border-white bg-white p-4 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Next action
        </p>
        <div className="flex flex-wrap gap-2">
          {claim.claimStatus === "received" && (
            <button
              type="button"
              onClick={() =>
                run(() => {
                  const next = advanceRepairToInRepair(data, claim.claimId, notes || "Start repair");
                  persist(next);
                  setMessage(`Started repair — ${statusLabel("in-repair")}`);
                  setNotes("");
                })
              }
              className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
            >
              Start repair
            </button>
          )}
          {claim.claimStatus === "in-repair" && (
            <button
              type="button"
              onClick={() =>
                run(() => {
                  const next = sendRepairToInQc(data, claim.claimId, notes);
                  persist(next);
                  setMessage(`Sent to QC — ${statusLabel("in-qc")}`);
                  setNotes("");
                })
              }
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
            >
              Send to QC
            </button>
          )}
          {claim.claimStatus === "in-qc" && (
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium">Accessory / repair detail</label>
                <input
                  value={accessory}
                  onChange={(e) => setAccessory(e.target.value)}
                  className={inputClass}
                  placeholder="Parts replaced, test results…"
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  run(() => {
                    const next = markRepairQcPassed(
                      data,
                      claim.claimId,
                      accessory || "QC passed",
                      notes,
                    );
                    persist(next);
                    setMessage(`QC passed — ${statusLabel("repaired")}`);
                    setAccessory("");
                    setNotes("");
                  })
                }
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
              >
                QC passed
              </button>
            </div>
          )}
          {claim.claimStatus === "repaired" && (
            <button
              type="button"
              onClick={() =>
                run(() => {
                  const next = returnRepairedToCustomer(
                    data,
                    claim.claimId,
                    notes || "Returned to dealer / customer",
                  );
                  persist(next);
                  setMessage("Unit returned — claim closed.");
                  setNotes("");
                })
              }
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Return to customer / dealer
            </button>
          )}
        </div>
      </div>

      {canRerouteRepair(claim) && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-3">
          <p className="text-sm font-semibold text-amber-900">Cannot repair — reroute</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium">{FIELDS.creditNote.label} (refund)</label>
              <input
                value={creditNote}
                onChange={(e) => setCreditNote(e.target.value)}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() =>
                  run(() => {
                    if (!creditNote.trim()) {
                      setError("Credit note required for refund reroute.");
                      return;
                    }
                    const next = rerouteRepairToRefund(
                      data,
                      claim.claimId,
                      creditNote.trim(),
                      false,
                      notes || "Cannot repair — refund",
                    );
                    persist(next);
                    setMessage("Rerouted to refund.");
                    setCreditNote("");
                  })
                }
                className="mt-2 w-full rounded-lg border border-amber-300 bg-white py-2 text-sm font-medium hover:bg-amber-100"
              >
                Reroute to refund
              </button>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">{FIELDS.salesOrderNumber.label} (replace)</label>
              <select
                value={replaceSo}
                onChange={(e) => setReplaceSo(e.target.value)}
                className={inputClass}
              >
                <option value="">Select SO for new unit</option>
                {openSos.map((o) => (
                  <option key={o.orderNumber} value={o.orderNumber}>
                    {o.orderNumber} ({o.qty} units)
                  </option>
                ))}
              </select>
              <input
                value={newScan}
                onChange={(e) => setNewScan(e.target.value)}
                placeholder="Scan new serial"
                className={`${inputClass} mt-2`}
              />
              <button
                type="button"
                onClick={() =>
                  run(() => {
                    const order = replaceSo ? getSalesOrder(replaceSo) : undefined;
                    const newSerial = lookupSerialForClaim(data.serials, newScan);
                    if (!order || !newSerial) {
                      setError("Select SO and scan new serial for replace reroute.");
                      return;
                    }
                    if (newSerial.status !== "available") {
                      setError("New serial must be available.");
                      return;
                    }
                    const next = rerouteRepairToReplace(
                      data,
                      claim.claimId,
                      newSerial,
                      order.orderNumber,
                      order.orderDate,
                      false,
                      notes || "Cannot repair — replace",
                    );
                    persist(next);
                    setMessage(`Rerouted to replace → ${newSerial.serialNumber}`);
                    setNewScan("");
                  })
                }
                className="mt-2 w-full rounded-lg border border-amber-300 bg-white py-2 text-sm font-medium hover:bg-amber-100"
              >
                Reroute to replace
              </button>
            </div>
          </div>
        </div>
      )}

      {claim.statusHistory && claim.statusHistory.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-slate-500">Status history</p>
          <ul className="space-y-1 rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600">
            {claim.statusHistory.slice(0, 6).map((h, i) => (
              <li key={i}>
                <span className="font-medium">{h.changedAt.slice(0, 16)}</span> —{" "}
                {statusLabel(h.status)}: {h.notes}
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="text-sm text-red-700">{error}</p>}
      {message && <p className="text-sm text-emerald-700">{message}</p>}
    </div>
  );
}
