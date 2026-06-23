import type { ClaimJourneyEntry } from "./types";
import { generateId } from "./storage";

let claimSeq = 0;

export function generateClaimId(): string {
  claimSeq += 1;
  const year = new Date().getFullYear();
  const seq = String(claimSeq).padStart(6, "0");
  return `CLM-${year}-${seq}`;
}

export function resetClaimIdSequence(maxExisting: number): void {
  claimSeq = maxExisting;
}

export function appendJourney(
  history: ClaimJourneyEntry[],
  entry: Omit<ClaimJourneyEntry, "id">,
): ClaimJourneyEntry[] {
  return [{ ...entry, id: generateId() }, ...history];
}
