import { defaultAppData } from "./seed";
import type {
  AppData,
  ClaimStatusHistoryEntry,
  InternalClaimStatus,
  PartyType,
  WarrantyClaimRecord,
  WarrantySubType,
} from "./types";
import { STORAGE_KEY, WARRANTY_CLAIM_TABLE_KEY } from "./types";

function migrateSubType(raw: string | undefined): WarrantySubType | undefined {
  if (raw === "exchange") return "replace";
  if (raw === "repair" || raw === "replace" || raw === "refund") return raw;
  return undefined;
}

function migrateClaimStatus(raw: string): InternalClaimStatus {
  if (raw === "exchange") return "replace";
  const allowed: InternalClaimStatus[] = [
    "received",
    "in-repair",
    "in-qc",
    "repaired",
    "rerouted",
    "closed",
    "counter-claim",
    "replace",
    "refund",
    "pending-approval",
    "approved",
  ];
  if (allowed.includes(raw as InternalClaimStatus)) return raw as InternalClaimStatus;
  if (raw === "repaired") return "repaired";
  return "closed";
}

function migrateLegacyClaim(raw: unknown): WarrantyClaimRecord | null {
  if (!raw || typeof raw !== "object") return null;
  const c = raw as Record<string, unknown>;

  if (c.claimId && c.claimCategory && c.statusHistory) {
    return c as unknown as WarrantyClaimRecord;
  }

  const legacyType = c.claimType as string | undefined;
  if (legacyType !== "warranty-claim" && legacyType !== "replacement") {
    if (!c.claimCategory) return null;
  }

  const serialNumber = String(c.serialNumber ?? "");
  const subType = migrateSubType(c.warrantySubType as string | undefined) ??
    (legacyType === "replacement" ? "replace" : "repair");
  const claimStatus = migrateClaimStatus(String(c.claimStatus ?? subType ?? "closed"));
  const claimId = String(c.claimId ?? `CLM-LEGACY-${String(c.id ?? serialNumber).slice(0, 12)}`);

  const history: ClaimStatusHistoryEntry[] = [
    {
      status: claimStatus,
      changedBy: String(c.submittedBy ?? "system"),
      changedAt: String(c.submittedAt ?? new Date().toISOString()),
      notes: "Migrated claim",
    },
  ];

  return {
    id: String(c.id ?? ""),
    claimId,
    partyType: (c.partyType as PartyType) ?? "dealer",
    qrCode: String(c.qrCode ?? serialNumber),
    serialNumber,
    itemCode: String(c.itemCode ?? ""),
    itemName: String(c.itemName ?? ""),
    itemDescription: String(c.itemDescription ?? ""),
    claimCategory: (c.claimCategory as WarrantyClaimRecord["claimCategory"]) ?? "warranty-claim",
    warrantySubType: subType,
    claimStatus,
    statusHistory: history,
    creditNote: c.creditNote ? String(c.creditNote) : undefined,
    cardCode: c.cardCode ? String(c.cardCode) : c.customerCode ? String(c.customerCode) : undefined,
    shopifyOrderId: c.shopifyOrderId ? String(c.shopifyOrderId) : undefined,
    oldSerialNumber: c.oldSerialNumber ? String(c.oldSerialNumber) : undefined,
    newSerialNumber: c.newSerialNumber ? String(c.newSerialNumber) : undefined,
    salesOrderNumber: c.salesOrderNumber ? String(c.salesOrderNumber) : undefined,
    accessoryReplaced: c.accessoryReplaced ? String(c.accessoryReplaced) : undefined,
    warrantyStartDate: String(c.warrantyStartDate ?? ""),
    warrantyEndDate: String(c.warrantyEndDate ?? ""),
    remarks: String(c.remarks ?? ""),
    submittedAt: String(c.submittedAt ?? new Date().toISOString()),
    submittedBy: String(c.submittedBy ?? "system"),
    linkedRequestId: c.linkedRequestId ? String(c.linkedRequestId) : undefined,
  };
}

export function getWarrantyClaimTable(): WarrantyClaimRecord[] {
  if (typeof window === "undefined") {
    return defaultAppData.claims;
  }

  try {
    const raw = localStorage.getItem(WARRANTY_CLAIM_TABLE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown[];
      return parsed
        .map((row) => migrateLegacyClaim(row) ?? (row as WarrantyClaimRecord))
        .filter((row): row is WarrantyClaimRecord => Boolean(row?.serialNumber));
    }

    const seeded = defaultAppData.claims;
    localStorage.setItem(WARRANTY_CLAIM_TABLE_KEY, JSON.stringify(seeded));
    return structuredClone(seeded);
  } catch {
    return structuredClone(defaultAppData.claims);
  }
}

export function saveWarrantyClaimTable(records: WarrantyClaimRecord[]): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(WARRANTY_CLAIM_TABLE_KEY, JSON.stringify(records));

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const appData: AppData = raw
      ? (JSON.parse(raw) as AppData)
      : structuredClone(defaultAppData);
    appData.claims = records;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
  } catch {
    // keep claim table write
  }
}

export function clearWarrantyClaimTable(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(WARRANTY_CLAIM_TABLE_KEY);
}
