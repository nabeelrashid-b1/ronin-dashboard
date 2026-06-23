"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, ShieldCheck, AlertCircle } from "lucide-react";
import { useAppDataContext } from "@/components/providers/app-data-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import {
  buildItemDescription,
  formatInternalClaimLabel,
  getReplacementChain,
} from "@/lib/claim-utils";
import { FIELDS } from "@/config/fields";
import { findSerialByScan } from "@/lib/dispatch-utils";
import {
  getProductDisplayName,
  getProductImageUrl,
} from "@/lib/product-catalog";
import {
  lookupForWarrantyCheck,
  type WarrantyCheckLookupResult,
} from "@/lib/warranty-check-eligibility";
import {
  getWarrantyStatusView,
  warrantyStatusLabels,
} from "@/lib/warranty-status";

export function WarrantyCheckForm() {
  const searchParams = useSearchParams();
  const { data, isReady } = useAppDataContext();
  const [query, setQuery] = useState("");
  const [lookup, setLookup] = useState<WarrantyCheckLookupResult | null>(null);

  useEffect(() => {
    const sn = searchParams.get("sn")?.trim();
    if (!sn || !data) return;
    setQuery(sn);
    const found = findSerialByScan(data.serials, sn);
    setLookup(lookupForWarrantyCheck(found));
  }, [searchParams, data]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    const trimmed = query.trim();
    if (!trimmed) return;
    const found = findSerialByScan(data.serials, trimmed);
    setLookup(lookupForWarrantyCheck(found));
  }

  const serial = lookup?.kind === "found" ? lookup.serial : null;
  const isClaimReady = lookup?.kind === "found" && lookup.statusKind === "claim-ready";

  const claimsForSerial =
    lookup?.kind === "found"
      ? data?.claims.filter(
          (c) =>
            c.serialNumber === lookup.serial.serialNumber ||
            c.oldSerialNumber === lookup.serial.serialNumber ||
            c.newSerialNumber === lookup.serial.serialNumber,
        ) ?? []
      : [];

  const statusView = lookup?.kind === "found" ? getWarrantyStatusView(lookup.serial) : null;
  const statusInfo = statusView ? warrantyStatusLabels[statusView] : null;

  const claimHref =
    lookup?.kind === "found" && lookup.canFileClaim
      ? `/warranty/claim?${new URLSearchParams({
          serial: lookup.serial.serialNumber,
          qr: lookup.serial.qrCode,
        }).toString()}`
      : "#";

  const inputClass =
    "flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Check warranty</CardTitle>
          <p className="text-xs text-slate-500">
            Scan any serial to see status. Only <strong>dispatched</strong> units within warranty
            can file a new claim. In-repair, in-QC, on-hold, refunded, and stock units show
            informational status instead.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setLookup(null);
              }}
              placeholder="Scan QR code or enter serial number"
              className={inputClass}
            />
            <button
              type="submit"
              disabled={!isReady}
              className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
            >
              <Search className="h-4 w-4" />
              Check
            </button>
          </form>
          <p className="mt-3 text-xs text-slate-400">
            Demo: dispatched {`ITM-A100-BATCH-001-0002`}, in-repair {`ITM-B200-BATCH-001-0001`},
            replacement new {`ITM-E500-BATCH-001-0004`} (see seed pins).
          </p>
        </CardContent>
      </Card>

      {lookup?.kind === "not-found" && (
        <Card className="border-red-200 bg-red-50/30">
          <CardContent className="py-10 text-center text-sm text-red-700">
            No item found for this QR code / serial number.
          </CardContent>
        </Card>
      )}

      {lookup?.kind === "found" && !isClaimReady && (
        <Card className="border-amber-200 bg-amber-50/40">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-700" />
              <span className="font-semibold text-slate-900">{lookup.headline}</span>
              <StatusBadge status={lookup.serial.status} />
            </div>
            <p className="mt-3 text-sm text-slate-700">{lookup.detail}</p>
            <p className="mt-2 font-mono text-xs text-slate-500">{lookup.serial.serialNumber}</p>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-slate-500">Item</dt>
                <dd>
                  {lookup.serial.itemCode} — {lookup.serial.itemName}
                </dd>
              </div>
              {lookup.serial.warrantyStartDate && (
                <div>
                  <dt className="text-slate-500">Warranty</dt>
                  <dd>
                    {lookup.serial.warrantyStartDate} → {lookup.serial.warrantyEndDate}
                  </dd>
                </div>
              )}
            </dl>
            {lookup.replacementNote && (
              <div className="mt-4 rounded-lg border border-sky-200 bg-sky-50/80 px-3 py-2 text-xs text-sky-900">
                <p className="font-medium">Replacement history</p>
                <p className="mt-1">{lookup.replacementNote}</p>
                {data && (lookup.serial.replacedFromSerial || lookup.serial.replacedBySerial) && (
                  <p className="mt-2 font-mono text-[10px] text-sky-800">
                    Chain:{" "}
                    {getReplacementChain(data.serials, lookup.serial.serialNumber)
                      .map((s) => s.serialNumber)
                      .join(" → ")}
                  </p>
                )}
              </div>
            )}
            {lookup.statusKind === "dispatched-blocked" && statusInfo && (
              <p className="mt-3 text-xs text-slate-600">{statusInfo.description}</p>
            )}
          </CardContent>
        </Card>
      )}

      {lookup?.kind === "found" && isClaimReady && statusInfo && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-[240px_1fr]">
              <div className="relative aspect-square bg-slate-100 md:aspect-auto md:min-h-[280px]">
                <Image
                  src={getProductImageUrl(lookup.serial.itemCode)}
                  alt={getProductDisplayName(lookup.serial)}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex flex-col p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Product
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                      {getProductDisplayName(lookup.serial)}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                      {buildItemDescription(lookup.serial)}
                    </p>
                  </div>
                  <StatusBadge status={lookup.serial.status} />
                </div>

                <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50/50 p-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    <span className="font-semibold text-slate-900">{lookup.headline}</span>
                    <Badge variant="success">Ready to claim</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{lookup.detail}</p>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-xs text-slate-500">Serial / QR ID</dt>
                      <dd className="font-mono text-xs">{lookup.serial.serialNumber}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">Warranty period</dt>
                      <dd>{lookup.serial.warrantyPeriod} months</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">Warranty start</dt>
                      <dd>{lookup.serial.warrantyStartDate || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">Warranty end</dt>
                      <dd>{lookup.serial.warrantyEndDate || "—"}</dd>
                    </div>
                  </dl>
                </div>

                {lookup.replacementNote && (
                  <div className="mt-4 rounded-lg border border-sky-200 bg-sky-50/80 px-3 py-2 text-xs text-sky-900">
                    <p className="font-medium">Replacement history</p>
                    <p className="mt-1">{lookup.replacementNote}</p>
                    {data && (
                      <p className="mt-2 font-mono text-[10px] text-sky-800">
                        Chain:{" "}
                        {getReplacementChain(data.serials, lookup.serial.serialNumber)
                          .map((s) => s.serialNumber)
                          .join(" → ")}
                      </p>
                    )}
                  </div>
                )}

                {claimsForSerial.length > 0 && (
                  <div className="mt-4 text-xs text-slate-500">
                    <p className="font-medium text-slate-700">Related claim history</p>
                    <ul className="mt-1 space-y-0.5">
                      {claimsForSerial.map((c) => (
                        <li key={c.id}>
                          {formatInternalClaimLabel(c)} ·{" "}
                          {new Date(c.submittedAt).toLocaleDateString()} · {c.claimStatus}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-auto pt-6">
                  <Link
                    href={claimHref}
                    className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
                  >
                    Claim warranty
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
