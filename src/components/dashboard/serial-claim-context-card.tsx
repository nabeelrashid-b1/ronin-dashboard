"use client";

import { FIELDS } from "@/config/fields";
import { formatSapCardCodeLabel } from "@/lib/sap-customers";
import type { SerialClaimContext } from "@/lib/serial-claim-lookup";

export function SerialClaimContextCard({
  title,
  ctx,
  variant = "old",
}: {
  title: string;
  ctx: SerialClaimContext;
  variant?: "old" | "new";
}) {
  const { serial, dispatchLine, salesOrder } = ctx;
  const border =
    variant === "old" ? "border-sky-200 bg-sky-50/50" : "border-emerald-200 bg-emerald-50/50";

  return (
    <div className={`rounded-lg border p-4 text-sm ${border}`}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
        {title}
      </p>
      <dl className="grid gap-2 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-slate-500">{FIELDS.serialNumber.label}</dt>
          <dd className="font-mono text-xs font-semibold">{serial.serialNumber}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Status</dt>
          <dd className="font-medium capitalize">{serial.status}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs text-slate-500">Item</dt>
          <dd>
            {serial.itemCode} — {serial.itemName} ({serial.color})
          </dd>
        </div>
        {serial.salesOrderNumber && (
          <div>
            <dt className="text-xs text-slate-500">{FIELDS.salesOrderNumber.label}</dt>
            <dd className="font-mono text-xs">{serial.salesOrderNumber}</dd>
          </div>
        )}
        {salesOrder?.cardCode && (
          <div className="sm:col-span-2">
            <dt className="text-xs text-slate-500">{FIELDS.cardCode.label}</dt>
            <dd className="text-xs">{formatSapCardCodeLabel(salesOrder.cardCode)}</dd>
          </div>
        )}
        {salesOrder && (
          <div>
            <dt className="text-xs text-slate-500">{FIELDS.salesOrderDate.label}</dt>
            <dd>{salesOrder.orderDate}</dd>
          </div>
        )}
        {dispatchLine && (
          <div>
            <dt className="text-xs text-slate-500">Dispatch date</dt>
            <dd>{dispatchLine.dispatchDate}</dd>
          </div>
        )}
        {serial.warrantyStartDate && (
          <div className="sm:col-span-2">
            <dt className="text-xs text-slate-500">Warranty</dt>
            <dd>
              {serial.warrantyStartDate} → {serial.warrantyEndDate}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
