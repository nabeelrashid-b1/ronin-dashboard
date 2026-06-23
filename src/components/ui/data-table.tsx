

// ORGINAL CODE START




"use client";

// import { useMemo, useState } from "react";
// import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";



// export type DataTableColumn<T> = {
//   id: string;
//   header: string;
//   accessor: (row: T) => string | number;
//   cell?: (row: T) => React.ReactNode;
//   sortable?: boolean;
//   className?: string;
//   apiResponse?:any
// };

// type SortDir = "asc" | "desc";

// export function DataTable<T extends { id: string }>({
//   columns,
//   data,
//   searchPlaceholder = "Search…",
//   pageSize = 10,
//   apiResponse,
//   emptyMessage = "No records found.",
//   dummyData = [],
// //
// }: {
//   columns: DataTableColumn<T>[];
//   data: T[];
//   searchPlaceholder?: string;
//   pageSize?: number;
//   emptyMessage?: string;
// }) {
//   const [search, setSearch] = useState("");
//   const [sortCol, setSortCol] = useState<string | null>(null);
//   const [sortDir, setSortDir] = useState<SortDir>("asc");
//   const [page, setPage] = useState(1);

//   // console.log('kokook',data)
  
//   console.log('kokook',apiResponse?.newValue?.value?.status?.serials)

  
//   const sourceData: T[] = apiResponse?.newValue?.value?.status?.serials?.loading ? dummyData : data;

//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     // let rows = [...data]; OLD
//     let rows=[...sourceData]   

//     if (q) {
//       rows = rows.filter((row) =>
//         columns.some((col) =>
//           String(col.accessor(row)).toLowerCase().includes(q),
//         ),
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

//   // console.log('kokoko',)


//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
//   const currentPage = Math.min(page, totalPages);
//   const pageRows = filtered.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize,
//   );

//   function toggleSort(colId: string) {
//     if (sortCol === colId) {
//       setSortDir((d) => (d === "asc" ? "desc" : "asc"));
//     } else {
//       setSortCol(colId);
//       setSortDir("asc");
//     }
//   }
// console.log('daat',data)






// //   // =========================
// //   // Skeleton rows
// //   // =========================
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

// //   // =========================
// //   // ERROR ROW (inside table)
// //   // =========================
//   const renderErrorRow = () => (
//     <tr>
//       <td colSpan={columns.length} className="px-4 py-10">
//         <div className="flex flex-col items-center justify-center text-center text-sm text-red-600">
//           <div className="rounded bg-red-50 px-4 py-3 border border-red-200">
//             {/* Failed to load data: {(error as Error)?.message} */}
//                Failed to load data: {(apiResponse?.newValue?.value?.status?.serials?.error as Error)?.message}
//     {/* {apiResponse?.newValue?.value?.status?.serials?.error ? 'Failed to load data' : "" } */}
   
//           </div>
//         </div>
//       </td>
//     </tr>
//   );
//   return (
//     <div className="space-y-3">
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

//       <div className="overflow-x-auto rounded-lg border border-slate-200">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="border-b border-slate-100 bg-slate-50/80 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
//               {columns.map((col) => (
//                 <th key={col.id} className={`px-4 py-3 ${col.className ?? ""}`}>
//                   {col.sortable !== false ? (
//                     <button
//                       type="button"
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
//           <tbody className="divide-y divide-slate-100 bg-white">
//             {apiResponse?.newValue?.value?.status?.serials?.error ? (
//               renderErrorRow()
//             ) : apiResponse?.newValue?.value?.status?.serials?.loading ? (
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

//       {totalPages > 1 && (
//         <div className="flex items-center justify-end gap-2">
//           <button
//             type="button"
//             disabled={currentPage <= 1}
//             onClick={() => setPage((p) => p - 1)}
//             className="rounded border border-slate-200 px-3 py-1 text-xs disabled:opacity-40"
//           >
//             Previous
//           </button>
//           <button
//             type="button"
//             disabled={currentPage >= totalPages}
//             onClick={() => setPage((p) => p + 1)}
//             className="rounded border border-slate-200 px-3 py-1 text-xs disabled:opacity-40"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }


// END ORIGINAL CODE








// chatgpt response

// "use client";

// import { useMemo, useState } from "react";
// import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
// import { getWarrantyMasterDataFromApi } from "@/lib/storage";


// export type DataTableColumn<T> = {
//   id: string;
//   header: string;
//   accessor: (row: T) => string | number;
//   cell?: (row: T) => React.ReactNode;
//   sortable?: boolean;
//   className?: string;
// };

