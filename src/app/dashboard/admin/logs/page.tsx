"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { AuditLogsTable } from "@/components/dashboard/audit-logs-table";
import { PermissionGate } from "@/components/auth/permission-gate";
import { PERMISSIONS } from "@/config/fields";

export default function AdminLogsPage() {
  return (
    <PermissionGate permission={PERMISSIONS.adminAudit}>
      <PageHeader
        phase="Administration"
        title="Audit logs"
        description="Serial generation, dispatch, claims, courier lockouts, and admin actions."
      />
      <p className="mb-4 text-xs">
        <Link href="/dashboard/admin" className="text-orange-600 hover:underline">
          ← Users & permissions
        </Link>
      </p>
      <AuditLogsTable />
    </PermissionGate>
  );
}
