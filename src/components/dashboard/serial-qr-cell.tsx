"use client";

import { QrCode } from "lucide-react";
import type { WarrantySerial } from "@/lib/types";

type SerialQrCellProps = {
  serial: WarrantySerial;
  onView: () => void;
};

export function SerialQrCell({ serial, onView }: SerialQrCellProps) {
  const thumbUrl = serial.qrCodeDataUrl ?? null;

  return (
    <div className="flex items-center gap-2">
      {thumbUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbUrl}
          alt=""
          className="h-10 w-10 shrink-0 rounded border border-slate-200 bg-white object-contain"
        />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-slate-200 bg-slate-50 text-slate-400">
          <QrCode className="h-4 w-4" />
        </div>
      )}
      <button
        type="button"
        onClick={onView}
        className="whitespace-nowrap text-xs font-medium text-orange-600 hover:underline"
      >
        View QR
      </button>
    </div>
  );
}