// type SortDir = "asc" | "desc";

// export function DataTable<T extends { id: string }>({
//   columns,
//   data,
//   searchPlaceholder = "Search…",
//   pageSize = 10,
//   emptyMessage = "No records found.",
// }: {
//   columns: DataTableColumn<T>[];
//   data: T[];
//   searchPlaceholder?: string;
//   pageSize?: number;
//   emptyMessage?: string;
// }) {
//   const [search, setSearch] = useState("");
//   const [sortCol, setSortCol] = useState<string | null>(null);
//   const [sortDir, setSortDir] = useState<SortDir>("asc");
//   const [page, setPage] = useState(1);

//   console.log('kokook',data)
//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     let rows = [...data];
//     if (q) {
//       rows = rows.filter((row) =>
//         columns.some((col) =>
//           String(col.accessor(row)).toLowerCase().includes(q),
//         ),
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
//   }, [data, search, sortCol, sortDir, columns]);

  
//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
//   const currentPage = Math.min(page, totalPages);
//   const pageRows = filtered.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize,
//   );

//   function toggleSort(colId: string) {
//     if (sortCol === colId) {
//       setSortDir((d) => (d === "asc" ? "desc" : "asc"));
//     } else {
//       setSortCol(colId);
//       setSortDir("asc");
//     }
//   }

//   // const {
//   //   data : serialListing,
//   //   isLoading,
//   //   isError,
//   //   error,
//   //   isFetching,
//   // } = useQuery({
//   //   queryKey: ["warranty-master-table", page, pageSize, search],
//   //   queryFn: () =>
//   //     getWarrantyMasterDataFromApi({
//   //       page,
//   //       pageSize,
//   //       search,
//   //     }),
//   //   keepPreviousData: true, // smooth UX
//   // });
  


//   return (
//     <div className="space-y-3">
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

//       <div className="overflow-x-auto rounded-lg border border-slate-200">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="border-b border-slate-100 bg-slate-50/80 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
//               {columns.map((col) => (
//                 <th key={col.id} className={`px-4 py-3 ${col.className ?? ""}`}>
//                   {col.sortable !== false ? (
//                     <button
//                       type="button"
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
//           <tbody className="divide-y divide-slate-100 bg-white">
//             {pageRows.length === 0 ? (
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

//       {totalPages > 1 && (
//         <div className="flex items-center justify-end gap-2">
//           <button
//             type="button"
//             disabled={currentPage <= 1}
//             onClick={() => setPage((p) => p - 1)}
//             className="rounded border border-slate-200 px-3 py-1 text-xs disabled:opacity-40"
//           >
//             Previous
//           </button>
//           <button
//             type="button"
//             disabled={currentPage >= totalPages}
//             onClick={() => setPage((p) => p + 1)}
//             className="rounded border border-slate-200 px-3 py-1 text-xs disabled:opacity-40"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }



// "use client";

// import { useMemo, useState } from "react";
// import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";
// import { getWarrantyMasterDataFromApi } from "@/lib/storage";

// export type DataTableColumn<T> = {
//   id: string;
//   header: string;
//   accessor: (row: T) => string | number;
//   cell?: (row: T) => React.ReactNode;
//   sortable?: boolean;
//   className?: string;
// };

// type SortDir = "asc" | "desc";

// type ApiResponse<T> = {
//   data: T[];
//   total: number;
// };

// export function DataTable<T extends { id: string }>({
//   columns,
//   searchPlaceholder = "Search…",
//   pageSize = 10,
//   emptyMessage = "No records found.",
// }: {
//   columns: DataTableColumn<T>[];
//   searchPlaceholder?: string;
//   pageSize?: number;
//   emptyMessage?: string;
// }) {
//   const [search, setSearch] = useState("");
//   const [sortCol, setSortCol] = useState<string | null>(null);
//   const [sortDir, setSortDir] = useState<SortDir>("asc");
//   const [page, setPage] = useState(1);

//   // ✅ API CALL
//   const {
//     data: apiData,
//     isLoading,
//     isError,
//     error,
//     isFetching,
//   } = useQuery<ApiResponse<T>>({
//     queryKey: ["warranty-master-table", page, pageSize, search],
//     queryFn: () =>
//       getWarrantyMasterDataFromApi({
//         page,
//         pageSize,
//         search,
//       }),
//     keepPreviousData: true,
//   });

