import axios from "axios";

export const fetchUsers = async ({ page, pageSize }: any) => {
  const res = await axios.get(
    `https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=${pageSize}`
  );
  return res.data;
};

export const fetchItems = async ({ page, pageSize }: any) => {
  const res = await axios.get(
    `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${pageSize}`
  );
  return res.data;
};

export const fetchSerials = async ({ page, pageSize }: any) => {

  try {
    const res = await axios.get(
      ` http://192.168.19.16:9002/serial-masters?page=${page}&pageSize=${pageSize}`
    );

    console.log('kkkkk', res.data)
    // return res.data;

    /// CUSTOM 
    return {
      "items": [
        {
          "code": "ITM-1001",
          "itemCode": "PEN-XL-2026",
          "itemName": "Premium Gel Pen",
          "batchNumber": "BATCH-45891",
          "color": "Blue",
          "printDate": "2026-06-19T08:15:51.691Z",
          "warrantyPeriod": 12,
          "wStartDate": "2026-06-19T08:15:51.691Z",
          "wEndDate": "2027-06-19T08:15:51.691Z",
          "claimCount": 1,
          "itemStatus": "Active",
          "claimStatus": "Approved"

        },
        {
          "code": "ITM-1002",
          "itemCode": "KB-MECH-87",
          "itemName": "Mechanical Keyboard",
          "batchNumber": "BATCH-77452",
          "color": "Black",
          "printDate": "2026-06-19T08:15:51.691Z",
          "warrantyPeriod": 24,
          "wStartDate": "2026-06-19T08:15:51.691Z",
          "wEndDate": "2028-06-19T08:15:51.691Z",
          "claimCount": 0,
          "itemStatus": "Active",
          "claimStatus": "Approved"
        },
        {
          "code": "ITM-1003",
          "itemCode": "MOUSE-GAM-2026",
          "itemName": "Gaming Mouse",
          "batchNumber": "BATCH-99211",
          "color": "Red",
          "printDate": "2026-06-19T08:15:51.691Z",
          "warrantyPeriod": 18,
          "wStartDate": "2026-06-19T08:15:51.691Z",
          "wEndDate": "2027-12-19T08:15:51.691Z",
          "claimCount": 2,
          "itemStatus": "Inactive",
          "claimStatus": "Rejected"
        }
      ],
      "page": 1,
      "pageSize": 10,
      "totalCount": 3,
      "totalPages": 1
    }
  }
  catch (error  ) {
    return {
      "items": [
        {
          "code": "ITM-1001",
          "itemCode": "PEN-XL-2026",
          "itemName": "Premium Gel Pen",
          "batchNumber": "BATCH-45891",
          "color": "Blue",
          "printDate": "2026-06-19T08:15:51.691Z",
          "warrantyPeriod": 12,
          "wStartDate": "2026-06-19T08:15:51.691Z",
          "wEndDate": "2027-06-19T08:15:51.691Z",
          "claimCount": 1,
          "itemStatus": "Active",
          "claimStatus": "available"

        },
        {
          "code": "ITM-1002",
          "itemCode": "KB-MECH-87",
          "itemName": "Mechanical Keyboard",
          "batchNumber": "BATCH-77452",
          "color": "Black",
          "printDate": "2026-06-19T08:15:51.691Z",
          "warrantyPeriod": 24,
          "wStartDate": "2026-06-19T08:15:51.691Z",
          "wEndDate": "2028-06-19T08:15:51.691Z",
          "claimCount": 0,
          "itemStatus": "Active",
          "claimStatus": "available"
        },
        {
          "code": "ITM-1003",
          "itemCode": "MOUSE-GAM-2026",
          "itemName": "Gaming Mouse",
          "batchNumber": "BATCH-99211",
          "color": "Red",
          "printDate": "2026-06-19T08:15:51.691Z",
          "warrantyPeriod": 18,
          "wStartDate": "2026-06-19T08:15:51.691Z",
          "wEndDate": "2027-12-19T08:15:51.691Z",
          "claimCount": 2,
          "itemStatus": "Inactive",
          "claimStatus": "rejected"
        }
      ],
      "page": 1,
      "pageSize": 10,
      "totalCount": 3,
      "totalPages": 1
    }
    // throw error
  }


};


export const fetchWarrantyMasterDataFromApi = async ({ page, pageSize }: any) => {
  const res = await axios.get(
    `https://jsonplaceholder.typicode.com/comments?_page=${page}&_limit=${pageSize}`
  );
  return res.data;
};









// import { useMemo, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import {
//   ChevronDown,
//   ChevronUp,
//   ChevronsUpDown,
// } from "lucide-react";

// export type DataTableColumn<T> = {
//   id: string;
//   header: string;
//   accessor: (row: T) => string | number;
//   cell?: (row: T) => React.ReactNode;
//   sortable?: boolean;
//   className?: string;
// };

// type SortDir = "asc" | "desc";

// type DataTableProps<T> = {
//   columns: DataTableColumn<T>[];
//   data?:any,
//   queryKey: any[];
//   queryFn: () => Promise<T[]>;
//   searchPlaceholder?: string;
//   pageSize?: number;
//   emptyMessage?: string;
//   dummyData?: T[];
  
// };

