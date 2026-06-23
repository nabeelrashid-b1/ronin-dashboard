import type { AppData, WarrantyDispatchRecord, WarrantySerial } from "./types";

/** Serials already posted on a sales order (for SO search / review) */
export function getSerialsOnSalesOrder(
  data: AppData,
  salesOrderNumber: string,
): WarrantySerial[] {
  const so = salesOrderNumber.trim();
  if (!so) return [];
  return data.serials.filter((s) => s.salesOrderNumber === so);
}

export function getWarrantyDispatchesOnSalesOrder(
  data: AppData,
  salesOrderNumber: string,
): WarrantyDispatchRecord[] {
  const so = salesOrderNumber.trim();
  if (!so) return [];
  return data.warrantyDispatches.filter((d) => d.salesOrderNumber === so);
}

/** Count of serials already posted on this S.O. (partial or full dispatch) */
export function getDispatchedQtyOnSalesOrder(data: AppData, orderNumber: string): number {
  return getSerialsOnSalesOrder(data, orderNumber).length;
}
