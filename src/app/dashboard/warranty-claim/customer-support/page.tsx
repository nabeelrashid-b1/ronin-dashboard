import { Suspense } from "react";
import { CustomerSupportWarrantyClaimClient } from "./customer-support-client";

type Props = { searchParams: Promise<{ tab?: string }> };

export default async function CustomerSupportWarrantyClaimPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const initialSection = tab === "courier" ? "courier" : "requests";

  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-500">Loading…</div>}>
      <CustomerSupportWarrantyClaimClient initialSection={initialSection} />
    </Suspense>
  );
}
