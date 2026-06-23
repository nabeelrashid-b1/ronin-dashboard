"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAppDataContext } from "@/components/providers/app-data-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { FIELDS } from "@/config/fields";
import {
  postCustomerRefundFromRequest,
  postReturnDeptReplace,
  postSevenDayRefundFromRequest,
} from "@/lib/claim-service";
import {
  canProcessReturnDeptOld,
  getReturnDeptOldSerialError,
  lookupSerialForClaim,
} from "@/lib/claim-utils";
import {
  getSevenDayReplacementSoOptions,
  mandatoryCreditNoteOptions,
} from "@/lib/claim-options";
import { getSalesOrder } from "@/lib/sales-orders";
import {
  getSerialClaimContext,
  resolveCounterDispatchSo,
} from "@/lib/serial-claim-lookup";
import { saveAppData } from "@/lib/storage";
import {
  isRoutedToReturn,
  isSevenDayIntake,
  isWarrantyIntake,
  validateSevenDayRequest,
} from "@/lib/support-workflow";
import { DEFAULT_SAP_CARD_CODE } from "@/lib/sap-customers";
import { SapCardCodeSelect } from "./sap-card-code-select";
import type { WarrantyClaimRequest } from "@/lib/types";
import {
  getWarrantyClaimRequests,
  saveWarrantyClaimRequests,
} from "@/lib/warranty-claim-request";
import { ItemSerialStatusLookup } from "@/components/dashboard/item-serial-status-lookup";
import { SerialClaimContextCard } from "@/components/dashboard/serial-claim-context-card";

const RETURN_USER = "After-sales Return";

type WorkflowMode = "request" | "direct";

type ReturnReplacementWorkspaceProps = {
  /** Hide serial lookup when parent page already provides one */
  embedded?: boolean;
};

