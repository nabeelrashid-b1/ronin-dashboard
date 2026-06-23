"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDataContext } from "@/components/providers/app-data-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { FIELDS } from "@/config/fields";
import { lookupSerialForClaim } from "@/lib/claim-utils";
import { saveAppData } from "@/lib/storage";
import { executeWarrantyRefresh } from "@/lib/warranty-refresh-service";
import { getWarrantyRefreshLog } from "@/lib/warranty-refresh-log";
import { monthsElapsed } from "@/lib/warranty-rules";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { WarrantyRefreshLogEntry, WarrantySerial } from "@/lib/types";

const MAX_REFRESH_MONTHS = 7;

export function WarrantyRefreshForm() {
  const { data, updateData } = useAppDataContext();
  const { user } = useCurrentUser();
  const [scan, setScan] = useState("");
  const [monthsToExtend, setMonthsToExtend] = useState("");
  const [logs, setLogs] = useState<WarrantyRefreshLogEntry[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const serial: WarrantySerial | undefined = useMemo(() => {
    if (!data || !scan.trim()) return undefined;
    return lookupSerialForClaim(data.serials, scan);
  }, [data, scan]);

  const monthsUsed = useMemo(() => {
    if (!serial?.warrantyStartDate) return null;
    const today = new Date().toISOString().slice(0, 10);
    return monthsElapsed(serial.warrantyStartDate, today);
  }, [serial]);

  const eligible = useMemo(() => {
    if (!serial || monthsUsed === null) return false;
    if (serial.status !== "dispatched") return false;
    return monthsUsed < MAX_REFRESH_MONTHS;
  }, [serial, monthsUsed]);

  useEffect(() => {
    if (serial && monthsUsed !== null && eligible) {
      setMonthsToExtend(String(monthsUsed));
    } else {
      setMonthsToExtend("");
    }
  }, [serial?.serialNumber, monthsUsed, eligible]);

  function reloadLogs() {
    setLogs(getWarrantyRefreshLog());
  }

  useEffect(() => {
    reloadLogs();
    window.addEventListener("ronin-demo-reset", reloadLogs);
    return () => window.removeEventListener("ronin-demo-reset", reloadLogs);
  }, []);

  function handleApply(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    if (!data || !serial || monthsUsed === null) {
      setError("Scan a dispatched serial with an active warranty first.");
      return;
    }
    if (!eligible) {
      setError(
        `Refresh only within ${MAX_REFRESH_MONTHS} months of dispatch (months used: ${monthsUsed}).`,
      );
      return;
    }
    const extend = Number(monthsToExtend);
    if (extend !== monthsUsed) {
      setError(`Extension must match months used since dispatch (${monthsUsed}).`);
      return;
    }

    const result = executeWarrantyRefresh(
      data,
      serial,
      user?.name ?? "Operator",
      `Refresh +${extend} month(s) on receive`,
      undefined,
      false,
      extend,
    );

    if ("error" in result) {
      setError(result.error);
      return;
    }

    saveAppData(result.data);
    updateData(() => result.data);
    reloadLogs();
    setMessage(
      `Warranty refreshed for ${serial.serialNumber}: end date extended by ${extend} month(s) → ${result.log.newEndDate}`,
    );
  }

  const logColumns: DataTableColumn<WarrantyRefreshLogEntry>[] = [
    {
      id: "serial",
      header: FIELDS.serialNumber.label,
      accessor: (r) => r.serialNumber,
      className: "font-mono text-xs",
    },
    { id: "extended", header: FIELDS.monthsExtended.label, accessor: (r) => r.monthsExtended },
    { id: "prev", header: "Previous end", accessor: (r) => r.previousEndDate },
    { id: "new", header: "New end", accessor: (r) => r.newEndDate },
    { id: "by", header: FIELDS.performedBy.label, accessor: (r) => r.approvedBy },
  ];

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Refresh warranty on item receipt</CardTitle>
          <p className="text-sm text-slate-500">
            Scan the returned unit. The system reads months elapsed since dispatch (warranty start)
            and offers that value as the only extension option — eligible while within{" "}
            {MAX_REFRESH_MONTHS} months + 0 days.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium">{FIELDS.serialNumber.label}</label>
              <input
                value={scan}
                onChange={(e) => {
                  setScan(e.target.value);
                  setMessage(null);
                  setError(null);
                }}
                placeholder="Scan QR or serial"
                className={inputClass}
                required
              />
            </div>

            {serial && monthsUsed !== null && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
                <div className="mb-2 flex flex-wrap gap-2">
                  <span className="font-mono text-xs font-semibold">{serial.serialNumber}</span>
                  <Badge variant={eligible ? "success" : "danger"}>
                    {eligible ? "Eligible" : "Locked"}
                  </Badge>
                </div>
                <dl className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-slate-500">Dispatch (warranty start)</dt>
                    <dd>{serial.warrantyStartDate || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Months used (to today)</dt>
                    <dd className="font-semibold">{monthsUsed}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Current end date</dt>
                    <dd>{serial.warrantyEndDate || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Status</dt>
                    <dd>{serial.status}</dd>
                  </div>
                </dl>
                {!eligible && (
                  <p className="mt-3 text-xs text-red-700">
                    Not within {MAX_REFRESH_MONTHS} months of dispatch — refresh locked.
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium">
                Extend warranty by (months)
              </label>
              <select
                value={monthsToExtend}
                onChange={(e) => setMonthsToExtend(e.target.value)}
                disabled={!eligible || monthsUsed === null}
                className={inputClass}
                required
              >
                <option value="">Select months</option>
                {monthsUsed !== null && eligible && (
                  <option value={String(monthsUsed)}>
                    {monthsUsed} month{monthsUsed === 1 ? "" : "s"} (months used since dispatch)
                  </option>
                )}
              </select>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}
            {message && (
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>
            )}

            <button
              type="submit"
              disabled={!eligible || !monthsToExtend}
              className="rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
            >
              Update refresh warranty
            </button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Refresh history</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={logColumns} data={logs} pageSize={8} emptyMessage="No refreshes yet." />
        </CardContent>
      </Card>
    </div>
  );
}
