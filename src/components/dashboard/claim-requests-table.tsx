"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getWarrantyClaimRequests } from "@/lib/warranty-claim-request";
import type { WarrantyClaimRequest } from "@/lib/types";

export function ClaimRequestsTable() {
  const [requests, setRequests] = useState<WarrantyClaimRequest[]>([]);

  useEffect(() => {
    setRequests(getWarrantyClaimRequests());
  }, []);

  useEffect(() => {
    const refresh = () => setRequests(getWarrantyClaimRequests());
    window.addEventListener("storage", refresh);
    window.addEventListener("ronin-demo-reset", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("ronin-demo-reset", refresh);
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Warranty_Claim_Request (customer)</CardTitle>
        <p className="text-xs text-slate-500">
          {requests.length} pending customer submission(s)
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Serial</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    No customer claim requests yet
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <p className="font-medium">{r.fullName}</p>
                      <p className="text-xs text-slate-500">{r.contactNumber}</p>
                    </td>
                    <td className="px-4 py-3">{r.productName}</td>
                    <td className="px-4 py-3 font-mono text-xs">{r.serialNumber}</td>
                    <td className="px-4 py-3 capitalize">
                      {(r.requestIntakeType ?? r.claimType ?? "warranty").replace("-", " ")}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="warning">{r.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(r.submittedAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
