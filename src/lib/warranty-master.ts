import { defaultAppData } from "./seed";
import type { AppData, SerialStatus, WarrantySerial } from "./types";
import { STORAGE_KEY, WARRANTY_MASTER_TABLE_KEY } from "./types";

function migrateSerial(raw: WarrantySerial): WarrantySerial {
  let status = raw.status as SerialStatus;
  if ((raw.status as string) === "claimed") status = "in-repair";
  if ((raw.status as string) === "replaced") status = "refunded";
  if ((raw.status as string) === "exchanged") status = "refunded";
  if ((raw.status as string) === "on-hold") status = "on-hold";
  if ((raw.status as string) === "repaired") status = "dispatched";
  return {
    ...raw,
    status,
    claimHistory: raw.claimHistory ?? [],
    claimCount: raw.claimCount ?? 0,
    refreshCount: raw.refreshCount ?? 0,
    dispatchChannel: raw.dispatchChannel,
    shopifyOrderId: raw.shopifyOrderId,
    outletReference: raw.outletReference,
  };
}

export function getWarrantyMasterTable(): WarrantySerial[] {
  if (typeof window === "undefined") {
    return defaultAppData.serials;
  }

  try {
    const raw = localStorage.getItem(WARRANTY_MASTER_TABLE_KEY);
    if (raw) {
      return (JSON.parse(raw) as WarrantySerial[]).map(migrateSerial);
    }

    const appRaw = localStorage.getItem(STORAGE_KEY);
    if (appRaw) {
      const appData = JSON.parse(appRaw) as AppData;
      if (appData.serials?.length) {
        localStorage.setItem(
          WARRANTY_MASTER_TABLE_KEY,
          JSON.stringify(appData.serials),
        );
        return appData.serials.map(migrateSerial);
      }
    }

    localStorage.setItem(
      WARRANTY_MASTER_TABLE_KEY,
      JSON.stringify(defaultAppData.serials),
    );
    return structuredClone(defaultAppData.serials);
  } catch {
    return structuredClone(defaultAppData.serials);
  }
}

export function saveWarrantyMasterTable(serials: WarrantySerial[]): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(WARRANTY_MASTER_TABLE_KEY, JSON.stringify(serials));

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const appData: AppData = raw
      ? (JSON.parse(raw) as AppData)
      : structuredClone(defaultAppData);
    appData.serials = serials;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
  } catch {
    // keep master table write even if app sync fails
  }
}



//  NEW CODE









export function clearWarrantyMasterTable(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(WARRANTY_MASTER_TABLE_KEY);
}
