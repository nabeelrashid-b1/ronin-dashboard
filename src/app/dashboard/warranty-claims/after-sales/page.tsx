import { redirect } from "next/navigation";

export default function LegacyAfterSalesClaimsPage() {
  redirect("/dashboard/warranty-claim/after-sales");
}
