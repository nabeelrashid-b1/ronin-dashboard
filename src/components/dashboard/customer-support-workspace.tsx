"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAppDataContext } from "@/components/providers/app-data-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import {
  CUSTOMER_REQUEST_STATUS,
  FIELDS,
  SEVEN_DAY_SUB_TYPE,
} from "@/config/fields";
import { holdSerialForReturnProcessing } from "@/lib/claim-service";
import {
  canRouteToAfterSales,
  canRouteToReturn,
  isSevenDayIntake,
  isWarrantyIntake,
} from "@/lib/support-workflow";
import { saveAppData } from "@/lib/storage";
import type { CustomerRequestStatus, WarrantyClaimRequest } from "@/lib/types";
import {
  getWarrantyClaimRequests,
  saveWarrantyClaimRequests,
} from "@/lib/warranty-claim-request";
import { CourierExceptionForm } from "@/components/dashboard/courier-exception-form";
import { ItemSerialStatusLookup } from "@/components/dashboard/item-serial-status-lookup";
import { WorkflowStepper } from "@/components/ui/workflow-stepper";

const CS_USER = "Customer Support";

type FilterTab = "all" | "seven-day" | "warranty" | "courier";

type CustomerSupportWorkspaceProps = {
  initialSection?: "requests" | "courier";
};

