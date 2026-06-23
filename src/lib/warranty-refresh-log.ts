import type { WarrantyRefreshLogEntry } from "./types";
import { WARRANTY_REFRESH_LOG_KEY } from "./types";

export function getWarrantyRefreshLog(): WarrantyRefreshLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WARRANTY_REFRESH_LOG_KEY);
    return raw ? (JSON.parse(raw) as WarrantyRefreshLogEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveWarrantyRefreshLog(entries: WarrantyRefreshLogEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(WARRANTY_REFRESH_LOG_KEY, JSON.stringify(entries));
}

export function appendWarrantyRefreshLog(entry: WarrantyRefreshLogEntry): void {
  saveWarrantyRefreshLog([entry, ...getWarrantyRefreshLog()]);
}

export function clearWarrantyRefreshLog(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(WARRANTY_REFRESH_LOG_KEY);
}
