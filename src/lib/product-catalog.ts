import type { WarrantySerial } from "./types";

/** Demo product images — replace with CMS / SAP item images later */
const productImages: Record<string, string> = {
  "ITM-A100":
    "https://images.unsplash.com/photo-1545127398-0009f208cea3?w=400&h=400&fit=crop",
  "ITM-B200":
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
  "ITM-C300":
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop",
  "ITM-D400":
    "https://images.unsplash.com/photo-1511467687858-23d96edac811?w=400&h=400&fit=crop",
  "ITM-E500":
    "https://images.unsplash.com/photo-1608043150521-fc7b3e28e013?w=400&h=400&fit=crop",
  DEFAULT:
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
};

export function getProductImageUrl(itemCode: string): string {
  return productImages[itemCode] ?? productImages.DEFAULT;
}

export function getProductDisplayName(serial: WarrantySerial): string {
  return serial.itemName;
}
