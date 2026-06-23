import { Badge } from "./badge";
import { getSerialStatusLabel } from "@/lib/warranty-status";
import type { SerialStatus } from "@/lib/types";

const variants: Record<
  SerialStatus,
  "success" | "info" | "warning" | "danger" | "accent" | "default"
> = {
  available: "success",
  dispatched: "info",
  "in-repair": "warning",
  "in-qc": "warning",
  refunded: "warning",
  flagged: "danger",
  rejected: "danger",
  "on-hold": "danger",
  exchanged: "warning",
};

export function StatusBadge({ status }: { status: SerialStatus }) {
  return (
    <Badge variant={variants[status] ?? "default"}>
      {getSerialStatusLabel(status)}
    </Badge>
  );
}
