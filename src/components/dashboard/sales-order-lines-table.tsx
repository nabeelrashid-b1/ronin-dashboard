"use client";

import { FIELDS } from "@/config/fields";
import type { SalesOrder } from "@/lib/types";

export function SalesOrderLinesTable({ order }: { order: SalesOrder }) { 
  // export function SalesOrderLinesTable({ order }: { order: any }) {

  const lines = order.lines ?? [];

  const totalQty = lines.reduce((sum, line) => {
    return sum + (line.quantity ?? 0);
  }, 0);


  if (!order.lines?.length) {
    return (
      <p className="text-sm text-slate-500">
        {/* Total qty: {order.qty} (line detail not loaded)  */}
        Total qty :{totalQty} (line detail not loaded)
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-3 py-2">Line</th>
            <th className="px-3 py-2">Item code</th>
            <th className="px-3 py-2">Description</th>
            <th className="px-3 py-2 text-right">{FIELDS.salesOrderQty.label}</th>
          </tr>
        </thead>
        <tbody>
          {order?.lines?.map((line:any) => (
            <tr key={line.lineNum} className="border-t border-slate-100">
              <td className="px-3 py-2 text-slate-500">{line.lineNum}</td>
              <td className="px-3 py-2 font-mono text-xs">{line.itemCode}</td>
              <td className="px-3 py-2">{line.itemName}</td>
              {/* <td className="px-3 py-2 text-right font-semibold">{line.qty}</td> */}
                   <td className="px-3 py-2 text-right font-semibold">{line.quantity}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t border-slate-200 bg-slate-50">
          <tr>
            <td colSpan={3} className="px-3 py-2 text-right text-xs font-medium text-slate-600">
              Total units
            </td>
            <td className="px-3 py-2 text-right font-bold text-slate-900">{totalQty}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}


// "use client";

// import { FIELDS } from "@/config/fields";
// import type { SalesOrder } from "@/lib/types";

// // export function SalesOrderLinesTable({ order }: { order: SalesOrder }) {
//   export function SalesOrderLinesTable({ order }: { order: any }) {
//   if (!order.lines?.length) {
//     return (
//       <p className="text-sm text-slate-500">
//         Total qty: {order.quantity} (line detail not loaded)
//       </p>
//     );
//   }

//   return (
//     <div className="overflow-x-auto rounded-lg border border-slate-200">
//       <table className="w-full text-left text-sm">
//         <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
//           <tr>
//             <th className="px-3 py-2">Line</th>
//             <th className="px-3 py-2">Item code</th>
//             <th className="px-3 py-2">Description</th>
//             <th className="px-3 py-2 text-right">{FIELDS.salesOrderQty.label}</th>
//           </tr>
//         </thead>
//         <tbody>
//           {order?.lines?.map((line :any) => (
//             <tr key={line.lineNum} className="border-t border-slate-100">
//               <td className="px-3 py-2 text-slate-500">{line.lineNum}</td>
//               <td className="px-3 py-2 font-mono text-xs">{line.itemCode}</td>
//               <td className="px-3 py-2">{line.itemName}</td>
//               {/* <td className="px-3 py-2 text-right font-semibold">{line.qty}</td> */}
//                   <td className="px-3 py-2 text-right font-semibold">{line.quantity}</td>
//             </tr>
//           ))}
//         </tbody>
//         <tfoot className="border-t border-slate-200 bg-slate-50">
//           <tr>
//             <td colSpan={3} className="px-3 py-2 text-right text-xs font-medium text-slate-600">
//               Total units
//             </td>
//             <td className="px-3 py-2 text-right font-bold text-slate-900">{order.quantity}</td>
//           </tr>
//         </tfoot>
//       </table>
//     </div>
//   );
// }
