"use client";

import { useMemo, useState } from "react";
import { useAppDataContext } from "@/components/providers/app-data-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DispatchHistoryTable() {
  const { data, isReady } = useAppDataContext();
  const [filter, setFilter] = useState("");

  const rows = useMemo(() => {
    if (!data) return [];
    let list = [...data.warrantyDispatches].sort(
      (a, b) =>
        new Date(b.dispatchDate).getTime() - new Date(a.dispatchDate).getTime(),
    );
    if (filter.trim()) {
      const q = filter.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.serialNumber.toLowerCase().includes(q) ||
          r.salesOrderNumber.toLowerCase().includes(q),
      );
    }
    return list;
  }, [data, filter]);

  if (!isReady || !data) return null;

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Warranty_Dispatch</CardTitle>
          <p className="mt-1 text-xs text-slate-500">
            {data.warrantyDispatches.length} dispatch record(s) in localStorage
          </p>
        </div>
        <input
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search serial or SO…"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm sm:w-56"
        />
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Serial no</th>
                <th className="px-4 py-3">Sales order no</th>
                <th className="px-4 py-3">Sales order date</th>
                <th className="px-4 py-3">Dispatch date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                    No dispatch records yet.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-mono text-xs">{row.serialNumber}</td>
                    <td className="px-4 py-3">{row.salesOrderNumber}</td>
                    <td className="px-4 py-3">{row.salesOrderDate}</td>
                    <td className="px-4 py-3">{row.dispatchDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
