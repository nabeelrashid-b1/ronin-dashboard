"use client";

import { PageHeader } from "@/components/layout/page-header";
import { DispatchForm } from "@/components/dashboard/dispatch-form";
import { PermissionGate } from "@/components/auth/permission-gate";
import { PERMISSIONS } from "@/config/fields";

export default function DispatchWarehousePage() {
  return (
    <PermissionGate permission={PERMISSIONS.dispatchWarehouse}>
      <PageHeader
        phase="Fulfillment"
        title="Warehouse dispatch"
        description="Role: warehouse dispatcher. SAP sales order is mandatory."
      />
      <DispatchForm channel="warehouse" />
    </PermissionGate>
  );
}
