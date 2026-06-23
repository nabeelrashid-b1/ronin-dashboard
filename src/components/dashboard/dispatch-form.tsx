"use client";

import { useMemo, useRef, useState } from "react";
import { ClipboardList, PackagePlus, ScanLine, Search } from "lucide-react";
import { useAppDataContext } from "@/components/providers/app-data-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StagingTable } from "@/components/ui/staging-table";
import { DISPATCH_CHANNEL, FIELDS } from "@/config/fields";
import {
  dispatchErrorMessages,
  findSerialByScan,
  validateDispatchScan,
} from "@/lib/dispatch-utils";
import {
  getSerialsOnSalesOrder,
  getWarrantyDispatchesOnSalesOrder,
} from "@/lib/dispatch-lookup";
import {
  isSalesOrderDispatched,
  isSalesOrderFullyDispatched,
  postDispatchBatch,
} from "@/lib/dispatch-service";
import {
  getOpenSalesOrdersForDispatch,
  getSalesOrder,
} from "@/lib/sales-orders";
import { generateId, saleOrders, saveAppData } from "@/lib/storage";
import type { DispatchChannel, SalesOrder, WarrantyDispatchRecord, WarrantySerial } from "@/lib/types";
import { saveWarrantyDispatchTable } from "@/lib/warranty-dispatch";
import { saveWarrantyMasterTable } from "@/lib/warranty-master";
import { ItemSerialStatusLookup } from "./item-serial-status-lookup";
import { formatSapCardCodeLabel } from "@/lib/sap-customers";
import { SapSalesOrderModal } from "./sap-sales-order-modal";
import { SalesOrderLinesTable } from "./sales-order-lines-table";
import { useQuery } from "@tanstack/react-query";



type StagedRow = { id: string; serial: WarrantySerial };
type Section = "lookup" | "create";

const channelMeta = {
  warehouse: {
    title: "Warehouse dispatch",
    hint: "B2B dealer fulfilment — SAP sales order required.",
  },
  outlet: {
    title: "Outlet dispatch",
    hint: "Walk-in retail — sales order number is the receipt (no separate outlet receipt).",
  },
  ecommerce: {
    title: "E-commerce dispatch",
    hint: "Online Shopify orders — SO and Shopify Order ID required.",
  },
} as const;

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20";

function SoSearchBar({
  soInput,
  setSoInput,
  onSearch,
  onOpenSap,
  label,
}: {
  soInput: string;
  setSoInput: (v: string) => void;
  onSearch: () => void;
  onOpenSap: () => void;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label className="mb-1.5 block text-xs font-medium text-slate-600">{label}</label>
        <input
          value={soInput}
          onChange={(e) => setSoInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), onSearch())}
          placeholder={label.includes("open") ? "e.g. SO-20001" : "e.g. SO-10001"}
          className={inputClass}
        />
      </div>
      <button
        type="button"
        onClick={onSearch}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        <Search className="h-4 w-4" />
        Search
      </button>
      <button
        type="button"
        onClick={onOpenSap}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
      >
        <ClipboardList className="h-4 w-4" />
        SAP S.O. list
      </button>
    </div>
  );
}

function SalesOrderSummary({ order, dispatched }: { order: SalesOrder; dispatched: boolean }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs text-slate-500">{FIELDS.salesOrderNumber.label}</p>
          <p className="font-mono text-sm font-semibold">{order.orderNumber}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">{FIELDS.salesOrderDate.label}</p>
          <p className="text-sm">{order.orderDate}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">{FIELDS.cardCode.label}</p>
          <p className="text-sm">
            {order.cardCode ? formatSapCardCodeLabel(order.cardCode) : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Dispatch status</p>
          <Badge variant={dispatched ? "success" : "info"}>
            {dispatched ? "Dispatched" : "Open"}
          </Badge>
        </div>
      </div>
      {order.customerName && (
        <p className="text-sm text-slate-600">
          <span className="font-medium">Customer:</span> {order.customerName}
        </p>
      )}
      <SalesOrderLinesTable order={order} />
    </div>
  );
}

