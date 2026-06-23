export function sanitizeSegment(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Human-readable item description encoded in QR for scanner parsing */
export function buildItemDescription(
  itemName: string,
  itemCode: string,
  color: string,
  batchNumber: string,
): string {
  return `${itemName} (${itemCode}) — ${color}, Batch ${batchNumber}`;
}

/** QR payload: unique serial + item description (scope §1.2) */
export function buildQrCodePayload(
  serialNumber: string,
  itemName: string,
  itemCode: string,
  color: string,
  batchNumber: string,
): string {
  const description = buildItemDescription(itemName, itemCode, color, batchNumber);
  return `${serialNumber}|${description}`;
}

export function buildSerialNumber(
  itemCode: string,
  batchNumber: string,
  sequence: number,
): string {
  const code = sanitizeSegment(itemCode);
  const batch = sanitizeSegment(batchNumber);
  const seq = String(sequence).padStart(4, "0");
  return `${code}-${batch}-${seq}`;
}
