// "use client";

// import { useMemo, useState } from "react";
// import { Search } from "lucide-react";
// import { useAppDataContext } from "@/components/providers/app-data-provider";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { StatusBadge } from "@/components/ui/status-badge";
// import { Badge } from "@/components/ui/badge";
// import { FIELDS } from "@/config/fields";
// import { formatInternalClaimLabel } from "@/lib/claim-utils";
// import { getSerialClaimContext } from "@/lib/serial-claim-lookup";
// import {
//   canReceiveNewWarrantyClaim,
//   getNewClaimIneligibilityReason,
// } from "@/lib/warranty-rules";
// import { getSerialStatusLabel } from "@/lib/warranty-status";

// type Props = {
//   /** Shorter card for embedding in forms */
//   compact?: boolean;
//   title?: string;
// };

// export function ItemSerialStatusLookup({
//   compact = false,
//   title = "Item serial status lookup",
// }: Props) {
//   const { data } = useAppDataContext();
//   const [query, setQuery] = useState("");
//   const [submitted, setSubmitted] = useState("");

//   const ctx = useMemo(() => {
//     if (!data || !submitted.trim()) return null;
//     return getSerialClaimContext(data, submitted);
//   }, [data, submitted]);

//   const openClaims = useMemo(() => {
//     if (!data || !ctx) return [];
//     return data.claims.filter(
//       (c) =>
//         c.serialNumber === ctx.serial.serialNumber ||
//         c.oldSerialNumber === ctx.serial.serialNumber ||
//         c.newSerialNumber === ctx.serial.serialNumber,
//     );
//   }, [data, ctx]);

//   function handleSearch(e: React.FormEvent) {
//     e.preventDefault();
//     setSubmitted(query.trim());
//   }

//   const inputClass =
//     "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20";

//   const body = (
//     <>
//       <form onSubmit={handleSearch} className="flex gap-2">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Scan or enter item serial / QR"
//             className={`${inputClass} pl-10 font-mono`}
//             autoComplete="off"
//           />
//         </div>
//         <button
//           type="submit"
//           className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
//         >
//           Search
//         </button>
//       </form>

//       {submitted && !ctx && (
//         <p className="mt-3 text-sm text-red-600">Serial not found in warranty master.</p>
//       )}

