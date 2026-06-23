import { redirect } from "next/navigation";

export default function LegacyClaimsPage() {
  redirect("/dashboard/warranty-claim/after-sales");
}
