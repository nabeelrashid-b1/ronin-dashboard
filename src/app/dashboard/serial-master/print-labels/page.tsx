"use client";

import { PermissionGate } from "@/components/auth/permission-gate";
import { WarrantyQrPrintPage } from "@/components/dashboard/warranty-qr-print-page";
import { PERMISSIONS } from "@/config/fields";

export default function PrintQrLabelsPage() {
  return (
    <PermissionGate permission={PERMISSIONS.serialMaster}>
      <WarrantyQrPrintPage />
    </PermissionGate>
  );
}