export function CustomerSupportWorkspace({
  initialSection = "requests",
}: CustomerSupportWorkspaceProps) {
  const { data, updateData } = useAppDataContext();
  const [section, setSection] = useState<"requests" | "courier">(initialSection);
  const [requests, setRequests] = useState<WarrantyClaimRequest[]>([]);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [selected, setSelected] = useState<WarrantyClaimRequest | null>(null);
  const [form, setForm] = useState({
    email: "",
    contactNumber: "",
    shopifyOrderId: "",
    problemDescription: "",
  });
  const [remarks, setRemarks] = useState("");
  const [postType, setPostType] = useState<"replace" | "refund">("replace");
  const [returnSaleable, setReturnSaleable] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    setForm({
      email: req.email,
      contactNumber: req.contactNumber,
      shopifyOrderId: req.shopifyOrderId ?? "",
      problemDescription: req.problemDescription,
    });
    setRemarks("");
    setPostType(req.routedResolution ?? (isSevenDayIntake(req) ? "replace" : "replace"));
    setReturnSaleable(req.returnedUnitSaleable ?? true);
    setMessage(null);
    setError(null);
  }

  function patchRequest(req: WarrantyClaimRequest, patch: Partial<WarrantyClaimRequest>) {
    const updated = { ...req, ...patch };
    const all = requests.map((r) => (r.id === req.id ? updated : r));
    saveWarrantyClaimRequests(all);
    setRequests(all);
    if (selected?.id === req.id) setSelected(updated);
    return updated;
  }

  function addStatus(req: WarrantyClaimRequest, status: CustomerRequestStatus, note: string) {
    return patchRequest(req, {
      status,
      reviewedBy: CS_USER,
      reviewedAt: new Date().toISOString(),
      statusHistory: [
        {
          status,
          changedBy: CS_USER,
          changedAt: new Date().toISOString(),
          notes: note,
        },
        ...req.statusHistory,
      ],
    });
  }

  function handleSubmitRouting(action: "after-sales") {
    if (!selected) return;
    setError(null);
    const note = remarks.trim() || form.problemDescription;
    if (!canRouteToAfterSales(selected)) {
      setError("Cannot route this request.");
      return;
    }
    addStatus(
      selected,
      CUSTOMER_REQUEST_STATUS.routedAfterSales.value,
      note || "Warranty claim routed to After-sales (repair).",
    );
    setMessage("Routed to After-sales — repair and counter workflows.");
  }

  function handleRouteToReturn(resolution: "replace" | "refund") {
    if (!selected || !data) return;
    setError(null);
    if (!canRouteToReturn(selected)) {
      setError("Cannot route this request.");
      return;
    }
    const serial = data.serials.find((s) => s.serialNumber === selected.serialNumber);
    if (!serial) {
      setError("Serial not found in master.");
      return;
    }
    const note = remarks.trim() || form.problemDescription;
    const resolutionLabel = resolution === "replace" ? "replace" : "refund";
    const routeNote = isSevenDayIntake(selected)
      ? note || `7-day ${resolutionLabel} routed to Return (After-sales).`
      : note || `Warranty ${resolutionLabel} routed to Return (After-sales).`;

    const next = holdSerialForReturnProcessing(data, serial, selected.claimId, routeNote);
    saveAppData(next);
    updateData(() => next);

    patchRequest(selected, {
      email: form.email,
      contactNumber: form.contactNumber,
      shopifyOrderId: form.shopifyOrderId || undefined,
      problemDescription: form.problemDescription,
      routedResolution: resolution,
      returnedUnitSaleable: returnSaleable,
      status: CUSTOMER_REQUEST_STATUS.routedReturnDept.value,
      reviewedBy: CS_USER,
      reviewedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: CUSTOMER_REQUEST_STATUS.routedReturnDept.value,
          changedBy: CS_USER,
          changedAt: new Date().toISOString(),
          notes: routeNote,
        },
        ...selected.statusHistory,
      ],
    });
    setMessage(
      `Routed to Return (After-sales) for ${resolutionLabel} — serial on hold until Return completes processing.`,
    );
  }

  function saveDraftFields() {
    if (!selected) return;
    patchRequest(selected, {
      email: form.email,
      contactNumber: form.contactNumber,
      shopifyOrderId: form.shopifyOrderId || undefined,
      problemDescription: form.problemDescription,
    });
    setMessage("Request fields updated.");
  }

  const columns: DataTableColumn<WarrantyClaimRequest>[] = [
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
    { id: "name", header: "Customer", accessor: (r) => r.fullName },
    { id: "status", header: "Status", accessor: (r) => r.status },
    {
      id: "pick",
      header: "",
      sortable: false,
      accessor: () => "",
      cell: (r) => (
        <button
          type="button"
          onClick={() => selectRequest(r)}
          className={`text-xs font-medium ${
            selected?.id === r.id ? "text-orange-700" : "text-orange-600 hover:underline"
          }`}
        >
          Open
        </button>
      ),
    },
  ];

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20";

  const canRoute =
    selected &&
    !selected.postedClaimId &&
    (canRouteToReturn(selected) || (isWarrantyIntake(selected) && canRouteToAfterSales(selected)));

  function renderReturnRouting() {
    if (!selected || selected.postedClaimId) return null;
    return (
      <div className="rounded-lg border p-4 space-y-3">
        <p className="text-xs font-semibold">
          {isSevenDayIntake(selected) ? "7-day claim" : "Replace / refund routing"}
        </p>
        <select
          value={postType}
          onChange={(e) => setPostType(e.target.value as "replace" | "refund")}
          className={inputClass}
        >
          <option value="replace">
            {isSevenDayIntake(selected)
              ? SEVEN_DAY_SUB_TYPE.replace.label
              : "Replace (Return screen)"}
          </option>
          <option value="refund">
            {isSevenDayIntake(selected)
              ? SEVEN_DAY_SUB_TYPE.refund.label
              : "Refund (Return screen)"}
          </option>
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={returnSaleable}
            onChange={(e) => setReturnSaleable(e.target.checked)}
          />
          {FIELDS.saleable.label} (returned unit)
        </label>
        <p className="text-xs text-amber-900 rounded-lg bg-amber-50 p-3">
          {postType === "replace"
            ? "Replacements are completed on the Return screen (scan old/new serial, credit note, submit)."
            : "Refunds are completed on the Return screen (scan serial, credit note, submit) — not posted here."}
        </p>
        <button
          type="button"
          onClick={() => handleRouteToReturn(postType)}
          disabled={!canRouteToReturn(selected)}
          className="w-full rounded-lg bg-amber-600 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
        >
          Send to Return (After-sales) — {postType}
        </button>
        <Link
          href="/dashboard/warranty-claim/after-sales?tab=warranty&claim=replace"
          className="block text-center text-xs text-orange-600 hover:underline"
        >
          Open After-sales replace →
        </Link>
      </div>
    );
  }

  if (section === "courier") {
    return (
      <div className="space-y-4">
        <ItemSerialStatusLookup />
        <button
          type="button"
          onClick={() => setSection("requests")}
          className="text-xs text-orange-600 hover:underline"
        >
          ← Customer requests
        </button>
        <CourierExceptionForm />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ItemSerialStatusLookup />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSection("courier")}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
        >
          Courier delivery failed →
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Customer requests</CardTitle>
            <p className="text-xs text-slate-500">Click a row to load the request form</p>
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex flex-wrap gap-1">
              {(["all", "seven-day", "warranty"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`rounded px-2 py-1 text-xs ${
                    filter === key ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {key === "all" ? "All" : key === "seven-day" ? "7-day" : "Warranty"}
                </button>
              ))}
            </div>
            <DataTable columns={columns} data={filteredRequests} pageSize={10} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-orange-100">
          <CardHeader>
            <CardTitle className="text-base">
              {selected ? `Request ${selected.claimId}` : "Select a request"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selected && (
              <p className="text-sm text-slate-400 py-8 text-center">
                Select a request from the table to review and submit.
              </p>
            )}

            {selected && (
              <>
                <WorkflowStepper
                  steps={[
                    { id: "review", label: "Review request", description: "Update contact & problem" },
                    {
                      id: "route",
                      label: "Route",
                      description: isWarrantyIntake(selected)
                        ? "Repair → After-sales · Replace/refund → Return"
                        : "Replace/refund → Return (After-sales)",
                    },
                    { id: "done", label: "Complete", description: selected.status },
                  ]}
                  currentStepId={
                    selected.status.startsWith("routed") || selected.status === "accepted"
                      ? "done"
                      : canRoute
                        ? "route"
                        : "review"
                  }
                />
                <dl className="grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-slate-500">Customer</dt>
                    <dd className="font-medium">{selected.fullName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Serial</dt>
                    <dd className="font-mono text-xs">{selected.serialNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Status</dt>
                    <dd>
                      <Badge variant="warning">{selected.status}</Badge>
                    </dd>
                  </div>
                </dl>

                <div className="space-y-3 border-t border-slate-100 pt-3">
                  <label className="block text-xs font-medium">{FIELDS.email.label}</label>
                  <input
                    className={inputClass}
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                  <label className="block text-xs font-medium">{FIELDS.contactNumber.label}</label>
                  <input
                    className={inputClass}
                    value={form.contactNumber}
                    onChange={(e) => setForm((f) => ({ ...f, contactNumber: e.target.value }))}
                  />
                  <label className="block text-xs font-medium">{FIELDS.shopifyOrderId.label}</label>
                  <input
                    className={inputClass}
                    value={form.shopifyOrderId}
                    onChange={(e) => setForm((f) => ({ ...f, shopifyOrderId: e.target.value }))}
                  />
                  <label className="block text-xs font-medium">{FIELDS.problemDescription.label}</label>
                  <textarea
                    className={inputClass}
                    rows={3}
                    value={form.problemDescription}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, problemDescription: e.target.value }))
                    }
                  />
                  <label className="block text-xs font-medium">{FIELDS.remarks.label}</label>
                  <textarea
                    className={inputClass}
                    rows={2}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Support remarks for routing"
                  />
                  <button
                    type="button"
                    onClick={saveDraftFields}
                    className="rounded border px-3 py-1.5 text-xs hover:bg-slate-50"
                  >
                    Save field updates
                  </button>
                </div>

                {isWarrantyIntake(selected) && !selected.postedClaimId && (
                  <div className="rounded-lg bg-sky-50 p-4 space-y-2">
                    <p className="text-xs font-semibold text-sky-900">Submit routing</p>
                    <button
                      type="button"
                      onClick={() => handleSubmitRouting("after-sales")}
                      disabled={!canRouteToAfterSales(selected)}
                      className="w-full rounded-lg bg-sky-600 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
                    >
                      Submit → After-sales (repair)
                    </button>
                  </div>
                )}

                {(isSevenDayIntake(selected) || isWarrantyIntake(selected)) &&
                  !selected.postedClaimId &&
                  renderReturnRouting()}

                {selected.status === CUSTOMER_REQUEST_STATUS.routedReturnDept.value && (
                  <p className="text-xs text-slate-600 rounded-lg bg-slate-50 p-3">
                    Awaiting Return (After-sales)
                    {selected.routedResolution ? ` — ${selected.routedResolution}` : ""}
                    {selected.returnedUnitSaleable !== undefined
                      ? ` · saleable: ${selected.returnedUnitSaleable ? "yes" : "no"}`
                      : ""}{" "}
                    —{" "}
                    <Link
                      href="/dashboard/warranty-claim/after-sales?tab=warranty&claim=replace"
                      className="text-orange-600 hover:underline"
                    >
                      process in After-sales replace
                    </Link>
                    .
                  </p>
                )}

                <ul className="text-xs text-slate-500 space-y-1 border-t pt-3">
                  {selected.statusHistory.map((h, i) => (
                    <li key={i}>
                      {h.status}: {h.notes}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {error && <p className="text-sm text-red-700">{error}</p>}
            {message && <p className="text-sm text-emerald-800">{message}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
