"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { PermissionGate } from "@/components/auth/permission-gate";
import { CounterClaimPanel } from "@/components/dashboard/counter-claim-panel";
import { ItemSerialStatusLookup } from "@/components/dashboard/item-serial-status-lookup";
import { WarrantyClaimManagement } from "@/components/dashboard/warranty-claim-management";
import { WarrantyRefreshForm } from "@/components/dashboard/warranty-refresh-form";
import { PERMISSIONS } from "@/config/fields";
import type { WarrantySubType } from "@/lib/types";

type Tab = "counter" | "refresh" | "warranty";

function AfterSalesWarrantyClaimContent() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>("counter");

  const claimParam = searchParams.get("claim");
  const initialClaimSubType =
    claimParam === "replace" || claimParam === "refund" || claimParam === "repair"
      ? (claimParam as WarrantySubType)
      : undefined;

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "warranty" || t === "refresh" || t === "counter") {
      setTab(t);
    }
  }, [searchParams]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "counter", label: "Counter claim" },
    { id: "refresh", label: "Warranty refresh" },
    { id: "warranty", label: "Warranty claims" },
  ];

  return (
    <PermissionGate permission={PERMISSIONS.claimsAfterSales}>
      <PageHeader
        title="Warranty Claim — After-sales"
        description="Counter swap, warranty refresh on receipt, and full warranty claim workflow through dispatch. Staging logs are stored on each Warranty_claim document."
      />

      <div className="mb-6">
        <ItemSerialStatusLookup />
      </div>

      <div className="mb-6 flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-white text-orange-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "counter" && <CounterClaimPanel />}
      {tab === "refresh" && <WarrantyRefreshForm />}
      {tab === "warranty" && (
        <WarrantyClaimManagement initialClaimSubType={initialClaimSubType} />
      )}
    </PermissionGate>
  );
}

export default function AfterSalesWarrantyClaimPage() {
  return (
    <Suspense fallback={null}>
      <AfterSalesWarrantyClaimContent />
    </Suspense>
  );
}
