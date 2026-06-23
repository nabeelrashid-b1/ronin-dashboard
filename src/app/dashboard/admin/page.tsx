"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { UsersTable } from "@/components/dashboard/users-table";
import { PermissionGate } from "@/components/auth/permission-gate";
import { PERMISSIONS } from "@/config/fields";
import { useCurrentUser } from "@/hooks/use-current-user";
import { adminSubNav } from "@/config/navigation";

export default function AdminPage() {
  const { can } = useCurrentUser();

  return (
    <PermissionGate permission={PERMISSIONS.adminUsers}>
      <PageHeader
        phase="Administration"
        title="Users & permissions"
        description="Grant module and document access by role. Use the header user switcher to test each profile."
      />

      <nav className="mb-6 flex flex-wrap gap-2">
        {adminSubNav.map((item) =>
          can(item.permission) ? (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                item.href === "/dashboard/admin"
                  ? "bg-orange-600 text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.title}
            </Link>
          ) : null,
        )}
      </nav>

      <UsersTable />
    </PermissionGate>
  );
}
