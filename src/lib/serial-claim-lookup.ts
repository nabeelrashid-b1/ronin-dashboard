import { lookupSerialForClaim } from "./claim-utils";
import { getSalesOrder } from "./sales-orders";
import type { AppData, SalesOrder, WarrantyDispatchRecord, WarrantySerial } from "./types";

export type SerialClaimContext = {
  serial: WarrantySerial;
  /** Latest warranty dispatch line for this serial */
  dispatchLine?: WarrantyDispatchRecord;
  salesOrder?: SalesOrder;
};

/** Resolve scan + enrich from warranty master and dispatch tables */
export function getSerialClaimContext(
  data: AppData,
  scanInput: string,
): SerialClaimContext | null {
  const serial = lookupSerialForClaim(data.serials, scanInput);
  if (!serial) return null;

  const dispatchLine = data.warrantyDispatches
    .filter((d) => d.serialNumber === serial.serialNumber)
    .sort((a, b) => b.dispatchDate.localeCompare(a.dispatchDate))[0];

  const soNumber = serial.salesOrderNumber ?? dispatchLine?.salesOrderNumber;
  const salesOrder = soNumber ? getSalesOrder(soNumber) : undefined;

  return { serial, dispatchLine, salesOrder };
}

export function resolveCounterDispatchSo(
  ctx: SerialClaimContext,
): { salesOrderNumber: string; salesOrderDate: string } | null {
  const salesOrderNumber =
    ctx.serial.salesOrderNumber ?? ctx.dispatchLine?.salesOrderNumber;
  if (!salesOrderNumber) return null;
  const salesOrderDate =
    ctx.salesOrder?.orderDate ?? ctx.dispatchLine?.salesOrderDate ?? "";
  if (!salesOrderDate) return null;
  return { salesOrderNumber, salesOrderDate };
}
