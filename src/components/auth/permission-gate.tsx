"use client";

import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { PermissionKey } from "@/config/fields";

export function PermissionGate({
  permission,
  children,
  fallback,
}: {
  permission: PermissionKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { can } = useCurrentUser();

  if (!can(permission)) {
    return (
      fallback ?? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center">
          <p className="text-sm font-medium text-amber-900">Access restricted</p>
          <p className="mt-2 text-xs text-amber-800">
            Your role does not include this module. Switch user in the header or contact an
            administrator.
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-block text-xs font-medium text-orange-700 hover:underline"
          >
            Back to dashboard
          </Link>
        </div>
      )
    );
  }

  return <>{children}</>;
}
