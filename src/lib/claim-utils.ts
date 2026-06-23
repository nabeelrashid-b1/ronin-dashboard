import {
  INTERNAL_CLAIM_CATEGORY,
  WARRANTY_SUB_TYPE,
} from "@/config/fields";
import { findSerialByScan } from "./dispatch-utils";
import {
  canReceiveNewWarrantyClaim,
  getNewClaimIneligibilityReason,
  hasActiveClaimLock,
  isEligibleForWarrantyRefresh,
  isWithinSevenDaysFromDispatch,
  resolveReturnedSerialStatus,
} from "./warranty-rules";
import { buildItemDescription as formatItemDescription } from "./serial-format";
import type { WarrantyClaimRecord, WarrantySerial } from "./types";

export function buildItemDescription(serial: WarrantySerial): string {
  return formatItemDescription(
    serial.itemName,
    serial.itemCode,
    serial.color,
    serial.batchNumber,
  );
}

export function lookupSerialForClaim(
  serials: WarrantySerial[],
  scanInput: string,
): WarrantySerial | undefined {
  if (!scanInput.trim()) return undefined;
  return findSerialByScan(serials, scanInput);
}

export function isWarrantyActive(serial: WarrantySerial): boolean {
  if (!serial.warrantyEndDate?.trim()) return false;
  return new Date(serial.warrantyEndDate) >= new Date();
}

/** Dealer warranty intake — dispatched, in-warranty, no open claim */
export function canReceiveDealerWarrantyClaim(serial: WarrantySerial): boolean {
  return canReceiveNewWarrantyClaim(serial);
}

export { getNewClaimIneligibilityReason };

/** Return Dept: old unit eligibility (routed = on-hold; direct = dispatched, no open claim) */
export function getReturnDeptOldSerialError(
  serial: WarrantySerial,
  routed: boolean,
): string | null {
  if (routed) {
    if (serial.status !== "on-hold") {
      return `Routed unit must be on hold (current: ${serial.status}).`;
    }
    if (!hasActiveClaimLock(serial)) {
      return "Routed unit has no active claim link — re-route from Customer Support.";
    }
    return null;
  }
  if (serial.status !== "dispatched") {
    return `Old serial must be dispatched for direct replace (current: ${serial.status}).`;
  }
  return getNewClaimIneligibilityReason(serial);
}

export function canProcessReturnDeptOld(serial: WarrantySerial, routed: boolean): boolean {
  return getReturnDeptOldSerialError(serial, routed) === null;
}

export function canProcessCounterOld(serial: WarrantySerial): boolean {
  if (serial.status !== "dispatched") return false;
  if (hasActiveClaimLock(serial)) return false;
  return true;
}

export function canProcessCounterNew(serial: WarrantySerial): boolean {
  return serial.status === "available";
}

export {
  isWithinSevenDaysFromDispatch,
  isEligibleForWarrantyRefresh,
  resolveReturnedSerialStatus,
};

export function formatInternalClaimLabel(claim: WarrantyClaimRecord): string {
  if (claim.claimCategory === "counter-claim") {
    return INTERNAL_CLAIM_CATEGORY.counterClaim.label;
  }
  if (claim.claimCategory === "seven-day") {
    return INTERNAL_CLAIM_CATEGORY.sevenDay.label;
  }
  if (claim.claimCategory === "warranty-refresh") {
    return INTERNAL_CLAIM_CATEGORY.warrantyRefresh.label;
  }
  const sub = Object.values(WARRANTY_SUB_TYPE).find(
    (s) => s.value === claim.warrantySubType,
  );
  return sub?.label ?? INTERNAL_CLAIM_CATEGORY.warrantyClaim.label;
}

/** Walk replacedFromSerial / replacedBySerial — oldest → newest active */
export function getReplacementChain(
  serials: WarrantySerial[],
  serialNumber: string,
): WarrantySerial[] {
  const bySn = new Map(serials.map((s) => [s.serialNumber, s]));
  const chain: WarrantySerial[] = [];
  let current = bySn.get(serialNumber);
  const visited = new Set<string>();

  while (current?.replacedFromSerial && !visited.has(current.serialNumber)) {
    visited.add(current.serialNumber);
    const prev = bySn.get(current.replacedFromSerial);
    if (!prev) break;
    chain.unshift(prev);
    current = prev;
  }

  const active = bySn.get(serialNumber);
  if (active) chain.push(active);

  let next = active?.replacedBySerial;
  while (next && !visited.has(next)) {
    visited.add(next);
    const n = bySn.get(next);
    if (!n) break;
    chain.push(n);
    next = n.replacedBySerial;
  }

  return chain;
}

export function isClaimOpen(claim: WarrantyClaimRecord): boolean {
  return ["received", "in-repair", "in-qc", "repaired"].includes(claim.claimStatus);
}

export function isActiveRepairClaim(claim: WarrantyClaimRecord): boolean {
  return (
    claim.warrantySubType === "repair" &&
    ["received", "in-repair", "in-qc"].includes(claim.claimStatus)
  );
}

export function canRerouteRepair(claim: WarrantyClaimRecord): boolean {
  return isActiveRepairClaim(claim);
}

export type RepairWorkflowStep =
  | "received"
  | "in-repair"
  | "in-qc"
  | "repaired"
  | "closed"
  | "rerouted";

export function getRepairWorkflowStep(claim: WarrantyClaimRecord): RepairWorkflowStep {
  if (claim.claimStatus === "rerouted") return "rerouted";
  if (claim.claimStatus === "closed") return "closed";
  return claim.claimStatus as RepairWorkflowStep;
}
