import { PERMISSION_MODULES } from "@/config/permission-modules";
import { PERMISSIONS, type PermissionKey } from "@/config/fields";
import type { AppUser } from "./types";

const ALL_MODULE_KEYS = PERMISSION_MODULES.map((m) => m.key);

const LEGACY_MAP: Record<string, PermissionKey[]> = {
  [PERMISSIONS.dispatch]: [
    PERMISSIONS.dispatchWarehouse,
    PERMISSIONS.dispatchOutlet,
    PERMISSIONS.dispatchEcommerce,
  ],
  [PERMISSIONS.claims]: [PERMISSIONS.claimsAfterSales],
  [PERMISSIONS.claimRequests]: [PERMISSIONS.claimsCustomerSupport],
  [PERMISSIONS.courierExceptions]: [PERMISSIONS.claimsCustomerSupport],
  [PERMISSIONS.returnDept]: [PERMISSIONS.claimsAfterSales],
  [PERMISSIONS.admin]: [PERMISSIONS.adminUsers, PERMISSIONS.adminAudit],
};

export function normalizeUserPermissions(user: AppUser): PermissionKey[] {
  const set = new Set<PermissionKey>();
  for (const p of user.permissions) {
    const key = p as PermissionKey;
    if (LEGACY_MAP[key]) {
      LEGACY_MAP[key].forEach((m) => set.add(m));
    } else {
      set.add(key);
    }
  }
  if (user.role === "admin") return [...ALL_MODULE_KEYS];
  return [...set];
}

export function userHasPermission(
  user: AppUser | undefined,
  permission: PermissionKey,
): boolean {
  if (!user?.isActive) return false;
  const perms = normalizeUserPermissions(user);
  return perms.includes(permission);
}

export function userHasAnyPermission(
  user: AppUser | undefined,
  permissions: PermissionKey[],
): boolean {
  return permissions.some((p) => userHasPermission(user, p));
}

export const DEMO_USERS_SEED: AppUser[] = [
  {
    id: "u1",
    name: "System Admin",
    email: "admin@ronin.local",
    role: "admin",
    permissions: [],
    isActive: true,
  },
  {
    id: "u-wh",
    name: "Warehouse Dispatcher",
    email: "warehouse@ronin.local",
    role: "operator",
    permissions: [PERMISSIONS.serialMaster, PERMISSIONS.dispatchWarehouse, PERMISSIONS.warrantyCheck],
    isActive: true,
  },
  {
    id: "u-out",
    name: "Outlet Sales",
    email: "outlet@ronin.local",
    role: "operator",
    permissions: [PERMISSIONS.dispatchOutlet, PERMISSIONS.warrantyCheck],
    isActive: true,
  },
  {
    id: "u-ec",
    name: "E-commerce Ops",
    email: "ecommerce@ronin.local",
    role: "operator",
    permissions: [PERMISSIONS.dispatchEcommerce, PERMISSIONS.warrantyCheck],
    isActive: true,
  },
  {
    id: "u-as",
    name: "After-sales Agent",
    email: "aftersales@ronin.local",
    role: "operator",
    permissions: [PERMISSIONS.claimsAfterSales, PERMISSIONS.warrantyCheck, PERMISSIONS.warrantyRefresh],
    isActive: true,
  },
  {
    id: "u-cs",
    name: "Customer Support",
    email: "support@ronin.local",
    role: "operator",
    permissions: [PERMISSIONS.claimsCustomerSupport, PERMISSIONS.warrantyCheck],
    isActive: true,
  },
  {
    id: "u-ret",
    name: "After-sales — Return desk",
    email: "returns@ronin.local",
    role: "operator",
    permissions: [PERMISSIONS.claimsAfterSales, PERMISSIONS.warrantyCheck],
    isActive: true,
  },
  {
    id: "u-vw",
    name: "Read-only Viewer",
    email: "viewer@ronin.local",
    role: "viewer",
    permissions: [PERMISSIONS.warrantyCheck],
    isActive: true,
  },
];

export function getDemoOperatorUser(): AppUser {
  return DEMO_USERS_SEED.find((u) => u.id === "u-as")!;
}
