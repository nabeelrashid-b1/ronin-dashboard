"use client";

import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Package,
  ScanLine,
  Tags,
  Truck,
} from "lucide-react";
import { useAppDataContext } from "@/components/providers/app-data-provider";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { navItems } from "@/config/navigation";

function flattenNavLinks(items: typeof navItems): { title: string; href: string; icon: (typeof navItems)[0]["icon"] }[] {
  const out: { title: string; href: string; icon: (typeof navItems)[0]["icon"] }[] = [];
  for (const item of items) {
    if (item.href && item.href !== "/dashboard") {
      out.push({ title: item.title, href: item.href, icon: item.icon });
    }
    if (item.children) {
      for (const child of item.children) {
        if (child.href) out.push({ title: child.title, href: child.href, icon: child.icon });
      }
    }
  }
  return out;
}

const quickLinks = flattenNavLinks(navItems);

export function OverviewContent() {
  const { data, isReady } = useAppDataContext();

  if (!isReady || !data) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-slate-500">
        Loading warranty data…
      </div>
    );
  }

  const available = data.serials.filter((s) => s.status === "available").length;
  const dispatched = data.serials.filter((s) => s.status === "dispatched").length;
  const inRepair = data.serials.filter((s) => s.status === "in-repair").length;
  const processed = data.serials.filter((s) =>
    ["refunded", "rejected", "flagged"].includes(s.status),
  ).length;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Operational overview across the five warranty lifecycle phases — serial master, dispatch, claims, inquiry, and administration."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total serials"
          value={data.serials.length}
          hint="Master table records"
          icon={Tags}
          accent="orange"
        />
        <StatCard
          label="Available"
          value={available}
          hint="Ready for dispatch"
          icon={Package}
          accent="emerald"
        />
        <StatCard
          label="Dispatched"
          value={dispatched}
          hint="Warranty activated"
          icon={Truck}
          accent="sky"
        />
        <StatCard
          label="In repair"
          value={inRepair}
          hint={`${data.claims.length} claims · ${processed} closed (reject/exchange)`}
          icon={ClipboardList}
          accent="amber"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent serials</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-3">Serial</th>
                    <th className="px-6 py-3">Item</th>
                    <th className="px-6 py-3">Batch</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.serials.slice(0, 8).map((serial) => (
                    <tr key={serial.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-3 font-mono text-xs font-medium text-slate-900">
                        {serial.serialNumber}
                      </td>
                      <td className="px-6 py-3 text-slate-600">{serial.itemCode}</td>
                      <td className="px-6 py-3 text-slate-600">{serial.batchNumber}</td>
                      <td className="px-6 py-3">
                        <StatusBadge status={serial.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2.5 text-sm transition-colors hover:border-orange-200 hover:bg-orange-50/50"
                  >
                    <Icon className="h-4 w-4 text-orange-600" />
                    <span className="flex-1 font-medium text-slate-800">
                      {item.title}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScanLine className="h-4 w-4 text-slate-500" />
                Warranty check
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                Scan or enter a serial to verify warranty validity, item details, and claim history.
              </p>
              <Link
                href="/dashboard/warranty-check"
                className="mt-3 inline-flex text-sm font-medium text-orange-600 hover:text-orange-700"
              >
                Open inquiry →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent audit activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-slate-100">
            {data.auditLogs.slice(0, 5).map((log) => (
              <li
                key={log.id}
                className="flex items-start justify-between gap-4 px-6 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-slate-800">{log.action}</p>
                  <p className="text-slate-500">{log.details}</p>
                </div>
                <span className="shrink-0 text-xs text-slate-400">
                  {new Date(log.performedAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
