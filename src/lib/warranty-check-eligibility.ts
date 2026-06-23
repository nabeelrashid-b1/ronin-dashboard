import {
  canReceiveNewWarrantyClaim,
  getNewClaimIneligibilityReason,
} from "./warranty-rules";
import type { SerialStatus, WarrantySerial } from "./types";

export type WarrantyCheckStatusKind =
  | "claim-ready"
  | "dispatched-blocked"
  | "in-repair"
  | "in-qc"
  | "on-hold"
  | "refunded"
  | "rejected"
  | "flagged"
  | "available"
  | "exchanged"
  | "not-dispatched";

export type WarrantyCheckLookupResult =
  | { kind: "not-found" }
  | {
      kind: "found";
      serial: WarrantySerial;
      statusKind: WarrantyCheckStatusKind;
      canFileClaim: boolean;
      headline: string;
      detail: string;
      /** Prior unit / replacement journey when relevant */
      replacementNote?: string;
    };

function replacementJourneyNote(serial: WarrantySerial): string | undefined {
  if (serial.replacedFromSerial) {
    return `This unit replaced ${serial.replacedFromSerial}. Warranty dates were transferred from the prior unit; a warranty claim was already processed on the old serial.`;
  }
  if (serial.replacedBySerial) {
    return `This serial was replaced by ${serial.replacedBySerial} and is no longer the active dispatched unit for new claims.`;
  }
  return undefined;
}

function statusKindFor(serial: WarrantySerial): WarrantyCheckStatusKind {
  if (serial.status === "dispatched") {
    return canReceiveNewWarrantyClaim(serial) ? "claim-ready" : "dispatched-blocked";
  }
  if (serial.status === "in-repair") return "in-repair";
  if (serial.status === "in-qc") return "in-qc";
  if (serial.status === "on-hold") return "on-hold";
  if (serial.status === "refunded") return "refunded";
  if (serial.status === "rejected") return "rejected";
  if (serial.status === "flagged") return "flagged";
  if (serial.status === "available") return "available";
  if (serial.status === "exchanged") return "exchanged";
  return "not-dispatched";
}

const statusCopy: Record<
  Exclude<WarrantyCheckStatusKind, "claim-ready" | "dispatched-blocked">,
  { headline: string; detail: string }
> = {
  "in-repair": {
    headline: "In repair",
    detail:
      "This unit is with RONIN for warranty repair. You cannot start a new claim until repair is completed and the unit is returned.",
  },
  "in-qc": {
    headline: "In QC",
    detail:
      "Repair is complete and quality check is in progress. New warranty claims cannot be filed until QC finishes.",
  },
  "on-hold": {
    headline: "On hold (Return Dept)",
    detail:
      "Replace or refund is in progress at Return. Complete processing before starting another warranty claim.",
  },
  refunded: {
    headline: "Refunded / voided",
    detail:
      "This serial was voided after replace or refund and cannot be used for warranty claim intake.",
  },
  rejected: {
    headline: "Rejected",
    detail: "Defective / unsaleable — this serial is permanently closed from warranty claims.",
  },
  flagged: {
    headline: "Flagged (investigation)",
    detail:
      "Courier fraud lockout — this serial is blocked from dispatch and all standard claims.",
  },
  available: {
    headline: "Not dispatched",
    detail:
      "This item is in stock (available) and has not been dispatched to a customer. Only dispatched units are eligible for warranty claim intake.",
  },
  exchanged: {
    headline: "Exchanged",
    detail: "This serial was exchanged and is not eligible for a new warranty claim.",
  },
  "not-dispatched": {
    headline: "Not ready for claim",
    detail: "Only dispatched units with active warranty can start a new claim.",
  },
};

export function lookupForWarrantyCheck(
  serial: WarrantySerial | undefined,
): WarrantyCheckLookupResult {
  if (!serial) return { kind: "not-found" };

  const statusKind = statusKindFor(serial);
  const replacementNote = replacementJourneyNote(serial);

  if (statusKind === "claim-ready") {
    return {
      kind: "found",
      serial,
      statusKind,
      canFileClaim: true,
      headline: "Eligible for warranty claim",
      detail:
        "This unit is dispatched and within warranty. You can file a new claim on this serial.",
      replacementNote,
    };
  }

  if (statusKind === "dispatched-blocked") {
    const reason =
      getNewClaimIneligibilityReason(serial) ??
      "This dispatched unit is not eligible for a new claim right now.";
    return {
      kind: "found",
      serial,
      statusKind,
      canFileClaim: false,
      headline: "Dispatched — claim not available",
      detail: reason,
      replacementNote,
    };
  }

  const copy = statusCopy[statusKind];
  return {
    kind: "found",
    serial,
    statusKind,
    canFileClaim: false,
    headline: copy.headline,
    detail: copy.detail,
    replacementNote,
  };
}

/** @deprecated Use lookup result statusKind; only dispatched is claim-intake eligible */
export const WARRANTY_CHECK_CLAIM_READY_STATUS: SerialStatus = "dispatched";
