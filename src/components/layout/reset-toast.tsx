"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

export function ResetToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const msg = sessionStorage.getItem("ronin-reset-toast");
    if (msg) {
      setMessage(msg);
      sessionStorage.removeItem("ronin-reset-toast");
    }
  }, []);

  if (!message) return null;

  return (
    <div className="mb-4 flex items-start justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
      <div className="flex gap-2">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        <p>{message}</p>
      </div>
      <button
        type="button"
        onClick={() => setMessage(null)}
        className="shrink-0 text-emerald-700 hover:text-emerald-900"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
