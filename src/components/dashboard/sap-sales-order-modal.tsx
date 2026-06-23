// "use client";

// import { Fragment, useMemo, useState } from "react";
// import { ChevronDown, ChevronRight } from "lucide-react";
// import { Dialog } from "@/components/ui/dialog";
// import { FIELDS } from "@/config/fields";
// import { formatSapCardCodeLabel } from "@/lib/sap-customers";
// import {
//   searchSalesOrders,
//   type SapSalesOrderListMode,
// } from "@/lib/sales-orders";
// import type { AppData, SalesOrder } from "@/lib/types";
// import { SalesOrderLinesTable } from "./sales-order-lines-table";

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   onSelect: (order: SalesOrder) => void;
//   mode?: SapSalesOrderListMode;
//   isLoading?:any
//   isError?:any
//   data?: AppData;
//   title?: string;
// };

// export function SapSalesOrderModal({
//   open,
//   onClose,
//   onSelect,
//   mode = "search",
//   data,
//   isLoading,
//   isError,
//   title = "SAP Sales Orders",
// }: Props) {
//   const [query, setQuery] = useState("");
//   const [expanded, setExpanded] = useState<string | null>(null);

//   console.log('dataaa',data)
//   console.log('dataaa',isError)
//   console.log('dataaa',isLoading)

//   const orders = useMemo(
//     () => searchSalesOrders(query, mode, data),
//     [query, mode, data],
//   );

//   const emptyMessage =
//     mode === "new-dispatch"
//       ? "No open sales orders with remaining quantity."
//       : "No sales orders match.";

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       title={title}
//       description={
//         mode === "new-dispatch"
//           ? "Open SAP orders (SO-200xx) with units still available to dispatch."
//           : "Demo SAP B1 — historical orders (SO-100xx) including closed and dispatched."
//       }
//       size="xl"
//     >
//       <input
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder="Search SO, card code, customer, or item…"
//         className="mb-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
//       />

//       <div className="max-h-[55vh] overflow-auto rounded-lg border border-slate-200">
//         <table className="w-full text-left text-sm">
//           <thead className="sticky top-0 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
//             <tr>
//               <th className="px-3 py-2 w-8" />
//               <th className="px-3 py-2">{FIELDS.salesOrderNumber.label}</th>
//               <th className="px-3 py-2">{FIELDS.salesOrderDate.label}</th>
//               <th className="px-3 py-2">{FIELDS.cardCode.label}</th>
//               <th className="px-3 py-2">Customer</th>
//               <th className="px-3 py-2 text-right">Qty</th>
//               <th className="px-3 py-2" />
//             </tr>
//           </thead>
//           <tbody>
//             {orders.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
//                   {emptyMessage}
//                 </td>
//               </tr>
//             ) : (
//               orders.map((order) => {
//                 const isOpen = expanded === order.orderNumber;
//                 return (
//                   <Fragment key={order.orderNumber}>
//                     <tr className="border-t border-slate-100 hover:bg-slate-50/80">
//                       <td className="px-2 py-2">
//                         <button
//                           type="button"
//                           onClick={() =>
//                             setExpanded(isOpen ? null : order.orderNumber)
//                           }
//                           className="rounded p-1 text-slate-400 hover:bg-slate-100"
//                         >
//                           {isOpen ? (
//                             <ChevronDown className="h-4 w-4" />
//                           ) : (
//                             <ChevronRight className="h-4 w-4" />
//                           )}
//                         </button>
//                       </td>
//                       <td className="px-3 py-2 font-mono text-xs font-semibold">
//                         {order.orderNumber}
//                       </td>
//                       <td className="px-3 py-2">{order.orderDate}</td>
//                       <td className="px-3 py-2 text-xs">
//                         {order.cardCode ? formatSapCardCodeLabel(order.cardCode) : "—"}
//                       </td>
//                       <td className="px-3 py-2 max-w-[160px] truncate text-xs">
//                         {order.customerName ?? "—"}
//                       </td>
//                       <td className="px-3 py-2 text-right font-semibold">{order.qty}</td>
//                       <td className="px-3 py-2 text-right">
//                         <button
//                           type="button"
//                           onClick={() => {
//                             onSelect(order);
//                             onClose();
//                           }}
//                           className="rounded-md bg-orange-600 px-3 py-1 text-xs font-medium text-white hover:bg-orange-700"
//                         >
//                           Select
//                         </button>
//                       </td>
//                     </tr>
//                     {isOpen && (
//                       <tr key={`${order.orderNumber}-lines`}>
//                         <td colSpan={7} className="bg-orange-50/40 px-6 py-3">
//                           <SalesOrderLinesTable order={order} />
//                         </td>
//                       </tr>
//                     )}
//                   </Fragment>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>
//     </Dialog>
//   );
// }



"use client";

