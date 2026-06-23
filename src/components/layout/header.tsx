"use client";

import { useState } from "react";
import { Bell, Loader2, RotateCcw } from "lucide-react";
import { useAppDataContext } from "@/components/providers/app-data-provider";
import { UserSwitcher } from "@/components/layout/user-switcher";
import { getDemoDataSummary, getResetConfirmMessage } from "@/lib/reset-demo";

export function Header() {
  const { reset } = useAppDataContext();
  const [isResetting, setIsResetting] = useState(false);

  function handleResetDemo() {
    if (!confirm(getResetConfirmMessage())) return;

    setIsResetting(true);
    reset();
    const s = getDemoDataSummary();

    sessionStorage.setItem(
      "ronin-reset-toast",
      `Demo loaded: ${s.serials} serials, ${s.dispatches} dispatches, ${s.staffClaims} staff claims, ${s.customerRequests} customer requests.`,
    );

    window.location.reload();
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="text-sm text-slate-500">
        Serialized warranty lifecycle management
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleResetDemo}
          disabled={isResetting}
          className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-800 transition-colors hover:bg-orange-100 disabled:cursor-wait disabled:opacity-70"
          title="Reload all phases with demo data"
        >
          {isResetting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RotateCcw className="h-3.5 w-3.5" />
          )}
          {isResetting ? "Loading demo…" : "Reset demo"}
        </button>
        <button
          type="button"
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <UserSwitcher />
      </div>
    </header>
  );
}
