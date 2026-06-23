import { CUSTOMER_REQUEST_STATUS, REQUEST_INTAKE_TYPE } from "@/config/fields";
import { isWithinSevenDaysFromDispatch } from "./warranty-rules";
import type {
  PurchaseFrom,
  RequestIntakeType,
  WarrantyClaimRequest,
  WarrantySerial,
} from "./types";

export type SupportPostType = "replace" | "refund" | "repair";

export function isSevenDayIntake(req: WarrantyClaimRequest): boolean {
  return req.requestIntakeType === REQUEST_INTAKE_TYPE.sevenDay.value;
}

export function isWarrantyIntake(req: WarrantyClaimRequest): boolean {
  return req.requestIntakeType === REQUEST_INTAKE_TYPE.warranty.value;
}

/** 7-day: online or official outlet only */
export function isValidSevenDayPurchaseChannel(purchaseFrom: PurchaseFrom): boolean {
  return purchaseFrom === "online" || purchaseFrom === "official-outlet";
}

export function validateSevenDayRequest(
  req: WarrantyClaimRequest,
  serial: WarrantySerial | undefined,
): string | null {
  if (!isSevenDayIntake(req)) return "Not a 7-day request.";
  if (!serial) return "Serial not found in master.";
  if (!isValidSevenDayPurchaseChannel(req.purchaseFrom)) {
    return "7-day claims apply to online or official outlet purchases only.";
  }
  if (!serial.warrantyStartDate?.trim()) {
    return "Item has no dispatch date — not eligible for 7-day claim.";
  }
  if (!isWithinSevenDaysFromDispatch(serial.warrantyStartDate)) {
    return "7-day window expired (must be within 7 days of dispatch date).";
  }
  if (serial.status !== "dispatched" && serial.status !== "on-hold") {
    return `Serial status is "${serial.status}" — must be dispatched for 7-day claim.`;
  }
  return null;
}

export function getSupportPostOptions(req: WarrantyClaimRequest): SupportPostType[] {
  if (isSevenDayIntake(req)) return ["replace", "refund"];
  return ["repair", "replace", "refund"];
}

/** Warranty requests: after-sales posts repair */
export function canSupportPostToClaim(req: WarrantyClaimRequest): boolean {
  if (isSevenDayIntake(req)) return false;
  return (
    req.status === CUSTOMER_REQUEST_STATUS.routedAfterSales.value ||
    req.status === CUSTOMER_REQUEST_STATUS.accepted.value ||
    req.status === CUSTOMER_REQUEST_STATUS.inRepair.value
  );
}

export function canRouteToAfterSales(req: WarrantyClaimRequest): boolean {
  return (
    isWarrantyIntake(req) &&
    !req.postedClaimId &&
    ["submitted", "under-review", "accepted"].includes(req.status)
  );
}

/** Route to Return screen (after-sales) for replace or refund */
export function canRouteToReturn(req: WarrantyClaimRequest): boolean {
  return (
    !req.postedClaimId &&
    ["submitted", "under-review", "accepted"].includes(req.status)
  );
}

/** @deprecated use canRouteToReturn */
export const canRouteToReturnDept = canRouteToReturn;

export function isRoutedToReturn(req: WarrantyClaimRequest): boolean {
  return req.status === CUSTOMER_REQUEST_STATUS.routedReturnDept.value;
}

/** @deprecated use isRoutedToReturn */
export const isRoutedToReturnDept = isRoutedToReturn;
