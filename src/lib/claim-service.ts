import { appendClaimStaging } from "./claim-staging";
import { appendJourney, generateClaimId } from "./claim-id";
import { buildItemDescription } from "./claim-utils";
import { todayDateString } from "./dispatch-utils";
import { generateId } from "./storage";
import {
  hasActiveClaimLock,
  resolveReturnedSerialStatus,
  resolveVoidedSerialStatus,
  warrantyDatesForReplacement,
} from "./warranty-rules";
import type {
  AppData,
  ClaimJourneyEntry,
  ClaimStatusHistoryEntry,
  InternalClaimStatus,
  PartyType,
  WarrantyClaimRecord,
  WarrantySerial,
  WarrantySubType,
} from "./types";

const OPERATOR = "Operator User";

function nowIso() {
  return new Date().toISOString();
}

function statusStep(
  status: InternalClaimStatus,
  notes: string,
  by = OPERATOR,
): ClaimStatusHistoryEntry {
  return { status, changedBy: by, changedAt: nowIso(), notes };
}

function updateSerial(
  serials: WarrantySerial[],
  serialNumber: string,
  patch: Partial<WarrantySerial>,
  journeyEntry?: Omit<ClaimJourneyEntry, "id">,
  incrementClaim = false,
): WarrantySerial[] {
  return serials.map((s) => {
    if (s.serialNumber !== serialNumber) return s;
    const claimHistory = journeyEntry
      ? appendJourney(s.claimHistory ?? [], journeyEntry)
      : (s.claimHistory ?? []);
    return {
      ...s,
      ...patch,
      claimCount: incrementClaim ? s.claimCount + 1 : s.claimCount,
      claimHistory,
    };
  });
}

function baseClaim(
  serial: WarrantySerial,
  partyType: PartyType,
  claimCategory: WarrantyClaimRecord["claimCategory"],
  claimStatus: InternalClaimStatus,
  extra: Partial<WarrantyClaimRecord>,
): WarrantyClaimRecord {
  const claimId = extra.claimId ?? generateClaimId();
  const history: ClaimStatusHistoryEntry[] = extra.statusHistory ?? [
    statusStep(claimStatus, `Claim posted — ${claimStatus}`),
  ];

  return {
    id: generateId(),
    claimId,
    partyType,
    qrCode: serial.qrCode,
    serialNumber: serial.serialNumber,
    itemCode: serial.itemCode,
    itemName: serial.itemName,
    itemDescription: buildItemDescription(serial),
    claimCategory,
    claimStatus,
    statusHistory: history,
    warrantyStartDate: serial.warrantyStartDate,
    warrantyEndDate: serial.warrantyEndDate,
    remarks: "",
    submittedAt: nowIso(),
    submittedBy: OPERATOR,
    ...extra,
  };
}

function appendClaimStatus(
  claim: WarrantyClaimRecord,
  status: InternalClaimStatus,
  notes: string,
): WarrantyClaimRecord {
  return {
    ...claim,
    claimStatus: status,
    statusHistory: [statusStep(status, notes), ...claim.statusHistory],
    closedAt: status === "closed" ? nowIso() : claim.closedAt,
  };
}

/** Single counter swap — SO derived from old unit dispatch when omitted */
export function postCounterClaimSingle(
  data: AppData,
  oldSerial: WarrantySerial,
  newSerial: WarrantySerial,
  cardCode: string,
  dispatchSo?: { salesOrderNumber: string; salesOrderDate: string },
): AppData {
  const salesOrderNumber =
    dispatchSo?.salesOrderNumber ?? oldSerial.salesOrderNumber ?? "";
  const salesOrderDate =
    dispatchSo?.salesOrderDate ?? todayDateString();
  if (!salesOrderNumber) return data;
  return processCounterClaimPair(
    data,
    oldSerial,
    newSerial,
    salesOrderNumber,
    salesOrderDate,
    cardCode,
  );
}

/** Counter claim batch post */
export function postCounterClaimBatch(
  data: AppData,
  pairs: {
    oldSerial: WarrantySerial;
    newSerial: WarrantySerial;
    oldUnitSaleable?: boolean;
    creditNote?: string;
  }[],
  salesOrderNumber: string,
  salesOrderDate: string,
  cardCode: string,
): AppData {
  let next = data;
  for (const pair of pairs) {
    next = processCounterClaimPair(
      next,
      pair.oldSerial,
      pair.newSerial,
      salesOrderNumber,
      salesOrderDate,
      cardCode,
      pair.oldUnitSaleable,
      pair.creditNote,
    );
  }
  return next;
}

