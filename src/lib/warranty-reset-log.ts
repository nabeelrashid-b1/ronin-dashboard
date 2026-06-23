import type { WarrantyResetLogEntry } from "./types";
import { WARRANTY_RESET_LOG_KEY } from "./types";

export function getWarrantyResetLog(): WarrantyResetLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WARRANTY_RESET_LOG_KEY);
    return raw ? (JSON.parse(raw) as WarrantyResetLogEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveWarrantyResetLog(entries: WarrantyResetLogEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(WARRANTY_RESET_LOG_KEY, JSON.stringify(entries));
}

export function appendWarrantyResetLog(entry: WarrantyResetLogEntry): void {
  const existing = getWarrantyResetLog();
  saveWarrantyResetLog([entry, ...existing]);
}

export function clearWarrantyResetLog(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(WARRANTY_RESET_LOG_KEY);
}
