"use client";

import { PageHeader } from "@/components/layout/page-header";
import { DispatchForm } from "@/components/dashboard/dispatch-form";
import { PermissionGate } from "@/components/auth/permission-gate";
import { PERMISSIONS } from "@/config/fields";

export default function DispatchOutletPage() {
  return (
    <PermissionGate permission={PERMISSIONS.dispatchOutlet}>
      <PageHeader
        phase="Fulfillment"
        title="Outlet dispatch"
        description="Role: outlet sales. SO number serves as the walk-in receipt."
      />
      <DispatchForm channel="outlet" />
    </PermissionGate>
  );
}
