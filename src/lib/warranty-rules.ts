import { addCalendarMonths } from "./dispatch-utils";
import type { SerialStatus, WarrantyPeriodMonths, WarrantySerial } from "./types";

/** Max extension per refresh application (scope §3.3 — 1 year cap) */
export const MAX_WARRANTY_REFRESH_EXTENSION_MONTHS = 12;

/** Returned unit: saleable → available, else rejected */
export function resolveReturnedSerialStatus(saleable: boolean): SerialStatus {
  return saleable ? "available" : "rejected";
}

/** Replace / void old unit — permanently out of circulation */
export function resolveVoidedSerialStatus(): SerialStatus {
  return "refunded";
}

/** Serial statuses that block starting a new warranty claim intake */
export const WARRANTY_CLAIM_PIPELINE_STATUSES: SerialStatus[] = [
  "in-repair",
  "in-qc",
  "on-hold",
];

/** Serial cannot be scanned for dispatch, claims, or counter while flagged */
export function isSerialWorkflowBlocked(status: SerialStatus): boolean {
  return ["flagged", "refunded", "rejected", "in-repair", "in-qc", "on-hold"].includes(
    status,
  );
}

export function hasActiveClaimLock(serial: { activeClaimId?: string }): boolean {
  return Boolean(serial.activeClaimId?.trim());
}

export function isInWarrantyClaimPipeline(status: SerialStatus): boolean {
  return WARRANTY_CLAIM_PIPELINE_STATUSES.includes(status);
}

/** 7-day window from dispatch (warranty start) date */
export function isWithinSevenDaysFromDispatch(
  warrantyStartDate: string,
  asOf: Date = new Date(),
): boolean {
  if (!warrantyStartDate?.trim()) return false;
  const start = new Date(warrantyStartDate);
  const limit = new Date(start);
  limit.setDate(limit.getDate() + 7);
  return asOf <= limit;
}

/** Refresh allowed within 7 months + 0 days from dispatch (months used must be &lt; 7) */
export function isEligibleForWarrantyRefresh(
  warrantyStartDate: string,
  asOf: Date = new Date(),
): boolean {
  if (!warrantyStartDate?.trim()) return false;
  const today = asOf.toISOString().slice(0, 10);
  return monthsElapsed(warrantyStartDate, today) < 7;
}

