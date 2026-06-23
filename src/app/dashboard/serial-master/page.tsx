// // "use client";

// // import Link from "next/link";
// // import { Printer } from "lucide-react";
// // import { useState } from "react";
// // import { PermissionGate } from "@/components/auth/permission-gate";
// // import { PERMISSIONS } from "@/config/fields";
// // import { PageHeader } from "@/components/layout/page-header";
// // import { ItemSerialStatusLookup } from "@/components/dashboard/item-serial-status-lookup";
// // import { SerialMasterForm } from "@/components/dashboard/serial-master-form";
// // import { SerialPrintSheet } from "@/components/dashboard/serial-print-sheet";
// // import { SerialTable } from "@/components/dashboard/serial-table";
// // import type { WarrantySerial } from "@/lib/types";

// // export default function SerialMasterPage() {
// //   const [tableKey, setTableKey] = useState(0);
// //   const [printBatch, setPrintBatch] = useState<{
// //     records: WarrantySerial[];
// //     label: string;
// //   } | null>(null);

// //   return (
// //     <PermissionGate permission={PERMISSIONS.serialMaster}>
// //       <PageHeader
// //         phase="Phase I"
// //         title="Warranty Serial Number Master"
// //         description="Bulk-generate unique serials with QR payloads (serial + item description). Status Available until dispatch; print labels after generation."
// //         actions={
// //           <Link
// //             href="/dashboard/serial-master/print-labels"
// //             className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
// //           >
// //             <Printer className="h-4 w-4" />
// //             Print all QR labels
// //           </Link>
// //         }
// //       />
// //       <div className="mb-6 space-y-6">
// //         <ItemSerialStatusLookup />
// //         <SerialMasterForm
// //           onGenerated={(records, label) => {
// //             setTableKey((k) => k + 1);
// //             setPrintBatch({ records, label });
// //           }}
// //         />
// //         {printBatch && (
// //           <SerialPrintSheet records={printBatch.records} batchLabel={printBatch.label} />
// //         )}
// //       </div>
// //       <SerialTable key={tableKey} />
// //     </PermissionGate>
// //   );
// // }


// "use client";

// import Link from "next/link";
// import { Printer } from "lucide-react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useState } from "react";
// import { PermissionGate } from "@/components/auth/permission-gate";
// import { PERMISSIONS } from "@/config/fields";
// import { PageHeader } from "@/components/layout/page-header";
// import { ItemSerialStatusLookup } from "@/components/dashboard/item-serial-status-lookup";
// import { SerialMasterForm } from "@/components/dashboard/serial-master-form";
// import { SerialPrintSheet } from "@/components/dashboard/serial-print-sheet";
// import { SerialTable } from "@/components/dashboard/serial-table";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import type { WarrantySerial } from "@/lib/types";

// export default function SerialMasterPage() {
//   const [tableKey, setTableKey] = useState(0);

//   const [printBatch, setPrintBatch] = useState<{
//     records: WarrantySerial[];
//     label: string;
//   } | null>(null);

//   return (
//     <PermissionGate permission={PERMISSIONS.serialMaster}>
//       <PageHeader
//         phase="Phase I"
//         title="Warranty Serial Number Master"
//         description="Bulk-generate unique serials with QR payloads (serial + item description). Status Available until dispatch; print labels after generation."
//         actions={
//           <Link
//             href="/dashboard/serial-master/print-labels"
//             className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
//           >
//             <Printer className="h-4 w-4" />
//             Print all QR labels
//           </Link>
//         }
//       />

//       <div className="mb-6">
//         <Tabs defaultValue="serial-master" className="w-full">
//           <TabsList className="mb-6">
//             <TabsTrigger value="serial-master">
//               Serial Master
//             </TabsTrigger>

//             <TabsTrigger value="item-serial-status">
//               Item Serial Status
//             </TabsTrigger>

//             <TabsTrigger value="print-sheet">
//               Print Sheet
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="serial-master">
//             <SerialMasterForm
//               onGenerated={(records, label) => {
//                 setTableKey((k) => k + 1);
//                 setPrintBatch({ records, label });
//               }}
//             />
//           </TabsContent>

//           <TabsContent value="item-serial-status">
//             <ItemSerialStatusLookup />
//           </TabsContent>

//           <TabsContent value="print-sheet">
//             {printBatch ? (
//               <SerialPrintSheet
//                 records={printBatch.records}
//                 batchLabel={printBatch.label}
//               />
//             ) : (
//               <div className="rounded-lg border border-dashed p-6 text-center text-sm text-slate-500">
//                 Generate serials first to view the print sheet.
//               </div>
//             )}
//           </TabsContent>
//         </Tabs>
//       </div>

//       <SerialTable key={tableKey} />
//     </PermissionGate>
//   );
// }








"use client";

import Link from "next/link";
import { Printer } from "lucide-react";
import { useState } from "react";
import { PermissionGate } from "@/components/auth/permission-gate";
import { PERMISSIONS } from "@/config/fields";
import { PageHeader } from "@/components/layout/page-header";
import { ItemSerialStatusLookup } from "@/components/dashboard/item-serial-status-lookup";
import { SerialMasterForm } from "@/components/dashboard/serial-master-form";
import { SerialPrintSheet } from "@/components/dashboard/serial-print-sheet";
import { SerialTable } from "@/components/dashboard/serial-table";
import type { WarrantySerial } from "@/lib/types";

export default function SerialMasterPage() {
  const [tableKey, setTableKey] = useState(0);

  const [printBatch, setPrintBatch] = useState<{
    records: WarrantySerial[];
    label: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<"master" | "table">("master");

  return (
    <PermissionGate permission={PERMISSIONS.serialMaster}>
      <PageHeader
        phase="Phase I"
        title="Warranty Serial Number Master"
        description="Bulk-generate unique serials with QR payloads (serial + item description). Status Available until dispatch; print labels after generation."
        actions={
          <Link
            href="/dashboard/serial-master/print-labels"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            <Printer className="h-4 w-4" />
            Print all QR labels
          </Link>
        }
      />

      {/* Tabs */}
      <div className="mb-4 border-b border-slate-200">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("master")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === "master"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Serial Masterss
          </button>

          <button
            onClick={() => setActiveTab("table")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === "table"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Serial Table
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-6 space-y-6">
        {activeTab === "master" && (
          <>
            <ItemSerialStatusLookup />

            <SerialMasterForm
              onGenerated={(records, label) => {
                setTableKey((k) => k + 1);
                setPrintBatch({ records, label });
              }}
            />

            {printBatch && (
              <SerialPrintSheet
                records={printBatch.records}
                batchLabel={printBatch.label}
              />
            )}
          </>
        )}

        {activeTab === "table" && <SerialTable key={tableKey} />}
      </div>
    </PermissionGate>
  );
}