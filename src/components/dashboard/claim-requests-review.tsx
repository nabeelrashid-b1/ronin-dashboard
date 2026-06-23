"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDataContext } from "@/components/providers/app-data-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import {
  CUSTOMER_REQUEST_STATUS,
  FIELDS,
  INTERNAL_CLAIM_CATEGORY,
  REQUEST_INTAKE_TYPE,
  SEVEN_DAY_SUB_TYPE,
  WARRANTY_SUB_TYPE,
} from "@/config/fields";
import {
  advanceRepairToInRepair,
  markRepairQcPassed,
  postCustomerRefundFromRequest,
  postCustomerRepairFromRequest,
  postCustomerReplaceFromRequest,
  postSevenDayRefundFromRequest,
  postSevenDayReplaceFromRequest,
  returnRepairedToCustomer,
  sendRepairToInQc,
} from "@/lib/claim-service";
import {
  getNewClaimIneligibilityReason,
  lookupSerialForClaim,
} from "@/lib/claim-utils";
import { getReplacementSalesOrders, getSalesOrder } from "@/lib/sales-orders";
import { getDispatchedSalesOrderNumbers } from "@/lib/dispatch-service";
import { saveAppData } from "@/lib/storage";
import {
  canRouteToAfterSales,
  canSupportPostToClaim,
  getSupportPostOptions,
  isSevenDayIntake,
  isWarrantyIntake,
  validateSevenDayRequest,
  type SupportPostType,
} from "@/lib/support-workflow";
import type { CustomerRequestStatus, WarrantyClaimRequest } from "@/lib/types";
import {
  getWarrantyClaimRequests,
  saveWarrantyClaimRequests,
} from "@/lib/warranty-claim-request";

const ADMIN = "Customer Support";

const purchaseLabels: Record<string, string> = {
  "official-outlet": "Official Brand Outlet",
  "market-retail": "Market / Retail Store",
  online: "Online (Shopify)",
};

type FilterTab = "all" | "seven-day" | "warranty";

