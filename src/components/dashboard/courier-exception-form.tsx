"use client";

import { useMemo, useState } from "react";
import { useAppDataContext } from "@/components/providers/app-data-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { FIELDS } from "@/config/fields";
import { lookupSerialForClaim } from "@/lib/claim-utils";
import { canFlagCourierFraud, flagCourierFraud } from "@/lib/courier-service";
import { saveAppData } from "@/lib/storage";
import type { CourierExceptionRecord } from "@/lib/types";

export function CourierExceptionForm() {
  const { data, updateData } = useAppDataContext();
  const [scan, setScan] = useState("");
  const [riderId, setRiderId] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [reportNote, setReportNote] = useState("");
  const [reportFileName, setReportFileName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const serial = useMemo(() => {
    if (!data || !scan.trim()) return undefined;
    return lookupSerialForClaim(data.serials, scan);
  }, [data, scan]);

  const records = data?.courierExceptions ?? [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!data || !serial) {
      setError("Scan a valid dispatched serial first.");
      return;
    }
    const precheck = canFlagCourierFraud(serial);
    if (precheck) {
      setError(precheck);
      return;
    }
    if (!riderId.trim() || !trackingCode.trim() || !reportNote.trim()) {
      setError("Rider ID, courier tracking code, and investigation report are required.");
      return;
    }
    if (!reportFileName.trim()) {
      setError("Upload a report file (name) before saving fraud lockout.");
      return;
    }

    try {
      const next = flagCourierFraud(data, serial, {
        riderId,
        courierTrackingCode: trackingCode,
        reportNote,
        reportFileName,
        lockedBy: "Warehouse User",
      });
      saveAppData(next);
      updateData(() => next);
      setMessage(
        `${serial.serialNumber} locked as Flagged — blocked from dispatch and claims.`,
      );
      setScan("");
      setRiderId("");
      setTrackingCode("");
      setReportNote("");
      setReportFileName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save fraud lockout.");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setReportFileName(file?.name ?? "");
  }

  const columns: DataTableColumn<CourierExceptionRecord>[] = [
    {
      id: "serial",
      header: FIELDS.serialNumber.label,
      accessor: (r) => r.serialNumber,
      className: "font-mono text-xs",
    },
    { id: "rider", header: FIELDS.riderId.label, accessor: (r) => r.riderId },
    {
      id: "tracking",
      header: FIELDS.courierTrackingCode.label,
      accessor: (r) => r.courierTrackingCode,
    },
    {
      id: "note",
      header: FIELDS.fraudReportNote.label,
      accessor: (r) => r.reportNote.slice(0, 60) + (r.reportNote.length > 60 ? "…" : ""),
    },
    {
      id: "file",
      header: "Report file",
      accessor: (r) => r.reportFileName ?? "—",
    },
    {
      id: "at",
      header: "Locked at",
      accessor: (r) => new Date(r.lockedAt).toLocaleString(),
    },
  ];

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Failed delivery — fraud lockout</CardTitle>
          <p className="text-xs text-slate-500">
            When a rider returns a failed delivery and the box was tampered with, activate fraud
            lockout. The serial becomes <strong>Flagged</strong> and never returns to Available.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Scan serial / QR
              </label>
              <input
                value={scan}
                onChange={(e) => setScan(e.target.value)}
                className={inputClass}
                placeholder="Dispatched unit from failed delivery"
              />
              {serial && (
                <p className="mt-1 text-xs text-slate-500">
                  {serial.itemName} — status: {serial.status}
                </p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  {FIELDS.riderId.label} *
                </label>
                <input
                  value={riderId}
                  onChange={(e) => setRiderId(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  {FIELDS.courierTrackingCode.label} *
                </label>
                <input
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                {FIELDS.fraudReportNote.label} *
              </label>
              <textarea
                value={reportNote}
                onChange={(e) => setReportNote(e.target.value)}
                rows={3}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Upload investigation report *
              </label>
              <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} />
              {reportFileName && (
                <p className="mt-1 text-xs text-emerald-700">Attached: {reportFileName}</p>
              )}
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}
            {message && (
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
            >
              Activate fraud lockout (Flagged)
            </button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Courier exception log</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={records} emptyMessage="No courier fraud records yet." />
        </CardContent>
      </Card>
    </div>
  );
}
