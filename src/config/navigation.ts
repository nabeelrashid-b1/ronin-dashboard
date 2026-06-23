import {
  ClipboardList,
  Headphones,
  LayoutDashboard,
  PackageCheck,
  RefreshCw,
  ScanLine,
  ShieldCheck,
  Printer,
  Tags,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import { PERMISSIONS, type PermissionKey } from "@/config/fields";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  href?: string;
  icon: LucideIcon;
  /** Single permission required */
  permission?: PermissionKey;
  /** Any of these permissions (for grouped items) */
  permissions?: PermissionKey[];
  description?: string;
  children?: NavItem[];
};

export const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Operational summary",
  },
  {
    title: "Serial Master",
    href: "/dashboard/serial-master",
    icon: Tags,
    permission: PERMISSIONS.serialMaster,
    description: "Generate serials & QR labels",
  },
  {
    title: "Print QR Labels",
    href: "/dashboard/serial-master/print-labels",
    icon: Printer,
    permission: PERMISSIONS.serialMaster,
    description: "Print all warranty stickers (17×20 mm)",
  },
  {
    title: "Dispatch",
    icon: Truck,
    permissions: [
      PERMISSIONS.dispatchWarehouse,
      PERMISSIONS.dispatchOutlet,
      PERMISSIONS.dispatchEcommerce,
    ],
    description: "Fulfillment by channel role",
    children: [
      {
        title: "Warehouse",
        href: "/dashboard/dispatch/warehouse",
        icon: Truck,
        permission: PERMISSIONS.dispatchWarehouse,
        description: "Dealer / SAP SO",
      },
      {
        title: "Outlet",
        href: "/dashboard/dispatch/outlet",
        icon: Truck,
        permission: PERMISSIONS.dispatchOutlet,
        description: "Walk-in (SO = receipt)",
      },
      {
        title: "E-commerce",
        href: "/dashboard/dispatch/ecommerce",
        icon: Truck,
        permission: PERMISSIONS.dispatchEcommerce,
        description: "Shopify orders",
      },
    ],
  },
  {
    title: "Warranty Claim",
    icon: ClipboardList,
    permissions: [PERMISSIONS.claimsAfterSales, PERMISSIONS.claimsCustomerSupport],
    description: "After-sales, customer support & returns",
    children: [
      {
        title: "After-sales",
        href: "/dashboard/warranty-claim/after-sales",
        icon: Wrench,
        permission: PERMISSIONS.claimsAfterSales,
        description: "Counter, refresh, warranty claims",
      },
      {
        title: "Customer support",
        href: "/dashboard/warranty-claim/customer-support",
        icon: Headphones,
        permission: PERMISSIONS.claimsCustomerSupport,
        description: "Requests, routing, courier",
      },
    ],
  },
  {
    title: "Warranty Check",
    href: "/dashboard/warranty-check",
    icon: ScanLine,
    permission: PERMISSIONS.warrantyCheck,
    description: "Dispatched & in-claim lookup",
  },
  {
    title: "Administration",
    href: "/dashboard/admin",
    icon: ShieldCheck,
    permission: PERMISSIONS.adminUsers,
    description: "Users, permissions, audit",
  },
];

export const adminSubNav = [
  { title: "Users & Permissions", href: "/dashboard/admin", icon: Users, permission: PERMISSIONS.adminUsers },
  { title: "Audit Logs", href: "/dashboard/admin/logs", icon: PackageCheck, permission: PERMISSIONS.adminAudit },
  { title: "Warranty admin reset", href: "/dashboard/admin/warranty-reset", icon: RefreshCw, permission: PERMISSIONS.warrantyReset },
] as const;
