"use client";

import { PageHeader } from "@/components/layout/page-header";
import { PermissionGate } from "@/components/auth/permission-gate";
import { CustomerSupportWorkspace } from "@/components/dashboard/customer-support-workspace";
import { PERMISSIONS } from "@/config/fields";

export function CustomerSupportWarrantyClaimClient({
  initialSection,
}: {
  initialSection: "requests" | "courier";
}) {
  return (
    <PermissionGate permission={PERMISSIONS.claimsCustomerSupport}>
      <PageHeader
        title="Warranty Claim — Customer support"
        description="Review customer requests, route repairs to After-sales, and route replace/refund (with saleable flag) to Return (After-sales). Courier fraud is handled here too."
      />
      <CustomerSupportWorkspace initialSection={initialSection} />
    </PermissionGate>
  );
}
