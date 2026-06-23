import { redirect } from "next/navigation";

export default function LegacyCourierPage() {
  redirect("/dashboard/warranty-claim/customer-support?tab=courier");
}
