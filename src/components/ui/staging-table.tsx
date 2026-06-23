"use client";

import { Trash2 } from "lucide-react";

export type StagingColumn<T> = {
  id: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
};

type StagingTableProps<T extends { id: string }> = {
  title?: string;
  rows: T[];
  columns: StagingColumn<T>[];
  onRemove: (id: string) => void;
  emptyMessage?: string;
};

export function StagingTable<T extends { id: string }>({
  title = "Staging (not posted yet)",
  rows,
  columns,
  onRemove,
  emptyMessage = "No rows staged",
}: StagingTableProps<T>) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/40">
      <div className="border-b border-amber-200 px-4 py-2">
        <p className="text-xs font-semibold text-amber-900">{title}</p>
        <p className="text-xs text-amber-800/80">{rows.length} row(s) — remove mistakes before posting</p>
      </div>
      {rows.length === 0 ? (
        <p className="px-4 py-6 text-center text-xs text-amber-800/60">{emptyMessage}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-amber-100 text-left text-xs font-medium uppercase tracking-wide text-amber-900/70">
                {columns.map((c) => (
                  <th key={c.id} className={`px-3 py-2 ${c.className ?? ""}`}>
                    {c.header}
                  </th>
                ))}
                <th className="px-3 py-2 w-16" />
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {rows.map((row) => (
                <tr key={row.id} className="bg-white/60">
                  {columns.map((c) => (
                    <td key={c.id} className={`px-3 py-2 ${c.className ?? ""}`}>
                      {c.cell(row)}
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => onRemove(row.id)}
                      className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                      title="Remove row"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