export function DispatchForm({ channel }: { channel: DispatchChannel }) {
  const { data, updateData } = useAppDataContext();
  console.log('data',data)
  const meta = channelMeta[channel];
  const [section, setSection] = useState<Section>("lookup");
  const [sapOpen, setSapOpen] = useState(false);
  const [sapMode, setSapMode] = useState<"lookup" | "create">("lookup");

  const [lookupInput, setLookupInput] = useState("");
  const [lookupSo, setLookupSo] = useState("");

  const [createInput, setCreateInput] = useState("");
  const [createSo, setCreateSo] = useState("");
  const [shopifyOrderId, setShopifyOrderId] = useState("");
  const [scanInput, setScanInput] = useState("");
  const [staged, setStaged] = useState<StagedRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const scanRef = useRef<HTMLInputElement>(null);

  const openOrders = useMemo(
    () => (data ? getOpenSalesOrdersForDispatch(data) : []),
    [data],
  );
  const openOrderNumbers = useMemo(
    () => new Set(openOrders.map((o) => o.orderNumber)),
    [openOrders],
  );

  const lookupOrder = useMemo(
    () => (lookupSo ? getSalesOrder(lookupSo) : undefined),
    [lookupSo],
  );
  const createOrder = useMemo(
    () => (createSo ? getSalesOrder(createSo) : undefined),
    [createSo],
  );

  const lookupSerials = useMemo(
    () => (data && lookupSo ? getSerialsOnSalesOrder(data, lookupSo) : []),
    [data, lookupSo],
  );
  const lookupDispatches = useMemo(
    () => (data && lookupSo ? getWarrantyDispatchesOnSalesOrder(data, lookupSo) : []),
    [data, lookupSo],
  );
  const lookupDispatched = useMemo(
    () => (data && lookupSo ? isSalesOrderDispatched(data, lookupSo) : false),
    [data, lookupSo],
  );

  const stagedCount = staged.length;
  const createQty = createOrder?.qty ?? 0;
  const remaining = createOrder ? Math.max(0, createQty - stagedCount) : 0;
  const isComplete = createOrder ? stagedCount >= createQty : false;

  function resolveLookup() {
    setError(null);
    const trimmed = lookupInput.trim().toUpperCase();
    if (!trimmed) {
      setError("Enter a sales order number.");
      return;
    }
    const order = getSalesOrder(trimmed);
    if (!order) {
      setError(`Sales order ${trimmed} not found in SAP (demo).`);
      setLookupSo("");
      return;
    }
    setLookupSo(order.orderNumber);
    setLookupInput(order.orderNumber);
  }

  function resolveCreate() {
    setError(null);
    setSuccess(null);
    const trimmed = createInput.trim().toUpperCase();
    if (!trimmed) {
      setError("Enter a sales order number.");
      return;
    }
    const order = getSalesOrder(trimmed);
    if (!order) {
      setError(`Sales order ${trimmed} not found in SAP (demo).`);
      setCreateSo("");
      return;
    }
    if (!openOrderNumbers.has(order.orderNumber)) {
      setError(
        "This sales order is closed, fully dispatched, or not available for new dispatch (use SO-200xx).",
      );
      setCreateSo("");
      return;
    }
    if (data && isSalesOrderFullyDispatched(data, order.orderNumber)) {
      setError("This sales order has no remaining quantity to dispatch.");
      setCreateSo("");
      return;
    }
    setCreateSo(order.orderNumber);
    setCreateInput(order.orderNumber);
    setStaged([]);
    setScanInput("");
    setTimeout(() => scanRef.current?.focus(), 100);
  }

  function handleSapSelect(order: SalesOrder) {
    if (sapMode === "lookup") {
      setLookupInput(order.orderNumber);
      setLookupSo(order.orderNumber);
      setSection("lookup");
    } else {
      setCreateInput(order.orderNumber);
      setCreateSo(order.orderNumber);
      setStaged([]);
      setSection("create");
      setTimeout(() => scanRef.current?.focus(), 100);
    }
    setError(null);
  }

  function openSap(mode: "lookup" | "create") {
    setSapMode(mode);
    setSapOpen(true);
  }

  function handleAddScan(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!data || !createOrder) {
      setError("Select an open sales order in section 2 first.");
      return;
    }

    const trimmed = scanInput.trim();
    if (!trimmed) {
      setError(dispatchErrorMessages.empty);
      return;
    }

    const serial = findSerialByScan(data.serials, trimmed);
    const sessionSerials = staged.map((r) => r.serial.serialNumber);
    const validationError = validateDispatchScan(
      serial,
      sessionSerials,
      stagedCount,
      createQty,
    );

    if (validationError) {
      setError(dispatchErrorMessages[validationError]);
      return;
    }
    if (!serial) return;

    setStaged((rows) => [...rows, { id: generateId(), serial }]);
    setScanInput("");
    scanRef.current?.focus();
  }

  function handlePost() {
    setError(null);
    setSuccess(null);
    if (!data || !createOrder || staged.length === 0) return;

    if (staged.length !== createQty) {
      setError(`Scan count must match SO qty (${createQty}). Currently ${staged.length}.`);
      return;
    }

    if (isSalesOrderDispatched(data, createOrder.orderNumber)) {
      setError("This sales order was already dispatched.");
      return;
    }

    if (channel === "ecommerce" && !shopifyOrderId.trim()) {
      setError("Shopify Order ID is required for e-commerce dispatch.");
      return;
    }

    const serials = staged.map((r) => r.serial);
    const next = postDispatchBatch(data, createOrder, serials, {
      channel,
      shopifyOrderId: channel === "ecommerce" ? shopifyOrderId.trim() : undefined,
    });

    saveWarrantyDispatchTable(next.warrantyDispatches);
    saveWarrantyMasterTable(next.serials);
    saveAppData(next);
    updateData(() => next);

    setStaged([]);
    setCreateSo("");
    setCreateInput("");
    setShopifyOrderId("");
    setSuccess(`Posted ${serials.length} unit(s) on ${createOrder.orderNumber}.`);
    setLookupSo(createOrder.orderNumber);
    setLookupInput(createOrder.orderNumber);
    setSection("lookup");
  }

  const serialColumns: DataTableColumn<WarrantySerial & { id: string }>[] = [
    {
      id: "sn",
      header: FIELDS.serialNumber.label,
      accessor: (r) => r.serialNumber,
      className: "font-mono text-xs",
    },
    { id: "item", header: "Item", accessor: (r) => r.itemName },
    { id: "status", header: "Status", accessor: (r) => r.status },
    {
      id: "warrantyStart",
      header: FIELDS.warrantyStartDate.label,
      accessor: (r) => r.warrantyStartDate || "—",
    },
    {
      id: "warrantyEnd",
      header: FIELDS.warrantyEndDate.label,
      accessor: (r) => r.warrantyEndDate || "—",
    },
  ];

  const dispatchLogColumns: DataTableColumn<WarrantyDispatchRecord & { id: string }>[] = [
    {
      id: "sn",
      header: "Serial",
      accessor: (r) => r.serialNumber,
      className: "font-mono text-xs",
    },
    { id: "date", header: "Dispatch date", accessor: (r) => r.dispatchDate },
    { id: "ch", header: "Channel", accessor: (r) => r.dispatchChannel },
    { id: "type", header: "Type", accessor: (r) => r.dispatchType ?? "initial" },
  ];

  const serialRows = lookupSerials.map((s) => ({ ...s, id: s.id }));
  const dispatchRows = lookupDispatches.map((d) => ({ ...d, id: d.id }));
