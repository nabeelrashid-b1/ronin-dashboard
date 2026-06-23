/**
 * Curated demo scenarios — all WMS document types populated for training / QA.
 * Applied on top of base seed in buildFullSeedData().
 */

import { buildItemDescription } from "./claim-utils";
import { addMonthsToDate } from "./dispatch-utils";
import { buildQrCodePayload, buildSerialNumber } from "./serial-format";
import { generateId } from "./storage";
import type {
  AuditLog,
  ClaimJourneyEntry,
  WarrantyClaimRecord,
  WarrantyClaimRequest,
  WarrantyDispatchRecord,
  WarrantySerial,
} from "./types";

function isoDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function isoDateTime(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

function findSerial(serials: WarrantySerial[], sn: string): WarrantySerial | undefined {
  return serials.find((s) => s.serialNumber === sn);
}

function patchSerial(
  serials: WarrantySerial[],
  sn: string,
  patch: Partial<WarrantySerial>,
): void {
  const i = serials.findIndex((s) => s.serialNumber === sn);
  if (i < 0) return;
  serials[i] = { ...serials[i], ...patch };
}

function journey(
  claimId: string,
  serialNumber: string,
  action: string,
  category: WarrantyClaimRecord["claimCategory"] | "customer",
  status: string,
  daysAgo: number,
  extra?: Partial<ClaimJourneyEntry>,
): ClaimJourneyEntry {
  return {
    id: generateId(),
    claimId,
    serialNumber,
    action,
    claimCategory: category,
    claimStatus: status,
    performedBy: "Operator User",
    performedAt: isoDateTime(daysAgo),
    notes: action,
    ...extra,
  };
}

/** Pinned serial numbers used in demo walkthroughs */
export const DEMO_SERIAL_PINS = {
  available: "ITM-A100-BATCH-001-0001",
  dispatched: "ITM-A100-BATCH-001-0002",
  inRepair: "ITM-B200-BATCH-001-0001",
  inQc: "ITM-B200-BATCH-001-0002",
  onHoldReplace: "ITM-C300-BATCH-001-0001",
  onHoldRefund: "ITM-D400-BATCH-001-0001",
  replaceOld: "ITM-E500-BATCH-001-0003",
  replaceNew: "ITM-E500-BATCH-001-0004",
  sevenDay: "ITM-A100-BATCH-002-0001",
  counterOld: "ITM-C300-BATCH-002-0003",
  counterNew: "ITM-C300-BATCH-002-0004",
} as const;

type SeedBundle = {
  serials: WarrantySerial[];
  claims: WarrantyClaimRecord[];
  claimRequests: WarrantyClaimRequest[];
  warrantyDispatches: WarrantyDispatchRecord[];
  auditLogs?: AuditLog[];
};

function baseClaimFromSerial(
  s: WarrantySerial,
  claimId: string,
  overrides: Partial<WarrantyClaimRecord>,
): WarrantyClaimRecord {
  return {
    id: generateId(),
    claimId,
    partyType: "dealer",
    qrCode: s.qrCode,
    serialNumber: s.serialNumber,
    itemCode: s.itemCode,
    itemName: s.itemName,
    itemDescription: buildItemDescription(s),
    claimCategory: "warranty-claim",
    claimStatus: "received",
    statusHistory: [
      {
        status: "received",
        changedBy: "Operator User",
        changedAt: isoDateTime(5),
        notes: "Seed claim opened",
      },
    ],
    warrantyStartDate: s.warrantyStartDate,
    warrantyEndDate: s.warrantyEndDate,
    remarks: "Demo scenario claim",
    submittedAt: isoDateTime(5),
    submittedBy: "Operator User",
    ...overrides,
  };
}

function applySerialScenarioPatches(serials: WarrantySerial[]): void {
  const dispatchRecent = isoDate(4);
  const dispatchWeek = isoDate(10);

  patchSerial(serials, DEMO_SERIAL_PINS.available, {
    status: "available",
    warrantyStartDate: "",
    warrantyEndDate: "",
    salesOrderNumber: undefined,
    dispatchedAt: undefined,
    dispatchChannel: undefined,
    activeClaimId: undefined,
    claimCount: 0,
    claimHistory: [],
  });

  patchSerial(serials, DEMO_SERIAL_PINS.dispatched, {
    status: "dispatched",
    warrantyStartDate: dispatchWeek,
    warrantyEndDate: addMonthsToDate(dispatchWeek, 24),
    salesOrderNumber: "SO-10001",
    dispatchChannel: "warehouse",
    dispatchedAt: isoDateTime(10),
    activeClaimId: undefined,
    claimCount: 0,
    claimHistory: [],
  });

  patchSerial(serials, DEMO_SERIAL_PINS.inRepair, {
    status: "in-repair",
    warrantyStartDate: dispatchWeek,
    warrantyEndDate: addMonthsToDate(dispatchWeek, 14),
    salesOrderNumber: "SO-10002",
    dispatchChannel: "outlet",
    activeClaimId: "CLM-DEMO-REPAIR-01",
    claimCount: 1,
    claimHistory: [
      journey(
        "CLM-DEMO-REPAIR-01",
        DEMO_SERIAL_PINS.inRepair,
        "Warranty repair — in repair",
        "warranty-claim",
        "in-repair",
        3,
        { claimType: "repair" },
      ),
    ],
  });

  patchSerial(serials, DEMO_SERIAL_PINS.inQc, {
    status: "in-qc",
    warrantyStartDate: dispatchWeek,
    warrantyEndDate: addMonthsToDate(dispatchWeek, 14),
    salesOrderNumber: "SO-10002",
    dispatchChannel: "warehouse",
    activeClaimId: "CLM-DEMO-REPAIR-02",
    claimCount: 1,
    claimHistory: [
      journey(
        "CLM-DEMO-REPAIR-02",
        DEMO_SERIAL_PINS.inQc,
        "Warranty repair — in QC",
        "warranty-claim",
        "in-qc",
        2,
        { claimType: "repair" },
      ),
    ],
  });

  patchSerial(serials, DEMO_SERIAL_PINS.onHoldReplace, {
    status: "on-hold",
    warrantyStartDate: dispatchWeek,
    warrantyEndDate: addMonthsToDate(dispatchWeek, 24),
    salesOrderNumber: "SO-10003",
    dispatchChannel: "ecommerce",
    shopifyOrderId: "SHOP-10042",
    activeClaimId: "CLM-REQ-RETURN-REP",
    claimCount: 1,
    claimHistory: [
      journey(
        "CLM-REQ-RETURN-REP",
        DEMO_SERIAL_PINS.onHoldReplace,
        "Routed to Return — replace pending",
        "customer",
        "on-hold",
        1,
      ),
    ],
  });

  patchSerial(serials, DEMO_SERIAL_PINS.onHoldRefund, {
    status: "on-hold",
    warrantyStartDate: dispatchWeek,
    warrantyEndDate: addMonthsToDate(dispatchWeek, 24),
    salesOrderNumber: "SO-10004",
    dispatchChannel: "warehouse",
    activeClaimId: "CLM-REQ-RETURN-REF",
    claimCount: 1,
    claimHistory: [
      journey(
        "CLM-REQ-RETURN-REF",
        DEMO_SERIAL_PINS.onHoldRefund,
        "Routed to Return — refund pending",
        "customer",
        "on-hold",
        1,
      ),
    ],
  });

  patchSerial(serials, DEMO_SERIAL_PINS.sevenDay, {
    status: "dispatched",
    warrantyStartDate: dispatchRecent,
    warrantyEndDate: addMonthsToDate(dispatchRecent, 24),
    salesOrderNumber: "SO-10010",
    dispatchChannel: "ecommerce",
    shopifyOrderId: "SHOP-10099",
    dispatchedAt: isoDateTime(4),
    activeClaimId: undefined,
    claimCount: 0,
  });

  const replaceOld = findSerial(serials, DEMO_SERIAL_PINS.replaceOld);
  const replaceNew = findSerial(serials, DEMO_SERIAL_PINS.replaceNew);
  if (replaceOld && replaceNew) {
    const transferredStart = dispatchWeek;
    const transferredEnd = addMonthsToDate(transferredStart, replaceOld.warrantyPeriod);
    patchSerial(serials, DEMO_SERIAL_PINS.replaceOld, {
      status: "available",
      warrantyStartDate: transferredStart,
      warrantyEndDate: transferredEnd,
      salesOrderNumber: "SO-10005",
      replacedBySerial: DEMO_SERIAL_PINS.replaceNew,
      activeClaimId: undefined,
      claimCount: 2,
      claimHistory: [
        journey(
          "CLM-DEMO-REPLACE-01",
          DEMO_SERIAL_PINS.replaceOld,
          "Warranty replace — old unit available (replaced)",
          "warranty-claim",
          "replace",
          8,
          { claimType: "replace", cardCode: "C00004" },
        ),
      ],
    });
    patchSerial(serials, DEMO_SERIAL_PINS.replaceNew, {
      status: "dispatched",
      warrantyStartDate: transferredStart,
      warrantyEndDate: transferredEnd,
      salesOrderNumber: "SO-10012",
      dispatchChannel: "warehouse",
      dispatchedAt: isoDateTime(6),
      replacedFromSerial: DEMO_SERIAL_PINS.replaceOld,
      activeClaimId: undefined,
      claimCount: 1,
      claimHistory: [
        journey(
          "CLM-DEMO-REPLACE-01",
          DEMO_SERIAL_PINS.replaceNew,
          "Warranty replace — new dispatched (replaced)",
          "warranty-claim",
          "replace",
          6,
          { claimType: "replace", cardCode: "C00004" },
        ),
      ],
    });
  }

  const counterOld = findSerial(serials, DEMO_SERIAL_PINS.counterOld);
  const counterNew = findSerial(serials, DEMO_SERIAL_PINS.counterNew);
  if (counterOld && counterNew) {
    const start = dispatchWeek;
    const end = addMonthsToDate(start, counterOld.warrantyPeriod);
    patchSerial(serials, DEMO_SERIAL_PINS.counterOld, {
      status: "available",
      salesOrderNumber: "SO-10008",
      replacedBySerial: DEMO_SERIAL_PINS.counterNew,
      claimCount: 1,
      claimHistory: [
        journey(
          "CLM-DEMO-COUNTER-01",
          DEMO_SERIAL_PINS.counterOld,
          "Counter claim — old available",
          "counter-claim",
          "counter-claim",
          12,
        ),
      ],
    });
    patchSerial(serials, DEMO_SERIAL_PINS.counterNew, {
      status: "dispatched",
      warrantyStartDate: start,
      warrantyEndDate: end,
      salesOrderNumber: "SO-10013",
      dispatchChannel: "outlet",
      replacedFromSerial: DEMO_SERIAL_PINS.counterOld,
      dispatchedAt: isoDateTime(11),
      claimCount: 1,
    });
  }
}

function buildScenarioClaims(serials: WarrantySerial[]): WarrantyClaimRecord[] {
  const extra: WarrantyClaimRecord[] = [];
  const sRepair = findSerial(serials, DEMO_SERIAL_PINS.inRepair);
  const sQc = findSerial(serials, DEMO_SERIAL_PINS.inQc);
  const sDispatched = findSerial(serials, DEMO_SERIAL_PINS.dispatched);
  const sRepOld = findSerial(serials, DEMO_SERIAL_PINS.replaceOld);
  const sRepNew = findSerial(serials, DEMO_SERIAL_PINS.replaceNew);

  if (sRepair && sQc) {
    extra.push(
      baseClaimFromSerial(sRepair, "CLM-DEMO-REPAIR-01", {
        warrantySubType: "repair",
        claimStatus: "in-repair",
        cardCode: "C00002",
        statusHistory: [
          { status: "received", changedBy: "Operator User", changedAt: isoDateTime(6), notes: "Received" },
          { status: "in-repair", changedBy: "Operator User", changedAt: isoDateTime(3), notes: "With repair dept" },
        ],
      }),
      baseClaimFromSerial(sQc, "CLM-DEMO-REPAIR-02", {
        warrantySubType: "repair",
        claimStatus: "in-qc",
        cardCode: "C00002",
        accessoryReplaced: "USB cable",
        statusHistory: [
          { status: "received", changedBy: "Operator User", changedAt: isoDateTime(5), notes: "Received" },
          { status: "in-repair", changedBy: "Operator User", changedAt: isoDateTime(4), notes: "Repair done" },
          { status: "in-qc", changedBy: "Operator User", changedAt: isoDateTime(2), notes: "QC in progress" },
        ],
      }),
    );
  }

  if (sRepOld && sRepNew) {
    extra.push({
      ...baseClaimFromSerial(sRepOld, "CLM-DEMO-REPLACE-01", {
        warrantySubType: "replace",
        claimStatus: "replace",
        creditNote: "CN-2026-0005",
        cardCode: "C00004",
        oldSerialNumber: sRepOld.serialNumber,
        newSerialNumber: sRepNew.serialNumber,
        salesOrderNumber: "SO-10012",
      }),
      statusHistory: [
        { status: "replace", changedBy: "Return User", changedAt: isoDateTime(7), notes: "CN-2026-0005" },
        { status: "replace", changedBy: "Return User", changedAt: isoDateTime(6), notes: "New unit dispatched" },
      ],
      stagingLog: [
        {
          step: "replace-old-voided",
          serialNumber: sRepOld.serialNumber,
          performedBy: "Return User",
          performedAt: isoDateTime(7),
          notes: "Old returned — available",
        },
        {
          step: "replace-dispatch",
          newSerialNumber: sRepNew.serialNumber,
          salesOrderNumber: "SO-10012",
          creditNote: "CN-2026-0005",
          performedBy: "Return User",
          performedAt: isoDateTime(6),
          notes: "Replacement dispatched",
        },
      ],
    });
  }

  const sCntOld = findSerial(serials, DEMO_SERIAL_PINS.counterOld);
  if (sCntOld) {
    extra.push(
      baseClaimFromSerial(sCntOld, "CLM-DEMO-COUNTER-01", {
        claimCategory: "counter-claim",
        claimStatus: "counter-claim",
        cardCode: "C00006",
        oldSerialNumber: DEMO_SERIAL_PINS.counterOld,
        newSerialNumber: DEMO_SERIAL_PINS.counterNew,
        salesOrderNumber: "SO-10013",
      }),
    );
  }

  if (sDispatched) {
    extra.push(
      baseClaimFromSerial(sDispatched, "CLM-DEMO-REPAIR-03", {
        warrantySubType: "repair",
        claimStatus: "repaired",
        cardCode: "C00001",
        accessoryReplaced: "Ear cushions",
        statusHistory: [
          { status: "received", changedBy: "Operator User", changedAt: isoDateTime(8), notes: "Received" },
          { status: "in-repair", changedBy: "Operator User", changedAt: isoDateTime(6), notes: "Repaired" },
          { status: "repaired", changedBy: "Operator User", changedAt: isoDateTime(4), notes: "Ready to return" },
        ],
        closedAt: isoDateTime(4),
      }),
    );
  }

  const refunded = serials.find((s) => s.status === "refunded" && !extra.some((c) => c.serialNumber === s.serialNumber));
  if (refunded) {
    extra.push(
      baseClaimFromSerial(refunded, "CLM-DEMO-REFUND-01", {
        warrantySubType: "refund",
        claimStatus: "refund",
        creditNote: "CN-2026-0002",
        cardCode: "C00003",
        returnedUnitSaleable: false,
      }),
    );
  }

  return extra;
}

function buildScenarioClaimRequests(serials: WarrantySerial[]): WarrantyClaimRequest[] {
  const mk = (
    id: string,
    claimId: string,
    serial: WarrantySerial,
    intake: "seven-day" | "warranty",
    status: WarrantyClaimRequest["status"],
    extra: Partial<WarrantyClaimRequest> = {},
  ): WarrantyClaimRequest => {
    const isSevenDay = intake === "seven-day";
    const dispatchRecent = isoDate(4);
    const warrantyStart = isSevenDay ? dispatchRecent : serial.warrantyStartDate;
    const warrantyEnd = isSevenDay
      ? addMonthsToDate(dispatchRecent, serial.warrantyPeriod)
      : serial.warrantyEndDate;

    return {
      id,
      claimId,
      requestIntakeType: intake,
      fullName: extra.fullName ?? "Demo Customer",
      qrCode: serial.qrCode,
      serialNumber: serial.serialNumber,
      productName: serial.itemName,
      itemCode: serial.itemCode,
      itemDescription: buildItemDescription(serial),
      purchaseFrom: isSevenDay ? "online" : "official-outlet",
      email: `${claimId.toLowerCase()}@demo.example`,
      contactNumber: "+971 50 000 0001",
      shopifyOrderId: isSevenDay ? "SHOP-10099" : serial.shopifyOrderId,
      problemDescription: isSevenDay
        ? "7-day issue — CS routes replace/refund to Return."
        : "Warranty issue — repair or Return routing.",
      warrantyStartDate: warrantyStart,
      warrantyEndDate: warrantyEnd,
      warrantyStatusAtSubmit: isSevenDay ? "Within 7-day window" : "Active warranty",
      status,
      statusHistory: [
        {
          status: "submitted",
          changedBy: "Customer",
          changedAt: isoDateTime(3),
          notes: "Online submission",
        },
        {
          status,
          changedBy: status === "submitted" ? "Customer" : "Customer Support",
          changedAt: isoDateTime(2),
          notes: `Demo status: ${status}`,
        },
      ],
      submittedAt: isoDateTime(3),
      reviewedBy: status !== "submitted" ? "Customer Support" : undefined,
      reviewedAt: status !== "submitted" ? isoDateTime(2) : undefined,
      ...extra,
    };
  };

  const seven = findSerial(serials, DEMO_SERIAL_PINS.sevenDay)!;
  const onRep = findSerial(serials, DEMO_SERIAL_PINS.onHoldReplace)!;
  const onRef = findSerial(serials, DEMO_SERIAL_PINS.onHoldRefund)!;
  const plainDisp = findSerial(serials, DEMO_SERIAL_PINS.dispatched)!;

  return [
    mk("seed-cr-7d-sub", "CLM-REQ-7D-001", seven, "seven-day", "submitted", {
      fullName: "Layla Hassan",
      problemDescription: "7-day — CS: route replace to Return with saleable flag.",
    }),
    mk("seed-cr-7d-rep", "CLM-REQ-7D-002", seven, "seven-day", "routed-return-dept", {
      fullName: "Omar Farooq",
      routedResolution: "replace",
      returnedUnitSaleable: true,
      problemDescription: "Routed replace — complete on Return screen.",
    }),
    mk("seed-cr-7d-ref", "CLM-REQ-7D-003", onRef, "seven-day", "routed-return-dept", {
      fullName: "Nina Patel",
      routedResolution: "refund",
      returnedUnitSaleable: false,
      problemDescription: "7-day refund routed — Return posts with credit note.",
    }),
    mk("seed-cr-war-sub", "CLM-REQ-WAR-001", plainDisp, "warranty", "submitted", {
      fullName: "James Wilson",
      problemDescription: "Warranty repair — route to After-sales.",
    }),
    mk("seed-cr-war-as", "CLM-REQ-WAR-002", plainDisp, "warranty", "routed-after-sales", {
      fullName: "Sara Malik",
      problemDescription: "With After-sales for repair intake.",
    }),
    mk("seed-cr-war-ret", "CLM-REQ-WAR-003", onRep, "warranty", "routed-return-dept", {
      fullName: "Ahmed Khan",
      routedResolution: "replace",
      returnedUnitSaleable: true,
      problemDescription: "Warranty replace via Return (not CS post).",
    }),
    mk("seed-cr-war-ref", "CLM-REQ-WAR-004", onRef, "warranty", "routed-return-dept", {
      fullName: "Priya Sharma",
      routedResolution: "refund",
      returnedUnitSaleable: true,
      problemDescription: "Warranty refund — Return screen.",
    }),
    mk("seed-cr-7d-closed", "CLM-REQ-7D-099", seven, "seven-day", "closed", {
      fullName: "Closed 7-day (historical)",
      postedClaimId: "CLM-REQ-7D-099",
      problemDescription: "Already completed in seed.",
    }),
  ];
}

function mergeClaims(
  base: WarrantyClaimRecord[],
  scenario: WarrantyClaimRecord[],
): WarrantyClaimRecord[] {
  const byId = new Map(base.map((c) => [c.claimId, c]));
  for (const c of scenario) {
    byId.set(c.claimId, c);
  }
  return Array.from(byId.values());
}

function appendReplaceDispatches(
  serials: WarrantySerial[],
  existing: WarrantyDispatchRecord[],
): WarrantyDispatchRecord[] {
  const out = [...existing];
  const replaceNew = findSerial(serials, DEMO_SERIAL_PINS.replaceNew);
  const counterNew = findSerial(serials, DEMO_SERIAL_PINS.counterNew);
  for (const s of [replaceNew, counterNew]) {
    if (!s?.salesOrderNumber || !s.warrantyStartDate) continue;
    const has = out.some(
      (d) => d.serialNumber === s.serialNumber && d.dispatchType === "replace-redispatch",
    );
    if (has) continue;
    out.push({
      id: generateId(),
      serialNumber: s.serialNumber,
      dispatchChannel: s.dispatchChannel ?? "warehouse",
      salesOrderNumber: s.salesOrderNumber,
      salesOrderDate: isoDate(8),
      dispatchDate: s.warrantyStartDate,
      shopifyOrderId: s.shopifyOrderId,
      dispatchType: "replace-redispatch",
    });
  }
  return out;
}

function appendScenarioAuditLogs(existing: AuditLog[]): AuditLog[] {
  return [
    ...existing,
    {
      id: "seed-a-scenario",
      action: "SEED_SCENARIOS",
      module: "Demo Data",
      details:
        "Pinned serials: available, dispatched, replace chain, on-hold, 7-day, counter claim, CS/Return requests",
      performedBy: "System",
      performedAt: isoDateTime(0),
    },
  ];
}

const SCENARIO_REQUEST_SERIALS = new Set<string>([
  DEMO_SERIAL_PINS.sevenDay,
  DEMO_SERIAL_PINS.onHoldReplace,
  DEMO_SERIAL_PINS.onHoldRefund,
  DEMO_SERIAL_PINS.dispatched,
]);

/** Apply all curated scenarios to base seed output */
export function enrichSeedWithScenarios(bundle: SeedBundle): SeedBundle {
  applySerialScenarioPatches(bundle.serials);

  const scenarioClaims = buildScenarioClaims(bundle.serials);
  const claims = mergeClaims(bundle.claims, scenarioClaims);
  const scenarioRequests = buildScenarioClaimRequests(bundle.serials);
  const baseRequests = bundle.claimRequests.filter(
    (r) => !SCENARIO_REQUEST_SERIALS.has(r.serialNumber),
  );
  const claimRequests = [...scenarioRequests, ...baseRequests.slice(0, 22)];
  const warrantyDispatches = appendReplaceDispatches(bundle.serials, bundle.warrantyDispatches);

  return {
    serials: bundle.serials,
    claims,
    claimRequests,
    warrantyDispatches,
    auditLogs: bundle.auditLogs
      ? appendScenarioAuditLogs(bundle.auditLogs)
      : undefined,
  };
}

/** Ensure pinned demo serials exist (create if batch generation skipped them) */
export function ensureDemoSerialPins(serials: WarrantySerial[]): void {
  const pins: { sn: string; itemCode: string; itemName: string; batch: string; color: string; period: 24 | 14 }[] = [
    { sn: DEMO_SERIAL_PINS.available, itemCode: "ITM-A100", itemName: "Ronin Pro Headset", batch: "BATCH-001", color: "Black", period: 24 },
    { sn: DEMO_SERIAL_PINS.dispatched, itemCode: "ITM-A100", itemName: "Ronin Pro Headset", batch: "BATCH-001", color: "White", period: 24 },
    { sn: DEMO_SERIAL_PINS.inRepair, itemCode: "ITM-B200", itemName: "Ronin Elite Mouse", batch: "BATCH-001", color: "Black", period: 14 },
    { sn: DEMO_SERIAL_PINS.inQc, itemCode: "ITM-B200", itemName: "Ronin Elite Mouse", batch: "BATCH-001", color: "Silver", period: 14 },
    { sn: DEMO_SERIAL_PINS.onHoldReplace, itemCode: "ITM-C300", itemName: "Ronin Vesper Premium", batch: "BATCH-001", color: "Graphite", period: 24 },
    { sn: DEMO_SERIAL_PINS.onHoldRefund, itemCode: "ITM-D400", itemName: "Ronin Blade Keyboard", batch: "BATCH-001", color: "Black", period: 24 },
    { sn: DEMO_SERIAL_PINS.replaceOld, itemCode: "ITM-E500", itemName: "Ronin Storm Speaker", batch: "BATCH-001", color: "Black", period: 14 },
    { sn: DEMO_SERIAL_PINS.replaceNew, itemCode: "ITM-E500", itemName: "Ronin Storm Speaker", batch: "BATCH-001", color: "Blue", period: 14 },
    { sn: DEMO_SERIAL_PINS.sevenDay, itemCode: "ITM-A100", itemName: "Ronin Pro Headset", batch: "BATCH-002", color: "Black", period: 24 },
    { sn: DEMO_SERIAL_PINS.counterOld, itemCode: "ITM-C300", itemName: "Ronin Vesper Premium", batch: "BATCH-002", color: "Rose Gold", period: 24 },
    { sn: DEMO_SERIAL_PINS.counterNew, itemCode: "ITM-C300", itemName: "Ronin Vesper Premium", batch: "BATCH-002", color: "Graphite", period: 24 },
  ];

  for (const p of pins) {
    if (findSerial(serials, p.sn)) continue;
    serials.push({
      id: generateId(),
      serialNumber: p.sn,
      itemCode: p.itemCode,
      itemName: p.itemName,
      batchNumber: p.batch,
      printDate: isoDate(20),
      color: p.color,
      warrantyPeriod: p.period,
      qrCode: buildQrCodePayload(p.sn, p.itemName, p.itemCode, p.color, p.batch),
      status: "available",
      claimCount: 0,
      claimHistory: [],
      warrantyStartDate: "",
      warrantyEndDate: "",
      createdAt: isoDateTime(25),
      refreshCount: 0,
    });
  }
}