/** Whole months elapsed between two ISO dates (start inclusive) */
export function monthsElapsed(fromDate: string, toDate: string): number {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  let months =
    (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  if (to.getDate() < from.getDate()) months -= 1;
  return Math.max(0, months);
}

/**
 * Push elapsed months forward on end date (refresh rule), capped at 12 months.
 * Product warranty period (14/24) on serial is unchanged.
 */
export function calculateWarrantyRefreshExtension(
  warrantyStartDate: string,
  warrantyEndDate: string,
  refreshDate: string,
): { newEndDate: string; monthsExtended: number } {
  const rawMonths = monthsElapsed(warrantyStartDate, refreshDate);
  const monthsExtended = Math.min(rawMonths, MAX_WARRANTY_REFRESH_EXTENSION_MONTHS);
  const newEndDate = addCalendarMonths(warrantyEndDate, monthsExtended);
  return { newEndDate, monthsExtended };
}

/** Replace / 7-day replace: new serial keeps old warranty dates */
export function warrantyDatesForReplacement(from: WarrantySerial): {
  warrantyStartDate: string;
  warrantyEndDate: string;
  warrantyPeriod: WarrantyPeriodMonths;
} {
  return {
    warrantyStartDate: from.warrantyStartDate,
    warrantyEndDate: from.warrantyEndDate,
    warrantyPeriod: from.warrantyPeriod,
  };
}

export function canReceiveNewWarrantyClaim(serial: {
  status: SerialStatus;
  warrantyEndDate: string;
  activeClaimId?: string;
}): boolean {
  if (hasActiveClaimLock(serial)) return false;
  if (isInWarrantyClaimPipeline(serial.status)) return false;
  if (isSerialWorkflowBlocked(serial.status)) return false;
  if (serial.status !== "dispatched") return false;
  if (!serial.warrantyEndDate?.trim()) return false;
  return new Date(serial.warrantyEndDate) >= new Date();
}

export function blocksNewClaimStatus(status: SerialStatus): boolean {
  return isSerialWorkflowBlocked(status) || status === "exchanged";
}

/** User-facing reason when a serial cannot start a new warranty claim */
export function getNewClaimIneligibilityReason(serial: {
  status: SerialStatus;
  warrantyEndDate: string;
  activeClaimId?: string;
  fraudLockout?: WarrantySerial["fraudLockout"];
}): string | null {
  if (serial.fraudLockout || serial.status === "flagged") {
    return "Serial is flagged (courier fraud investigation) — claims blocked.";
  }
  if (hasActiveClaimLock(serial)) {
    return `Open warranty claim in progress (${serial.activeClaimId}) — cannot start another claim.`;
  }
  if (serial.status === "on-hold") {
    return "Serial is on hold for replace/refund — complete processing at Return Dept first.";
  }
  if (serial.status === "in-repair" || serial.status === "in-qc") {
    return `Serial is ${serial.status} — complete the current repair claim before starting a new one.`;
  }
  if (serial.status === "refunded" || serial.status === "rejected") {
    return `Serial status is "${serial.status}" — not eligible for warranty claims.`;
  }
  if (serial.status === "exchanged") {
    return "Serial was exchanged — not eligible for a new warranty claim.";
  }
  if (serial.status !== "dispatched") {
    return `Serial must be dispatched (current: ${serial.status}).`;
  }
  if (!serial.warrantyEndDate?.trim()) {
    return "Warranty not activated (no end date).";
  }
  if (new Date(serial.warrantyEndDate) < new Date()) {
    return "Warranty period has expired.";
  }
  return null;
}

export type WarrantyRefreshPreview = {
  eligible: boolean;
  reason: string;
  monthsUsed: number;
  monthsToExtend: number;
  currentEndDate: string;
  proposedEndDate: string;
  dispatchDate: string;
  warrantyPeriodMonths: WarrantyPeriodMonths;
  refreshCount: number;
  requiresManagementApproval: boolean;
};

/** Preview refresh before apply — eligibility + extension math */
export function getWarrantyRefreshPreview(
  serial: WarrantySerial,
  asOf: Date = new Date(),
  managementOverride = false,
): WarrantyRefreshPreview {
  const dispatchDate = serial.warrantyStartDate;
  const refreshDateStr = asOf.toISOString().slice(0, 10);
  const refreshCount = serial.refreshCount ?? 0;
  const withinWindow = dispatchDate?.trim()
    ? isEligibleForWarrantyRefresh(dispatchDate, asOf)
    : false;
  const requiresManagementApproval = Boolean(
    dispatchDate?.trim() && !withinWindow && !managementOverride,
  );

  if (!dispatchDate?.trim()) {
    return {
      eligible: false,
      reason: "Warranty not activated (no dispatch date).",
      monthsUsed: 0,
      monthsToExtend: 0,
      currentEndDate: serial.warrantyEndDate,
      proposedEndDate: serial.warrantyEndDate,
      dispatchDate: "",
      warrantyPeriodMonths: serial.warrantyPeriod,
      refreshCount,
      requiresManagementApproval: false,
    };
  }

  if (serial.status === "flagged") {
    return {
      eligible: false,
      reason: "Serial is flagged (courier fraud investigation) — refresh blocked.",
      monthsUsed: monthsElapsed(dispatchDate, refreshDateStr),
      monthsToExtend: 0,
      currentEndDate: serial.warrantyEndDate,
      proposedEndDate: serial.warrantyEndDate,
      dispatchDate,
      warrantyPeriodMonths: serial.warrantyPeriod,
      refreshCount,
      requiresManagementApproval: false,
    };
  }

  if (serial.status !== "dispatched") {
    return {
      eligible: false,
      reason: `Serial must be dispatched (current: ${serial.status}).`,
      monthsUsed: monthsElapsed(dispatchDate, refreshDateStr),
      monthsToExtend: 0,
      currentEndDate: serial.warrantyEndDate,
      proposedEndDate: serial.warrantyEndDate,
      dispatchDate,
      warrantyPeriodMonths: serial.warrantyPeriod,
      refreshCount,
      requiresManagementApproval,
    };
  }

  if (!withinWindow && !managementOverride) {
    return {
      eligible: false,
      reason:
        "Not eligible — refresh only within 7 months of dispatch, or enter a valid management approval token.",
      monthsUsed: monthsElapsed(dispatchDate, refreshDateStr),
      monthsToExtend: 0,
      currentEndDate: serial.warrantyEndDate,
      proposedEndDate: serial.warrantyEndDate,
      dispatchDate,
      warrantyPeriodMonths: serial.warrantyPeriod,
      refreshCount,
      requiresManagementApproval: true,
    };
  }

  const monthsUsed = monthsElapsed(dispatchDate, refreshDateStr);
  const { newEndDate, monthsExtended } = calculateWarrantyRefreshExtension(
    dispatchDate,
    serial.warrantyEndDate,
    refreshDateStr,
  );

  return {
    eligible: true,
    reason: managementOverride && !withinWindow
      ? `Management override: extend end date by ${monthsExtended} month(s) (capped at ${MAX_WARRANTY_REFRESH_EXTENSION_MONTHS}). Product warranty remains ${serial.warrantyPeriod} months.`
      : `Eligible: ${monthsUsed} month(s) used since dispatch → extend end date by ${monthsExtended} month(s). Product warranty remains ${serial.warrantyPeriod} months.`,
    monthsUsed,
    monthsToExtend: monthsExtended,
    currentEndDate: serial.warrantyEndDate,
    proposedEndDate: newEndDate,
    dispatchDate,
    warrantyPeriodMonths: serial.warrantyPeriod,
    refreshCount,
    requiresManagementApproval: false,
  };
}
