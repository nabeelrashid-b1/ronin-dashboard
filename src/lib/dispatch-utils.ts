import type { WarrantyPeriodMonths, WarrantySerial } from "./types";

export function parseSerialFromScan(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  if (trimmed.includes("|")) {
    return trimmed.split("|")[0]?.trim() ?? "";
  }

  const fromUrl = parseSerialFromWarrantyCheckUrl(trimmed);
  if (fromUrl) return fromUrl;

  return trimmed;
}

/** Consumer sticker QR: `https://warranty.ronin.com/check?sn=...` */
export function parseSerialFromWarrantyCheckUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  try {
    const url = trimmed.includes("://")
      ? new URL(trimmed)
      : new URL(trimmed.startsWith("?") ? `https://warranty.local${trimmed}` : `https://warranty.local/?${trimmed}`);
    const sn = url.searchParams.get("sn")?.trim();
    if (sn) return sn;
  } catch {
    /* fall through */
  }

  const match = trimmed.match(/(?:\?|&)sn=([^&\s#]+)/i);
  if (match?.[1]) {
    try {
      return decodeURIComponent(match[1]).trim();
    } catch {
      return match[1].trim();
    }
  }

  return "";
}

export function addMonthsToDate(isoDate: string, months: WarrantyPeriodMonths): string {
  return addCalendarMonths(isoDate, months);
}

/** Add arbitrary month count (e.g. warranty refresh extension) */
export function addCalendarMonths(isoDate: string, months: number): string {
  const d = new Date(isoDate + "T12:00:00");
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

export function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function findSerialByScan(
  serials: WarrantySerial[],
  scanInput: string,
): WarrantySerial | undefined {
  const parsed = parseSerialFromScan(scanInput);
  if (!parsed) return undefined;

  const upper = parsed.toUpperCase();
  const scanTrim = scanInput.trim();
  const fromUrl = parseSerialFromWarrantyCheckUrl(scanTrim);

  return serials.find(
    (s) =>
      s.serialNumber.toUpperCase() === upper ||
      (fromUrl && s.serialNumber.toUpperCase() === fromUrl.toUpperCase()) ||
      s.qrCode.toUpperCase() === scanTrim.toUpperCase() ||
      s.qrCode.toUpperCase().startsWith(`${upper}|`),
  );
}

export type DispatchScanError =
  | "empty"
  | "not-found"
  | "not-available"
  | "already-dispatched"
  | "duplicate-session"
  | "qty-exceeded"
  | "flagged";

export function validateDispatchScan(
  serial: WarrantySerial | undefined,
  sessionSerials: string[],
  scannedCount: number,
  orderQty: number,
): DispatchScanError | null {
  if (!serial) return "not-found";
  if (serial.status === "flagged") return "flagged";
  if (serial.status !== "available") {
    return serial.status === "dispatched" ? "already-dispatched" : "not-available";
  }
  if (sessionSerials.includes(serial.serialNumber)) return "duplicate-session";
  if (scannedCount >= orderQty) return "qty-exceeded";
  return null;
}

export const dispatchErrorMessages: Record<DispatchScanError, string> = {
  empty: "Scan or enter a QR code / serial number.",
  "not-found": "Serial not found in Warranty Master table.",
  "not-available": "Serial is not available for dispatch.",
  "already-dispatched": "This serial has already been dispatched.",
  "duplicate-session": "This serial was already scanned for this sales order.",
  "qty-exceeded":
    "Sales order quantity is full — scan rejected (cannot exceed SO qty).",
  flagged: "Serial is flagged (courier fraud investigation) and cannot be dispatched.",
};