export function processCounterClaimPair(
  data: AppData,
  oldSerial: WarrantySerial,
  newSerial: WarrantySerial,
  salesOrderNumber: string,
  salesOrderDate: string,
  cardCode: string,
  _oldUnitSaleable?: boolean,
  creditNote?: string,
): AppData {
  const claimId = generateClaimId();
  const dispatchDate = todayDateString();
  const transferred = warrantyDatesForReplacement(oldSerial);

  let claim = baseClaim(oldSerial, "dealer", "counter-claim", "counter-claim", {
    claimId,
    cardCode,
    warrantySubType: undefined,
    oldSerialNumber: oldSerial.serialNumber,
    newSerialNumber: newSerial.serialNumber,
    salesOrderNumber,
    remarks: `Counter swap: ${oldSerial.serialNumber} → ${newSerial.serialNumber}`,
    creditNote,
    statusHistory: [
      statusStep(
        "counter-claim",
        `Old serial ${oldSerial.serialNumber} received — returned to available`,
      ),
      statusStep(
        "counter-claim",
        `New serial ${newSerial.serialNumber} dispatched (replaced) on ${salesOrderNumber}`,
      ),
    ],
  });

  claim = appendClaimStaging(claim, {
    step: "counter-old-received",
    serialNumber: oldSerial.serialNumber,
    performedBy: OPERATOR,
    notes: `Old unit returned — status available`,
  });

  let serials = updateSerial(
    data.serials,
    oldSerial.serialNumber,
    {
      status: "available",
      replacedBySerial: newSerial.serialNumber,
      activeClaimId: undefined,
    },
    {
      claimId,
      serialNumber: oldSerial.serialNumber,
      action: "Counter claim — old unit replaced (available)",
      claimCategory: "counter-claim",
      claimType: "replace",
      claimStatus: "counter-claim",
      performedBy: OPERATOR,
      performedAt: nowIso(),
      notes: `Replaced by ${newSerial.serialNumber} · claim ${claimId}`,
      cardCode,
    },
    true,
  );

  serials = updateSerial(
    serials,
    newSerial.serialNumber,
    {
      status: "dispatched",
      ...transferred,
      salesOrderNumber,
      dispatchedAt: nowIso(),
      replacedFromSerial: oldSerial.serialNumber,
      activeClaimId: undefined,
    },
    {
      claimId,
      serialNumber: newSerial.serialNumber,
      action: "Counter claim — new unit dispatched (replacement)",
      claimCategory: "counter-claim",
      claimType: "replace",
      claimStatus: "counter-claim",
      performedBy: OPERATOR,
      performedAt: nowIso(),
      notes: `Replaces ${oldSerial.serialNumber} · claim ${claimId}`,
      cardCode,
    },
    false,
  );

  const dispatch = {
    id: generateId(),
    serialNumber: newSerial.serialNumber,
    dispatchChannel: "warehouse" as const,
    salesOrderNumber,
    salesOrderDate,
    dispatchDate,
    dispatchType: "replace-redispatch" as const,
  };

  claim = appendClaimStaging(claim, {
    step: "counter-replace-dispatch",
    newSerialNumber: newSerial.serialNumber,
    salesOrderNumber,
    creditNote,
    performedBy: OPERATOR,
    notes: `New unit dispatched on ${salesOrderNumber}`,
  });

  return {
    ...data,
    serials,
    claims: [...data.claims, claim],
    warrantyDispatches: [...data.warrantyDispatches, dispatch],
  };
}

/** Post dealer repair — Received (serial stays dispatched until in-repair step) */
export function postDealerRepairClaim(
  data: AppData,
  serial: WarrantySerial,
  cardCode: string,
  remarks: string,
): AppData {
  const claimId = generateClaimId();
  const claim = baseClaim(serial, "dealer", "warranty-claim", "received", {
    claimId,
    cardCode,
    warrantySubType: "repair",
    remarks,
    statusHistory: [statusStep("received", "Item received for warranty repair")],
  });

  const serials = updateSerial(
    data.serials,
    serial.serialNumber,
    { status: "dispatched", activeClaimId: claimId },
    {
      claimId,
      serialNumber: serial.serialNumber,
      action: "Warranty repair — received",
      claimCategory: "warranty-claim",
      claimType: "repair",
      claimStatus: "received",
      performedBy: OPERATOR,
      performedAt: nowIso(),
      notes: remarks,
      cardCode,
    },
    true,
  );

  return { ...data, serials, claims: [...data.claims, claim] };
}

/** Received → In-Repair (same serial, warranty dates unchanged) */
export function advanceRepairToInRepair(
  data: AppData,
  claimId: string,
  notes: string,
): AppData {
  const claim = findRepairClaim(data, claimId);
  if (!claim || claim.claimStatus !== "received") return data;

  const updatedClaim = appendClaimStatus(
    claim,
    "in-repair",
    notes || "With repair department",
  );

  const serials = updateSerial(
    data.serials,
    claim.serialNumber,
    { status: "in-repair", activeClaimId: claimId },
    {
      claimId,
      serialNumber: claim.serialNumber,
      action: "Warranty repair — in repair",
      claimCategory: claim.partyType === "customer" ? "customer" : "warranty-claim",
      claimType: "repair",
      claimStatus: "in-repair",
      performedBy: OPERATOR,
      performedAt: nowIso(),
      notes,
      cardCode: claim.cardCode,
      shopifyOrderId: claim.shopifyOrderId,
    },
    false,
  );

  return { ...patchClaimInData(data, claimId, updatedClaim), serials };
}

