"use client";

import { useEffect, useState } from "react";
import { useAppDataContext } from "@/components/providers/app-data-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { FIELDS } from "@/config/fields";
import { lookupSerialForClaim } from "@/lib/claim-utils";
import { addMonthsToDate } from "@/lib/dispatch-utils";
import { generateId, saveAppData } from "@/lib/storage";
import type { WarrantyResetLogEntry } from "@/lib/types";
import {
  appendWarrantyResetLog,
  getWarrantyResetLog,
} from "@/lib/warranty-reset-log";

export function WarrantyResetForm() {
  const { data, updateData } = useAppDataContext();
  const [scan, setScan] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [reason, setReason] = useState("");
  const [logs, setLogs] = useState<WarrantyResetLogEntry[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setLogs(getWarrantyResetLog());
    const refresh = () => setLogs(getWarrantyResetLog());
    window.addEventListener("ronin-demo-reset", refresh);
    return () => window.removeEventListener("ronin-demo-reset", refresh);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!data) return;

    const serial = lookupSerialForClaim(data.serials, scan);
    if (!serial) {
      setMessage("Serial not found.");
      return;
    }
    if (!newStart || !newEnd) {
      setMessage("Enter new warranty start and end dates.");
      return;
    }

    const logEntry: WarrantyResetLogEntry = {
      id: generateId(),
      serialNumber: serial.serialNumber,
      qrCode: serial.qrCode,
      previousStartDate: serial.warrantyStartDate,
      previousEndDate: serial.warrantyEndDate,
      newStartDate: newStart,
      newEndDate: newEnd,
      reason: reason.trim() || "Manual reset",
      resetBy: "Admin User",
      resetAt: new Date().toISOString(),
    };

    const serials = data.serials.map((s) =>
      s.serialNumber === serial.serialNumber
        ? { ...s, warrantyStartDate: newStart, warrantyEndDate: newEnd }
        : s,
    );

    const next = { ...data, serials };
    saveAppData(next);
    updateData(() => next);
    appendWarrantyResetLog(logEntry);
    setLogs(getWarrantyResetLog());
    setMessage(`Warranty reset for ${serial.serialNumber}`);
    setScan("");
    setReason("");
  }

  function autoEndFromStart(start: string) {
    setNewStart(start);
    const serial = data ? lookupSerialForClaim(data.serials, scan) : undefined;
    if (serial && start) {
      setNewEnd(addMonthsToDate(start, serial.warrantyPeriod));
    }
  }

  const logColumns: DataTableColumn<WarrantyResetLogEntry>[] = [
    { id: "serial", header: FIELDS.serialNumber.label, accessor: (r) => r.serialNumber, className: "font-mono text-xs" },
    { id: "prev", header: "Previous", accessor: (r) => `${r.previousStartDate} → ${r.previousEndDate}` },
    { id: "new", header: "New", accessor: (r) => `${r.newStartDate} → ${r.newEndDate}` },
    { id: "by", header: FIELDS.performedBy.label, accessor: (r) => r.resetBy },
    { id: "at", header: FIELDS.performedAt.label, accessor: (r) => new Date(r.resetAt).toLocaleString() },
    { id: "reason", header: "Reason", accessor: (r) => r.reason },
  ];

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reset warranty dates</CardTitle>
          <p className="text-sm text-slate-500">Scan QR and set new warranty period — all changes logged.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium">{FIELDS.qrCode.label}</label>
              <input value={scan} onChange={(e) => setScan(e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">{FIELDS.warrantyStartDate.label}</label>
              <input type="date" value={newStart} onChange={(e) => autoEndFromStart(e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">{FIELDS.warrantyEndDate.label}</label>
              <input type="date" value={newEnd} onChange={(e) => setNewEnd(e.target.value)} className={inputClass} required />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium">Reason</label>
              <input value={reason} onChange={(e) => setReason(e.target.value)} className={inputClass} />
            </div>
            {message && <p className="sm:col-span-2 text-sm text-emerald-700">{message}</p>}
            <button type="submit" className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700">
              Reset warranty
            </button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Warranty reset history</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={logColumns} data={logs.map((l) => ({ ...l, id: l.id }))} pageSize={8} emptyMessage="No reset history yet." />
        </CardContent>
      </Card>
    </div>
  );
}