const { data : salesOrderData, isLoading,isError  } = useQuery({
    queryKey: ["sales"],
    queryFn: saleOrders,
  });
  console.log('salesdata',salesOrderData)
  return (
    <div className="space-y-6">
      <ItemSerialStatusLookup compact title="Check item serial status" />

      <div className="flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
        <button
          type="button"
          onClick={() => setSection("lookup")}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium ${
            section === "lookup"
              ? "bg-white text-orange-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Search className="h-4 w-4" />
          1. Search S.O. &amp; dispatched data
        </button>
        <button
          type="button"
          onClick={() => setSection("create")}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium ${
            section === "create"
              ? "bg-white text-orange-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <PackagePlus className="h-4 w-4" />
          2. New dispatch
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{meta.title}</CardTitle>
          <CardDescription>{meta.hint}</CardDescription>
          <p className="text-xs font-medium text-orange-700">
            Channel: {DISPATCH_CHANNEL[channel].label}
          </p>
        </CardHeader>
      </Card>

      {section === "lookup" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Search sales order</CardTitle>
            <CardDescription>
              Load SAP order lines and all serials / dispatch lines already posted on this S.O.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <SoSearchBar
              soInput={lookupInput}
              setSoInput={setLookupInput}
              onSearch={resolveLookup}
              onOpenSap={() => openSap("lookup")}
              label={`${FIELDS.salesOrderNumber.label} (any status)`}
            />
            {lookupOrder && (
              <>
                <SalesOrderSummary order={lookupOrder} dispatched={lookupDispatched} />
                <div>
                  <p className="mb-2 text-sm font-medium text-slate-800">
                    Dispatched serials ({lookupSerials.length} / {lookupOrder.qty})
                  </p>
                  <DataTable
                    columns={serialColumns}
                    data={serialRows}
                    pageSize={6}
                    emptyMessage="No serials linked to this S.O. yet."
                    searchPlaceholder="Filter serials…"
                  />
                </div>
                {lookupDispatches.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-slate-800">
                      Dispatch staging log ({lookupDispatches.length})
                    </p>
                    <DataTable
                      columns={dispatchLogColumns}
                      data={dispatchRows}
                      pageSize={6}
                      emptyMessage="No dispatch records."
                      searchPlaceholder="Filter dispatch lines…"
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {section === "create" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create new dispatch</CardTitle>
            <CardDescription>
              Select an open SAP sales order, scan available serials until qty matches, then post.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <SoSearchBar
              soInput={createInput}
              setSoInput={setCreateInput}
              onSearch={resolveCreate}
              onOpenSap={() => openSap("create")}
              label={`${FIELDS.salesOrderNumber.label} (open only)`}
            />

            {createOrder && (
              <>
                <SalesOrderSummary
                  order={createOrder}
                  dispatched={data ? isSalesOrderDispatched(data, createOrder.orderNumber) : false}
                />

                {channel === "ecommerce" && (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                      {FIELDS.shopifyOrderId.label} <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={shopifyOrderId}
                      onChange={(e) => setShopifyOrderId(e.target.value)}
                      placeholder="SHOP-12345"
                      className={inputClass}
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
                  <span className="text-sm text-slate-600">Scan progress:</span>
                  <Badge variant={isComplete ? "success" : "info"}>
                    {stagedCount} / {createQty}
                  </Badge>
                  {!isComplete && (
                    <span className="text-xs text-slate-500">{remaining} scan(s) remaining</span>
                  )}
                  {isComplete && (
                    <span className="text-xs text-emerald-700">Qty matched — ready to post</span>
                  )}
                </div>

                <form onSubmit={handleAddScan} className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <ScanLine className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      ref={scanRef}
                      type="text"
                      value={scanInput}
                      onChange={(e) => setScanInput(e.target.value)}
                      disabled={isComplete}
                      placeholder="Scan QR / serial (available units only)"
                      className={`${inputClass} pl-10`}
                      autoComplete="off"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isComplete}
                    className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
                  >
                    Add scan
                  </button>
                </form>

                {staged.length > 0 && (
                  <StagingTable
                    rows={staged}
                    onRemove={(id) => setStaged((rows) => rows.filter((r) => r.id !== id))}
                    columns={[
                      {
                        id: "serial",
                        header: "Serial",
                        className: "font-mono text-xs",
                        cell: (r) => r.serial.serialNumber,
                      },
                      {
                        id: "item",
                        header: "Item",
                        cell: (r) => `${r.serial.itemCode} — ${r.serial.itemName}`,
                      },
                    ]}
                  />
                )}

                <button
                  type="button"
                  onClick={handlePost}
                  disabled={!isComplete}
                  className="rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Post dispatch
                </button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {(error || success) && (
        <div className="space-y-2">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{success}</p>
          )}
        </div>
      )}

      {/* old version */}
{/* 
       <SapSalesOrderModal
        open={sapOpen}
        onClose={() => setSapOpen(false)}
        onSelect={handleSapSelect}
        mode={sapMode === "create" ? "new-dispatch" : "search"}
        data={data ?? undefined}
      
        title={
          sapMode === "create"
            ? "SAP Sales Orders — open for dispatch"
            : "SAP Sales Orders — history & dispatched"
        }
      />
  */}


 {/* new verion */}
 <SapSalesOrderModal
        open={sapOpen}
        // open={true}

        onClose={() => setSapOpen(false)}
        onSelect={handleSapSelect}
        mode={sapMode === "create" ? "new-dispatch" : "search"}
        data={salesOrderData ?? undefined}
        isLoading={isLoading}
        isError={isError}
        title={
          sapMode === "create"
            ? "SAP Sales Orders — open for dispatch"
            : "SAP Sales Orders — history & dispatched"
        }
      />

    </div>
  );
}
