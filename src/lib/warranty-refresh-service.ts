import { applyWarrantyRefresh } from "./claim-service";
import { todayDateString } from "./dispatch-utils";
import { generateId } from "./storage";
import {
  calculateWarrantyRefreshExtension,
  getWarrantyRefreshPreview,
  type WarrantyRefreshPreview,
} from "./warranty-rules";
import { appendWarrantyRefreshLog } from "./warranty-refresh-log";
import type { AppData, WarrantyRefreshLogEntry, WarrantySerial } from "./types";

export function previewWarrantyRefresh(
  serial: WarrantySerial,
  asOf: Date = new Date(),
  managementOverride = false,
): WarrantyRefreshPreview {
  return getWarrantyRefreshPreview(serial, asOf, managementOverride);
}

export function executeWarrantyRefresh(
  data: AppData,
  serial: WarrantySerial,
  approvedBy: string,
  notes: string,
  refreshDate: string = todayDateString(),
  managementOverride = false,
  forcedMonthsExtended?: number,
): { data: AppData; log: WarrantyRefreshLogEntry } | { error: string } {
  const preview = getWarrantyRefreshPreview(
    serial,
    new Date(refreshDate + "T12:00:00"),
    managementOverride,
  );
  if (!preview.eligible) {
    return { error: preview.reason };
  }

  const monthsToExtend = forcedMonthsExtended ?? preview.monthsToExtend;
  const { newEndDate } = calculateWarrantyRefreshExtension(
    serial.warrantyStartDate,
    serial.warrantyEndDate,
    refreshDate,
  );

  const next = applyWarrantyRefresh(
    data,
    serial,
    newEndDate,
    monthsToExtend,
    approvedBy,
    notes || preview.reason,
  );

  const log: WarrantyRefreshLogEntry = {
    id: generateId(),
    serialNumber: serial.serialNumber,
    qrCode: serial.qrCode,
    previousStartDate: serial.warrantyStartDate,
    previousEndDate: serial.warrantyEndDate,
    newEndDate: preview.proposedEndDate,
    monthsExtended: monthsToExtend,
    warrantyPeriodMonths: serial.warrantyPeriod,
    eligibilityNote: preview.reason,
    approvedBy,
    refreshAt: new Date().toISOString(),
    refreshCount: (serial.refreshCount ?? 0) + 1,
  };

  appendWarrantyRefreshLog(log);

  return { data: next, log };
}
