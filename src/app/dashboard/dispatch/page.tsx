"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { useCurrentUser } from "@/hooks/use-current-user";
import { PERMISSIONS } from "@/config/fields";

const channels = [
  {
    href: "/dashboard/dispatch/warehouse",
    permission: PERMISSIONS.dispatchWarehouse,
    title: "Warehouse",
    desc: "B2B dealer / SAP SO",
  },
  {
    href: "/dashboard/dispatch/outlet",
    permission: PERMISSIONS.dispatchOutlet,
    title: "Outlet",
    desc: "Walk-in — SO is receipt",
  },
  {
    href: "/dashboard/dispatch/ecommerce",
    permission: PERMISSIONS.dispatchEcommerce,
    title: "E-commerce",
    desc: "Shopify fulfilment",
  },
];

export default function DispatchHubPage() {
  const { can } = useCurrentUser();
  const visible = channels.filter((c) => can(c.permission));

  return (
    <>
      <PageHeader title="Dispatch" description="Open your channel workspace (role-based)." />
      <div className="grid gap-4 sm:grid-cols-3">
        {visible.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-orange-300"
          >
            <p className="font-semibold text-slate-900">{c.title}</p>
            <p className="mt-1 text-sm text-slate-500">{c.desc}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