export function ClaimRequestsReview() {
  const { data, updateData } = useAppDataContext();
  const [requests, setRequests] = useState<WarrantyClaimRequest[]>([]);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [selected, setSelected] = useState<WarrantyClaimRequest | null>(null);
  const [notes, setNotes] = useState("");
  const [postType, setPostType] = useState<SupportPostType>("replace");
  const [newScan, setNewScan] = useState("");
  const [replaceSo, setReplaceSo] = useState("");
  const [creditNote, setCreditNote] = useState("");
  const [returnSaleable, setReturnSaleable] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openSos = useMemo(
    () => (data ? getReplacementSalesOrders(getDispatchedSalesOrderNumbers(data)) : []),
    [data],
  );

  const filteredRequests = useMemo(() => {
    if (filter === "seven-day") return requests.filter(isSevenDayIntake);
    if (filter === "warranty") return requests.filter(isWarrantyIntake);
    return requests;
  }, [requests, filter]);

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
    setMessage(null);
    setError(null);
    const opts = getSupportPostOptions(req);
    setPostType(opts[0] ?? "repair");
  }

  function patchRequest(req: WarrantyClaimRequest, patch: Partial<WarrantyClaimRequest>) {
    const updated = { ...req, ...patch };
    const all = requests.map((r) => (r.id === req.id ? updated : r));
    saveWarrantyClaimRequests(all);
    setRequests(all);
    if (selected?.id === req.id) setSelected(updated);
    return updated;
  }

  function addStatus(req: WarrantyClaimRequest, status: CustomerRequestStatus, note?: string) {
    return patchRequest(req, {
      status,
      reviewedBy: ADMIN,
      reviewedAt: new Date().toISOString(),
      statusHistory: [
        {
          status,
          changedBy: ADMIN,
          changedAt: new Date().toISOString(),
          notes: note ?? (notes || `Status → ${status}`),
        },
        ...req.statusHistory,
      ],
    });
  }

  function handleRouteToAfterSales(req: WarrantyClaimRequest) {
    if (!canRouteToAfterSales(req)) {
      setError("Cannot route this request to after-sales.");
      return;
    }
    addStatus(req, "routed-after-sales", "Routed to after-sales department for warranty processing.");
    setMessage("Request routed to after-sales. They can post Repair / Replace / Refund.");
    setError(null);
  }

  function handleReject(req: WarrantyClaimRequest) {
    addStatus(req, "rejected", notes || "Request rejected by customer support.");
    setMessage("Request rejected.");
    setError(null);
  }

  function handlePostToWarrantyClaim(req: WarrantyClaimRequest) {
    if (!data) return;
    setMessage(null);
    setError(null);

    const serial = data.serials.find((s:any) => s.serialNumber === req.serialNumber);
    if (req.postedClaimId) {
      setError(`Already posted as ${req.postedClaimId}`);
      return;
    }
    if (!canSupportPostToClaim(req)) {
      setError(
        isWarrantyIntake(req)
          ? "Warranty requests must be routed to after-sales before posting."
          : "Cannot post this request.",
      );
      return;
    }

    const remarks = notes || req.problemDescription;
    let next = data;

    if (isSevenDayIntake(req)) {
      const validationError = validateSevenDayRequest(req, serial);
      if (validationError) {
        setError(validationError);
        return;
      }
      if (!serial) return;

      if (postType === "refund") {
        if (!creditNote.trim()) {
          setError("Credit note required for 7-day refund.");
          return;
        }
        next = postSevenDayRefundFromRequest(next, serial, {
          shopifyOrderId: req.shopifyOrderId,
          linkedRequestId: req.id,
          requestClaimId: req.claimId,
          creditNote: creditNote.trim(),
          remarks,
          returnedUnitSaleable: returnSaleable,
        });
      } else if (postType === "replace") {
        const order = replaceSo ? getSalesOrder(replaceSo) : undefined;
        const newSerial = lookupSerialForClaim(data.serials, newScan);
        if (!order || !newSerial) {
          setError("Select SO and scan new replacement serial.");
          return;
        }
        if (newSerial.status !== "available") {
          setError("New serial must be available in master.");
          return;
        }
        next = postSevenDayReplaceFromRequest(next, serial, newSerial, {
          shopifyOrderId: req.shopifyOrderId,
          linkedRequestId: req.id,
          requestClaimId: req.claimId,
          salesOrderNumber: order.orderNumber,
          salesOrderDate: order.orderDate,
          remarks,
          oldUnitSaleable: returnSaleable,
        });
      } else {
        setError("7-day claims support Replace or Refund only.");
        return;
      }

      saveAppData(next);
      updateData(() => next);
      patchRequest(req, {
        status: "closed",
        postedClaimId: req.claimId,
        reviewedBy: ADMIN,
        reviewedAt: new Date().toISOString(),
        statusHistory: [
          {
            status: "closed",
            changedBy: ADMIN,
            changedAt: new Date().toISOString(),
            notes: notes || `7-day ${postType} posted to Warranty_claim`,
          },
          ...req.statusHistory,
        ],
      });
      setMessage(`7-day ${postType} posted (${req.claimId}).`);
      return;
    }

    // Warranty — after-sales posting
    if (!serial) {
      setError("Serial not found in master.");
      return;
    }

    const ineligible = getNewClaimIneligibilityReason(serial);
    if (ineligible) {
      setError(ineligible);
      return;
    }

    if (postType === "repair") {
      next = postCustomerRepairFromRequest(next, serial, {
        shopifyOrderId: req.shopifyOrderId,
        linkedRequestId: req.id,
        requestClaimId: req.claimId,
        remarks,
      });
    } else if (postType === "refund") {
      if (!creditNote.trim()) {
        setError("Credit note required for refund.");
        return;
      }
      next = postCustomerRefundFromRequest(next, serial, {
        shopifyOrderId: req.shopifyOrderId,
        linkedRequestId: req.id,
        requestClaimId: req.claimId,
        creditNote: creditNote.trim(),
        remarks,
        returnedUnitSaleable: returnSaleable,
      });
    } else {
      const order = replaceSo ? getSalesOrder(replaceSo) : undefined;
      const newSerial = lookupSerialForClaim(data.serials, newScan);
      if (!order || !newSerial) {
        setError("Select SO and scan new replacement serial.");
        return;
      }
      next = postCustomerReplaceFromRequest(next, serial, newSerial, {
        shopifyOrderId: req.shopifyOrderId,
        linkedRequestId: req.id,
        requestClaimId: req.claimId,
        salesOrderNumber: order.orderNumber,
        salesOrderDate: order.orderDate,
        remarks,
        oldUnitSaleable: returnSaleable,
      });
    }

    saveAppData(next);
    updateData(() => next);

    const requestStatus: CustomerRequestStatus =
      postType === "repair"
        ? "in-repair"
        : postType === "refund"
          ? "closed"
          : "completed";

    patchRequest(req, {
      status: requestStatus,
      postedClaimId: req.claimId,
      reviewedBy: ADMIN,
      reviewedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: requestStatus,
          changedBy: ADMIN,
          changedAt: new Date().toISOString(),
          notes: notes || `After-sales posted ${postType} to Warranty_claim`,
        },
        ...req.statusHistory,
      ],
    });
    setMessage(`Warranty claim posted as ${postType} (${req.claimId}).`);
  }

  function handleClaimAction(
    action: "start-repair" | "send-qc" | "qc-passed" | "return",
    postedClaimId: string,
  ) {
    if (!data) return;
    setError(null);
    let next = data;
    if (action === "start-repair") {
      next = advanceRepairToInRepair(next, postedClaimId, notes || "Start repair");
      setMessage("Repair started (in-repair).");
    } else if (action === "send-qc") {
      next = sendRepairToInQc(next, postedClaimId, notes || "Sent to QC");
      setMessage("Sent to QC.");
    } else if (action === "qc-passed") {
      next = markRepairQcPassed(next, postedClaimId, "Customer repair", notes);
      setMessage("QC passed — ready to return.");
    } else {
      next = returnRepairedToCustomer(next, postedClaimId, notes);
      if (selected) addStatus(selected, "completed", "Returned to customer — serial dispatched again.");
      setMessage("Returned to customer — serial dispatched again.");
    }
    saveAppData(next);
    updateData(() => next);
  }

  const columns: DataTableColumn<WarrantyClaimRequest>[] = [
    { id: "claimId", header: FIELDS.claimId.label, accessor: (r) => r.claimId, className: "font-mono text-xs" },
    {
      id: "intake",
      header: FIELDS.requestIntakeType.label,
      accessor: (r) => r.requestIntakeType,
      cell: (r) => (
        <Badge variant={isSevenDayIntake(r) ? "accent" : "info"}>
          {isSevenDayIntake(r)
            ? REQUEST_INTAKE_TYPE.sevenDay.label
            : REQUEST_INTAKE_TYPE.warranty.label}
        </Badge>
      ),
    },
    { id: "customer", header: FIELDS.fullName.label, accessor: (r) => r.fullName },
    { id: "serial", header: FIELDS.serialNumber.label, accessor: (r) => r.serialNumber, className: "font-mono text-xs" },
    { id: "shopify", header: FIELDS.shopifyOrderId.label, accessor: (r) => r.shopifyOrderId ?? "—" },
    {
      id: "status",
      header: FIELDS.requestStatus.label,
      accessor: (r) => r.status,
      cell: (r) => <Badge variant="warning">{r.status}</Badge>,
    },
    {
      id: "posted",
      header: "Posted",
      accessor: (r) => (r.postedClaimId ? "Yes" : "No"),
    },
    {
      id: "actions",
      header: "",
      sortable: false,
      accessor: () => "",
      cell: (r) => (
        <button
          type="button"
          onClick={() => selectRequest(r)}
          className="text-xs font-medium text-orange-600 hover:underline"
        >
          Review
        </button>
      ),
    },
  ];

  const postedClaim = selected?.postedClaimId
    ? data?.claims.find((c) => c.claimId === selected.postedClaimId)
    : undefined;
  const showRepairActions = postedClaim?.warrantySubType === "repair";
  const serialForSelected = selected
    ? data?.serials.find((s) => s.serialNumber === selected.serialNumber)
    : undefined;
  const sevenDayOk =
    selected && serialForSelected
      ? !validateSevenDayRequest(selected, serialForSelected)
      : false;
  const postOptions = selected ? getSupportPostOptions(selected) : [];

  const inputClass = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm";

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Customer claim requests — support</CardTitle>
          <p className="text-xs text-slate-500">
            <strong>7-day:</strong> support posts Replace or Refund (within 7 days of dispatch).{" "}
            <strong>Warranty:</strong> route to after-sales, then post Repair / Replace / Refund.
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-2">
            {(
              [
                ["all", "All"],
                ["seven-day", REQUEST_INTAKE_TYPE.sevenDay.label],
                ["warranty", REQUEST_INTAKE_TYPE.warranty.label],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  filter === key
                    ? "bg-orange-600 text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <DataTable
            columns={columns}
            data={filteredRequests}
            pageSize={8}
            searchPlaceholder="Search claim ID, Shopify order, serial…"
          />
        </CardContent>
      </Card>

      {selected && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center gap-2">
              Review {selected.claimId}
              <Badge variant={isSevenDayIntake(selected) ? "accent" : "info"}>
                {isSevenDayIntake(selected)
                  ? INTERNAL_CLAIM_CATEGORY.sevenDay.label
                  : "Warranty → after-sales"}
              </Badge>
            </CardTitle>
            {selected.postedClaimId && (
              <p className="text-xs text-emerald-700">Posted to Warranty_claim: {selected.postedClaimId}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-slate-500">{FIELDS.requestIntakeType.label}</dt>
                <dd className="font-medium">
                  {isSevenDayIntake(selected)
                    ? REQUEST_INTAKE_TYPE.sevenDay.label
                    : REQUEST_INTAKE_TYPE.warranty.label}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{FIELDS.fullName.label}</dt>
                <dd className="font-medium">{selected.fullName}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{FIELDS.email.label}</dt>
                <dd>{selected.email || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{FIELDS.contactNumber.label}</dt>
                <dd>{selected.contactNumber}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Purchase channel</dt>
                <dd>{purchaseLabels[selected.purchaseFrom] ?? selected.purchaseFrom}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{FIELDS.shopifyOrderId.label}</dt>
                <dd className="font-mono text-xs">{selected.shopifyOrderId ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{FIELDS.serialNumber.label}</dt>
                <dd className="font-mono text-xs">{selected.serialNumber}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{FIELDS.productName.label}</dt>
                <dd>{selected.productName}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-slate-500">Description</dt>
                <dd>{selected.itemDescription}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{FIELDS.warrantyStartDate.label} (dispatch)</dt>
                <dd>{selected.warrantyStartDate || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{FIELDS.warrantyEndDate.label}</dt>
                <dd>{selected.warrantyEndDate || "—"}</dd>
              </div>
              {isSevenDayIntake(selected) && serialForSelected?.warrantyStartDate && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-slate-500">7-day window</dt>
                  <dd className={sevenDayOk ? "text-emerald-700" : "text-red-700"}>
                    {sevenDayOk
                      ? "Eligible (within 7 days of dispatch)"
                      : "Not eligible — window expired or invalid channel"}
                  </dd>
                </div>
              )}
              <div className="sm:col-span-2">
                <dt className="text-xs text-slate-500">{FIELDS.problemDescription.label}</dt>
                <dd className="text-slate-700">{selected.problemDescription}</dd>
              </div>
            </dl>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Support / after-sales remarks…"
              className={inputClass}
              rows={2}
            />

            {isWarrantyIntake(selected) && !selected.postedClaimId && (
              <div className="flex flex-wrap gap-2 rounded-lg bg-slate-50 p-3">
                <span className="w-full text-xs font-semibold text-slate-700">Customer support actions</span>
                <button
                  type="button"
                  onClick={() => addStatus(selected, "under-review")}
                  className="rounded border border-slate-200 bg-white px-3 py-1 text-xs hover:bg-slate-50"
                >
                  {CUSTOMER_REQUEST_STATUS.underReview.label}
                </button>
                {canRouteToAfterSales(selected) && (
                  <button
                    type="button"
                    onClick={() => handleRouteToAfterSales(selected)}
                    className="rounded bg-sky-600 px-3 py-1 text-xs text-white hover:bg-sky-700"
                  >
                    Route to after-sales
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleReject(selected)}
                  className="rounded border border-red-200 px-3 py-1 text-xs text-red-700 hover:bg-red-50"
                >
                  Reject request
                </button>
              </div>
            )}

            {!selected.postedClaimId && canSupportPostToClaim(selected) && (
              <div className="rounded-lg border border-slate-200 p-4 space-y-3">
                <p className="text-xs font-semibold text-slate-700">
                  {isSevenDayIntake(selected)
                    ? `${INTERNAL_CLAIM_CATEGORY.sevenDay.label} — post to Warranty_claim`
                    : "After-sales — post to Warranty_claim"}
                </p>
                <select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value as SupportPostType)}
                  className={inputClass}
                >
                  {postOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {isSevenDayIntake(selected)
                        ? Object.values(SEVEN_DAY_SUB_TYPE).find((s) => s.value === opt)?.label ??
                          opt
                        : Object.values(WARRANTY_SUB_TYPE).find((s) => s.value === opt)?.label ??
                          opt}
                    </option>
                  ))}
                </select>

                {(postType === "refund" || postType === "replace") && (
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={returnSaleable}
                      onChange={(e) => setReturnSaleable(e.target.checked)}
                    />
                    {FIELDS.saleable.label} (returned unit → available if checked)
                  </label>
                )}

                {postType === "refund" && (
                  <input
                    value={creditNote}
                    onChange={(e) => setCreditNote(e.target.value)}
                    placeholder="Credit note no"
                    className={inputClass}
                  />
                )}
                {postType === "replace" && (
                  <>
                    <select value={replaceSo} onChange={(e) => setReplaceSo(e.target.value)} className={inputClass}>
                      <option value="">SO for new unit</option>
                      {openSos.map((o) => (
                        <option key={o.orderNumber} value={o.orderNumber}>
                          {o.orderNumber}
                        </option>
                      ))}
                    </select>
                    <input
                      value={newScan}
                      onChange={(e) => setNewScan(e.target.value)}
                      placeholder="Scan new serial (same warranty transfers)"
                      className={inputClass}
                    />
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handlePostToWarrantyClaim(selected)}
                  className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                >
                  Post to Warranty_claim
                </button>
              </div>
            )}

            {isWarrantyIntake(selected) &&
              !selected.postedClaimId &&
              !canSupportPostToClaim(selected) &&
              selected.status !== "rejected" && (
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  Route this warranty request to after-sales before posting a claim.
                </p>
              )}

            {showRepairActions && selected.postedClaimId && postedClaim && (
              <div className="flex flex-wrap gap-2">
                <span className="w-full text-xs font-medium text-slate-500">
                  Repair: In repair → In QC → Repaired → Return
                </span>
                {postedClaim.claimStatus === "received" && (
                  <button
                    type="button"
                    onClick={() => handleClaimAction("start-repair", selected.postedClaimId!)}
                    className="rounded bg-orange-600 px-3 py-1 text-xs text-white hover:bg-orange-700"
                  >
                    Start repair
                  </button>
                )}
                {postedClaim.claimStatus === "in-repair" && (
                  <button
                    type="button"
                    onClick={() => handleClaimAction("send-qc", selected.postedClaimId!)}
                    className="rounded bg-sky-600 px-3 py-1 text-xs text-white hover:bg-sky-700"
                  >
                    Send to QC
                  </button>
                )}
                {postedClaim.claimStatus === "in-qc" && (
                  <button
                    type="button"
                    onClick={() => handleClaimAction("qc-passed", selected.postedClaimId!)}
                    className="rounded border px-3 py-1 text-xs hover:bg-slate-50"
                  >
                    QC passed
                  </button>
                )}
                {postedClaim.claimStatus === "repaired" && (
                  <button
                    type="button"
                    onClick={() => handleClaimAction("return", selected.postedClaimId!)}
                    className="rounded bg-emerald-600 px-3 py-1 text-xs text-white hover:bg-emerald-700"
                  >
                    Return to customer
                  </button>
                )}
              </div>
            )}

            <div>
              <p className="mb-1 text-xs font-medium text-slate-500">Status journey</p>
              <ul className="space-y-1 text-xs text-slate-600">
                {selected.statusHistory.map((h, i) => (
                  <li key={i}>
                    {h.changedAt.slice(0, 16)} — {h.status} ({h.changedBy}): {h.notes}
                  </li>
                ))}
              </ul>
            </div>

            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            {message && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