//   // ✅ FIXED: use apiData (not data)
//   const rows = apiData?.data ?? [];
//   const total = apiData?.total ?? 0;
//   const totalPages = Math.max(1, Math.ceil(total / pageSize));

//   // client-side sorting only
//   const filtered = useMemo(() => {
//     let result = [...rows];

//     if (sortCol) {
//       const col = columns.find((c) => c.id === sortCol);

//       if (col) {
//         result.sort((a, b) => {
//           const av = col.accessor(a);
//           const bv = col.accessor(b);

//           const cmp = String(av).localeCompare(String(bv), undefined, {
//             numeric: true,
//           });

//           return sortDir === "asc" ? cmp : -cmp;
//         });
//       }
//     }

//     return result;
//   }, [rows, sortCol, sortDir, columns]);

//   function toggleSort(colId: string) {
//     if (sortCol === colId) {
//       setSortDir((d) => (d === "asc" ? "desc" : "asc"));
//     } else {
//       setSortCol(colId);
//       setSortDir("asc");
//     }
//   }

//   // ================= LOADING =================
//   if (isLoading) {
//     return (
//       <div className="space-y-3">
//         <div className="h-10 w-64 animate-pulse rounded bg-slate-200" />

//         <div className="rounded border">
//           <table className="w-full text-sm">
//             <tbody>
//               {Array.from({ length: pageSize }).map((_, i) => (
//                 <tr key={i}>
//                   {columns.map((col) => (
//                     <td key={col.id} className="px-4 py-3">
//                       <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   }

//   // ================= ERROR =================
//   if (isError) {
//     return (
//       <div className="rounded border border-red-200 bg-red-50 p-4 text-red-600">
//         Error loading data: {(error as Error)?.message}
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-3">
//       {/* SEARCH */}
//       <div className="flex items-center justify-between">
//         <input
//           type="search"
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setPage(1);
//           }}
//           placeholder={searchPlaceholder}
//           className="w-full max-w-xs rounded border px-3 py-2 text-sm"
//         />

//         <p className="text-xs text-slate-500">
//           Page {page} of {totalPages}
//           {isFetching && <span className="ml-2">Loading...</span>}
//         </p>
//       </div>

//       {/* TABLE */}
//       <div className="overflow-x-auto rounded border">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="bg-slate-50 text-left text-xs uppercase text-slate-500">
//               {columns.map((col) => (
//                 <th key={col.id} className="px-4 py-3">
//                   {col.sortable !== false ? (
//                     <button
//                       onClick={() => toggleSort(col.id)}
//                       className="flex items-center gap-1"
//                     >
//                       {col.header}

//                       {sortCol === col.id ? (
//                         sortDir === "asc" ? (
//                           <ChevronUp className="h-3 w-3" />
//                         ) : (
//                           <ChevronDown className="h-3 w-3" />
//                         )
//                       ) : (
//                         <ChevronsUpDown className="h-3 w-3 opacity-40" />
//                       )}
//                     </button>
//                   ) : (
//                     col.header
//                   )}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {rows.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={columns.length}
//                   className="py-10 text-center text-slate-400"
//                 >
//                   {emptyMessage}
//                 </td>
//               </tr>
//             ) : (
//               filtered.map((row) => (
//                 <tr key={row.id} className="hover:bg-slate-50">
//                   {columns.map((col) => (
//                     <td key={col.id} className="px-4 py-3">
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
//       {totalPages > 1 && (
//         <div className="flex justify-end gap-2">
//           <button
//             disabled={page <= 1}
//             onClick={() => setPage((p) => p - 1)}
//             className="rounded border px-3 py-1 text-xs disabled:opacity-40"
//           >
//             Previous
//           </button>

//           <button
//             disabled={page >= totalPages}
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









////////  CODE START ERROR PAY TABLE GAYAB HORAHA  ////////////



// "use client";

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
//   queryKey: any[];
//   queryFn: () => Promise<T[]>;
//   searchPlaceholder?: string;
//   pageSize?: number;
//   emptyMessage?: string;
//   dummyData?: T[]; // 👈 fallback loading data
// };

// export function DataTable<T extends { id: string }>({
//   columns,
//   queryKey,
//   queryFn,
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
//   // React Query API CALL
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
//   // ERROR STATE
//   // =========================
//   if (isError) {
//     return (
//       <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-600">
//         Failed to load data: {(error as Error)?.message}
//       </div>
//     );
//   }

