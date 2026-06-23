"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { generateStickerQrDataUrl } from "@/lib/qr";
import { WarrantyQrLabel } from "@/components/dashboard/warranty-qr-label";
import type { WarrantySerial } from "@/lib/types";

type SerialQrViewDialogProps = {
  serial: WarrantySerial | null;
  open: boolean;
  onClose: () => void;
};

export function SerialQrViewDialog({ serial, open, onClose }: SerialQrViewDialogProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
    if (!open || !serial) {
    // alert("Invalid serial data for QR view");
      setQrDataUrl(null);
      return;
    }

    const serialNumber = serial.serialNumber;
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const url = await generateStickerQrDataUrl(serialNumber);
        if (!cancelled) setQrDataUrl(url);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [open, serial]);

  if (!serial) return null;

  const displaySerial: WarrantySerial = {
    ...serial,
    qrCodeDataUrl: qrDataUrl ?? serial.qrCodeDataUrl,
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Warranty QR ${serial.serialNumber}`}
      hideHeader
      size="md"
    >
      <div className="flex items-center justify-center p-3">
        {loading ? (
          <div
            className="warranty-qr-label-preview-host warranty-qr-label-preview-host--modal flex items-center justify-center text-sm font-medium text-[#25408F]"
            aria-busy="true"
          >
            Generating…
          </div>
        ) : (
          <div className="warranty-qr-label-preview-host warranty-qr-label-preview-host--modal">
            <WarrantyQrLabel serial={displaySerial} />
          </div>
        )}
      </div>
    </Dialog>
  );
}
