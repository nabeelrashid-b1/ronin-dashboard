import {
  canReceiveNewWarrantyClaim,
  getNewClaimIneligibilityReason,
  isInWarrantyClaimPipeline,
} from "./warranty-rules";
import {
  canCustomerFileClaim,
  getWarrantyStatusView,
  warrantyStatusLabels,
  type WarrantyStatusView,
} from "./warranty-status";
import type { SerialStatus, WarrantySerial } from "./types";

/** Statuses where customers may see warranty coverage (post-dispatch / in claim). */
export const PUBLIC_WARRANTY_VISIBLE_STATUSES: SerialStatus[] = [
  "dispatched",
  "in-repair",
  "in-qc",
  "on-hold",
];

export function isPublicWarrantyVisible(serial: WarrantySerial): boolean {
  if (!PUBLIC_WARRANTY_VISIBLE_STATUSES.includes(serial.status)) {
    return false;
  }
  if (serial.status === "dispatched") {
    return Boolean(serial.warrantyStartDate?.trim());
  }
  return true;
}

export type PublicWarrantyLookupResult =
  | { kind: "not-found" }
  | {
      kind: "not-eligible";
      headline: string;
      detail: string;
    }
  | {
      kind: "warranty";
      serial: WarrantySerial;
      statusView: WarrantyStatusView;
      inClaimPipeline: boolean;
      canFileClaim: boolean;
      headline: string;
      detail: string;
      replacementNote?: string;
    };

function replacementJourneyNote(serial: WarrantySerial): string | undefined {
  if (serial.replacedFromSerial) {
    return `This unit replaced ${serial.replacedFromSerial}. Warranty dates were carried over from the previous unit.`;
  }
  if (serial.replacedBySerial) {
    return `This serial was replaced by ${serial.replacedBySerial}. Use the new unit for warranty service.`;
  }
  return undefined;
}

export function lookupForPublicWarrantyCheck(
  serial: WarrantySerial | undefined,
): PublicWarrantyLookupResult {
  if (!serial) {
    return { kind: "not-found" };
  }

  if (!isPublicWarrantyVisible(serial)) {
    const isStock = serial.status === "available";
    const isRejected = serial.status === "rejected";
    return {
      kind: "not-eligible",
      headline: isStock ? "Warranty not activated" : "Warranty not available",
      detail: isStock
        ? "This product has not been dispatched yet. Warranty coverage appears here only after your unit is sold and dispatched from an authorized Ronin dealer."
        : isRejected
          ? "This serial is not eligible for warranty lookup."
          : "Only dispatched products and units currently in warranty service can be verified on this page.",
    };
  }

  const statusView = getWarrantyStatusView(serial);
  const inClaimPipeline = isInWarrantyClaimPipeline(serial.status);
  const canFileClaim = canCustomerFileClaim(serial);
  const replacementNote = replacementJourneyNote(serial);
  const statusInfo = warrantyStatusLabels[statusView];

  if (canFileClaim) {
    return {
      kind: "warranty",
      serial,
      statusView,
      inClaimPipeline,
      canFileClaim: true,
      headline: "Your warranty is active",
      detail: statusInfo.description,
      replacementNote,
    };
  }

  if (inClaimPipeline) {
    return {
      kind: "warranty",
      serial,
      statusView,
      inClaimPipeline: true,
      canFileClaim: false,
      headline: statusInfo.label,
      detail: statusInfo.description,
      replacementNote,
    };
  }

  if (serial.status === "dispatched" && !canReceiveNewWarrantyClaim(serial)) {
    const reason =
      getNewClaimIneligibilityReason(serial) ??
      "This unit cannot start a new warranty claim at this time.";
    return {
      kind: "warranty",
      serial,
      statusView,
      inClaimPipeline: false,
      canFileClaim: false,
      headline: statusView === "expired" ? "Warranty expired" : "Warranty on file",
      detail: reason,
      replacementNote,
    };
  }

  return {
    kind: "warranty",
    serial,
    statusView,
    inClaimPipeline,
    canFileClaim: false,
    headline: statusInfo.label,
    detail: statusInfo.description,
    replacementNote,
  };
}
