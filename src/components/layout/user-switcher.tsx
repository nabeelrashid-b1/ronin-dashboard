"use client";

import { User } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { normalizeUserPermissions } from "@/lib/permissions";

export function UserSwitcher() {
  const { user, switchUser, users } = useCurrentUser();

  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-white">
        <User className="h-3.5 w-3.5" />
      </div>
      <div className="hidden min-w-[140px] sm:block">
        <select
          value={user?.id ?? ""}
          onChange={(e) => switchUser(e.target.value)}
          className="w-full border-0 bg-transparent text-xs font-medium text-slate-900 focus:outline-none focus:ring-0"
          aria-label="Switch demo user"
        >
          {users
            .filter((u) => u.isActive)
            .map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
        </select>
        <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
      </div>
      {user && (
        <span className="hidden lg:inline text-[10px] text-slate-400" title={normalizeUserPermissions(user).join(", ")}>
          {normalizeUserPermissions(user).length} modules
        </span>
      )}
    </div>
  );
}
