import { redirect } from "next/navigation";
import WarrantyCheckClient from "./warranty-check-client";

type Props = { searchParams: Promise<{ sn?: string }> };

/** QR scans use public `/check`; legacy dashboard URLs with `?sn=` redirect there. */
export default async function WarrantyCheckPage({ searchParams }: Props) {
  const { sn } = await searchParams;
  if (sn?.trim()) {
    redirect(`/check?sn=${encodeURIComponent(sn.trim())}`);
  }
  return <WarrantyCheckClient />;
}
