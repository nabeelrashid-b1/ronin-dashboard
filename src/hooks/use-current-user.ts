"use client";

import { useCallback, useEffect, useState } from "react";
import { resolveCurrentUser, setCurrentUserId } from "@/lib/current-user";
import { userHasPermission } from "@/lib/permissions";
import type { PermissionKey } from "@/config/fields";
import type { AppUser } from "@/lib/types";
import { useAppDataContext } from "@/components/providers/app-data-provider";

export function useCurrentUser() {
  const { data } = useAppDataContext();
  const [user, setUser] = useState<AppUser | undefined>();

  const sync = useCallback(() => {
    if (!data) return;
    setUser(resolveCurrentUser(data.users));
  }, [data]);

  useEffect(() => {
    sync();
    window.addEventListener("ronin-user-changed", sync);
    window.addEventListener("ronin-demo-reset", sync);
    return () => {
      window.removeEventListener("ronin-user-changed", sync);
      window.removeEventListener("ronin-demo-reset", sync);
    };
  }, [sync]);

  function switchUser(userId: string) {
    setCurrentUserId(userId);
    window.dispatchEvent(new Event("ronin-user-changed"));
    sync();
  }

  function can(permission: PermissionKey) {
    return userHasPermission(user, permission);
  }

  return { user, switchUser, can, users: data?.users ?? [] };
}
