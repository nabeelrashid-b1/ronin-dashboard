import { generateId } from "./storage";
import type { AppData, CourierExceptionRecord, WarrantySerial } from "./types";

export type CourierFraudInput = {
  riderId: string;
  courierTrackingCode: string;
  reportNote: string;
  reportFileName?: string;
  lockedBy: string;
};

export function canFlagCourierFraud(serial: WarrantySerial | undefined): string | null {
  if (!serial) return "Serial not found.";
  if (serial.status === "flagged") return "Serial is already flagged.";
  if (serial.status !== "dispatched") {
    return "Only dispatched units (failed delivery return) can be fraud-locked.";
  }
  return null;
}

/** Failed delivery + tamper — lock serial as Flagged; never revert to Available */
export function flagCourierFraud(
  data: AppData,
  serial: WarrantySerial,
  input: CourierFraudInput,
): AppData {
  const err = canFlagCourierFraud(serial);
  if (err) throw new Error(err);

  const lockedAt = new Date().toISOString();
  const fraudLockout = {
    riderId: input.riderId.trim(),
    courierTrackingCode: input.courierTrackingCode.trim(),
    reportNote: input.reportNote.trim(),
    reportFileName: input.reportFileName?.trim() || undefined,
    lockedAt,
    lockedBy: input.lockedBy.trim(),
  };

  const record: CourierExceptionRecord = {
    id: generateId(),
    serialNumber: serial.serialNumber,
    qrCode: serial.qrCode,
    ...fraudLockout,
  };

  const serials = data.serials.map((s) =>
    s.serialNumber === serial.serialNumber
      ? {
          ...s,
          status: "flagged" as const,
          fraudLockout,
          activeClaimId: undefined,
        }
      : s,
  );

  return {
    ...data,
    serials,
    courierExceptions: [...(data.courierExceptions ?? []), record],
    auditLogs: [
      {
        id: generateId(),
        action: "COURIER_FRAUD_LOCKOUT",
        module: "Courier",
        details: `Flagged ${serial.serialNumber} — rider ${fraudLockout.riderId}, tracking ${fraudLockout.courierTrackingCode}`,
        performedBy: input.lockedBy,
        performedAt: lockedAt,
      },
      ...data.auditLogs,
    ],
  };
}