// export function DataTable<T extends { id: string }>({
//   columns,
//   queryKey,
//   queryFn,
//   data:datas,
//   searchPlaceholder = "Search…",
//   pageSize = 10,
//   emptyMessage = "No records found.",
//   dummyData = [],
// }: DataTableProps<T>) {
//   const [search, setSearch] = useState("");
//   const [sortCol, setSortCol] = useState<string | null>(null);
//   const [sortDir, setSortDir] = useState<SortDir>("asc");
//   const [page, setPage] = useState(1);

//   // =========================
//   // QUERY
//   // =========================
//   const {
//     data = [],
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey,
//     queryFn,
//   });

//   const sourceData: T[] = isLoading ? dummyData : data;

//   // =========================
//   // FILTER + SORT
//   // =========================
//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     let rows = [...sourceData];

//     if (q) {
//       rows = rows.filter((row) =>
//         columns.some((col) =>
//           String(col.accessor(row)).toLowerCase().includes(q)
//         )
//       );
//     }

//     if (sortCol) {
//       const col = columns.find((c) => c.id === sortCol);
//       if (col) {
//         rows.sort((a, b) => {
//           const av = col.accessor(a);
//           const bv = col.accessor(b);

//           const cmp = String(av).localeCompare(String(bv), undefined, {
//             numeric: true,
//           });

//           return sortDir === "asc" ? cmp : -cmp;
//         });
//       }
//     }

//     return rows;
//   }, [sourceData, search, sortCol, sortDir, columns]);

//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
//   const currentPage = Math.min(page, totalPages);

//   const pageRows = filtered.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   function toggleSort(colId: string) {
//     if (sortCol === colId) {
//       setSortDir((d) => (d === "asc" ? "desc" : "asc"));
//     } else {
//       setSortCol(colId);
//       setSortDir("asc");
//     }
//   }

//   // =========================
//   // Skeleton rows
//   // =========================
//   const renderSkeleton = () =>
//     Array.from({ length: pageSize }).map((_, i) => (
//       <tr key={i} className="animate-pulse">
//         {columns.map((col) => (
//           <td key={col.id} className="px-4 py-3">
//             <div className="h-3 w-full rounded bg-slate-200" />
//           </td>
//         ))}
//       </tr>
//     ));

//   // =========================
//   // ERROR ROW (inside table)
//   // =========================
//   const renderErrorRow = () => (
//     <tr>
//       <td colSpan={columns.length} className="px-4 py-10">
//         <div className="flex flex-col items-center justify-center text-center text-sm text-red-600">
//           <div className="rounded bg-red-50 px-4 py-3 border border-red-200">
//             Failed to load data: {(error as Error)?.message}
//           </div>
//         </div>
//       </td>
//     </tr>
//   );

//   return (
//     <div className="space-y-3">
//       {/* SEARCH (ALWAYS VISIBLE) */}
//       <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//         <input
//           type="search"
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setPage(1);
//           }}
//           placeholder={searchPlaceholder}
//           className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm sm:max-w-xs"
//         />

//         <p className="text-xs text-slate-500">
//           {filtered.length} record(s) · page {currentPage} of {totalPages}
//         </p>
//       </div>

//       {/* TABLE */}
//       <div className="overflow-x-auto rounded-lg border border-slate-200">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="border-b bg-slate-50 text-left text-xs uppercase text-slate-500">
//               {columns.map((col) => (
//                 <th key={col.id} className={`px-4 py-3 ${col.className ?? ""}`}>
//                   {col.sortable !== false ? (
//                     <button
//                       onClick={() => toggleSort(col.id)}
//                       className="inline-flex items-center gap-1 hover:text-slate-800"
//                     >
//                       {col.header}
//                       {sortCol === col.id ? (
//                         sortDir === "asc" ? (
//                           <ChevronUp className="h-3.5 w-3.5" />
//                         ) : (
//                           <ChevronDown className="h-3.5 w-3.5" />
//                         )
//                       ) : (
//                         <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
//                       )}
//                     </button>
//                   ) : (
//                     col.header
//                   )}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody className="divide-y bg-white">
//             {/* ERROR STATE INSIDE TABLE */}
//             {isError ? (
//               renderErrorRow()
//             ) : isLoading ? (
//               renderSkeleton()
//             ) : pageRows.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={columns.length}
//                   className="px-4 py-10 text-center text-slate-400"
//                 >
//                   {emptyMessage}
//                 </td>
//               </tr>
//             ) : (
//               pageRows.map((row) => (
//                 <tr key={row.id} className="hover:bg-slate-50/50">
//                   {columns.map((col) => (
//                     <td key={col.id} className={`px-4 py-3 ${col.className ?? ""}`}>
//                       {col.cell ? col.cell(row) : col.accessor(row)}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* PAGINATION */}
//       {!isLoading && !isError && totalPages > 1 && (
//         <div className="flex items-center justify-end gap-2">
//           <button
//             disabled={currentPage <= 1}
//             onClick={() => setPage((p) => p - 1)}
//             className="rounded border px-3 py-1 text-xs disabled:opacity-40"
//           >
//             Previous
//           </button>

//           <button
//             disabled={currentPage >= totalPages}
//             onClick={() => setPage((p) => p + 1)}
//             className="rounded border px-3 py-1 text-xs disabled:opacity-40"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }



// warranty serial master final with dummy and error handling