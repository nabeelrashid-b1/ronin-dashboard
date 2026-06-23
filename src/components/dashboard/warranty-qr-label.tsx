"use client";

import type { WarrantySerial } from "@/lib/types";
import {
  WARRANTY_LABEL_MM,
  WARRANTY_QR_MM,
  WARRANTY_STICKER_COPY,
  WARRANTY_STICKER_STYLE,
  formatStickerItemDescription,
} from "@/lib/warranty-qr-label";

type WarrantyQrLabelProps = {
  serial: WarrantySerial;
  className?: string;
};

/** Ronin 17×20 mm warranty sticker — centered layout per official sample artwork. */
export function WarrantyQrLabel({ serial, className = "" }: WarrantyQrLabelProps) {
  const itemDescription = formatStickerItemDescription(serial);

  // alert(`Rendering QR label for serial ${serial.serialNumber} with item description "${itemDescription}". If the QR code does not appear, please check the console for errors and ensure that the serial data is correct.`);
  return (
    <div
      className={`warranty-qr-label ${className}`.trim()}
      style={{
        width: `${WARRANTY_LABEL_MM.width}mm`,
        height: `${WARRANTY_LABEL_MM.height}mm`,
        minWidth: `${WARRANTY_LABEL_MM.width}mm`,
        minHeight: `${WARRANTY_LABEL_MM.height}mm`,
        maxWidth: `${WARRANTY_LABEL_MM.width}mm`,
        maxHeight: `${WARRANTY_LABEL_MM.height}mm`,
        borderRadius: `${WARRANTY_STICKER_STYLE.borderRadiusMm}mm`,
        boxSizing: "border-box",
      }}
      aria-label={`Warranty label ${serial.serialNumber}`}
    >
      <div className="warranty-qr-label__header">
        <span className="warranty-qr-label__header-line">{WARRANTY_STICKER_COPY.scanTo}</span>
        <span className="warranty-qr-label__header-line">{WARRANTY_STICKER_COPY.line1}</span>
        <span className="warranty-qr-label__header-line">{WARRANTY_STICKER_COPY.line2}</span>
      </div>

      <div className="warranty-qr-label__qr-wrap">
        {serial.qrCodeDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={serial.qrCodeDataUrl}
            alt=""
            className="warranty-qr-label__qr"
            style={{ width: `${WARRANTY_QR_MM}mm`, height: `${WARRANTY_QR_MM}mm` }}
          />
        ) : (
          <div
            className="warranty-qr-label__qr warranty-qr-label__qr--placeholder"
            style={{ width: `${WARRANTY_QR_MM}mm`, height: `${WARRANTY_QR_MM}mm` }}
          />
        )}
      </div>

      <p className="warranty-qr-label__serial">{serial.serialNumber}</p>
      <p className="warranty-qr-label__item-desc">{itemDescription}</p>
    </div>
  );
}