/** Post dealer refund */
export function postDealerRefundClaim(
  data: AppData,
  serial: WarrantySerial,
  cardCode: string,
  creditNote: string,
  remarks: string,
  returnedUnitSaleable: boolean,
): AppData {
  const claimId = generateClaimId();
  const finalStatus = resolveReturnedSerialStatus(returnedUnitSaleable);
  const claim = baseClaim(serial, "dealer", "warranty-claim", "refund", {
    claimId,
    cardCode,
    warrantySubType: "refund",
    creditNote,
    returnedUnitSaleable,
    remarks,
  });

  const serials = updateSerial(
    data.serials,
    serial.serialNumber,
    { status: finalStatus, activeClaimId: undefined },
    {
      claimId,
      serialNumber: serial.serialNumber,
      action: "Refund — rejected",
      claimCategory: "warranty-claim",
      claimType: "refund",
      claimStatus: "refund",
      performedBy: OPERATOR,
      performedAt: nowIso(),
      notes: creditNote,
      cardCode,
    },
    true,
  );

  return { ...data, serials, claims: [...data.claims, claim] };
}

function canReplaceOldSerial(serial: WarrantySerial, allowFromRepair = false): boolean {
  if (serial.status === "on-hold") {
    return hasActiveClaimLock(serial);
  }
  if (allowFromRepair) {
    return ["dispatched", "in-repair", "in-qc"].includes(serial.status);
  }
  return serial.status === "dispatched" && !hasActiveClaimLock(serial);
}

/** Place serial on hold when routed to Return Dept (replace/refund processing) */
export function holdSerialForReturnProcessing(
  data: AppData,
  serial: WarrantySerial,
  claimId: string,
  notes: string,
): AppData {
  if (!["dispatched", "on-hold"].includes(serial.status)) return data;
  if (hasActiveClaimLock(serial) && serial.activeClaimId !== claimId) return data;

  const serials = updateSerial(
    data.serials,
    serial.serialNumber,
    { status: "on-hold", activeClaimId: claimId },
    {
      claimId,
      serialNumber: serial.serialNumber,
      action: "On hold — Return Dept replace/refund",
      claimCategory: "customer",
      claimType: "replace",
      claimStatus: "on-hold",
      performedBy: OPERATOR,
      performedAt: nowIso(),
      notes,
    },
    false,
  );

  return { ...data, serials };
}

/** Warranty replace — credit note required; SO from old unit dispatch */
export function postWarrantyReplaceClaim(
  data: AppData,
  oldSerial: WarrantySerial,
  newSerial: WarrantySerial,
  cardCode: string,
  creditNote: string,
  remarks: string,
  oldUnitSaleable: boolean,
  dispatchSo: { salesOrderNumber: string; salesOrderDate: string },
): AppData {
  if (!creditNote.trim()) return data;
  return postDealerReplacePair(
    data,
    oldSerial,
    newSerial,
    dispatchSo.salesOrderNumber,
    dispatchSo.salesOrderDate,
    cardCode,
    remarks,
    oldUnitSaleable,
    { creditNote: creditNote.trim() },
  );
}

