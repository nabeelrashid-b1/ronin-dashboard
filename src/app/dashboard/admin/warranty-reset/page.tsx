"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { WarrantyResetForm } from "@/components/dashboard/warranty-reset-form";
import { PermissionGate } from "@/components/auth/permission-gate";
import { PERMISSIONS } from "@/config/fields";

export default function AdminWarrantyResetPage() {
  return (
    <PermissionGate permission={PERMISSIONS.warrantyReset}>
      <PageHeader
        title="Warranty admin reset"
        description="Management-only manual override of warranty dates (separate from refresh-by-months-used)."
      />
      <p className="mb-4 text-xs">
        <Link href="/dashboard/admin" className="text-orange-600 hover:underline">
          ← Users & permissions
        </Link>
      </p>
      <WarrantyResetForm />
    </PermissionGate>
  );
}