//   // =========================
//   // LOADING STATE (DUMMY UI)
//   // =========================
//   const renderSkeleton = () => {
//     return Array.from({ length: pageSize }).map((_, i) => (
//       <tr key={i} className="animate-pulse">
//         {columns.map((col) => (
//           <td key={col.id} className="px-4 py-3">
//             <div className="h-3 w-full rounded bg-slate-200" />
//           </td>
//         ))}
//       </tr>
//     ));
//   };

//   return (
//     <div className="space-y-3">
//       {/* Search */}
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

//       {/* Table */}
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
//             {isLoading ? (
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

//       {/* Pagination */}
//       {!isLoading && totalPages > 1 && (
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



////////  CODE END ERROR PAY TABLE GAYAB HORAHA  ////////////



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














////////// BELOW IS FINAL CODE WITH DUMMMY DATA AND ERROR HANGLING ////////////




"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
} from "lucide-react";

export type DataTableColumn<T> = {
  id: string;
  header: string;
  accessor: (row: T) => string | number;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
};

type SortDir = "asc" | "desc";

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  searchPlaceholder?: string;
  pageSize?: number;
  emptyMessage?: string;
  apiResponse?: any; // keeping flexible since backend shape is nested
  skeletonRows?: T[];
};

export function DataTable<T extends { id: string }>({
  columns,
  data,
  searchPlaceholder = "Search…",
  pageSize = 10,
  emptyMessage = "No records found.",
  apiResponse,
  skeletonRows = [],
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  // =========================
  // SAFE API EXTRACTION (IMPORTANT FIX)
  // =========================
  const serialsState =
    apiResponse?.newValue?.value?.status?.serials ?? {};

  const isLoading = Boolean(serialsState?.loading);
  const error = serialsState?.error;

  console.log('isssss' , isLoading)
   console.log('isssss' , error)
  // choose data source safely
  const sourceData: T[] = isLoading ? skeletonRows : data;

  // =========================
  // FILTER + SORT
  // =========================
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = [...sourceData];

    if (q) {
      rows = rows.filter((row) =>
        columns.some((col) =>
          String(col.accessor(row)).toLowerCase().includes(q)
        )
      );
    }

    if (sortCol) {
      const col = columns.find((c) => c.id === sortCol);

      if (col) {
        rows.sort((a, b) => {
          const av = col.accessor(a);
          const bv = col.accessor(b);

          const cmp = String(av).localeCompare(String(bv), undefined, {
            numeric: true,
          });

          return sortDir === "asc" ? cmp : -cmp;
        });
      }
    }

    return rows;
  }, [sourceData, search, sortCol, sortDir, columns]);

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pageRows = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function toggleSort(colId: string) {
    if (sortCol === colId) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(colId);
      setSortDir("asc");
    }
  }

  // =========================
  // SKELETON
  // =========================
  const renderSkeleton = () =>
    Array.from({ length: pageSize }).map((_, i) => (
      <tr key={i} className="animate-pulse">
        {columns.map((col) => (
          <td key={col.id} className="px-4 py-3">
            <div className="h-3 w-full rounded bg-slate-200" />
          </td>
        ))}
      </tr>
    ));

  // =========================
  // ERROR
  // =========================
  const renderErrorRow = () => (
    <tr>
      <td colSpan={columns.length} className="px-4 py-10">
        <div className="flex justify-center">
          <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error?.message ?? "Failed to load data"}
          </div>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-3">
      {/* SEARCH */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder={searchPlaceholder}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm sm:max-w-xs"
        />

        <p className="text-xs text-slate-500">
          {filtered.length} record(s) · page {currentPage} of {totalPages}
        </p>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
              {columns.map((col) => (
                <th key={col.id} className={`px-4 py-3 ${col.className ?? ""}`}>
                  {col.sortable !== false ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.id)}
                      className="inline-flex items-center gap-1"
                    >
                      {col.header}

                      {sortCol === col.id ? (
                        sortDir === "asc" ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y bg-white">
            {error ? (
              renderErrorRow()
            ) : isLoading ? (
              renderSkeleton()
            ) : pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pageRows.map((row,index) => (
                  //  <tr key={row.id}  className="hover:bg-slate-50">
                <tr key={index}  className="hover:bg-slate-50">

                  {columns.map((col) => (
                    <td
                      key={col.id}
                      className={`px-4 py-3 ${col.className ?? ""}`}
                    >
                      {col.cell ? col.cell(row) : col.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2">
          <button
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded border px-3 py-1 text-xs disabled:opacity-40"
          >
            Previous
          </button>

          <button
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded border px-3 py-1 text-xs disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}