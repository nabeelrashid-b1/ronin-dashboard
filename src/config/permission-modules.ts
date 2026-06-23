import type { PermissionKey } from "@/config/fields";
import { PERMISSIONS } from "@/config/fields";
import type { DispatchChannel } from "@/lib/types";

export type PermissionModule = {
  key: PermissionKey;
  label: string;
  description: string;
  group: "production" | "fulfillment" | "service" | "governance";
};

/** Module/document permissions for Administration */
export const PERMISSION_MODULES: PermissionModule[] = [
  {
    key: PERMISSIONS.serialMaster,
    label: "Serial Master",
    description: "Generate serials and QR labels",
    group: "production",
  },
  {
    key: PERMISSIONS.dispatchWarehouse,
    label: "Dispatch — Warehouse",
    description: "B2B dealer dispatch (SAP SO)",
    group: "fulfillment",
  },
  {
    key: PERMISSIONS.dispatchOutlet,
    label: "Dispatch — Outlet",
    description: "Walk-in retail dispatch (SO = receipt)",
    group: "fulfillment",
  },
  {
    key: PERMISSIONS.dispatchEcommerce,
    label: "Dispatch — E-commerce",
    description: "Shopify online dispatch",
    group: "fulfillment",
  },
  {
    key: PERMISSIONS.warrantyCheck,
    label: "Warranty Check",
    description: "Lookup dispatched and in-claim units only",
    group: "service",
  },
  {
    key: PERMISSIONS.claimsAfterSales,
    label: "Warranty Claims — After-sales",
    description: "Counter swap, repair/QC, Return screen (replace/refund)",
    group: "service",
  },
  {
    key: PERMISSIONS.claimsCustomerSupport,
    label: "Warranty Claims — Customer support",
    description: "7-day claims, customer requests, courier fraud",
    group: "service",
  },
  {
    key: PERMISSIONS.warrantyRefresh,
    label: "Warranty Refresh",
    description: "Extend warranty by months used (within 7 months)",
    group: "service",
  },
  {
    key: PERMISSIONS.warrantyReset,
    label: "Warranty Admin Reset",
    description: "Manual date override (management)",
    group: "governance",
  },
  {
    key: PERMISSIONS.adminUsers,
    label: "Administration — Users",
    description: "Manage users and module permissions",
    group: "governance",
  },
  {
    key: PERMISSIONS.adminAudit,
    label: "Administration — Audit logs",
    description: "View system audit trail",
    group: "governance",
  },
];

export const DISPATCH_CHANNEL_PERMISSION: Record<DispatchChannel, PermissionKey> = {
  warehouse: PERMISSIONS.dispatchWarehouse,
  outlet: PERMISSIONS.dispatchOutlet,
  ecommerce: PERMISSIONS.dispatchEcommerce,
};

export function permissionModuleLabel(key: string): string {
  return PERMISSION_MODULES.find((m) => m.key === key)?.label ?? key;
}
