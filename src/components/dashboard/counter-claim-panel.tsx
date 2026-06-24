"use client";

import { useMemo, useState } from "react";
import { ScanLine } from "lucide-react";
import { useAppDataContext } from "@/components/providers/app-data-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FIELDS, INTERNAL_CLAIM_CATEGORY } from "@/config/fields";
import { postCounterClaimSingle } from "@/lib/claim-service";
import {
  canProcessCounterNew,
  canProcessCounterOld,
  getNewClaimIneligibilityReason,
} from "@/lib/claim-utils";
import { DEFAULT_SAP_CARD_CODE, getSapCustomer } from "@/lib/sap-customers";
import { SapCardCodeSelect } from "./sap-card-code-select";
import {
  getSerialClaimContext,
  resolveCounterDispatchSo,
} from "@/lib/serial-claim-lookup";
import { saveAppData } from "@/lib/storage";
import { ItemSerialStatusLookup } from "./item-serial-status-lookup";
import { SerialClaimContextCard } from "./serial-claim-context-card";

export function CounterClaimPanel() {
  const { data, updateData } = useAppDataContext();
  const [cardCode, setCardCode] = useState(DEFAULT_SAP_CARD_CODE);
  const [oldScan, setOldScan] = useState("");
  const [newScan, setNewScan] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const oldCtx = useMemo(
    () => (data && oldScan.trim() ? getSerialClaimContext(data, oldScan) : null),
    [data, oldScan],
  );
  const newCtx = useMemo(
    () => (data && newScan.trim() ? getSerialClaimContext(data, newScan) : null),
    [data, newScan],
  );

  const customer = useMemo(() => getSapCustomer(cardCode), [cardCode]);

  function handleSubmit() {
    setError(null);
    setSuccess(null);
    if (!data || !cardCode.trim()) {
      setError("Select SAP customer code.");
      return;
    }
    if (!oldCtx) {
      setError("Scan old item serial — not found in master.");
      return;
    }
    if (!newCtx) {
      setError("Scan new item serial — not found in master.");
      return;
    }
    if (!canProcessCounterOld(oldCtx.serial)) {
      setError(
        getNewClaimIneligibilityReason(oldCtx.serial) ??
          "Old item must be dispatched with no open warranty claim.",
      );
      return;
    }
    if (!canProcessCounterNew(newCtx.serial)) {
      setError("New item must be available in serial master.");
      return;
    }
    if (oldCtx.serial.serialNumber === newCtx.serial.serialNumber) {
      setError("Old and new serial must be different.");
      return;
    }

    const dispatchSo = resolveCounterDispatchSo(oldCtx);
    if (!dispatchSo) {
      setError("Old unit has no sales order on dispatch — cannot post counter claim.");
      return;
    }

    const next = postCounterClaimSingle(
      data,
      oldCtx.serial,
      newCtx.serial,
      cardCode.trim(),
      dispatchSo,
    );

    if (next?.claims?.length === data?.claims?.length) {
      setError("Failed to post counter claim.");
      return;
    }

    // const posted = next?.claims[next?.claims?.length - 1] ;
    const posted =
  next?.claims?.length
    ? next.claims[next.claims.length - 1]
    : undefined;
    saveAppData(next);
    updateData(() => next);
    setOldScan("");
    setNewScan("");
    setSuccess(
      `Counter claim ${posted?.claimId} posted (${INTERNAL_CLAIM_CATEGORY.counterClaim.label}). ` +
        `Old ${oldCtx.serial.serialNumber} → available · New ${newCtx.serial.serialNumber} → dispatched.`,
    );
  }

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20";

  const readyToSubmit =
    !!oldCtx &&
    !!newCtx &&
    canProcessCounterOld(oldCtx.serial) &&
    canProcessCounterNew(newCtx.serial);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{INTERNAL_CLAIM_CATEGORY.counterClaim.label}</CardTitle>
        <p className="text-sm text-slate-500">
          Select SAP customer, scan defective serial (master + dispatch auto-load), scan replacement box, then submit one{" "}
          <span className="font-medium">counter-claim</span> with history on both serials.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <ItemSerialStatusLookup compact title="Serial status lookup" />

        <SapCardCodeSelect
          value={cardCode}
          onChange={setCardCode}
          required
          showHint={!!customer}
        />

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            {FIELDS.oldSerialNumber.label} — scan <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <ScanLine className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={oldScan}
              onChange={(e) => {
                setOldScan(e.target.value);
                setError(null);
                setSuccess(null);
              }}
              placeholder="Scan old / defective unit"
              className={`${inputClass} pl-10 font-mono`}
              autoComplete="off"
            />
          </div>
          {oldScan.trim() && !oldCtx && (
            <p className="mt-1 text-xs text-red-600">Serial not found in warranty master.</p>
          )}
          {oldCtx && <SerialClaimContextCard title="Old unit (from master + dispatch)" ctx={oldCtx} variant="old" />}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            {FIELDS.newSerialNumber.label} — scan <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <ScanLine className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={newScan}
              onChange={(e) => {
                setNewScan(e.target.value);
                setError(null);
              }}
              placeholder="Scan new replacement unit"
              className={`${inputClass} pl-10 font-mono`}
              autoComplete="off"
              disabled={!oldCtx}
            />
          </div>
          {newScan.trim() && !newCtx && (
            <p className="mt-1 text-xs text-red-600">Serial not found in warranty master.</p>
          )}
          {newCtx && (
            <SerialClaimContextCard title="New unit (from master)" ctx={newCtx} variant="new" />
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!readyToSubmit}
          className="w-full rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          Submit counter claim
        </button>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{success}</p>
        )}
      </CardContent>
    </Card>
  );
}