//       {ctx && (
//         <div className={`mt-3 space-y-3 ${compact ? "text-sm" : ""}`}>
//           <div className="flex flex-wrap items-center gap-2">
//             <span className="font-mono text-xs font-semibold">{ctx.serial.serialNumber}</span>
//             <StatusBadge status={ctx.serial.status} />
//             <span className="text-xs text-slate-500">
//               {getSerialStatusLabel(ctx.serial.status)}
//             </span>
//           </div>
//           {ctx.serial.status === "dispatched" && canReceiveNewWarrantyClaim(ctx.serial) ? (
//             <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1.5 text-xs text-emerald-800">
//               Eligible for new warranty claim intake (dispatched, in warranty).
//             </p>
//           ) : (
//             <p className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs text-amber-900">
//               {getNewClaimIneligibilityReason(ctx.serial) ??
//                 (ctx.serial.status !== "dispatched"
//                   ? `Not claim-ready — status is ${getSerialStatusLabel(ctx.serial.status)} (only dispatched units).`
//                   : "Not eligible for new warranty claim intake.")}
//             </p>
//           )}
//           {(ctx.serial.replacedFromSerial || ctx.serial.replacedBySerial) && (
//             <p className="text-xs text-sky-800">
//               {ctx.serial.replacedFromSerial &&
//                 `Replaces ${ctx.serial.replacedFromSerial} (prior claim may exist on old unit). `}
//               {ctx.serial.replacedBySerial && `Replaced by ${ctx.serial.replacedBySerial}.`}
//             </p>
//           )}
//           <dl className={`grid gap-2 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-3"} text-xs`}>
//             <div>
//               <dt className="text-slate-500">Item</dt>
//               <dd>
//                 {ctx.serial.itemCode} — {ctx.serial.itemName}
//               </dd>
//             </div>
//             <div>
//               <dt className="text-slate-500">Batch / color</dt>
//               <dd>
//                 {ctx.serial.batchNumber} · {ctx.serial.color}
//               </dd>
//             </div>
//             {ctx.serial.salesOrderNumber && (
//               <div>
//                 <dt className="text-slate-500">{FIELDS.salesOrderNumber.label}</dt>
//                 <dd className="font-mono">{ctx.serial.salesOrderNumber}</dd>
//               </div>
//             )}
//             {ctx.dispatchLine && (
//               <div>
//                 <dt className="text-slate-500">Last dispatch</dt>
//                 <dd>
//                   {ctx.dispatchLine.dispatchDate} ({ctx.dispatchLine.dispatchChannel})
//                 </dd>
//               </div>
//             )}
//             {ctx.serial.warrantyStartDate && (
//               <div className="sm:col-span-2">
//                 <dt className="text-slate-500">Warranty</dt>
//                 <dd>
//                   {ctx.serial.warrantyStartDate} → {ctx.serial.warrantyEndDate}
//                 </dd>
//               </div>
//             )}
//             {ctx.serial.replacedBySerial && (
//               <div>
//                 <dt className="text-slate-500">Replaced by</dt>
//                 <dd className="font-mono">{ctx.serial.replacedBySerial}</dd>
//               </div>
//             )}
//             {ctx.serial.replacedFromSerial && (
//               <div>
//                 <dt className="text-slate-500">Replaces</dt>
//                 <dd className="font-mono">{ctx.serial.replacedFromSerial}</dd>
//               </div>
//             )}
//             {ctx.serial.activeClaimId && (
//               <div>
//                 <dt className="text-slate-500">Active claim</dt>
//                 <dd className="font-mono">{ctx.serial.activeClaimId}</dd>
//               </div>
//             )}
//           </dl>
//           {openClaims.length > 0 && (
//             <div>
//               <p className="mb-1 text-xs font-medium text-slate-600">Related Warranty_claim rows</p>
//               <ul className="space-y-1">
//                 {openClaims.slice(0, 5).map((c) => (
//                   <li
//                     key={c.id}
//                     className="flex flex-wrap items-center gap-2 rounded border border-slate-100 bg-slate-50 px-2 py-1 text-xs"
//                   >
//                     <span className="font-mono font-semibold">{c.claimId}</span>
//                     <Badge variant="info">{formatInternalClaimLabel(c)}</Badge>
//                     <span className="text-slate-500">{c.claimStatus}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//           {(ctx.serial.claimHistory?.length ?? 0) > 0 && (
//             <div>
//               <p className="mb-1 text-xs font-medium text-slate-600">Recent journey</p>
//               <ul className="max-h-24 overflow-y-auto text-[10px] text-slate-500 space-y-0.5">
//                 {ctx.serial.claimHistory.slice(0, 4).map((h) => (
//                   <li key={h.id}>
//                     {h.performedAt.slice(0, 16)} — {h.action}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       )}
//     </>
//   );

//   if (compact) {
//     return (
//       <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
//         <p className="mb-2 text-xs font-semibold text-slate-700">{title}</p>
//         {body}
//       </div>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader className="pb-3">
//         <CardTitle className="text-base">{title}</CardTitle>
//         <p className="text-xs text-slate-500">
//           Check current serial status on any document — master, dispatch, and open claims.
//         </p>
//       </CardHeader>
//       <CardContent>{body}</CardContent>
//     </Card>
//   );
// }





// "use client";

// import { useMemo, useState } from "react";
// import { Search } from "lucide-react";
// import { useAppDataContext } from "@/components/providers/app-data-provider";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { StatusBadge } from "@/components/ui/status-badge";
// import { Badge } from "@/components/ui/badge";
// import { FIELDS } from "@/config/fields";
// import { formatInternalClaimLabel } from "@/lib/claim-utils";
// import { getSerialClaimContext } from "@/lib/serial-claim-lookup";
// import {
//   canReceiveNewWarrantyClaim,
//   getNewClaimIneligibilityReason,
// } from "@/lib/warranty-rules";
// import { getSerialStatusLabel } from "@/lib/warranty-status";

// type Props = {
//   /** Shorter card for embedding in forms */
//   compact?: boolean;
//   title?: string;
// };

// export function ItemSerialStatusLookup({
//   compact = false,
//   title = "Item serial status lookup",
// }: Props) {
//   const { data } = useAppDataContext();
//   const [query, setQuery] = useState("");
//   const [submitted, setSubmitted] = useState("");

//   const ctx = useMemo(() => {
//     if (!data || !submitted.trim()) return null;
//     return getSerialClaimContext(data, submitted);
//   }, [data, submitted]);

//   const openClaims = useMemo(() => {
//     if (!data || !ctx) return [];
//     return data.claims.filter(
//       (c) =>
//         c.serialNumber === ctx.serial.serialNumber ||
//         c.oldSerialNumber === ctx.serial.serialNumber ||
//         c.newSerialNumber === ctx.serial.serialNumber,
//     );
//   }, [data, ctx]);

//   function handleSearch(e: React.FormEvent) {
//     e.preventDefault();
//     setSubmitted(query.trim());
//   }

