import { redirect } from "next/navigation";

type Props = { searchParams: Promise<{ tab?: string }> };

export default async function LegacyCustomerSupportClaimsPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const q = tab === "courier" ? "?tab=courier" : "";
  redirect(`/dashboard/warranty-claim/customer-support${q}`);
}
