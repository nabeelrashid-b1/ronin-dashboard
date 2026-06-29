// "use client";

// import { useMemo, useState } from "react";
// import { useAppDataContext } from "@/components/providers/app-data-provider";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
// import { StatusBadge } from "@/components/ui/status-badge";
// import { SerialQrCell } from "@/components/dashboard/serial-qr-cell";
// import { SerialQrViewDialog } from "@/components/dashboard/serial-qr-view-dialog";
// import { FIELDS } from "@/config/fields";
// import { formatSapCardCodeLabel } from "@/lib/sap-customers";
// import { getSalesOrder } from "@/lib/sales-orders";
// import type { WarrantySerial } from "@/lib/types";

// export function SerialTable({ limit }: { limit?: number }) {
//   const { data, isReady } = useAppDataContext();
//   const [qrViewSerial, setQrViewSerial] = useState<WarrantySerial | null>(null);

//   const rows = useMemo(() => {
//     if (!data) return [];
//     const list = [...data.serials].sort(
//       (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
//     );
//     return limit ? list.slice(0, limit) : list;
//   }, [data, limit]);

//   if (!isReady || !data) return null;

//   const columns: DataTableColumn<WarrantySerial>[] = [
//     { id: "serial", header: FIELDS.serialNumber.label, accessor: (r) => r.serialNumber, className: "font-mono text-xs" },
//     {
//       id: "qr",
//       header: FIELDS.qrCode.label,
//       accessor: () => "",
//       sortable: false,
//       cell: (r) => (
//         <SerialQrCell serial={r} onView={() => setQrViewSerial(r)} />
//       ),
//     },
//     { id: "item", header: FIELDS.itemCode.label, accessor: (r) => `${r.itemCode} — ${r.itemName}` },
//     { id: "color", header: FIELDS.color.label, accessor: (r) => r.color },
//     { id: "batch", header: FIELDS.batchNumber.label, accessor: (r) => r.batchNumber },
//     {
//       id: "cardCode",
//       header: FIELDS.cardCode.label,
//       accessor: (r) => {
//         const so = r.salesOrderNumber ? getSalesOrder(r.salesOrderNumber) : undefined;
//         return so?.cardCode ? formatSapCardCodeLabel(so.cardCode) : "—";
//       },
//       className: "text-xs",
//     },
//     { id: "print", header: FIELDS.qrPrintDate.label, accessor: (r) => r.printDate },
//     {
//       id: "chain",
//       header: FIELDS.replacementChain.label,
//       accessor: (r) =>
//         r.replacedFromSerial || r.replacedBySerial
//           ? `${r.replacedFromSerial ?? "—"} → ${r.serialNumber} → ${r.replacedBySerial ?? "—"}`
//           : "—",
//       className: "text-xs text-slate-500",
//     },
//     { id: "claims", header: "Claims", accessor: (r) => r.claimCount },
//     {
//       id: "history",
//       header: "Journey",
//       accessor: (r) => r.claimHistory?.length ?? 0,
//       cell: (r) => (
//         <span className="text-xs text-slate-500">{r.claimHistory?.length ?? 0} event(s)</span>
//       ),
//     },
//     {
//       id: "status",
//       header: FIELDS.claimStatus.label,
//       accessor: (r) => r.status,
//       cell: (r) => <StatusBadge status={r.status} />,
//     },
//     {
//       id: "warrantyStart",
//       header: FIELDS.warrantyStartDate.label,
//       accessor: (r) => r.warrantyStartDate || "—",
//     },
//     {
//       id: "warrantyEnd",
//       header: FIELDS.warrantyEndDate.label,
//       accessor: (r) => r.warrantyEndDate || "—",
//     },
//   ];

//   console.log("Rendering SerialTable with rows:", rows);
//   if (limit) {
//     return (
//       <Card>
//         <CardHeader><CardTitle>Warranty_Master_Table</CardTitle></CardHeader>
//         <CardContent className="p-0">
//           <table className="w-full text-sm">
//             <tbody>
//               {rows.map((r) => (
//                 <tr key={r.id} className="border-t">
//                   <td className="px-4 py-2 font-mono text-xs">{r.serialNumber}</td>
//                   <td className="px-4 py-2"><StatusBadge status={r.status} /></td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <>
//       <Card>
//         <CardHeader>
//           <CardTitle>Warranty_Master_Table</CardTitle>
//           <p className="text-xs text-slate-500">{data?.serials?.length} record(s)</p>
//         </CardHeader>
//         <CardContent>
//           <DataTable columns={columns} data={rows} pageSize={12} searchPlaceholder="Search serial, item, batch…" />
//         </CardContent>
//       </Card>

//       <SerialQrViewDialog
//         serial={qrViewSerial}
//         open={!!qrViewSerial}
//         onClose={() => setQrViewSerial(null)}
//       />
//     </>
//   );
// }


// New

"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDataContext } from "@/components/providers/app-data-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { SerialQrCell } from "@/components/dashboard/serial-qr-cell";
import { SerialQrViewDialog } from "@/components/dashboard/serial-qr-view-dialog";
import { FIELDS } from "@/config/fields";
import { formatSapCardCodeLabel } from "@/lib/sap-customers";
import { getSalesOrder } from "@/lib/sales-orders";
import type { WarrantySerial } from "@/lib/types";

