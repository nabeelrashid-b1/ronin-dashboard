"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, Search, ShieldCheck } from "lucide-react";
import { useAppDataContext } from "@/components/providers/app-data-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buildItemDescription } from "@/lib/claim-utils";
import { findSerialByScan } from "@/lib/dispatch-utils";
import {
  lookupForPublicWarrantyCheck,
  type PublicWarrantyLookupResult,
} from "@/lib/public-warranty-check";
import {
  getProductDisplayName,
  getProductImageUrl,
} from "@/lib/product-catalog";
import { warrantyStatusLabels } from "@/lib/warranty-status";

export function PublicWarrantyCheck() {
  const searchParams = useSearchParams();
  const { data, isReady } = useAppDataContext();
  const [query, setQuery] = useState("");
  const [lookup, setLookup] = useState<PublicWarrantyLookupResult | null>(null);

  function runLookup(sn: string) {
    if (!data) return;
    const trimmed = sn.trim();
    if (!trimmed) return;
    const found = findSerialByScan(data.serials, trimmed);
    setLookup(lookupForPublicWarrantyCheck(found));
  }

  useEffect(() => {
    const sn = searchParams.get("sn")?.trim();
    if (!sn || !data) return;
    setQuery(sn);
    runLookup(sn);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when URL or data loads
  }, [searchParams, data]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    runLookup(query);
  }

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#25408F] focus:outline-none focus:ring-2 focus:ring-[#25408F]/20";

  const claimHref =
    lookup?.kind === "warranty" && lookup.canFileClaim
      ? `/warranty/claim?${new URLSearchParams({
          serial: lookup.serial.serialNumber,
          qr: lookup.serial.qrCode,
        }).toString()}`
      : "#";

  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">E-Warranty check</h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Scan the QR code on your product label or enter your serial number to view warranty
          coverage.
        </p>
      </div>

      <Card className="mx-auto max-w-xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="block text-xs font-medium text-slate-600" htmlFor="warranty-sn">
              Serial number
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="warranty-sn"
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setLookup(null);
                }}
                placeholder="From QR scan or product label"
                className={inputClass}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!isReady}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#25408F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1e3475] disabled:opacity-50"
              >
                <Search className="h-4 w-4" />
                Check warranty
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {lookup?.kind === "not-found" && (
        <Card className="mx-auto max-w-xl border-red-200 bg-red-50/50">
          <CardContent className="flex items-start gap-3 py-6">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <div>
              <p className="font-semibold text-slate-900">Serial not found</p>
              <p className="mt-1 text-sm text-slate-600">
                We could not find this serial number. Check the label and try again, or contact
                Ronin customer care.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {lookup?.kind === "not-eligible" && (
        <Card className="mx-auto max-w-xl border-slate-200 bg-slate-50/80">
          <CardContent className="flex items-start gap-3 py-6">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
            <div>
              <p className="font-semibold text-slate-900">{lookup.headline}</p>
              <p className="mt-1 text-sm text-slate-600">{lookup.detail}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {lookup?.kind === "warranty" && (
        <Card className="mx-auto w-full max-w-3xl overflow-hidden border-[#25408F]/20 xl:max-w-4xl">
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-[minmax(240px,36%)_1fr]">
              <div className="relative aspect-[4/3] bg-[#E9EAED] sm:aspect-[16/10] lg:aspect-auto lg:min-h-[280px] xl:min-h-[320px]">
                <Image
                  src={getProductImageUrl(lookup.serial.itemCode)}
                  alt={getProductDisplayName(lookup.serial)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 36vw"
                  unoptimized
                />
              </div>
              <div className="flex flex-col p-5 sm:p-6 lg:p-7">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#25408F]">
                  Ronin product
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {getProductDisplayName(lookup.serial)}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {buildItemDescription(lookup.serial)}
                </p>
                <p className="mt-2 font-mono text-xs text-slate-500">
                  {lookup.serial.serialNumber}
                </p>

                <div
                  className={`mt-5 rounded-lg border p-4 ${
                    lookup.canFileClaim
                      ? "border-emerald-200 bg-emerald-50/60"
                      : "border-[#25408F]/15 bg-[#E9EAED]/50"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <ShieldCheck
                      className={`h-5 w-5 ${lookup.canFileClaim ? "text-emerald-600" : "text-[#25408F]"}`}
                    />
                    <span className="font-semibold text-slate-900">{lookup.headline}</span>
                    {lookup.canFileClaim ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="default">
                        {warrantyStatusLabels[lookup.statusView].label}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{lookup.detail}</p>

                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:gap-4 lg:grid-cols-4 lg:gap-x-4">
                    <div>
                      <dt className="text-xs text-slate-500">Warranty start</dt>
                      <dd>{lookup.serial.warrantyStartDate || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">Warranty end</dt>
                      <dd>{lookup.serial.warrantyEndDate || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">Coverage period</dt>
                      <dd>{lookup.serial.warrantyPeriod} months</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">Color</dt>
                      <dd>{lookup.serial.color}</dd>
                    </div>
                  </dl>
                </div>

                {lookup.replacementNote && (
                  <p className="mt-4 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-900">
                    {lookup.replacementNote}
                  </p>
                )}

                {lookup.canFileClaim && (
                  <div className="mt-auto pt-6">
                    <Link
                      href={claimHref}
                      className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      File a warranty claim
                    </Link>
                  </div>
                )}

                {lookup.inClaimPipeline && (
                  <p className="mt-4 text-xs text-slate-500">
                    A warranty service case is already in progress for this unit. Contact Ronin
                    customer care if you need an update.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
