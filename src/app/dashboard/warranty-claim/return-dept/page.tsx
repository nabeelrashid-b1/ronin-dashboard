import { redirect } from "next/navigation";

export default function ReturnDeptRedirectPage() {
  redirect("/dashboard/warranty-claim/after-sales?tab=warranty&claim=replace");
}
