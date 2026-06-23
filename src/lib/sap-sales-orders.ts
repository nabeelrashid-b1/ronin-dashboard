import type { SalesOrder, SalesOrderLine } from "./types";

export function salesOrderTotalQty(order: SalesOrder): number {
  if (order.lines?.length) {
    return order.lines.reduce((sum, line) => sum + line.qty, 0);
  }
  return order.qty;
}

export function buildSapSalesOrder(
  orderNumber: string,
  orderDate: string,
  lines: Omit<SalesOrderLine, "lineNum">[],
  meta?: {
    cardCode?: string;
    customerName?: string;
    status?: SalesOrder["status"];
  },
): SalesOrder {
  const withLineNum: SalesOrderLine[] = lines.map((line, i) => ({
    lineNum: i + 1,
    ...line,
  }));
  const qty = withLineNum.reduce((sum, line) => sum + line.qty, 0);
  return {
    orderNumber,
    orderDate,
    qty,
    lines: withLineNum,
    cardCode: meta?.cardCode,
    customerName: meta?.customerName,
    status: meta?.status ?? "open",
  };
}
