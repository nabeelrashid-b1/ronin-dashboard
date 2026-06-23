"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Printer } from "lucide-react";
import { useAppDataContext } from "@/components/providers/app-data-provider";
import { PageHeader } from "@/components/layout/page-header";
import { SerialPrintSheet } from "@/components/dashboard/serial-print-sheet";
import { generateStickerQrDataUrls } from "@/lib/qr";
import { SERIAL_STATUS } from "@/config/fields";
import {
  WARRANTY_LABEL_MM,
  WARRANTY_LABELS_PER_PAGE,
  WARRANTY_LABELS_PER_ROW,
} from "@/lib/warranty-qr-label";
import type { WarrantySerial } from "@/lib/types";

const QR_CHUNK = 40;

type Filters = {
  itemCode: string;
  batchNumber: string;
  status: string;
};

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

export function WarrantyQrPrintPage() {
  const { data, isReady } = useAppDataContext();
  const [filters, setFilters] = useState<Filters>({
    itemCode: "",
    batchNumber: "",
    status: "",
  });
  const [labels, setLabels] = useState<WarrantySerial[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const allSerials = data?.serials ?? [];

  const itemOptions = useMemo(
    () => uniqueSorted(allSerials.map((s) => s.itemCode)),
    [allSerials],
  );

  const batchOptions = useMemo(() => {
    const scoped = filters.itemCode
      ? allSerials.filter((s) => s.itemCode === filters.itemCode)
      : allSerials;
    return uniqueSorted(scoped.map((s) => s.batchNumber));
  }, [allSerials, filters.itemCode]);

  const filtered = useMemo(() => {
    return allSerials
      .filter((s) => !filters.itemCode || s.itemCode === filters.itemCode)
      .filter((s) => !filters.batchNumber || s.batchNumber === filters.batchNumber)
      .filter((s) => !filters.status || s.status === filters.status)
      .sort((a, b) => a.serialNumber.localeCompare(b.serialNumber));
  }, [allSerials, filters]);

  const filteredSignature = useMemo(
    () => filtered.map((s) => s.id).join("|"),
    [filtered],
  );

  const loadLabels = useCallback(async (serials: WarrantySerial[], signal: { cancelled: boolean }) => {
    if (serials.length === 0) {
      setLabels([]);
      setProgress(null);
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(`0 / ${serials.length}`);

    try {
      const enriched: WarrantySerial[] = [];

      for (let i = 0; i < serials.length; i += QR_CHUNK) {
        if (signal.cancelled) return;

        const chunk = serials.slice(i, i + QR_CHUNK);
        const urls = await generateStickerQrDataUrls(chunk.map((s) => s.serialNumber));
        enriched.push(
          ...chunk.map((s, j) => ({
            ...s,
            qrCodeDataUrl: urls[j] ?? s.qrCodeDataUrl,
          })),
        );
        setProgress(`${Math.min(i + QR_CHUNK, serials.length)} / ${serials.length}`);
        setLabels([...enriched]);
      }

      if (!signal.cancelled) {
        setLabels(enriched);
        setProgress(null);
      }
    } catch {
      if (!signal.cancelled) {
        setError("Could not generate QR images. Try again.");
        setLabels([]);
      }
    } finally {
      if (!signal.cancelled) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const signal = { cancelled: false };
    void loadLabels(filtered, signal);

    return () => {
      signal.cancelled = true;
    };
  }, [isReady, filteredSignature, loadLabels, filtered]);

  const batchLabel = useMemo(() => {
    const parts: string[] = [];
    if (filters.itemCode) parts.push(filters.itemCode);
    if (filters.batchNumber) parts.push(filters.batchNumber);
    if (filters.status) parts.push(filters.status);
    return parts.length > 0 ? parts.join(" · ") : "All serials";
  }, [filters]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-slate-500">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading…
      </div>
    );
  }

  return (
    <div className="warranty-print-labels-page">
      <div className="print:hidden">
      <PageHeader
        phase="Phase I"
        title="Print QR labels"
        description={`Prepare and print Ronin warranty stickers at ${WARRANTY_LABEL_MM.width}×${WARRANTY_LABEL_MM.height} mm (PDF sample size). Labels use the warranty check URL in the QR code.`}
        actions={
          <Link
            href="/dashboard/serial-master"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 print:hidden"
          >
            ← Serial Master
          </Link>
        }
      />
      </div>

      <div className="print:hidden mb-6 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex min-w-[10rem] flex-col gap-1 text-xs font-medium text-slate-600">
            Item code
            <select
              value={filters.itemCode}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  itemCode: e.target.value,
                  batchNumber: "",
                }))
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
            >
              <option value="">All items</option>
              {itemOptions.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </label>

          <label className="flex min-w-[10rem] flex-col gap-1 text-xs font-medium text-slate-600">
            Batch
            <select
              value={filters.batchNumber}
              onChange={(e) => setFilters((f) => ({ ...f, batchNumber: e.target.value }))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
            >
              <option value="">All batches</option>
              {batchOptions.map((batch) => (
                <option key={batch} value={batch}>
                  {batch}
                </option>
              ))}
            </select>
          </label>

          <label className="flex min-w-[10rem] flex-col gap-1 text-xs font-medium text-slate-600">
            Status
            <select
              value={filters.status}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
            >
              <option value="">All statuses</option>
              {Object.values(SERIAL_STATUS).map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{filtered.length}</span> label
              {filtered.length === 1 ? "" : "s"} selected
              {loading && progress ? (
                <span className="ml-2 text-xs text-slate-500">· Preparing {progress}</span>
              ) : null}
            </p>
            <button
              type="button"
              disabled={loading || labels.length === 0}
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Printer className="h-4 w-4" />
              Print labels
            </button>
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <p className="mt-3 text-xs text-slate-500">
          Stickers are {WARRANTY_LABEL_MM.width}×{WARRANTY_LABEL_MM.height} mm with{" "}
          {WARRANTY_LABELS_PER_ROW} per row ({WARRANTY_LABELS_PER_PAGE} per A4 page). In print
          preview, set scale to 100% and enable background graphics.
        </p>
      </div>

      {loading && labels.length === 0 ? (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white py-20 text-sm text-slate-500 print:hidden">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Generating QR codes… {progress}
        </div>
      ) : filtered.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 print:hidden">
          No serials match the current filters.
        </p>
      ) : (
        <SerialPrintSheet
          records={labels}
          batchLabel={batchLabel}
          showToolbar={false}
        />
      )}

      {!loading && labels.length > 0 && (
        <div className="mt-4 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            <Printer className="h-4 w-4" />
            Print {labels.length} label{labels.length === 1 ? "" : "s"}
          </button>
        </div>
      )}
    </div>
  );
}
