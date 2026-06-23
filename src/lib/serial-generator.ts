import type { SerialGenerationInput, WarrantySerial } from "./types";
import { generateId } from "./storage";
import {
  buildQrCodePayload,
  buildSerialNumber,
  sanitizeSegment,
} from "./serial-format";

export { buildQrCodePayload, buildSerialNumber } from "./serial-format";

export function getNextSequenceForItem(
  existingSerials: WarrantySerial[],
  itemCode: string,
  batchNumber: string,
): number {
  const prefix = `${sanitizeSegment(itemCode)}-${sanitizeSegment(batchNumber)}-`;
  const matching = existingSerials.filter((s) =>
    s.serialNumber.startsWith(prefix),
  );

  if (matching.length === 0) return 1;

  const maxSeq = matching.reduce((max, s) => {
    const part = s.serialNumber.slice(prefix.length);
    const num = parseInt(part, 10);
    return Number.isNaN(num) ? max : Math.max(max, num);
  }, 0);

  return maxSeq + 1;
}

export function createSerialRecords(
  input: SerialGenerationInput,
  existingSerials: WarrantySerial[],
  qrDataUrls: string[],
): WarrantySerial[] {
  const now = new Date().toISOString();
  let sequence = getNextSequenceForItem(
    existingSerials,
    input.itemCode,
    input.batchNumber,
  );

  const records: WarrantySerial[] = [];

  for (let i = 0; i < input.qty; i++) {
    const serialNumber = buildSerialNumber(
      input.itemCode,
      input.batchNumber,
      sequence,
    );
    sequence += 1;

    const qrCode = buildQrCodePayload(
      serialNumber,
      input.itemName.trim(),
      input.itemCode.trim(),
      input.color.trim(),
      input.batchNumber.trim(),
    );

    records.push({
      id: generateId(),
      serialNumber,
      itemCode: input.itemCode.trim(),
      itemName: input.itemName.trim(),
      batchNumber: input.batchNumber.trim(),
      printDate: input.printDate,
      color: input.color.trim(),
      warrantyPeriod: input.warrantyPeriod,
      qrCode,
      qrCodeDataUrl: qrDataUrls[i],
      status: "available",
      claimCount: 0,
      claimHistory: [],
      warrantyStartDate: "",
      warrantyEndDate: "",
      createdAt: now,
    });
  }

  return records;
}