import { Fragment, useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { FIELDS } from "@/config/fields";
import { formatSapCardCodeLabel } from "@/lib/sap-customers";
import {
  searchSalesOrders,
  type SapSalesOrderListMode,
} from "@/lib/sales-orders";
import type { AppData, SalesOrder } from "@/lib/types";
import { SalesOrderLinesTable } from "./sales-order-lines-table";
import { formatDate } from "@/lib/sales-orders";
import { totalQty } from "@/lib/sales-orders";


type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (order: SalesOrder) => void;
  mode?: SapSalesOrderListMode;
  isLoading?: boolean;
  isError?: boolean;
  // data?: AppData;
  data?: any;
  title?: string;
};

export function SapSalesOrderModal({
  open,
  onClose,
  onSelect,
  mode = "search",
  data,
  isLoading,
  isError,
  title = "SAP Sales Orders",
}: Props) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const orders = useMemo(
    () => searchSalesOrders(query, mode, data),
    [query, mode, data]
  );


  const emptyMessage =
    mode === "new-dispatch"
      ? "No open sales orders with remaining quantity."
      : "No sales orders match.";

  const SkeletonRow = () => (
    <tr className="border-t animate-pulse">
      <td className="px-3 py-3">
        <div className="h-4 w-4 bg-slate-200 rounded" />
      </td>
      <td className="px-3 py-3">
        <div className="h-4 w-24 bg-slate-200 rounded" />
      </td>
      <td className="px-3 py-3">
        <div className="h-4 w-20 bg-slate-200 rounded" />
      </td>
      <td className="px-3 py-3">
        <div className="h-4 w-20 bg-slate-200 rounded" />
      </td>
      <td className="px-3 py-3">
        <div className="h-4 w-28 bg-slate-200 rounded" />
      </td>
      <td className="px-3 py-3 text-right">
        <div className="h-4 w-10 bg-slate-200 rounded ml-auto" />
      </td>
      <td className="px-3 py-3">
        <div className="h-6 w-16 bg-slate-200 rounded ml-auto" />
      </td>
    </tr>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      description={
        mode === "new-dispatch"
          ? "Open SAP orders (SO-200xx) with units still available to dispatch."
          : "Demo SAP B1 — historical orders (SO-100xx) including closed and dispatched."
      }
      size="xl"
    >
      <input
        value={query}
        disabled
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search SO, card code, customer, or item…"
        className="mb-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
      />

      <div className="max-h-[55vh] overflow-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2 w-8" />
              <th className="px-3 py-2">{FIELDS.salesOrderNumber.label}</th>
              <th className="px-3 py-2">{FIELDS.salesOrderDate.label}</th>
              <th className="px-3 py-2">{FIELDS.cardCode.label}</th>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2 text-right">Qty</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>

          <tbody>
            {/* ERROR STATE */}
            {isError ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-red-500">
                  Failed to load sales orders. Please try again.
                </td>
              </tr>
            ) : isLoading ? (
              // alert('asa')
              // LOADING STATE (SKELETON)
              <>
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </>
            ) : orders?.length === 0 ? (
              // EMPTY STATE
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              // DATA STATE
              // Array.isArray(orders) ? orders.map((order:any,key:any) =>  /// old 
              Array.isArray(data) ? data.map((order: any, key: any) => {
                // const isOpen = expanded === order.orderNumber;
                  const isOpen = expanded == order.docNum;

                return (
                  <Fragment key={order.orderNumber}  >
                    <tr className="border-t border-slate-100 hover:bg-slate-50/80"  >
                      <td className="px-2 py-2">
                        <button
                          type="button"
                          onClick={() =>
                            // setExpanded(isOpen ? null : order.orderNumber) old 
                              setExpanded(isOpen ? null : order.docNum) 
                          }
                          className="rounded p-1 text-slate-400 hover:bg-slate-100"
                        >
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      </td>

                      <td className="px-3 py-2 font-mono text-xs font-semibold">
                        {/* {order.orderNumber} */}
                        {order.docNum}
                      </td>

                      {/* <td className="px-3 py-2">{order.orderDate}</td>    ///old */}


                      <td className="px-3 py-2">{order.docDate ? formatDate(order.docDate) : "—"}</td>


                      <td className="px-3 py-2 text-xs">
                        {order.cardCode
                          ? formatSapCardCodeLabel(order.cardCode)
                          : "—"}
                      </td>

                      <td className="px-3 py-2 max-w-[160px] truncate text-xs">
                        {/* {order.customerName ?? "—"} */}
                        {order.cardName}
                        {/* {totalQty} */}

                      </td>

                      <td className="px-3 py-2 text-right font-semibold">
                        {/* {order.qty} */}
                        {/* {totalQty} */}
                        {order?.lines ? totalQty(order?.lines) : "—"}
                        {/* {order.Quan} */}
                      </td>

                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            onSelect(order);
                            onClose();
                          }}
                          className="rounded-md bg-orange-600 px-3 py-1 text-xs font-medium text-white hover:bg-orange-700"
                        >
                          Select
                        </button>
                      </td>
                    </tr>

                    {isOpen && (
                      <tr>
                        <td colSpan={7} className="bg-orange-50/40 px-6 py-3">
                          <SalesOrderLinesTable order={order} />
                          {/* <SalesOrderLinesTable order={data} /> */}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
                : <></>)}
          </tbody>
        </table>
      </div>
    </Dialog>
  );
}