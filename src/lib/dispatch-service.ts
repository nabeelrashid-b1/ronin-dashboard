import { getDispatchedQtyOnSalesOrder } from "./dispatch-lookup";
import { addMonthsToDate, todayDateString } from "./dispatch-utils";
import { getSalesOrder } from "./sales-orders";
import { salesOrderTotalQty } from "./sap-sales-orders";
import { generateId } from "./storage";
import type {
  AppData,
  DispatchChannel,
  DispatchRecord,
  SalesOrder,
  WarrantyDispatchRecord,
  WarrantySerial,
} from "./types";

const OPERATOR = "Operator User";

export type PostDispatchOptions = {
  channel: DispatchChannel;
  shopifyOrderId?: string;
  outletReference?: string;
};

export function getDispatchedSalesOrderNumbers(data: AppData): string[] {
  const fromRecords = data.dispatches.map((d) => d.salesOrderNumber);
  const fromLines = [...new Set(data.warrantyDispatches.map((d) => d.salesOrderNumber))];
  return [...new Set([...fromRecords, ...fromLines])];
}

export { getDispatchedQtyOnSalesOrder } from "./dispatch-lookup";

export function isSalesOrderFullyDispatched(data: AppData, orderNumber: string): boolean {
  const order = getSalesOrder(orderNumber);
  if (!order) {
    return getDispatchedSalesOrderNumbers(data).includes(orderNumber);
  }
  return getDispatchedQtyOnSalesOrder(data, orderNumber) >= salesOrderTotalQty(order);
}

export function isSalesOrderDispatched(data: AppData, orderNumber: string): boolean {
  return isSalesOrderFullyDispatched(data, orderNumber);
}

/** Post all staged serials for one SO in a single transaction */
export function postDispatchBatch(
  data: AppData,
  salesOrder: SalesOrder,
  serials: WarrantySerial[],
  options: PostDispatchOptions,
): AppData {
  const dispatchDate = todayDateString();
  const warrantyStartDate = dispatchDate;
  const { channel, shopifyOrderId, outletReference } = options;

  const dispatchRecords: WarrantyDispatchRecord[] = serials.map((serial) => ({
    id: generateId(),
    serialNumber: serial.serialNumber,
    dispatchChannel: channel,
    salesOrderNumber: salesOrder.orderNumber,
    salesOrderDate: salesOrder.orderDate,
    dispatchDate,
    shopifyOrderId: channel === "ecommerce" ? shopifyOrderId : undefined,
    outletReference: channel === "outlet" ? outletReference : undefined,
    dispatchType: "initial",
  }));

  const serialNumbers = serials.map((s) => s.serialNumber);

  const updatedSerials = data.serials.map((s) => {
    const match = serials.find((x) => x.id === s.id);
    if (!match) return s;
    return {
      ...s,
      status: "dispatched" as const,
      warrantyStartDate,
      warrantyEndDate: addMonthsToDate(dispatchDate, s.warrantyPeriod),
      salesOrderNumber: salesOrder.orderNumber,
      dispatchChannel: channel,
      shopifyOrderId: channel === "ecommerce" ? shopifyOrderId : s.shopifyOrderId,
      outletReference: channel === "outlet" ? outletReference : s.outletReference,
      dispatchedAt: new Date().toISOString(),
      activeClaimId: undefined,
    };
  });

  const batchRecord: DispatchRecord = {
    id: generateId(),
    dispatchChannel: channel,
    salesOrderNumber: salesOrder.orderNumber,
    serialNumbers,
    warrantyStartDate,
    warrantyEndDate: serials[0]
      ? addMonthsToDate(dispatchDate, serials[0].warrantyPeriod)
      : dispatchDate,
    finalizedAt: new Date().toISOString(),
    finalizedBy: OPERATOR,
    shopifyOrderId: channel === "ecommerce" ? shopifyOrderId : undefined,
    outletReference: channel === "outlet" ? outletReference : undefined,
  };

  return {
    ...data,
    serials: updatedSerials,
    warrantyDispatches: [...data.warrantyDispatches, ...dispatchRecords],
    dispatches: [...data.dispatches, batchRecord],
    auditLogs: [
      {
        id: generateId(),
        action: "DISPATCH_POSTED",
        module: "Dispatch",
        details: `Posted ${serials.length} serial(s) on SO ${salesOrder.orderNumber} via ${channel}`,
        performedBy: OPERATOR,
        performedAt: new Date().toISOString(),
      },
      ...data.auditLogs,
    ],
  };
}
