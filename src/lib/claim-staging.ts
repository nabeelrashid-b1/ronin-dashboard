import type { ClaimStagingLogEntry, WarrantyClaimRecord } from "./types";

export function appendClaimStaging(
  claim: WarrantyClaimRecord,
  entry: Omit<ClaimStagingLogEntry, "performedAt"> & { performedAt?: string },
): WarrantyClaimRecord {
  const log: ClaimStagingLogEntry = {
    ...entry,
    performedAt: entry.performedAt ?? new Date().toISOString(),
  };
  return {
    ...claim,
    stagingLog: [...(claim.stagingLog ?? []), log],
  };
}