export function SerialTable({ limit }: { limit?: number }) {
  const {  isReady } = useAppDataContext(); 
  const response=useAppDataContext()
   const apiResponse=useAppDataContext()
  // const {isReady}=useAppDataContext()
 
  //  const isReady = useAppDataContext(); 
  //  const data={serial:res} as any

  // console.log()

  // console.log('kokokoppppp',response?.newValue?.value)
  //  console.log('kokokok',  res?.newValue?.value?.data)
  // console.log('kokokoppppp',data.serials)

  const serialItems =
  response?.newValue?.value?.data?.serials?.items ?? [];
  const data={serials:[...serialItems],
    ...response?.newValue?.value?.data?.serials,
    pagination:response?.newValue?.value?.paginations?.serials,
    status:response?.newValue?.value?.status?.serials
  }

  console.log('kokokoppppp',response)
  
  console.log('kokokoppppp',data.serials)
  
  console.log('kokokoppppp',response?.newValue?.value?.data?.serials?.items)
  

//  const data=res?.newValue?.value?.data?.users
   
 
 const [qrViewSerial, setQrViewSerial] = useState<WarrantySerial | null>(null);

  // const rows = useMemo(() => {
  //   if (!data) return [];

  //   const list = [...data.serials].sort(
  //     (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  //   );
  //   return limit ? list.slice(0, limit) : list;
  // }, [data, limit]);

  
  const rows = useMemo(() => {
    if (!data) return [];

    const list = [...data.serials].sort(
      (a, b) => new Date(b.printDate).getTime() - new Date(a.printDate).getTime(),
    );
    return limit ? list.slice(0, limit) : list;
  }, [data, limit]);
console.log('rowa',data?.serials)



  if (!isReady || !data) return null;

  const columns: DataTableColumn<WarrantySerial>[] = [
    // { id: "serial", header: FIELDS.serialNumber.label, accessor: (r) => r.serialNumber, className: "font-mono text-xs" },
    { id: "serial", header: FIELDS.serialNumber.label, accessor: (r) => r.serialNo, className: "font-mono text-xs" },
  
    {
      id: "qr",
      header: FIELDS.qrCode.label,
      accessor: () => "",
      sortable: false,
      cell: (r) => (
        <SerialQrCell serial={r} onView={() => setQrViewSerial(r)} />
      ),
    },
    { id: "item", header: FIELDS.itemCode.label, accessor: (r) => `${r.itemCode} — ${r.itemName}` },
    { id: "color", header: FIELDS.color.label, accessor: (r) => r.color },
    { id: "batch", header: FIELDS.batchNumber.label, accessor: (r) => r.batchNumber },
    {
      id: "cardCode",
      header: FIELDS.cardCode.label,
      accessor: (r) => {
        const so = r.salesOrderNumber ? getSalesOrder(r.salesOrderNumber) : undefined;
        return so?.cardCode ? formatSapCardCodeLabel(so.cardCode) : "—";
      },
      className: "text-xs",
    },
    { id: "print", header: FIELDS.qrPrintDate.label, accessor: (r) => r.printDate },
    {
      id: "chain",
      header: FIELDS.replacementChain.label,
      accessor: (r) =>
        r.replacedFromSerial || r.replacedBySerial
          ? `${r.replacedFromSerial ?? "—"} → ${r.serialNumber} → ${r.replacedBySerial ?? "—"}`
          : "—",
      className: "text-xs text-slate-500",
    },
    { id: "claims", header: "Claims", accessor: (r) => r.claimCount },
    {
      id: "history",
      header: "Journey",
      accessor: (r) => r.claimHistory?.length ?? 0,
      cell: (r) => (
        <span className="text-xs text-slate-500">{r.claimHistory?.length ?? 0} event(s)</span>
      ),
    },
    // {
    //   id: "status",
    //   header: FIELDS.claimStatus.label,
    //   accessor: (r) => r.status,
    //   cell: (r) => <StatusBadge status={r.status} />,
    // },

    {
  id: "status",
  header: FIELDS.claimStatus.label,
  accessor: (r) => r.claimStatus,
  cell: (r) => <StatusBadge status={r.claimStatus} />,
},
  {
      id: "warrantyStart",
      header: FIELDS.warrantyStartDate.label,
      accessor: (r) => r.wStartDate || "—",
    },
    // {
    //   id: "warrantyStart",
    //   header: FIELDS.warrantyStartDate.label,
    //   accessor: (r) => r.warrantyStartDate || "—",
    // },
    {
      id: "warrantyEnd",
      header: FIELDS.warrantyEndDate.label,
      accessor: (r) => r.warrantyEndDate || "—",
    },
    //  {
    //   id: "warrantyEnd",
    //   header: FIELDS.warrantyEndDate.label,
    //   accessor: (r) => r.wEndDate || "—",
    // },
  ];

  console.log("Rendering SerialTable with rows:", rows);
  if (limit) {
    return (
      <Card>
        <CardHeader><CardTitle>Warranty_Master_Table</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-2 font-mono text-xs">{r.serialNumber}</td>
                  <td className="px-4 py-2"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Warranty_Master_Table</CardTitle>
          <p className="text-xs text-slate-500">{data?.serials?.length} record(s)</p>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={rows} pageSize={12} apiResponse={apiResponse} searchPlaceholder="Search serial, item, batch…" />
      
        </CardContent>
      </Card>

      <SerialQrViewDialog
        serial={qrViewSerial}
        open={!!qrViewSerial}
        onClose={() => setQrViewSerial(null)}
      />
    </>
  );
}
