"use client";

import { useMemo, useState } from "react";
import { useAppDataContext } from "@/components/providers/app-data-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FIELDS } from "@/config/fields";

export function ClaimDocumentStagingPanel() {
  const { data } = useAppDataContext();
  const [claimId, setClaimId] = useState("");

  const claim = useMemo(
    () => data?.claims.find((c:any) => c.claimId === claimId.trim()),
    [data, claimId],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Warranty_claim staging log</CardTitle>
        <p className="text-xs text-slate-500">
          Document-level staging history (scan, void, dispatch with credit note)
        </p>
      </CardHeader>
      <CardContent>
        <input
          value={claimId}
          onChange={(e) => setClaimId(e.target.value)}
          placeholder="Enter claim ID"
          className="mb-4 w-full max-w-sm rounded-lg border px-3 py-2 text-sm font-mono"
        />
        {claim && (
          <ul className="space-y-2 text-xs text-slate-600">
            {(claim.stagingLog ?? []).length === 0 ? (
              <li className="text-slate-400">No staging entries on this claim yet.</li>
            ) : (
              claim.stagingLog!.map((entry:any, i:any) => (
                <li key={i} className="rounded border border-slate-100 bg-slate-50 p-2">
                  <span className="font-semibold text-slate-800">{entry.step}</span>
                  <span className="text-slate-400"> · {entry.performedAt.slice(0, 16)}</span>
                  {entry.creditNote && (
                    <p>
                      {FIELDS.creditNote.label}: {entry.creditNote}
                    </p>
                  )}
                  {entry.newSerialNumber && <p>New: {entry.newSerialNumber}</p>}
                  <p>{entry.notes}</p>
                </li>
              ))
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
