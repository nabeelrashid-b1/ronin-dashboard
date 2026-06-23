import { defaultAppData } from "./seed";
import type { AppData, WarrantyDispatchRecord } from "./types";
import { STORAGE_KEY, WARRANTY_DISPATCH_TABLE_KEY } from "./types";

export function getWarrantyDispatchTable(): WarrantyDispatchRecord[] {
  if (typeof window === "undefined") {
    return defaultAppData.warrantyDispatches;
  }

  try {
    const raw = localStorage.getItem(WARRANTY_DISPATCH_TABLE_KEY);
    if (raw) {
      return JSON.parse(raw) as WarrantyDispatchRecord[];
    }

    const seeded = defaultAppData.warrantyDispatches;
    localStorage.setItem(WARRANTY_DISPATCH_TABLE_KEY, JSON.stringify(seeded));
    return structuredClone(seeded);
  } catch {
    return structuredClone(defaultAppData.warrantyDispatches);
  }
}

export function saveWarrantyDispatchTable(
  records: WarrantyDispatchRecord[],
): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(WARRANTY_DISPATCH_TABLE_KEY, JSON.stringify(records));

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const appData: AppData = raw
      ? (JSON.parse(raw) as AppData)
      : structuredClone(defaultAppData);
    appData.warrantyDispatches = records;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
  } catch {
    // keep dispatch table write
  }
}

export function clearWarrantyDispatchTable(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(WARRANTY_DISPATCH_TABLE_KEY);
}
