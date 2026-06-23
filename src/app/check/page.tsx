import { Suspense } from "react";
import { PublicWarrantyCheck } from "@/components/warranty/public-warranty-check";

export default function PublicWarrantyCheckPage() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-sm text-slate-500">Loading warranty check…</p>
      }
    >
      <PublicWarrantyCheck />
    </Suspense>
  );
}
