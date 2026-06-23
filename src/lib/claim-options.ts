/** Demo SAP / finance lookup data — replace with live APIs later */

import { getSapCardCodeSelectOptions } from "./sap-customers";
import { dummySalesOrders } from "./sales-orders";

export type SelectOption = { value: string; label: string };

/** Credit notes for 7-day refund / replace (selection required) */
export const mandatoryCreditNoteOptions: SelectOption[] = [
  { value: "CN-2026-0001", label: "CN-2026-0001 — Standard refund" },
  { value: "CN-2026-0002", label: "CN-2026-0002 — 7-day return" },
  { value: "CN-2026-0003", label: "CN-2026-0003 — E-commerce replace" },
  { value: "CN-2026-0004", label: "CN-2026-0004 — Dealer counter / replace" },
  { value: "CN-2026-0005", label: "CN-2026-0005 — Warranty replace dispatch" },
  { value: "CN-2026-0006", label: "CN-2026-0006 — Partial credit" },
  { value: "CN-2026-0007", label: "CN-2026-0007 — Full credit" },
  { value: "CN-2026-0008", label: "CN-2026-0008 — Shopify 7-day" },
];

/** Legacy — includes empty option */
export const creditNotes: SelectOption[] = [
  { value: "", label: "— None —" },
  ...mandatoryCreditNoteOptions,
];

/** Open SAP sales orders for 7-day replacement dispatch (demo) */
export function getSevenDayReplacementSoOptions(): SelectOption[] {
  return dummySalesOrders
    .filter((o) =>
      ["SO-10010", "SO-10011", "SO-10012", "SO-10013", "SO-10014", "SO-10015"].includes(
        o.orderNumber,
      ),
    )
    .map((o) => ({
      value: o.orderNumber,
      label: `${o.orderNumber} — ${o.orderDate} · ${o.qty} u · ${o.cardCode ?? "—"}`,
    }));
}

/** @deprecated Use sapCustomers / SapCardCodeSelect */
export const customerCodes: SelectOption[] = [
  { value: "", label: "Select SAP card code" },
  ...getSapCardCodeSelectOptions(),
];

export const shopifyOrderNumbers: SelectOption[] = [
  { value: "", label: "— None —" },
  { value: "SHOP-10001", label: "SHOP-10001" },
  { value: "SHOP-10002", label: "SHOP-10002" },
  { value: "SHOP-10003", label: "SHOP-10003" },
  { value: "SHOP-10004", label: "SHOP-10004" },
  { value: "SHOP-10005", label: "SHOP-10005" },
];