export function ReturnReplacementWorkspace({ embedded = false }: ReturnReplacementWorkspaceProps) {
  const { data, updateData } = useAppDataContext();
  const [requests, setRequests] = useState<WarrantyClaimRequest[]>([]);
  const [workflow, setWorkflow] = useState<WorkflowMode>("request");
  const [selected, setSelected] = useState<WarrantyClaimRequest | null>(null);
  const [oldScan, setOldScan] = useState("");
  const [newScan, setNewScan] = useState("");
  const [creditNote, setCreditNote] = useState("");
  const [replaceSo, setReplaceSo] = useState("");
  const [cardCode, setCardCode] = useState(DEFAULT_SAP_CARD_CODE);
  const [remarks, setRemarks] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sevenDaySoOptions = useMemo(() => getSevenDayReplacementSoOptions(), []);

  const routedRequests = useMemo(
    () => requests.filter(isRoutedToReturn),
    [requests],
  );

  const oldCtx = useMemo(
    () => (data && oldScan.trim() ? getSerialClaimContext(data, oldScan) : null),
    [data, oldScan],
  );
  const newCtx = useMemo(
    () => (data && newScan.trim() ? getSerialClaimContext(data, newScan) : null),
    [data, newScan],
  );

  const dispatchSoFromOld = useMemo(
    () => (oldCtx ? resolveCounterDispatchSo(oldCtx) : null),
    [oldCtx],
  );

  function refresh() {
    setRequests(getWarrantyClaimRequests());
  }

  useEffect(() => {
    refresh();
    window.addEventListener("ronin-demo-reset", refresh);
    return () => window.removeEventListener("ronin-demo-reset", refresh);
  }, []);

  function selectRequest(req: WarrantyClaimRequest) {
    setSelected(req);
    setWorkflow("request");
    setOldScan(req.serialNumber);
    setNewScan("");
    setCreditNote("");
    setReplaceSo("");
    setRemarks("");
    setMessage(null);
    setError(null);
  }

  function patchRequestClosed(req: WarrantyClaimRequest, note: string) {
    const updated: WarrantyClaimRequest = {
      ...req,
      status: "closed",
      postedClaimId: req.claimId,
      reviewedBy: RETURN_USER,
      reviewedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: "closed",
          changedBy: RETURN_USER,
          changedAt: new Date().toISOString(),
          notes: note,
        },
        ...req.statusHistory,
      ],
    };
    const all = requests.map((r) => (r.id === req.id ? updated : r));
    saveWarrantyClaimRequests(all);
    setRequests(all);
    if (selected?.id === req.id) setSelected(updated);
  }

  const isRefundRequest =
    selected?.routedResolution === "refund" && workflow === "request";

  const saleableFromRequest = selected?.returnedUnitSaleable ?? true;

  function handleSubmitRefund() {
    setError(null);
    setMessage(null);
    if (!data || !selected) return;

    if (!creditNote.trim()) {
      setError(`${FIELDS.creditNote.label} is required.`);
      return;
    }

    const oldSerial =
      oldCtx?.serial ??
      data.serials.find((s) => s.serialNumber === selected.serialNumber);

    if (!oldSerial) {
      setError("Scan returned serial (or select a routed request).");
      return;
    }

    const routed = true;
    const oldSerialError = getReturnDeptOldSerialError(oldSerial, routed);
    if (oldSerialError) {
      setError(oldSerialError);
      return;
    }
    if (!canProcessReturnDeptOld(oldSerial, routed)) {
      setError(oldSerialError ?? "Old serial not eligible for Return.");
      return;
    }

    if (isSevenDayIntake(selected)) {
      const validationError = validateSevenDayRequest(selected, oldSerial);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    const note = remarks.trim() || selected.problemDescription || "Return refund";
    const before = data.claims.length;
    const next = isSevenDayIntake(selected)
      ? postSevenDayRefundFromRequest(data, oldSerial, {
          shopifyOrderId: selected.shopifyOrderId,
          linkedRequestId: selected.id,
          requestClaimId: selected.claimId,
          creditNote: creditNote.trim(),
          remarks: note,
          returnedUnitSaleable: saleableFromRequest,
        })
      : postCustomerRefundFromRequest(data, oldSerial, {
          shopifyOrderId: selected.shopifyOrderId,
          linkedRequestId: selected.id,
          requestClaimId: selected.claimId,
          creditNote: creditNote.trim(),
          remarks: note,
          returnedUnitSaleable: saleableFromRequest,
        });

    if (next.claims.length === before) {
      setError("Failed to post refund.");
      return;
    }

    saveAppData(next);
    updateData(() => next);
    patchRequestClosed(selected, `Refund posted from Return (CN ${creditNote.trim()}).`);
    setOldScan("");
    setCreditNote("");
    setRemarks("");
    setSelected(null);
    setMessage("Refund posted to Warranty_claim.");
  }

  function handleSubmitReplace() {
    setError(null);
    setMessage(null);
    if (!data) return;

    if (!creditNote.trim()) {
      setError(`${FIELDS.creditNote.label} is required.`);
      return;
    }

    const oldSerial =
      oldCtx?.serial ??
      (selected ? data.serials.find((s) => s.serialNumber === selected.serialNumber) : undefined);
    const newSerial = lookupSerialForClaim(data.serials, newScan);

    if (!oldSerial) {
      setError("Scan old serial (or select a routed request).");
      return;
    }

    const routed = Boolean(selected);
    const oldSerialError = getReturnDeptOldSerialError(oldSerial, routed);
    if (oldSerialError) {
      setError(oldSerialError);
      return;
    }
    if (!canProcessReturnDeptOld(oldSerial, routed)) {
      setError(oldSerialError ?? "Old serial not eligible for Return.");
      return;
    }

    if (!newSerial) {
      setError("Scan new replacement serial.");
      return;
    }
    if (newSerial.status !== "available") {
      setError("New serial must be available in master.");
      return;
    }

    const note = remarks.trim() || selected?.problemDescription || "Return replacement";
    const before = data.claims.length;
    let next = data;

    if (selected && isSevenDayIntake(selected)) {
      const validationError = validateSevenDayRequest(selected, oldSerial);
      if (validationError) {
        setError(validationError);
        return;
      }
      const order = replaceSo ? getSalesOrder(replaceSo) : undefined;
      if (!order) {
        setError("Select replacement sales order.");
        return;
      }
      next = postReturnDeptReplace(data, {
        mode: "seven-day",
        oldSerial,
        newSerial,
        creditNote: creditNote.trim(),
        salesOrderNumber: order.orderNumber,
        salesOrderDate: order.orderDate,
        remarks: note,
        oldUnitSaleable: saleableFromRequest,
        shopifyOrderId: selected.shopifyOrderId,
        linkedRequestId: selected.id,
        requestClaimId: selected.claimId,
      });
    } else if (selected && isWarrantyIntake(selected)) {
      const order =
        (replaceSo ? getSalesOrder(replaceSo) : undefined) ??
        (dispatchSoFromOld
          ? {
              orderNumber: dispatchSoFromOld.salesOrderNumber,
              orderDate: dispatchSoFromOld.salesOrderDate,
            }
          : undefined);
      if (!order) {
        setError("Select or resolve replacement sales order.");
        return;
      }
      next = postReturnDeptReplace(data, {
        mode: "warranty-customer-request",
        oldSerial,
        newSerial,
        creditNote: creditNote.trim(),
        salesOrderNumber: order.orderNumber,
        salesOrderDate: order.orderDate,
        remarks: note,
        oldUnitSaleable: saleableFromRequest,
        shopifyOrderId: selected.shopifyOrderId,
        linkedRequestId: selected.id,
        requestClaimId: selected.claimId,
      });
    } else {
      if (!dispatchSoFromOld) {
        setError("Old unit has no dispatch S.O. — cannot post warranty replace.");
        return;
      }
      next = postReturnDeptReplace(data, {
        mode: "warranty-dealer",
        oldSerial,
        newSerial,
        creditNote: creditNote.trim(),
        cardCode: cardCode.trim(),
        remarks: note,
        oldUnitSaleable: false,
        dispatchSo: dispatchSoFromOld,
      });
    }

    if (next.claims.length === before) {
      setError("Failed to post replacement.");
      return;
    }

    saveAppData(next);
    updateData(() => next);

    if (selected) {
      patchRequestClosed(
        selected,
        `Replacement posted from Return (CN ${creditNote.trim()}).`,
      );
    }

    setOldScan("");
    setNewScan("");
    setCreditNote("");
    setReplaceSo("");
    setRemarks("");
    setSelected(null);
    setMessage("Replacement posted — new unit marked dispatched (replace-redispatch).");
  }

  const requestColumns: DataTableColumn<WarrantyClaimRequest>[] = [
    {
      id: "claimId",
      header: FIELDS.claimId.label,
      accessor: (r) => r.claimId,
      className: "font-mono text-xs",
    },
    {
      id: "type",
      header: "Type",
      accessor: (r) => r.requestIntakeType,
      cell: (r) => (
        <Badge variant={isSevenDayIntake(r) ? "accent" : "info"}>
          {isSevenDayIntake(r) ? "7-day" : "Warranty"}
        </Badge>
      ),
    },
    { id: "serial", header: FIELDS.serialNumber.label, accessor: (r) => r.serialNumber },
    {
      id: "resolution",
      header: "Resolution",
      accessor: (r) => r.routedResolution ?? "replace",
      cell: (r) => (
        <Badge variant={r.routedResolution === "refund" ? "warning" : "info"}>
          {r.routedResolution ?? "replace"}
        </Badge>
      ),
    },
    {
      id: "pick",
      header: "",
      sortable: false,
      accessor: () => "",
      cell: (r) => (
        <button
          type="button"
          onClick={() => selectRequest(r)}
          className="text-xs font-medium text-orange-600 hover:underline"
        >
          Process
        </button>
      ),
    },
  ];

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20";

  const showSevenDaySo =
    (selected && isSevenDayIntake(selected)) ||
    (workflow === "direct" && oldCtx?.serial.status === "dispatched");

  return (
    <div className="space-y-4">
      {!embedded && <ItemSerialStatusLookup />}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setWorkflow("request");
            setSelected(null);
            setOldScan("");
          }}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
            workflow === "request" ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          Routed requests
        </button>
        <button
          type="button"
          onClick={() => {
            setWorkflow("direct");
            setSelected(null);
            setOldScan("");
          }}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
            workflow === "direct" ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          Direct scan (dealer warranty)
        </button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {selected
                ? isRefundRequest
                  ? `Refund — ${selected.claimId}`
                  : `Replace — ${selected.claimId}`
                : workflow === "direct"
                  ? "Direct warranty replace"
                  : "Return intake"}
            </CardTitle>
            {selected && (
              <p className="text-xs text-slate-500">
                {isRefundRequest
                  ? `${isSevenDayIntake(selected) ? "7-day" : "Warranty"} refund — scan returned serial, credit note, submit. Saleable: ${saleableFromRequest ? "yes" : "no"} (from CS).`
                  : `${isSevenDayIntake(selected) ? "7-day replace" : "Warranty customer replace"} — scan old & new serial, credit note, then submit. Saleable: ${saleableFromRequest ? "yes" : "no"} (from CS).`}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {workflow === "direct" && !selected && (
              <SapCardCodeSelect
                value={cardCode}
                onChange={setCardCode}
                required
                className={inputClass}
              />
            )}

            <div>
              <label className="mb-1 block text-xs font-medium">
                {FIELDS.oldSerialNumber.label} <span className="text-red-500">*</span>
              </label>
              <input
                value={oldScan}
                onChange={(e) => setOldScan(e.target.value)}
                placeholder="Scan old unit"
                className={`${inputClass} font-mono`}
                disabled={!!selected}
              />
              {oldCtx && (
                <SerialClaimContextCard title="Old unit" ctx={oldCtx} variant="old" />
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium">
                {FIELDS.creditNote.label} <span className="text-red-500">*</span>
              </label>
              <select
                value={creditNote}
                onChange={(e) => setCreditNote(e.target.value)}
                className={inputClass}
              >
                <option value="">Select credit note</option>
                {mandatoryCreditNoteOptions.map((cn) => (
                  <option key={cn.value} value={cn.value}>
                    {cn.label}
                  </option>
                ))}
              </select>
            </div>

            {!isRefundRequest &&
              (showSevenDaySo || (selected && isWarrantyIntake(selected))) && (
              <div>
                <label className="mb-1 block text-xs font-medium">
                  {FIELDS.salesOrderNumber.label} (replacement){" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  value={replaceSo}
                  onChange={(e) => setReplaceSo(e.target.value)}
                  className={inputClass}
                >
                  <option value="">
                    {dispatchSoFromOld && !selected
                      ? `Use dispatch SO ${dispatchSoFromOld.salesOrderNumber}`
                      : "Select SAP sales order"}
                  </option>
                  {sevenDaySoOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                {dispatchSoFromOld && !replaceSo && (
                  <p className="mt-1 text-xs text-slate-500">
                    Default: {dispatchSoFromOld.salesOrderNumber} from old unit dispatch
                  </p>
                )}
              </div>
            )}

            {!isRefundRequest && (
              <div>
                <label className="mb-1 block text-xs font-medium">
                  {FIELDS.newSerialNumber.label} <span className="text-red-500">*</span>
                </label>
                <input
                  value={newScan}
                  onChange={(e) => setNewScan(e.target.value)}
                  placeholder="Scan new unit (available)"
                  className={`${inputClass} font-mono`}
                  disabled={!oldCtx && !selected}
                />
                {newCtx && <SerialClaimContextCard title="New unit" ctx={newCtx} variant="new" />}
              </div>
            )}

            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder={FIELDS.remarks.label}
              rows={2}
              className={inputClass}
            />

            <button
              type="button"
              onClick={isRefundRequest ? handleSubmitRefund : handleSubmitReplace}
              disabled={
                !creditNote.trim() ||
                !oldScan.trim() ||
                (!isRefundRequest && !newScan.trim())
              }
              className="w-full rounded-lg bg-orange-600 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
            >
              {isRefundRequest ? "Submit refund" : "Submit replacement"}
            </button>

            {selected && (
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setOldScan("");
                }}
                className="text-xs text-slate-500 hover:underline"
              >
                Clear selected request
              </button>
            )}

            {error && <p className="text-sm text-red-700">{error}</p>}
            {message && <p className="text-sm text-emerald-800">{message}</p>}
          </CardContent>
        </Card>

        {workflow === "request" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Routed to Return</CardTitle>
              <p className="text-xs text-slate-500">
                Customer support routes 7-day and warranty replace/refund here (saleable set on CS).
              </p>
            </CardHeader>
            <CardContent>
              {routedRequests.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">No routed requests.</p>
              ) : (
                <DataTable columns={requestColumns} data={routedRequests} pageSize={8} />
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {!embedded && (
        <p className="text-xs text-slate-500">
          Customer support routes replace/refund here. Repair and counter claims are on{" "}
          <Link href="/dashboard/warranty-claim/after-sales" className="text-orange-600 hover:underline">
            After-sales
          </Link>
          .
        </p>
      )}
    </div>
  );
}
