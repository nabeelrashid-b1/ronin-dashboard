"use client";

import { useMemo, useState } from "react";
import { useAppDataContext } from "@/components/providers/app-data-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const statusLabel = (s: string) =>
  Object.values(INTERNAL_CLAIM_STATUS).find((x) => x.value === s)?.label ?? s;

export function ClaimStatusUpdatePanel() {
  const { data, updateData } = useAppDataContext();
  const [accessory, setAccessory] = useState("");
  const [notes, setNotes] = useState("");
  const [creditNote, setCreditNote] = useState("");
  const [returnSaleable, setReturnSaleable] = useState(false);
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
        (c: WarrantyClaimRecord) => c.warrantySubType === "repair" && isClaimOpen(c),
      ) ?? [],
    [data],
  );

  function persist(next: typeof data) {
    if (!next) return;
    saveAppData(next);
    updateData(() => next);
  }

  function handleStartRepair(claim: WarrantyClaimRecord) {
    setError(null);
    const next = advanceRepairToInRepair(data!, claim.claimId, notes || "Start repair");
    persist(next);
    setMessage(`${claim.claimId} → ${statusLabel("in-repair")}`);
    setNotes("");
  }

  function handleSendToQc(claim: WarrantyClaimRecord) {
    setError(null);
    const next = sendRepairToInQc(data!, claim.claimId, notes);
    persist(next);
    setMessage(`${claim.claimId} → ${statusLabel("in-qc")}`);
    setNotes("");
  }

  function handleQcPassed(claim: WarrantyClaimRecord) {
    setError(null);
    const next = markRepairQcPassed(
      data!,
      claim.claimId,
      accessory || "QC passed",
      notes,
    );
    persist(next);
    setMessage(`${claim.claimId} → ${statusLabel("repaired")} (ready to return)`);
    setAccessory("");
    setNotes("");
  }

  function handleReturn(claim: WarrantyClaimRecord) {
    setError(null);
    const next = returnRepairedToCustomer(
      data!,
      claim.claimId,
      notes || "Returned to dealer / customer",
    );
    persist(next);
    setMessage(`${claim.claimId} closed — ${claim.serialNumber} dispatched again.`);
    setNotes("");
  }

  function handleRerouteRefund(claim: WarrantyClaimRecord) {
    setError(null);
    if (!creditNote.trim()) {
      setError("Credit note required for refund reroute.");
      return;
    }
    const next = rerouteRepairToRefund(
      data!,
      claim.claimId,
      creditNote.trim(),
      returnSaleable,
      notes || "Cannot repair — refund",
    );
    persist(next);
    setMessage(`${claim.claimId} rerouted to refund.`);
    setCreditNote("");
    setNotes("");
  }

  function handleRerouteReplace(claim: WarrantyClaimRecord) {
    setError(null);
    if (!data) return;
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
      returnSaleable,
      notes || "Cannot repair — replace",
    );
    persist(next);
    setMessage(`${claim.claimId} rerouted to replace → ${newSerial.serialNumber}`);
    setNewScan("");
    setNotes("");
  }

  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Repair workflow (after-sales)</CardTitle>
        <p className="text-xs text-slate-500">
          Received → In repair → In QC → Repaired → Return (status only). If not repairable:
          reroute to Refund or Replace.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {openClaims.length === 0 ? (
          <p className="text-sm text-slate-400">No open repair claims.</p>
        ) : (
          openClaims.map((claim: WarrantyClaimRecord) => {
            const step = getRepairWorkflowStep(claim);
            const chain = getReplacementChain(data.serials, claim.serialNumber);

            return (
              <div key={claim.id} className="rounded-lg border border-slate-200 p-4 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold">{claim.claimId}</span>
                  <Badge variant="info">{statusLabel(claim.claimStatus)}</Badge>
                  <span className="text-xs text-slate-500">
                    {claim.partyType} · {claim.serialNumber}
                    {claim.cardCode ? ` · ${claim.cardCode}` : ""}
                    {claim.shopifyOrderId ? ` · ${claim.shopifyOrderId}` : ""}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 text-[10px] uppercase tracking-wide text-slate-400">
                  {(["received", "in-repair", "in-qc", "repaired", "closed"] as const).map(
                    (s, i) => (
                      <span
                        key={s}
                        className={
                          step === s || (step === "rerouted" && s === "closed")
                            ? "font-bold text-orange-600"
                            : ""
                        }
                      >
                        {statusLabel(s)}
                        {i < 4 ? " → " : ""}
                      </span>
                    ),
                  )}
                </div>

                {chain.length > 1 && (
                  <p className="text-xs text-slate-500">
                    {FIELDS.replacementChain.label}:{" "}
                    {chain.map((s) => s.serialNumber).join(" → ")}
                  </p>
                )}

                <input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Workflow notes"
                  className="w-full rounded border px-2 py-1 text-sm"
                />

                <div className="flex flex-wrap gap-2">
                  {claim.claimStatus === "received" && (
                    <button
                      type="button"
                      onClick={() => handleStartRepair(claim)}
                      className="rounded bg-orange-600 px-3 py-1 text-xs text-white hover:bg-orange-700"
                    >
                      Start repair (in-repair)
                    </button>
                  )}
                  {claim.claimStatus === "in-repair" && (
                    <button
                      type="button"
                      onClick={() => handleSendToQc(claim)}
                      className="rounded bg-sky-600 px-3 py-1 text-xs text-white hover:bg-sky-700"
                    >
                      Send to QC
                    </button>
                  )}
                  {claim.claimStatus === "in-qc" && (
                    <>
                      <input
                        value={accessory}
                        onChange={(e) => setAccessory(e.target.value)}
                        placeholder="Accessory / repair detail"
                        className="min-w-[160px] flex-1 rounded border px-2 py-1 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleQcPassed(claim)}
                        className="rounded bg-slate-800 px-3 py-1 text-xs text-white hover:bg-slate-900"
                      >
                        QC passed
                      </button>
                    </>
                  )}
                  {claim.claimStatus === "repaired" && (
                    <button
                      type="button"
                      onClick={() => handleReturn(claim)}
                      className="rounded bg-emerald-600 px-3 py-1 text-xs text-white hover:bg-emerald-700"
                    >
                      Return to dealer / customer
                    </button>
                  )}
                </div>

                {canRerouteRepair(claim) && (
                  <div className="rounded-lg border border-dashed border-amber-200 bg-amber-50/50 p-3 space-y-2">
                    <p className="text-xs font-semibold text-amber-900">Cannot repair — reroute</p>
                    <label className="flex items-center gap-2 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={returnSaleable}
                        onChange={(e) => setReturnSaleable(e.target.checked)}
                      />
                      {FIELDS.saleable.label}
                    </label>
                    <input
                      value={creditNote}
                      onChange={(e) => setCreditNote(e.target.value)}
                      placeholder="Credit note (refund)"
                      className="w-full rounded border px-2 py-1 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleRerouteRefund(claim)}
                      className="rounded border border-amber-300 bg-white px-3 py-1 text-xs hover:bg-amber-50"
                    >
                      Reroute to refund
                    </button>
                    <select
                      value={replaceSo}
                      onChange={(e) => setReplaceSo(e.target.value)}
                      className="w-full rounded border px-2 py-1 text-xs"
                    >
                      <option value="">SO for new unit (replace)</option>
                      {openSos.map((o) => (
                        <option key={o.orderNumber} value={o.orderNumber}>
                          {o.orderNumber}
                        </option>
                      ))}
                    </select>
                    <input
                      value={newScan}
                      onChange={(e) => setNewScan(e.target.value)}
                      placeholder="Scan new serial"
                      className="w-full rounded border px-2 py-1 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleRerouteReplace(claim)}
                      className="rounded border border-amber-300 bg-white px-3 py-1 text-xs hover:bg-amber-50"
                    >
                      Reroute to replace
                    </button>
                  </div>
                )}

                {claim.statusHistory?.length > 0 && (
                  <ul className="space-y-0.5 text-[10px] text-slate-500">
                    {claim.statusHistory.slice(0, 4).map((h, i) => (
                      <li key={i}>
                        {h.changedAt.slice(0, 16)} — {statusLabel(h.status)}: {h.notes}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })
        )}
        {error && <p className="text-sm text-red-700">{error}</p>}
        {message && <p className="text-sm text-emerald-700">{message}</p>}
      </CardContent>
    </Card>
  );
}
