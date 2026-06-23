import { redirect } from "next/navigation";

export default function LegacyClaimRequestsPage() {
  redirect("/dashboard/warranty-claim/customer-support");
}
