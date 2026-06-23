"use client";

import { useAppDataContext } from "@/components/providers/app-data-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { FIELDS, INTERNAL_CLAIM_CATEGORY, PARTY_TYPE } from "@/config/fields";
import { getReplacementChain } from "@/lib/claim-utils";
import { formatSapCardCodeLabel } from "@/lib/sap-customers";
import type { WarrantyClaimRecord } from "@/lib/types";

export function InternalClaimsTable() {
  const { data, isReady } = useAppDataContext();
  if (!isReady || !data) return null;

  const columns: DataTableColumn<WarrantyClaimRecord>[] = [
    { id: "claimId", header: FIELDS.claimId.label, accessor: (r) => r.claimId, className: "font-mono text-xs" },
    { id: "serial", header: FIELDS.serialNumber.label, accessor: (r) => r.serialNumber, className: "font-mono text-xs" },
    {
      id: "party",
      header: FIELDS.partyType.label,
      accessor: (r) => r.partyType,
      cell: (r) => (r.partyType === "customer" ? PARTY_TYPE.customer.label : PARTY_TYPE.dealer.label),
    },
    {
      id: "track",
      header: FIELDS.cardCode.label,
      accessor: (r) =>
        r.cardCode
          ? formatSapCardCodeLabel(r.cardCode)
          : r.shopifyOrderId ?? "—",
      className: "text-xs",
    },
    {
      id: "category",
      header: FIELDS.claimCategory.label,
      accessor: (r) => r.claimCategory,
      cell: (r) => {
        const label =
          r.claimCategory === "counter-claim"
            ? INTERNAL_CLAIM_CATEGORY.counterClaim.label
            : r.claimCategory === "seven-day"
              ? INTERNAL_CLAIM_CATEGORY.sevenDay.label
              : INTERNAL_CLAIM_CATEGORY.warrantyClaim.label;
        return (
          <Badge variant={r.claimCategory === "seven-day" ? "accent" : "info"}>
            {label}
          </Badge>
        );
      },
    },
    { id: "status", header: FIELDS.claimStatus.label, accessor: (r) => r.claimStatus },
    { id: "subType", header: "Sub type", accessor: (r) => r.warrantySubType ?? "—" },
    {
      id: "swap",
      header: "Old → New",
      accessor: (r) => r.newSerialNumber ?? "—",
      cell: (r) =>
        r.oldSerialNumber && r.newSerialNumber ? (
          <span className="font-mono text-xs">
            {r.oldSerialNumber} → {r.newSerialNumber}
          </span>
        ) : (
          "—"
        ),
    },
    { id: "by", header: FIELDS.performedBy.label, accessor: (r) => r.submittedBy },
    {
      id: "at",
      header: FIELDS.performedAt.label,
      accessor: (r) => new Date(r.submittedAt).toLocaleString(),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Warranty_claim</CardTitle>
        <p className="text-xs text-slate-500">
          Dealer claims by {FIELDS.cardCode.label}; customer by {FIELDS.shopifyOrderId.label}. Replacement chain on serial master.
        </p>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data.claims} pageSize={10} searchPlaceholder="Search claim ID, CardCode, Shopify, serial…" />
        {data.claims.some((c) => c.newSerialNumber) && (
          <p className="mt-3 text-xs text-slate-500">
            Example chain:{" "}
            {getReplacementChain(data.serials, data.claims.find((c) => c.newSerialNumber)?.newSerialNumber ?? "")
              .map((s) => s.serialNumber)
              .join(" → ") || "—"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
