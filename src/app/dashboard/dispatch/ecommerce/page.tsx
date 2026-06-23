"use client";

import { PageHeader } from "@/components/layout/page-header";
import { DispatchForm } from "@/components/dashboard/dispatch-form";
import { PermissionGate } from "@/components/auth/permission-gate";
import { PERMISSIONS } from "@/config/fields";

export default function DispatchEcommercePage() {
  return (
    <PermissionGate permission={PERMISSIONS.dispatchEcommerce}>
      <PageHeader
        phase="Fulfillment"
        title="E-commerce dispatch"
        description="Role: e-commerce operations. SAP SO + Shopify Order ID required."
      />
      <DispatchForm channel="ecommerce" />
    </PermissionGate>
  );
}
