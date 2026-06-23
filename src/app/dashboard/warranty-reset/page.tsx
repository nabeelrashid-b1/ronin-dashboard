import { redirect } from "next/navigation";

export default function LegacyWarrantyResetPage() {
  redirect("/dashboard/warranty-claim/after-sales");
}
