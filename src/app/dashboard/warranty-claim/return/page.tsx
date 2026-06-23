import { redirect } from "next/navigation";

/** Legacy route — replace/refund lives under After-sales → Warranty claims → Replace */
export default function ReturnPage() {
  redirect("/dashboard/warranty-claim/after-sales?tab=warranty&claim=replace");
}
