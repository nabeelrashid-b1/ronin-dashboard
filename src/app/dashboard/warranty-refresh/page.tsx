import { redirect } from "next/navigation";

export default function LegacyWarrantyRefreshPage() {
  redirect("/dashboard/warranty-claim/after-sales");
}
