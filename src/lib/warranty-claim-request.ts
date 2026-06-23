import { defaultClaimRequests } from "./seed";
import type { WarrantyClaimRequest } from "./types";
import { WARRANTY_CLAIM_REQUEST_TABLE_KEY } from "./types";

export function getWarrantyClaimRequests(): WarrantyClaimRequest[] {
  if (typeof window === "undefined") {
    return defaultClaimRequests;
  }

  try {
    const raw = localStorage.getItem(WARRANTY_CLAIM_REQUEST_TABLE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as WarrantyClaimRequest[];
      return parsed.map((r) => ({
        ...r,
        requestIntakeType:
          r.requestIntakeType ??
          (r.claimType === "warranty-repair" ? "warranty" : "warranty"),
      }));
    }
    localStorage.setItem(
      WARRANTY_CLAIM_REQUEST_TABLE_KEY,
      JSON.stringify(defaultClaimRequests),
    );
    return structuredClone(defaultClaimRequests);
  } catch {
    return structuredClone(defaultClaimRequests);
  }
}

export function saveWarrantyClaimRequests(records: WarrantyClaimRequest[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(WARRANTY_CLAIM_REQUEST_TABLE_KEY, JSON.stringify(records));
}

export function saveWarrantyClaimRequest(record: WarrantyClaimRequest): void {
  if (typeof window === "undefined") return;
  const existing = getWarrantyClaimRequests();
  saveWarrantyClaimRequests([record, ...existing]);
}

export function clearWarrantyClaimRequests(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(WARRANTY_CLAIM_REQUEST_TABLE_KEY);
}