//   const inputClass =
//     "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20";

//   const body = (
//     <>
//       <form onSubmit={handleSearch} className="flex gap-2">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Scan or enter item serial / QR"
//             className={`${inputClass} pl-10 font-mono`}
//             autoComplete="off"
//           />
//         </div>
//         <button
//           type="submit"
//           className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
//         >
//           Search
//         </button>
//       </form>

//       {submitted && !ctx && (
//         <p className="mt-3 text-sm text-red-600">Serial not found in warranty master.</p>
//       )}

//       {ctx && (
//         <div className={`mt-3 space-y-3 ${compact ? "text-sm" : ""}`}>
//           <div className="flex flex-wrap items-center gap-2">
//             <span className="font-mono text-xs font-semibold">{ctx.serial.serialNumber}</span>
//             <StatusBadge status={ctx.serial.status} />
//             <span className="text-xs text-slate-500">
//               {getSerialStatusLabel(ctx.serial.status)}
//             </span>
//           </div>
//           {ctx.serial.status === "dispatched" && canReceiveNewWarrantyClaim(ctx.serial) ? (
//             <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1.5 text-xs text-emerald-800">
//               Eligible for new warranty claim intake (dispatched, in warranty).
//             </p>
//           ) : (
//             <p className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs text-amber-900">
//               {getNewClaimIneligibilityReason(ctx.serial) ??
//                 (ctx.serial.status !== "dispatched"
//                   ? `Not claim-ready — status is ${getSerialStatusLabel(ctx.serial.status)} (only dispatched units).`
//                   : "Not eligible for new warranty claim intake.")}
//             </p>
//           )}
//           {(ctx.serial.replacedFromSerial || ctx.serial.replacedBySerial) && (
//             <p className="text-xs text-sky-800">
//               {ctx.serial.replacedFromSerial &&
//                 `Replaces ${ctx.serial.replacedFromSerial} (prior claim may exist on old unit). `}
//               {ctx.serial.replacedBySerial && `Replaced by ${ctx.serial.replacedBySerial}.`}
//             </p>
//           )}
//           <dl className={`grid gap-2 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-3"} text-xs`}>
//             <div>
//               <dt className="text-slate-500">Item</dt>
//               <dd>
//                 {ctx.serial.itemCode} — {ctx.serial.itemName}
//               </dd>
//             </div>
//             <div>
//               <dt className="text-slate-500">Batch / color</dt>
//               <dd>
//                 {ctx.serial.batchNumber} · {ctx.serial.color}
//               </dd>
//             </div>
//             {ctx.serial.salesOrderNumber && (
//               <div>
//                 <dt className="text-slate-500">{FIELDS.salesOrderNumber.label}</dt>
//                 <dd className="font-mono">{ctx.serial.salesOrderNumber}</dd>
//               </div>
//             )}
//             {ctx.dispatchLine && (
//               <div>
//                 <dt className="text-slate-500">Last dispatch</dt>
//                 <dd>
//                   {ctx.dispatchLine.dispatchDate} ({ctx.dispatchLine.dispatchChannel})
//                 </dd>
//               </div>
//             )}
//             {ctx.serial.warrantyStartDate && (
//               <div className="sm:col-span-2">
//                 <dt className="text-slate-500">Warranty</dt>
//                 <dd>
//                   {ctx.serial.warrantyStartDate} → {ctx.serial.warrantyEndDate}
//                 </dd>
//               </div>
//             )}
//             {ctx.serial.replacedBySerial && (
//               <div>
//                 <dt className="text-slate-500">Replaced by</dt>
//                 <dd className="font-mono">{ctx.serial.replacedBySerial}</dd>
//               </div>
//             )}
//             {ctx.serial.replacedFromSerial && (
//               <div>
//                 <dt className="text-slate-500">Replaces</dt>
//                 <dd className="font-mono">{ctx.serial.replacedFromSerial}</dd>
//               </div>
//             )}
//             {ctx.serial.activeClaimId && (
//               <div>
//                 <dt className="text-slate-500">Active claim</dt>
//                 <dd className="font-mono">{ctx.serial.activeClaimId}</dd>
//               </div>
//             )}
//           </dl>
//           {openClaims.length > 0 && (
//             <div>
//               <p className="mb-1 text-xs font-medium text-slate-600">Related Warranty_claim rows</p>
//               <ul className="space-y-1">
//                 {openClaims.slice(0, 5).map((c) => (
//                   <li
//                     key={c.id}
//                     className="flex flex-wrap items-center gap-2 rounded border border-slate-100 bg-slate-50 px-2 py-1 text-xs"
//                   >
//                     <span className="font-mono font-semibold">{c.claimId}</span>
//                     <Badge variant="info">{formatInternalClaimLabel(c)}</Badge>
//                     <span className="text-slate-500">{c.claimStatus}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//           {(ctx.serial.claimHistory?.length ?? 0) > 0 && (
//             <div>
//               <p className="mb-1 text-xs font-medium text-slate-600">Recent journey</p>
//               <ul className="max-h-24 overflow-y-auto text-[10px] text-slate-500 space-y-0.5">
//                 {ctx.serial.claimHistory.slice(0, 4).map((h) => (
//                   <li key={h.id}>
//                     {h.performedAt.slice(0, 16)} — {h.action}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       )}
//     </>
//   );

