"use client";

import { useAppDataContext } from "@/components/providers/app-data-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AuditLogsTable() {
  const { data, isReady } = useAppDataContext();

  if (!isReady || !data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit log entries</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Module</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Details</th>
                <th className="px-6 py-3">By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3 whitespace-nowrap text-slate-500">
                    {new Date(log.performedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-3">
                    <Badge variant="accent">{log.module}</Badge>
                  </td>
                  <td className="px-6 py-3 font-mono text-xs">{log.action}</td>
                  <td className="px-6 py-3 max-w-md text-slate-600">{log.details}</td>
                  <td className="px-6 py-3">{log.performedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
