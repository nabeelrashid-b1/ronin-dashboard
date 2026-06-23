import { generateSeedRefreshLog } from "./generate-seed-data";
import { defaultAppData, defaultClaimRequests, SEED_VERSION } from "./seed";
import type { AppData } from "./types";
import {
  STORAGE_KEY,
  WARRANTY_CLAIM_REQUEST_TABLE_KEY,
  WARRANTY_CLAIM_TABLE_KEY,
  WARRANTY_DISPATCH_TABLE_KEY,
  WARRANTY_MASTER_TABLE_KEY,
} from "./types";
import { clearWarrantyRefreshLog, saveWarrantyRefreshLog } from "./warranty-refresh-log";
import { clearWarrantyResetLog } from "./warranty-reset-log";

export const SEED_VERSION_KEY = "ronin-seed-version";

export type DemoDataSummary = {
  serials: number;
  available: number;
  dispatched: number;
  refunded: number;
  flagged: number;
  rejected: number;
  dispatches: number;
  staffClaims: number;
  customerRequests: number;
  salesOrders: number;
  auditLogs: number;
};

export function getDemoDataSummary(): DemoDataSummary {
  const { serials, warrantyDispatches, claims, auditLogs, salesOrders } =
    defaultAppData;

  return {
    serials: serials.length,
    available: serials.filter((s) => s.status === "available").length,
    dispatched: serials.filter((s) => s.status === "dispatched").length,
    refunded: serials.filter((s) => s.status === "refunded").length,
    flagged: serials.filter((s) => s.status === "flagged").length,
    rejected: serials.filter((s) => s.status === "rejected").length,
    dispatches: warrantyDispatches.length,
    staffClaims: claims.length,
    customerRequests: defaultClaimRequests.length,
    salesOrders: salesOrders.length,
    auditLogs: auditLogs.length,
  };
}

export function getResetConfirmMessage(): string {
  const s = getDemoDataSummary();
  return [
    "Load full demo data for all phases?",
    "",
    `Phase I — Serial Master: ${s.serials} items (${s.available} available)`,
    `Phase II — Dispatch: ${s.dispatches} dispatch records, ${s.salesOrders} sales orders`,
    `Phase III — Claims: ${s.staffClaims} · Courier flagged: ${s.flagged}`,
    `Phase IV — Ready for warranty check on ${s.dispatched} dispatched items`,
    `Customer claims: ${s.customerRequests} requests`,
    `Audit logs: ${s.auditLogs} entries`,
    "",
    "This replaces all data in localStorage. Continue?",
  ].join("\n");
}

/**
 * Clears and rewrites every warranty localStorage table with full demo seed data.
 */
export function resetAllDemoData(): AppData {
  if (typeof window === "undefined") {
    return structuredClone(defaultAppData);
  }

  const fresh = structuredClone(defaultAppData);

  localStorage.removeItem(WARRANTY_MASTER_TABLE_KEY);
  localStorage.removeItem(WARRANTY_DISPATCH_TABLE_KEY);
  localStorage.removeItem(WARRANTY_CLAIM_TABLE_KEY);
  localStorage.removeItem(WARRANTY_CLAIM_REQUEST_TABLE_KEY);
  localStorage.removeItem(STORAGE_KEY);
  clearWarrantyResetLog();
  clearWarrantyRefreshLog();
  saveWarrantyRefreshLog(generateSeedRefreshLog(fresh.serials));

  localStorage.setItem(WARRANTY_MASTER_TABLE_KEY, JSON.stringify(fresh.serials));
  localStorage.setItem(
    WARRANTY_DISPATCH_TABLE_KEY,
    JSON.stringify(fresh.warrantyDispatches),
  );
  localStorage.setItem(WARRANTY_CLAIM_TABLE_KEY, JSON.stringify(fresh.claims));
  localStorage.setItem(
    WARRANTY_CLAIM_REQUEST_TABLE_KEY,
    JSON.stringify(defaultClaimRequests),
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);

  window.dispatchEvent(new CustomEvent("ronin-demo-reset", { detail: fresh }));

  return fresh;
}