//   if (compact) {
//     return (
//       <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
//         <p className="mb-2 text-xs font-semibold text-slate-700">{title}</p>
//         {body}
//       </div>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader className="pb-3">
//         <CardTitle className="text-base">{title}</CardTitle>
//         <p className="text-xs text-slate-500">
//           Check current serial status on any document — master, dispatch, and open claims.
//         </p>
//       </CardHeader>
//       <CardContent>{body}</CardContent>
//     </Card>
//   );
// }




//  New code 

"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useAppDataContext } from "@/components/providers/app-data-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { FIELDS } from "@/config/fields";
import { formatInternalClaimLabel } from "@/lib/claim-utils";
import { getSerialClaimContext } from "@/lib/serial-claim-lookup";
import {
  canReceiveNewWarrantyClaim,
  getNewClaimIneligibilityReason,
} from "@/lib/warranty-rules";
import { getSerialStatusLabel } from "@/lib/warranty-status";

type Props = {
  compact?: boolean;
  title?: string;
};

export function ItemSerialStatusLookup({
  compact = false,
  title = "Item serial status lookup",
}: Props) {
  const { data } = useAppDataContext();

  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const ctx = useMemo(() => {
    if (!data || !submitted.trim()) return null;
    return getSerialClaimContext(data, submitted);
  }, [data, submitted]);

  const openClaims = useMemo(() => {
    if (!data || !ctx) return [];
    return data.claims.filter(
      (c) =>
        c.serialNumber === ctx.serial.serialNumber ||
        c.oldSerialNumber === ctx.serial.serialNumber ||
        c.newSerialNumber === ctx.serial.serialNumber
    );
  }, [data, ctx]);

  // ✅ AUTO FOCUS (important for scanner)
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function submitScan(value: string) {
    const cleaned = value.trim();
    if (!cleaned) return;

    setSubmitted(cleaned);
    setQuery("");

    // keep focus for next scan
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20";

  const body = (
    <>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          {/* 🔥 SCANNER INPUT */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Scan or enter item serial / QR"
            className={`${inputClass} pl-10 font-mono`}
            autoComplete="off"
            onKeyDown={(e) => {
              // ✅ TAB = scan complete
              if (e.key === "Tab") {
                e.preventDefault();
                submitScan(query);
              }

              // 🔁 OPTIONAL fallback ENTER
              // if (e.key === "Enter") {
              //   e.preventDefault();
              //   submitScan(query);
              // }
            }}
          />
        </div>
      </div>

      {submitted && !ctx && (
        <p className="mt-3 text-sm text-red-600">
          Serial not found in warranty master.
        </p>
      )}

      {ctx && (
        <div className={`mt-3 space-y-3 ${compact ? "text-sm" : ""}`}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold">
              {ctx.serial.serialNumber}
            </span>
            <StatusBadge status={ctx.serial.status} />
            <span className="text-xs text-slate-500">
              {getSerialStatusLabel(ctx.serial.status)}
            </span>
          </div>

          {ctx.serial.status === "dispatched" &&
          canReceiveNewWarrantyClaim(ctx.serial) ? (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1.5 text-xs text-emerald-800">
              Eligible for new warranty claim intake (dispatched, in warranty).
            </p>
          ) : (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs text-amber-900">
              {getNewClaimIneligibilityReason(ctx.serial) ??
                (ctx.serial.status !== "dispatched"
                  ? `Not claim-ready — status is ${getSerialStatusLabel(
                      ctx.serial.status
                    )}`
                  : "Not eligible for new warranty claim intake.")}
            </p>
          )}

          <dl className={`grid gap-2 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-3"} text-xs`}>
            <div>
              <dt className="text-slate-500">Item</dt>
              <dd>
                {ctx.serial.itemCode} — {ctx.serial.itemName}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </>
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <p className="text-xs text-slate-500">
          Scan serial using POS scanner (Tab/Enter supported)
        </p>
      </CardHeader>
      <CardContent>{body}</CardContent>
    </Card>
  );
}