/** Post dealer replace — SAP credit note, void old serial, same warranty on new */
export function postDealerReplacePair(
  data: AppData,
  oldSerial: WarrantySerial,
  newSerial: WarrantySerial,
  salesOrderNumber: string,
  salesOrderDate: string,
  cardCode: string,
  remarks: string,
  oldUnitSaleable: boolean,
  options?: {
    allowFromRepair?: boolean;
    existingClaimId?: string;
    creditNote?: string;
  },
): AppData {
  if (!canReplaceOldSerial(oldSerial, options?.allowFromRepair)) return data;

  const claimId = options?.existingClaimId ?? generateClaimId();
  const dispatchDate = todayDateString();
  const transferred = warrantyDatesForReplacement(oldSerial);
  const oldFinalStatus = oldUnitSaleable
    ? resolveReturnedSerialStatus(true)
    : resolveVoidedSerialStatus();

  const cn = options?.creditNote?.trim() ?? "";

  let claim = baseClaim(oldSerial, "dealer", "warranty-claim", "replace", {
    claimId,
    cardCode,
    warrantySubType: "replace",
    creditNote: cn || undefined,
    oldSerialNumber: oldSerial.serialNumber,
    newSerialNumber: newSerial.serialNumber,
    salesOrderNumber,
    returnedUnitSaleable: oldUnitSaleable,
    remarks: remarks || `Replace ${oldSerial.serialNumber} → ${newSerial.serialNumber}`,
    statusHistory: [
      statusStep(
        "replace",
        cn
          ? `Warranty replace registered — credit note ${cn}`
          : "Warranty replace registered",
      ),
      statusStep(
        "replace",
        `Old serial ${oldSerial.serialNumber} closed (${oldFinalStatus})`,
      ),
      statusStep(
        "replace",
        `New serial ${newSerial.serialNumber} marked dispatched (replaced)`,
      ),
    ],
  });

  claim = appendClaimStaging(claim, {
    step: "replace-old-voided",
    serialNumber: oldSerial.serialNumber,
    performedBy: OPERATOR,
    notes: `Old serial closed — ${oldFinalStatus}`,
  });

  let serials = updateSerial(
    data.serials,
    oldSerial.serialNumber,
    {
      status: oldFinalStatus,
      replacedBySerial: newSerial.serialNumber,
      activeClaimId: undefined,
    },
    {
      claimId,
      serialNumber: oldSerial.serialNumber,
      action: `Replace — old unit ${oldFinalStatus}`,
      claimCategory: "warranty-claim",
      claimType: "replace",
      claimStatus: "replace",
      performedBy: OPERATOR,
      performedAt: nowIso(),
      notes: `New: ${newSerial.serialNumber}`,
      cardCode,
    },
    true,
  );

  serials = updateSerial(
    serials,
    newSerial.serialNumber,
    {
      status: "dispatched",
      ...transferred,
      salesOrderNumber,
      dispatchedAt: nowIso(),
      replacedFromSerial: oldSerial.serialNumber,
    },
    {
      claimId,
      serialNumber: newSerial.serialNumber,
      action: "Warranty replace — new unit dispatched (replaced)",
      claimCategory: "warranty-claim",
      claimType: "replace",
      claimStatus: "replace",
      performedBy: OPERATOR,
      performedAt: nowIso(),
      notes: cn
        ? `Replaces ${oldSerial.serialNumber} · CN ${cn}`
        : `Replaces ${oldSerial.serialNumber}`,
      cardCode,
    },
    false,
  );

  const dispatch = {
    id: generateId(),
    serialNumber: newSerial.serialNumber,
    dispatchChannel: "warehouse" as const,
    salesOrderNumber,
    salesOrderDate,
    dispatchDate,
    dispatchType: "replace-redispatch" as const,
  };

  claim = appendClaimStaging(claim, {
    step: "replace-dispatch",
    newSerialNumber: newSerial.serialNumber,
    salesOrderNumber,
    creditNote: cn || undefined,
    performedBy: OPERATOR,
    notes: `Replacement dispatched (replaced)${cn ? ` — credit note ${cn}` : ""}`,
  });

  return {
    ...data,
    serials,
    claims: [...data.claims, claim],
    warrantyDispatches: [...data.warrantyDispatches, dispatch],
  };
}

/** Apply approved warranty refresh — extend end date by elapsed months */
export function applyWarrantyRefresh(
  data: AppData,
  serial: WarrantySerial,
  newEndDate: string,
  monthsExtended: number,
  approvedBy: string,
  notes: string,
): AppData {
  const claimId = generateClaimId();
  const claim = baseClaim(serial, "dealer", "warranty-refresh", "approved", {
    claimId,
    remarks: notes,
    statusHistory: [
      statusStep("pending-approval", "Refresh requested"),
      statusStep("approved", `Extended ${monthsExtended} month(s). ${notes}`),
    ],
  });

  const serials = updateSerial(
    data.serials,
    serial.serialNumber,
    {
      warrantyEndDate: newEndDate,
      refreshCount: (serial.refreshCount ?? 0) + 1,
    },
    {
      claimId,
      serialNumber: serial.serialNumber,
      action: `Warranty refresh +${monthsExtended} mo`,
      claimCategory: "warranty-refresh",
      claimStatus: "approved",
      performedBy: approvedBy,
      performedAt: nowIso(),
      notes,
    },
    false,
  );

  return { ...data, serials, claims: [...data.claims, claim] };
}

function findRepairClaim(data: AppData, claimId: string): WarrantyClaimRecord | undefined {
  const claim = data.claims.find((c) => c.claimId === claimId);
  if (!claim || claim.warrantySubType !== "repair") return undefined;
  return claim;
}

function patchClaimInData(
  data: AppData,
  claimId: string,
  updated: WarrantyClaimRecord,
): AppData {
  return {
    ...data,
    claims: data.claims.map((c) => (c.claimId === claimId ? updated : c)),
  };
}

/** In-repair → in QC (serial locked in-qc) */
export function sendRepairToInQc(
  data: AppData,
  claimId: string,
  notes: string,
): AppData {
  const claim = findRepairClaim(data, claimId);
  if (!claim || claim.claimStatus !== "in-repair") return data;

  const updatedClaim = appendClaimStatus(claim, "in-qc", notes || "Sent to quality check");

  const serials = updateSerial(
    data.serials,
    claim.serialNumber,
    { status: "in-qc", activeClaimId: claimId },
    {
      claimId,
      serialNumber: claim.serialNumber,
      action: "Repair complete — in QC",
      claimCategory: claim.partyType === "customer" ? "customer" : "warranty-claim",
      claimType: "repair",
      claimStatus: "in-qc",
      performedBy: OPERATOR,
      performedAt: nowIso(),
      notes,
      cardCode: claim.cardCode,
      shopifyOrderId: claim.shopifyOrderId,
    },
    false,
  );

  return { ...patchClaimInData(data, claimId, updatedClaim), serials };
}

