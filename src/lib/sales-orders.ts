import {
  seedSalesOrders,
  seedSalesOrdersHistory,
  seedSalesOrdersOpen,
} from "./generate-seed-data";
import { getDispatchedQtyOnSalesOrder } from "./dispatch-lookup";
import { salesOrderTotalQty } from "./sap-sales-orders";
import type { AppData, SalesOrder } from "./types";

export { salesOrderTotalQty };

export type SapSalesOrderListMode = "search" | "new-dispatch";

/**
 * Demo SAP B1 sales orders — replace with live SAP B1 Service Layer / DI API fetch.
 * History (SO-100xx) = search & dispatched data; open (SO-200xx) = new dispatch only.
 */
export const dummySalesOrders: SalesOrder[] = seedSalesOrders;
export const dummySalesOrdersHistory: SalesOrder[] = seedSalesOrdersHistory;
export const dummySalesOrdersOpen: SalesOrder[] = seedSalesOrdersOpen;

// function filterOrdersByQuery(orders: SalesOrder[], query: string): SalesOrder[] || [] {

  function filterOrdersByQuery(orders: SalesOrder[], query: string): any {
  // if (Array.isArray(orders) && orders.length > 0) {
    const q = query.trim().toUpperCase();
    if (!q) return orders;
    return orders?.filter(
      (o) =>
        o.orderNumber.toUpperCase().includes(q) ||
        o.cardCode?.toUpperCase().includes(q) ||
        o.customerName?.toUpperCase().includes(q) ||
        o.lines?.some(
          (l) =>
            l.itemCode.toUpperCase().includes(q) ||
            l.itemName.toUpperCase().includes(q),
        ),
    );
  // }
  return []
}

export function getSalesOrdersForList(
  mode: SapSalesOrderListMode,
  // data?: AppData,
  data?: any,
): SalesOrder[] {
  if (mode === "search") {
    // console.log('searchif',data)
    return dummySalesOrdersHistory;
    // return data

  }
  return getOpenSalesOrdersForDispatch(data);
}

// export function formatDate(dateString: string): string {
//   const date = new Date(dateString);

//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// }






export function searchSalesOrders(
  query: string,
  mode: SapSalesOrderListMode = "search",
  data?: AppData,
): SalesOrder[] {
  return filterOrdersByQuery(getSalesOrdersForList(mode, data), query);
}


export function formatDate(dateString?: string) {
  if (!dateString) return "—";
  return dateString.split("T")[0];
};


export function totalQty(lines?:any){
 const orderLines = lines ?? [];

  const totalQty = orderLines.reduce((sum:any, line:any) => {
    return sum + (line.quantity ?? 0);
  }, 0);

  return totalQty
}





export function getSalesOrder(orderNumber: string): SalesOrder | undefined {
  return dummySalesOrders.find((o) => o.orderNumber === orderNumber);
}

function isOrderOpenForSap(order: SalesOrder): boolean {
  return order.status !== "closed";
}

function hasRemainingDispatchQty(data: AppData | undefined, order: SalesOrder): boolean {
  const total = salesOrderTotalQty(order);
  if (!data) return true;
  return getDispatchedQtyOnSalesOrder(data, order.orderNumber) < total;
}

/** Open SO-200xx with remaining qty — for new warehouse dispatch */
export function getOpenSalesOrdersForDispatch(data?: AppData): SalesOrder[] {
  return dummySalesOrdersOpen.filter(
    (o) => isOrderOpenForSap(o) && hasRemainingDispatchQty(data, o),
  );
}

/** SOs not yet fully dispatched (replacement / legacy callers) */
export function getOpenSalesOrders(dispatchedOrderNumbers: string[]): SalesOrder[] {
  const used = new Set(dispatchedOrderNumbers);
  return dummySalesOrdersOpen.filter(
    (o) => isOrderOpenForSap(o) && !used.has(o.orderNumber),
  );
}

/** SOs available for counter/replace */
export function getReplacementSalesOrders(dispatchedOrderNumbers: string[]): SalesOrder[] {
  return getOpenSalesOrders(dispatchedOrderNumbers);
}
