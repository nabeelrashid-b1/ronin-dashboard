"use client";

import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ItemSerialStatusLookup } from "@/components/dashboard/item-serial-status-lookup";
import { WarrantyCheckForm } from "@/components/dashboard/warranty-check-form";
import { PermissionGate } from "@/components/auth/permission-gate";
import { PERMISSIONS } from "@/config/fields";

function WarrantyCheckContent() {
  return (
    <>
      <PageHeader
        title="Warranty check"
        description="Staff lookup for all serial statuses. Customer QR scans open the public /check page."
      />
      <div className="mb-6">
        <ItemSerialStatusLookup />
      </div>
      <WarrantyCheckForm />
    </>
  );
}

export default function WarrantyCheckClient() {
  return (
    <PermissionGate permission={PERMISSIONS.warrantyCheck}>
      <Suspense fallback={<p className="text-sm text-slate-500">Loading warranty check…</p>}>
        <WarrantyCheckContent />
      </Suspense>
    </PermissionGate>
  );
}