/** QC passed — ready to return (claim repaired, serial stays in-qc until return) */
export function markRepairQcPassed(
  data: AppData,
  claimId: string,
  accessoryReplaced: string,
  notes: string,
): AppData {
  const claim = findRepairClaim(data, claimId);
  if (!claim || claim.claimStatus !== "in-qc") return data;

  const updatedClaim = appendClaimStatus(
    {
      ...claim,
      accessoryReplaced: accessoryReplaced || claim.accessoryReplaced,
    },
    "repaired",
    notes || "QC passed — repair approved",
  );

  const serials = updateSerial(
    data.serials,
    claim.serialNumber,
    { status: "in-qc", activeClaimId: claimId },
    {
      claimId,
      serialNumber: claim.serialNumber,
      action: "QC passed",
      claimCategory: claim.partyType === "customer" ? "customer" : "warranty-claim",
      claimType: "repair",
      claimStatus: "repaired",
      performedBy: OPERATOR,
      performedAt: nowIso(),
      notes: accessoryReplaced,
      cardCode: claim.cardCode,
      shopifyOrderId: claim.shopifyOrderId,
    },
    false,
  );

  return { ...patchClaimInData(data, claimId, updatedClaim), serials };
}

/** @deprecated use markRepairQcPassed after sendRepairToInQc */
export function markClaimRepaired(
  data: AppData,
  claimId: string,
  accessoryReplaced: string,
  notes: string,
): AppData {
  const claim = findRepairClaim(data, claimId);
  if (!claim) return data;
  if (claim.claimStatus === "in-qc") {
    return markRepairQcPassed(data, claimId, accessoryReplaced, notes);
  }
  if (claim.claimStatus === "received") {
    let nextReceived = advanceRepairToInRepair(data, claimId, "Auto advance for legacy action");
    nextReceived = sendRepairToInQc(nextReceived, claimId, "Auto QC for legacy action");
    return markRepairQcPassed(nextReceived, claimId, accessoryReplaced, notes);
  }
  if (claim.claimStatus === "in-repair") {
    let next = sendRepairToInQc(data, claimId, "Auto QC for legacy action");
    return markRepairQcPassed(next, claimId, accessoryReplaced, notes);
  }
  return data;
}

/** Cannot repair → refund (closes repair claim as rerouted) */
export function rerouteRepairToRefund(
  data: AppData,
  claimId: string,
  creditNote: string,
  returnedUnitSaleable: boolean,
  notes: string,
): AppData {
  const claim = findRepairClaim(data, claimId);
  if (!claim || !["received", "in-repair", "in-qc"].includes(claim.claimStatus)) {
    return data;
  }

  const serial = data.serials.find((s) => s.serialNumber === claim.serialNumber);
  if (!serial) return data;

  const finalStatus = resolveReturnedSerialStatus(returnedUnitSaleable);
  const reroutedClaim = appendClaimStatus(
    {
      ...claim,
      reroutedTo: "refund",
      creditNote,
      returnedUnitSaleable,
      closedAt: nowIso(),
    },
    "rerouted",
    notes || `Rerouted to refund — ${creditNote}`,
  );

  const serials = updateSerial(
    data.serials,
    claim.serialNumber,
    { status: finalStatus, activeClaimId: undefined },
    {
      claimId,
      serialNumber: claim.serialNumber,
      action: "Repair rerouted → refund",
      claimCategory: claim.partyType === "customer" ? "customer" : "warranty-claim",
      claimType: "refund",
      claimStatus: "rerouted",
      performedBy: OPERATOR,
      performedAt: nowIso(),
      notes: creditNote,
      cardCode: claim.cardCode,
      shopifyOrderId: claim.shopifyOrderId,
      saleable: returnedUnitSaleable,
    },
    false,
  );

  return { ...patchClaimInData(data, claimId, reroutedClaim), serials };
}

