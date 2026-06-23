import { buildItemDescription } from "./claim-utils";
import type { WarrantySerial } from "./types";

/** Physical sticker size from Ronin artwork (E-Warranty QR sample). */
export const WARRANTY_LABEL_MM = {
  width: 17,
  height: 20,
} as const;

/** Print sheet layout — labels per row on A4 label reports. */
export const WARRANTY_LABELS_PER_ROW = 5;

/** Label rows that fit on one A4 portrait page (10 mm margins, 20 mm row + 2 mm gap). */
export const WARRANTY_LABEL_ROWS_PER_PAGE = 12;

/** Stickers per printed A4 page (5 × 12). */
export const WARRANTY_LABELS_PER_PAGE =
  WARRANTY_LABELS_PER_ROW * WARRANTY_LABEL_ROWS_PER_PAGE;

/** Gap between stickers on print sheet (mm). */
export const WARRANTY_LABEL_SHEET_GAP_MM = 2;

/** Centered QR block on 17 mm label. */
export const WARRANTY_QR_MM = 9;

/** Bitmap size when generating QR (sharp at print scale). */
export const WARRANTY_QR_PIXELS = 320;

/** Ronin sticker artwork — matches sample PDF/image. */
export const WARRANTY_STICKER_STYLE = {
  blue: "#25408F",
  background: "#E9EAED",
  qrLight: "#E9EAED",
  borderRadiusMm: 1.4,
} as const;

export const WARRANTY_STICKER_COPY = {
  scanTo: "SCAN TO",
  line1: "LOCATE CUSTOMER CARE",
  line2: "& CHECK E-WARRANTY",
} as const;

const DEV_WARRANTY_CHECK_BASE = "http://localhost:3000/check";

/** Public warranty check page base (no query). Set via NEXT_PUBLIC_WARRANTY_CHECK_URL in production. */
export function getWarrantyCheckBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_WARRANTY_CHECK_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "").replace(/\?.*$/, "");
  if (typeof window !== "undefined") {
    return `${window.location.origin}/check`;
  }
  return DEV_WARRANTY_CHECK_BASE;
}

/** Full URL encoded in QR — scan opens warranty check with serial pre-filled. */
export function buildWarrantyCheckQrUrl(
  serialNumber: string,
  baseUrl?: string,
): string {
  const base = (baseUrl ?? getWarrantyCheckBaseUrl()).replace(/\/$/, "").replace(/\?.*$/, "");
  return `${base}?sn=${encodeURIComponent(serialNumber.trim())}`;
}

/** @deprecated use buildWarrantyCheckQrUrl */
export const buildStickerQrEncodePayload = buildWarrantyCheckQrUrl;

/**
 * Item description line on sticker — matches sample:
 * `R-7120 BLACK (00828)` → `{model} {COLOR} ({batch})`
 */
export function formatStickerItemDescription(
  serial: Pick<WarrantySerial, "itemName" | "itemCode" | "color" | "batchNumber">,
): string {
  const batch = formatStickerBatchRef(serial.batchNumber);
  const color = serial.color.trim().toUpperCase();
  const model = formatStickerModelLine(serial);
  return `${model} ${color} (${batch})`;
}

/** Model segment: sample uses short product id (e.g. R-7120); we use item code. */
function formatStickerModelLine(
  serial: Pick<WarrantySerial, "itemName" | "itemCode">,
): string {
  const code = serial.itemCode.trim().toUpperCase();
  if (code) return code;
  return serial.itemName.trim().toUpperCase();
}

/** Full master description (screens / dialogs) — not printed on small sticker. */
export function formatStickerMasterDescription(serial: WarrantySerial): string {
  return buildItemDescription(serial);
}

/** @deprecated use formatStickerItemDescription */
export const formatStickerProductLine = formatStickerItemDescription;

/** Short batch ref in parentheses — sample `00828`; BATCH-001 → `001`. */
export function formatStickerBatchRef(batchNumber: string): string {
  const digits = batchNumber
    .trim()
    .replace(/^BATCH-/i, "")
    .replace(/\D/g, "");
  if (!digits) {
    return batchNumber.trim().replace(/^BATCH-/i, "") || batchNumber.trim();
  }
  if (digits.length >= 5) return digits.slice(-5);
  return digits.padStart(3, "0");
}
