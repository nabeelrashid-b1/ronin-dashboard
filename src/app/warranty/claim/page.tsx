import { Suspense } from "react";
import { CustomerClaimForm } from "@/components/warranty/customer-claim-form";

export default function CustomerClaimPage() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-sm text-slate-500">Loading claim form…</p>
      }
    >
      <CustomerClaimForm />
    </Suspense>
  );
}