/** Cannot repair → replace (same warranty on new serial) */
export function rerouteRepairToReplace(
  data: AppData,
  claimId: string,
  newSerial: WarrantySerial,
  salesOrderNumber: string,
  salesOrderDate: string,
  oldUnitSaleable: boolean,
  notes: string,
): AppData {
  const claim = findRepairClaim(data, claimId);
  if (!claim || !["received", "in-repair", "in-qc"].includes(claim.claimStatus)) {
    return data;
  }

  const oldSerial = data.serials.find((s) => s.serialNumber === claim.serialNumber);
  if (!oldSerial) return data;

  const reroutedClaim = appendClaimStatus(
    {
      ...claim,
      reroutedTo: "replace",
      oldSerialNumber: oldSerial.serialNumber,
      newSerialNumber: newSerial.serialNumber,
      closedAt: nowIso(),
    },
    "rerouted",
    notes || `Rerouted to replace → ${newSerial.serialNumber}`,
  );

  let next = patchClaimInData(data, claimId, reroutedClaim);
  const cardCode = claim.cardCode ?? claim.shopifyOrderId ?? "CUSTOMER";

  next = postDealerReplacePair(
    next,
    oldSerial,
    newSerial,
    salesOrderNumber,
    salesOrderDate,
    cardCode,
    notes || `Reroute replace from repair ${claim.claimId}`,
    oldUnitSaleable,
    { allowFromRepair: true },
  );

  if (claim.partyType === "customer") {
    const last = next.claims[next.claims.length - 1];
    if (last?.warrantySubType === "replace") {
      next = {
        ...next,
        claims: next.claims.map((c) =>
          c.id === last.id
            ? {
                ...c,
                partyType: "customer",
                shopifyOrderId: claim.shopifyOrderId,
                linkedRequestId: claim.linkedRequestId,
              }
            : c,
        ),
      };
    }
  }

  return next;
}

/** Return repaired unit to dealer/customer — status only, serial dispatched again */
export function returnRepairedToCustomer(
  data: AppData,
  claimId: string,
  notes: string,
): AppData {
  const claim = findRepairClaim(data, claimId);
  if (!claim || claim.claimStatus !== "repaired") return data;

  const updatedClaim = appendClaimStatus(
    claim,
    "closed",
    notes || "Returned to customer / dealer",
  );

  const serials = updateSerial(
    data.serials,
    claim.serialNumber,
    { status: "dispatched", activeClaimId: undefined },
    {
      claimId,
      serialNumber: claim.serialNumber,
      action: "Returned after repair — dispatched again",
      claimCategory: claim.partyType === "customer" ? "customer" : "warranty-claim",
      claimType: "repair",
      claimStatus: "closed",
      performedBy: OPERATOR,
      performedAt: nowIso(),
      notes,
      cardCode: claim.cardCode,
      shopifyOrderId: claim.shopifyOrderId,
    },
    false,
  );

  return { ...patchClaimInData(data, claimId, updatedClaim), serials };
}

/** 7-day replace — same warranty on new serial; old unit per saleable rule */
export function postSevenDayReplaceFromRequest(
  data: AppData,
  oldSerial: WarrantySerial,
  newSerial: WarrantySerial,
  opts: {
    shopifyOrderId?: string;
    linkedRequestId: string;
    requestClaimId: string;
    salesOrderNumber: string;
    salesOrderDate: string;
    remarks: string;
    oldUnitSaleable: boolean;
    creditNote?: string;
  },
): AppData {
  const claimId = opts.requestClaimId;
  const dispatchDate = todayDateString();
  const transferred = warrantyDatesForReplacement(oldSerial);
  let claim = baseClaim(oldSerial, "customer", "seven-day", "replace", {
    claimId,
    shopifyOrderId: opts.shopifyOrderId,
    linkedRequestId: opts.linkedRequestId,
    warrantySubType: "replace",
    creditNote: opts.creditNote,
    oldSerialNumber: oldSerial.serialNumber,
    newSerialNumber: newSerial.serialNumber,
    salesOrderNumber: opts.salesOrderNumber,
    returnedUnitSaleable: opts.oldUnitSaleable,
    remarks: opts.remarks,
    statusHistory: [
      statusStep("received", "7-day claim — customer support"),
      statusStep("replace", opts.remarks),
    ],
  });

  const oldFinalStatus = resolveReturnedSerialStatus(opts.oldUnitSaleable);

  let serials = updateSerial(
    data.serials,
    oldSerial.serialNumber,
    {
      status: oldFinalStatus,
      replacedBySerial: newSerial.serialNumber,
      activeClaimId: undefined,
    },
    {
      claimId,
      serialNumber: oldSerial.serialNumber,
      action: `7-day replace — old unit ${oldFinalStatus}`,
      claimCategory: "seven-day",
      claimType: "replace",
      claimStatus: "replace",
      performedBy: OPERATOR,
      performedAt: nowIso(),
      notes: `New: ${newSerial.serialNumber}`,
      shopifyOrderId: opts.shopifyOrderId,
      saleable: opts.oldUnitSaleable,
    },
    true,
  );

  serials = updateSerial(
    serials,
    newSerial.serialNumber,
    {
      status: "dispatched",
      ...transferred,
      shopifyOrderId: opts.shopifyOrderId ?? newSerial.shopifyOrderId,
      dispatchedAt: nowIso(),
      replacedFromSerial: oldSerial.serialNumber,
    },
    {
      claimId,
      serialNumber: newSerial.serialNumber,
      action: "7-day replace — new unit (same warranty)",
      claimCategory: "seven-day",
      claimType: "replace",
      claimStatus: "replace",
      performedBy: OPERATOR,
      performedAt: nowIso(),
      notes: `Replaces ${oldSerial.serialNumber}`,
      shopifyOrderId: opts.shopifyOrderId,
    },
    false,
  );

  const dispatch = {
    id: generateId(),
    serialNumber: newSerial.serialNumber,
    dispatchChannel: "ecommerce" as const,
    salesOrderNumber: opts.salesOrderNumber,
    salesOrderDate: opts.salesOrderDate,
    dispatchDate,
    shopifyOrderId: opts.shopifyOrderId,
    dispatchType: "replace-redispatch" as const,
  };

  claim = appendClaimStaging(claim, {
    step: "seven-day-replace-dispatch",
    newSerialNumber: newSerial.serialNumber,
    salesOrderNumber: opts.salesOrderNumber,
    creditNote: opts.creditNote,
    performedBy: OPERATOR,
    notes: `7-day replace dispatched — ${opts.remarks}`,
  });

  return {
    ...data,
    serials,
    claims: [...data.claims, claim],
    warrantyDispatches: [...data.warrantyDispatches, dispatch],
  };
}

