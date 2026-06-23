import { buildQrCodePayload } from "./serial-generator";
import {
  WARRANTY_QR_PIXELS,
  WARRANTY_STICKER_STYLE,
  buildWarrantyCheckQrUrl,
  getWarrantyCheckBaseUrl,
} from "./warranty-qr-label";

const STICKER_QR_RENDER = {
  width: WARRANTY_QR_PIXELS,
  margin: 0,
  errorCorrectionLevel: "M" as const,
  color: {
    dark: WARRANTY_STICKER_STYLE.blue,
    light: WARRANTY_STICKER_STYLE.qrLight,
  },
};

export async function generateQrDataUrls(
  payloads: string[],
): Promise<string[]> {
  const QRCode = (await import("qrcode")).default;
  return Promise.all(
    payloads.map((payload) =>
      QRCode.toDataURL(payload, {
        width: 200,
        margin: 1,
        errorCorrectionLevel: "M",
      }),
    ),
  );
}

/** Single QR data URL for warranty check link. */
export async function generateStickerQrDataUrl(
  serialNumber: string,
  checkBaseUrl?: string,
): Promise<string> {
  const QRCode = (await import("qrcode")).default;
  const base = checkBaseUrl ?? getWarrantyCheckBaseUrl();
  return QRCode.toDataURL(buildWarrantyCheckQrUrl(serialNumber, base), STICKER_QR_RENDER);
}

/** High-resolution QR for 17×20 mm Ronin warranty stickers (warranty check URL). */
export async function generateStickerQrDataUrls(
  serialNumbers: string[],
  checkBaseUrl?: string,
): Promise<string[]> {
  const base = checkBaseUrl ?? getWarrantyCheckBaseUrl();
  return Promise.all(serialNumbers.map((sn) => generateStickerQrDataUrl(sn, base)));
}

export async function generateQrDataUrlsForSerials(
  serials: {
    serialNumber: string;
    itemCode: string;
    itemName: string;
    color: string;
    batchNumber: string;
  }[],
): Promise<string[]> {
  const payloads = serials.map((s) =>
    buildQrCodePayload(
      s.serialNumber,
      s.itemName,
      s.itemCode,
      s.color,
      s.batchNumber,
    ),
  );
  return generateQrDataUrls(payloads);
}

/** Sticker print QR from serial numbers (warranty check URL encoding). */
export async function generateStickerQrDataUrlsForSerials(
  serials: { serialNumber: string }[],
): Promise<string[]> {
  return generateStickerQrDataUrls(serials.map((s) => s.serialNumber));
}
