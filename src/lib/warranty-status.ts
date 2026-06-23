import { SERIAL_STATUS } from "@/config/fields";
import { blocksNewClaimStatus, canReceiveNewWarrantyClaim } from "./warranty-rules";
import type { SerialStatus, WarrantySerial } from "./types";

export type WarrantyStatusView =
  | "not-activated"
  | "active"
  | "expired"
  | "in-repair"
  | "in-qc"
  | "on-hold"
  | "flagged"
  | "refunded"
  | "rejected";

export function getWarrantyStatusView(serial: {
  status: SerialStatus;
  warrantyStartDate: string;
  warrantyEndDate: string;
}): WarrantyStatusView {
  if (serial.status === "in-repair") return "in-repair";
  if (serial.status === "in-qc") return "in-qc";
  if (serial.status === "flagged") return "flagged";
  if (serial.status === "refunded") return "refunded";
  if (serial.status === "rejected") return "rejected";
  if (serial.status === "on-hold") return "on-hold";
  if (serial.status === "exchanged") return "refunded";
  if (serial.status === "available" || !serial.warrantyStartDate?.trim()) {
    return "not-activated";
  }
  if (serial.warrantyEndDate?.trim()) {
    return new Date(serial.warrantyEndDate) >= new Date() ? "active" : "expired";
  }
  return "not-activated";
}

export function canCustomerFileClaim(serial: WarrantySerial): boolean {
  if (blocksNewClaimStatus(serial.status)) return false;
  return canReceiveNewWarrantyClaim(serial);
}

export const warrantyStatusLabels: Record<
  WarrantyStatusView,
  { label: string; description: string; tone: "success" | "warning" | "danger" | "neutral" | "info" }
> = {
  "not-activated": {
    label: "Not activated",
    description: "Warranty has not been activated for this item yet.",
    tone: "neutral",
  },
  active: {
    label: "Within warranty",
    description: "Your product is covered under the current warranty period.",
    tone: "success",
  },
  expired: {
    label: "Warranty expired",
    description: "The warranty period for this item has ended.",
    tone: "danger",
  },
  "in-repair": {
    label: "In repair / processing",
    description: "This item is with RONIN for warranty repair. New claims cannot be filed until it is returned.",
    tone: "warning",
  },
  "in-qc": {
    label: "In QC",
    description: "Repair completed — quality check in progress.",
    tone: "warning",
  },
  "on-hold": {
    label: "On hold",
    description:
      "Replace or refund in progress at Return Dept — new warranty claims cannot be started until processing completes.",
    tone: "warning",
  },
  flagged: {
    label: "Flagged (investigation)",
    description:
      "Courier fraud lockout — this serial is blocked from dispatch and all standard claims.",
    tone: "danger",
  },
  refunded: {
    label: "Refunded / voided",
    description: "This serial was voided after replace or refund and cannot be scanned again.",
    tone: "warning",
  },
  rejected: {
    label: "Rejected",
    description: "Defective / unsaleable — permanently locked from transactional scanning.",
    tone: "danger",
  },
};

export function getSerialStatusLabel(status: SerialStatus): string {
  const entry = Object.values(SERIAL_STATUS).find((s) => s.value === status);
  return entry?.label ?? status;
}