/** 7-day refund — saleable → available */
export function postSevenDayRefundFromRequest(
  data: AppData,
  serial: WarrantySerial,
  opts: {
    shopifyOrderId?: string;
    linkedRequestId: string;
    requestClaimId: string;
    creditNote: string;
    remarks: string;
    returnedUnitSaleable: boolean;
  },
): AppData {
  const claimId = opts.requestClaimId;
  const finalStatus = resolveReturnedSerialStatus(opts.returnedUnitSaleable);
  const claim = baseClaim(serial, "customer", "seven-day", "refund", {
    claimId,
    shopifyOrderId: opts.shopifyOrderId,
    linkedRequestId: opts.linkedRequestId,
    warrantySubType: "refund",
    creditNote: opts.creditNote,
    returnedUnitSaleable: opts.returnedUnitSaleable,
    remarks: opts.remarks,
    statusHistory: [
      statusStep("received", "7-day claim — customer support"),
      statusStep("refund", opts.remarks),
    ],
  });

  const serials = updateSerial(
    data.serials,
    serial.serialNumber,
    { status: finalStatus, activeClaimId: undefined },
    {
      claimId,
      serialNumber: serial.serialNumber,
      action: "7-day refund",
      claimCategory: "seven-day",
      claimType: "refund",
      claimStatus: "refund",
      performedBy: OPERATOR,
      performedAt: nowIso(),
      notes: opts.creditNote,
      shopifyOrderId: opts.shopifyOrderId,
      saleable: opts.returnedUnitSaleable,
    },
    true,
  );

  return { ...data, serials, claims: [...data.claims, claim] };
}

/** Customer repair post */
export function postCustomerRepairFromRequest(
  data: AppData,
  serial: WarrantySerial,
  opts: {
    shopifyOrderId?: string;
    linkedRequestId: string;
    requestClaimId: string;
    remarks: string;
  },
): AppData {
  const claimId = opts.requestClaimId;
  const claim = baseClaim(serial, "customer", "warranty-claim", "received", {
    claimId,
    shopifyOrderId: opts.shopifyOrderId,
    linkedRequestId: opts.linkedRequestId,
    warrantySubType: "repair",
    remarks: opts.remarks,
    statusHistory: [statusStep("received", "Posted from customer claim request")],
  });

  const serials = updateSerial(
    data.serials,
    serial.serialNumber,
    { status: "dispatched", activeClaimId: claimId },
    {
      claimId,
      serialNumber: serial.serialNumber,
      action: "Customer claim posted — received",
      claimCategory: "customer",
      claimType: "repair",
      claimStatus: "received",
      performedBy: OPERATOR,
      performedAt: nowIso(),
      notes: opts.remarks,
      shopifyOrderId: opts.shopifyOrderId,
    },
    true,
  );

  return { ...data, serials, claims: [...data.claims, claim] };
}

export function postCustomerRefundFromRequest(
  data: AppData,
  serial: WarrantySerial,
  opts: {
    shopifyOrderId?: string;
    linkedRequestId: string;
    requestClaimId: string;
    creditNote: string;
    remarks: string;
    returnedUnitSaleable?: boolean;
  },
): AppData {
  const claimId = opts.requestClaimId;
  const saleable = opts.returnedUnitSaleable ?? false;
  const finalStatus = resolveReturnedSerialStatus(saleable);
  const claim = baseClaim(serial, "customer", "warranty-claim", "refund", {
    claimId,
    shopifyOrderId: opts.shopifyOrderId,
    linkedRequestId: opts.linkedRequestId,
    warrantySubType: "refund",
    creditNote: opts.creditNote,
    returnedUnitSaleable: saleable,
    remarks: opts.remarks,
  });

  const serials = updateSerial(
    data.serials,
    serial.serialNumber,
    { status: finalStatus, activeClaimId: undefined },
    {
      claimId,
      serialNumber: serial.serialNumber,
      action: "Customer refund",
      claimCategory: "customer",
      claimType: "refund",
      claimStatus: "refund",
      performedBy: OPERATOR,
      performedAt: nowIso(),
      notes: opts.creditNote,
      shopifyOrderId: opts.shopifyOrderId,
    },
    true,
  );

  return { ...data, serials, claims: [...data.claims, claim] };
}

