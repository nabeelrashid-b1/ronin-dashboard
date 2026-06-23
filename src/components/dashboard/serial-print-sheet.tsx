"use client";

import { useMemo } from "react";
import type { WarrantySerial } from "@/lib/types";
import {
  WARRANTY_LABEL_MM,
  WARRANTY_LABELS_PER_PAGE,
  WARRANTY_LABELS_PER_ROW,
} from "@/lib/warranty-qr-label";
import { WarrantyQrLabel } from "./warranty-qr-label";

function chunkRecords<T>(records: T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < records.length; i += size) {
    pages.push(records.slice(i, i + size));
  }
  return pages;
}

export function SerialPrintSheet({
  records,
  batchLabel,
  showToolbar = true,
}: {
  records: WarrantySerial[];
  batchLabel: string;
  /** When false, parent supplies print controls (bulk print page). */
  showToolbar?: boolean;
}) {
  const pages = useMemo(
    () => chunkRecords(records, WARRANTY_LABELS_PER_PAGE),
    [records],
  );

  if (records.length === 0) return null;

  return (
    <div
      id="warranty-label-print-area"
      className={`print-sheet rounded-lg border border-slate-200 bg-white p-4 ${showToolbar ? "mt-6" : ""}`}
    >
      {showToolbar && (
        <div className="mb-4 flex items-center justify-between print:hidden">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Print-ready warranty stickers</h3>
            <p className="text-xs text-slate-500">
              {batchLabel} — {records.length} label(s) at {WARRANTY_LABEL_MM.width}×
              {WARRANTY_LABEL_MM.height} mm, {WARRANTY_LABELS_PER_ROW} per row, up to{" "}
              {WARRANTY_LABELS_PER_PAGE} per A4 page. Use browser Print (Ctrl+P).
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
          >
            Print labels
          </button>
        </div>
      )}

      {pages.map((pageRecords, pageIndex) => (
        <div key={pageIndex} className="warranty-print-page">
          <p className="mb-2 text-xs font-medium text-slate-500 print:hidden">
            Page {pageIndex + 1} of {pages.length}
          </p>
          <div className="warranty-label-sheet-preview">
            {pageRecords.map((r) => (
              <WarrantyQrLabel key={r.id} serial={r} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