export function postCustomerReplaceFromRequest(
  data: AppData,
  oldSerial: WarrantySerial,
  newSerial: WarrantySerial,
  opts: {
    shopifyOrderId?: string;
    linkedRequestId: string;
    requestClaimId: string;
    salesOrderNumber: string;
    salesOrderDate: string;
    remarks: string;
    oldUnitSaleable?: boolean;
    creditNote?: string;
  },
): AppData {
  const result = postDealerReplacePair(
    data,
    oldSerial,
    newSerial,
    opts.salesOrderNumber,
    opts.salesOrderDate,
    opts.shopifyOrderId ?? "SHOPIFY",
    opts.remarks,
    opts.oldUnitSaleable ?? false,
    { creditNote: opts.creditNote, existingClaimId: opts.requestClaimId },
  );
  const last = result.claims[result.claims.length - 1];
  if (!last) return result;
  const claims = result.claims.map((c) =>
    c.id === last.id
      ? {
          ...c,
          partyType: "customer" as const,
          claimId: opts.requestClaimId,
          shopifyOrderId: opts.shopifyOrderId,
          linkedRequestId: opts.linkedRequestId,
        }
      : c,
  );
  return { ...result, claims };
}

export type ReturnDeptReplaceInput =
  | {
      mode: "seven-day";
      oldSerial: WarrantySerial;
      newSerial: WarrantySerial;
      creditNote: string;
      salesOrderNumber: string;
      salesOrderDate: string;
      remarks: string;
      oldUnitSaleable: boolean;
      shopifyOrderId?: string;
      linkedRequestId: string;
      requestClaimId: string;
    }
  | {
      mode: "warranty-dealer";
      oldSerial: WarrantySerial;
      newSerial: WarrantySerial;
      creditNote: string;
      cardCode: string;
      remarks: string;
      oldUnitSaleable: boolean;
      dispatchSo: { salesOrderNumber: string; salesOrderDate: string };
    }
  | {
      mode: "warranty-customer-request";
      oldSerial: WarrantySerial;
      newSerial: WarrantySerial;
      creditNote: string;
      salesOrderNumber: string;
      salesOrderDate: string;
      remarks: string;
      oldUnitSaleable: boolean;
      shopifyOrderId?: string;
      linkedRequestId: string;
      requestClaimId: string;
    };

/** Unified Return Dept replacement — 7-day or warranty */
export function postReturnDeptReplace(
  data: AppData,
  input: ReturnDeptReplaceInput,
): AppData {
  const cn = input.creditNote.trim();
  if (!cn) return data;

  if (input.mode === "seven-day") {
    return postSevenDayReplaceFromRequest(data, input.oldSerial, input.newSerial, {
      shopifyOrderId: input.shopifyOrderId,
      linkedRequestId: input.linkedRequestId,
      requestClaimId: input.requestClaimId,
      salesOrderNumber: input.salesOrderNumber,
      salesOrderDate: input.salesOrderDate,
      remarks: input.remarks,
      oldUnitSaleable: input.oldUnitSaleable,
      creditNote: cn,
    });
  }

  if (input.mode === "warranty-dealer") {
    return postWarrantyReplaceClaim(
      data,
      input.oldSerial,
      input.newSerial,
      input.cardCode,
      cn,
      input.remarks,
      input.oldUnitSaleable,
      input.dispatchSo,
    );
  }

  return postCustomerReplaceFromRequest(data, input.oldSerial, input.newSerial, {
    shopifyOrderId: input.shopifyOrderId,
    linkedRequestId: input.linkedRequestId,
    requestClaimId: input.requestClaimId,
    salesOrderNumber: input.salesOrderNumber,
    salesOrderDate: input.salesOrderDate,
    remarks: input.remarks,
    oldUnitSaleable: input.oldUnitSaleable,
    creditNote: cn,
  });
}

/** @deprecated use postDealerRepairClaim */
export function processRepairClaim(
  data: AppData,
  serial: WarrantySerial,
  accessoryReplaced: string,
  remarks: string,
  cardCode = "CUST-0001",
): AppData {
  const next = postDealerRepairClaim(data, serial, cardCode, remarks);
  const claim = next.claims[next.claims.length - 1];
  if (!claim) return next;
  return markClaimRepaired(next, claim.claimId, accessoryReplaced, remarks);
}

/** @deprecated */
export function processExchangeClaim(
  data: AppData,
  serial: WarrantySerial,
  remarks: string,
): AppData {
  return postDealerRefundClaim(data, serial, "CUST-0001", "", remarks, false);
}

/** @deprecated */
export function processRefundClaim(
  data: AppData,
  serial: WarrantySerial,
  creditNote: string,
  remarks: string,
  returnedUnitSaleable = false,
): AppData {
  return postDealerRefundClaim(
    data,
    serial,
    "CUST-0001",
    creditNote,
    remarks,
    returnedUnitSaleable,
  );
}
