import { buildItemDescription } from "./claim-utils";
import { addMonthsToDate } from "./dispatch-utils";
import {
  ensureDemoSerialPins,
  enrichSeedWithScenarios,
} from "./seed-scenarios";
import { calculateWarrantyRefreshExtension } from "./warranty-rules";
import { buildSapSalesOrder } from "./sap-sales-orders";
import { buildQrCodePayload, buildSerialNumber } from "./serial-format";
import type {
  AuditLog,
  ClaimJourneyEntry,
  DispatchChannel,
  DispatchRecord,
  InternalClaimCategory,
  InternalClaimStatus,
  PurchaseFrom,
  RequestIntakeType,
  SalesOrder,
  SerialStatus,
  WarrantyClaimRecord,
  WarrantyClaimRequest,
  WarrantyDispatchRecord,
  WarrantyPeriodMonths,
  WarrantyRefreshLogEntry,
  CourierExceptionRecord,
  WarrantySerial,
  WarrantySubType,
} from "./types";

const TOTAL_SERIALS = 180;

const products = [
  { itemCode: "ITM-A100", itemName: "Ronin Pro Headset", colors: ["Black", "White"], warrantyPeriod: 24 as WarrantyPeriodMonths, batches: ["BATCH-001", "BATCH-002", "BATCH-003", "BATCH-004"], perBatch: 10 },
  { itemCode: "ITM-B200", itemName: "Ronin Elite Mouse", colors: ["Black", "Silver"], warrantyPeriod: 14 as WarrantyPeriodMonths, batches: ["BATCH-001", "BATCH-002", "BATCH-003"], perBatch: 12 },
  { itemCode: "ITM-C300", itemName: "Ronin Vesper Premium", colors: ["Graphite", "Rose Gold"], warrantyPeriod: 24 as WarrantyPeriodMonths, batches: ["BATCH-001", "BATCH-002", "BATCH-003", "BATCH-004"], perBatch: 11 },
  { itemCode: "ITM-D400", itemName: "Ronin Blade Keyboard", colors: ["Black", "RGB"], warrantyPeriod: 24 as WarrantyPeriodMonths, batches: ["BATCH-001", "BATCH-002", "BATCH-003"], perBatch: 12 },
  { itemCode: "ITM-E500", itemName: "Ronin Storm Speaker", colors: ["Black", "Blue"], warrantyPeriod: 14 as WarrantyPeriodMonths, batches: ["BATCH-001", "BATCH-002", "BATCH-003"], perBatch: 12 },
];

/** Search / dispatched history — SO-100xx (seed serials & scenarios reference these) */
export const seedSalesOrdersHistory: SalesOrder[] = [
  buildSapSalesOrder("SO-10001", "2026-04-02", [
    { itemCode: "ITM-A100", itemName: "Ronin Pro Headset", qty: 5 },
    { itemCode: "ITM-B200", itemName: "Ronin Elite Mouse", qty: 3 },
  ], { cardCode: "C00001", customerName: "Metro Audio Distributors", status: "closed" }),
  buildSapSalesOrder("SO-10002", "2026-04-05", [
    { itemCode: "ITM-C300", itemName: "Ronin Vesper Premium", qty: 8 },
    { itemCode: "ITM-D400", itemName: "Ronin Blade Keyboard", qty: 4 },
  ], { cardCode: "C00002", customerName: "Pacific Retail Group", status: "closed" }),
  buildSapSalesOrder("SO-10003", "2026-04-08", [
    { itemCode: "ITM-A100", itemName: "Ronin Pro Headset", qty: 10 },
    { itemCode: "ITM-E500", itemName: "Ronin Storm Speaker", qty: 5 },
  ], { cardCode: "C00003", customerName: "SoundWave Trading Co.", status: "closed" }),
  buildSapSalesOrder("SO-10004", "2026-04-12", [
    { itemCode: "ITM-B200", itemName: "Ronin Elite Mouse", qty: 6 },
    { itemCode: "ITM-D400", itemName: "Ronin Blade Keyboard", qty: 4 },
  ], { cardCode: "C00001", customerName: "Metro Audio Distributors", status: "closed" }),
  buildSapSalesOrder("SO-10005", "2026-04-15", [
    { itemCode: "ITM-C300", itemName: "Ronin Vesper Premium", qty: 12 },
    { itemCode: "ITM-E500", itemName: "Ronin Storm Speaker", qty: 8 },
  ], { cardCode: "C00004", customerName: "Elite Gadgets Ltd", status: "open" }),
  buildSapSalesOrder("SO-10006", "2026-04-18", [
    { itemCode: "ITM-A100", itemName: "Ronin Pro Headset", qty: 6 },
  ], { cardCode: "C00005", customerName: "North Star Electronics", status: "open" }),
  buildSapSalesOrder("SO-10007", "2026-04-22", [
    { itemCode: "ITM-D400", itemName: "Ronin Blade Keyboard", qty: 7 },
    { itemCode: "ITM-B200", itemName: "Ronin Elite Mouse", qty: 7 },
  ], { cardCode: "C00002", customerName: "Pacific Retail Group", status: "closed" }),
  buildSapSalesOrder("SO-10008", "2026-04-25", [
    { itemCode: "ITM-C300", itemName: "Ronin Vesper Premium", qty: 10 },
    { itemCode: "ITM-A100", itemName: "Ronin Pro Headset", qty: 8 },
  ], { cardCode: "C00006", customerName: "Vertex Supply Chain", status: "open" }),
  buildSapSalesOrder("SO-10009", "2026-04-28", [
    { itemCode: "ITM-E500", itemName: "Ronin Storm Speaker", qty: 5 },
    { itemCode: "ITM-B200", itemName: "Ronin Elite Mouse", qty: 4 },
  ], { cardCode: "C00003", customerName: "SoundWave Trading Co.", status: "closed" }),
  buildSapSalesOrder("SO-10010", "2026-05-02", [
    { itemCode: "ITM-A100", itemName: "Ronin Pro Headset", qty: 8 },
    { itemCode: "ITM-C300", itemName: "Ronin Vesper Premium", qty: 8 },
  ], { cardCode: "C00001", customerName: "Metro Audio Distributors", status: "open" }),
  buildSapSalesOrder("SO-10011", "2026-05-06", [
    { itemCode: "ITM-D400", itemName: "Ronin Blade Keyboard", qty: 6 },
    { itemCode: "ITM-E500", itemName: "Ronin Storm Speaker", qty: 5 },
  ], { cardCode: "C00007", customerName: "Horizon Wholesale", status: "open" }),
  buildSapSalesOrder("SO-10012", "2026-05-10", [
    { itemCode: "ITM-B200", itemName: "Ronin Elite Mouse", qty: 12 },
    { itemCode: "ITM-A100", itemName: "Ronin Pro Headset", qty: 10 },
  ], { cardCode: "C00004", customerName: "Elite Gadgets Ltd", status: "open" }),
  buildSapSalesOrder("SO-10013", "2026-05-14", [
    { itemCode: "ITM-C300", itemName: "Ronin Vesper Premium", qty: 7 },
  ], { cardCode: "C00005", customerName: "North Star Electronics", status: "open" }),
  buildSapSalesOrder("SO-10014", "2026-05-17", [
    { itemCode: "ITM-D400", itemName: "Ronin Blade Keyboard", qty: 8 },
    { itemCode: "ITM-E500", itemName: "Ronin Storm Speaker", qty: 5 },
  ], { cardCode: "C00002", customerName: "Pacific Retail Group", status: "closed" }),
  buildSapSalesOrder("SO-10015", "2026-05-19", [
    { itemCode: "ITM-A100", itemName: "Ronin Pro Headset", qty: 3 },
    { itemCode: "ITM-B200", itemName: "Ronin Elite Mouse", qty: 2 },
  ], { cardCode: "C00008", customerName: "Summit Tech Partners", status: "open" }),
];

/** New warehouse dispatch — SO-200xx only (not used in search/dispatched demo list) */
export const seedSalesOrdersOpen: SalesOrder[] = [
  buildSapSalesOrder("SO-20001", "2026-05-20", [
    { itemCode: "ITM-A100", itemName: "Ronin Pro Headset", qty: 4 },
    { itemCode: "ITM-B200", itemName: "Ronin Elite Mouse", qty: 2 },
  ], { cardCode: "C00009", customerName: "Apex Distribution Hub", status: "open" }),
  buildSapSalesOrder("SO-20002", "2026-05-21", [
    { itemCode: "ITM-C300", itemName: "Ronin Vesper Premium", qty: 6 },
  ], { cardCode: "C00010", customerName: "Coastal Electronics", status: "open" }),
  buildSapSalesOrder("SO-20003", "2026-05-22", [
    { itemCode: "ITM-D400", itemName: "Ronin Blade Keyboard", qty: 5 },
    { itemCode: "ITM-E500", itemName: "Ronin Storm Speaker", qty: 3 },
  ], { cardCode: "C00001", customerName: "Metro Audio Distributors", status: "open" }),
  buildSapSalesOrder("SO-20004", "2026-05-23", [
    { itemCode: "ITM-A100", itemName: "Ronin Pro Headset", qty: 8 },
  ], { cardCode: "C00011", customerName: "Prime AV Wholesale", status: "open" }),
  buildSapSalesOrder("SO-20005", "2026-05-24", [
    { itemCode: "ITM-B200", itemName: "Ronin Elite Mouse", qty: 10 },
    { itemCode: "ITM-C300", itemName: "Ronin Vesper Premium", qty: 4 },
  ], { cardCode: "C00004", customerName: "Elite Gadgets Ltd", status: "open" }),
  buildSapSalesOrder("SO-20006", "2026-05-25", [
    { itemCode: "ITM-E500", itemName: "Ronin Storm Speaker", qty: 6 },
  ], { cardCode: "C00012", customerName: "Lakeside Retail Partners", status: "open" }),
  buildSapSalesOrder("SO-20007", "2026-05-26", [
    { itemCode: "ITM-D400", itemName: "Ronin Blade Keyboard", qty: 3 },
    { itemCode: "ITM-A100", itemName: "Ronin Pro Headset", qty: 3 },
  ], { cardCode: "C00006", customerName: "Vertex Supply Chain", status: "open" }),
  buildSapSalesOrder("SO-20008", "2026-05-27", [
    { itemCode: "ITM-C300", itemName: "Ronin Vesper Premium", qty: 5 },
    { itemCode: "ITM-B200", itemName: "Ronin Elite Mouse", qty: 5 },
  ], { cardCode: "C00007", customerName: "Horizon Wholesale", status: "open" }),
];

/** All demo SAP orders (lookup by number) */
export const seedSalesOrders: SalesOrder[] = [
  ...seedSalesOrdersHistory,
  ...seedSalesOrdersOpen,
];

function statusForIndex(index: number): SerialStatus {
  if (index < 58) return "available";
  if (index < 92) return "dispatched";
  if (index < 97) return "in-repair";
  if (index < 100) return "in-qc";
  if (index < 103) return "on-hold";
  if (index < 112) return "dispatched";
  if (index < 125) return "refunded";
  if (index < 128) return "flagged";
  if (index < 138) return "rejected";
  return "dispatched";
}

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

function journey(
  claimId: string,
  serialNumber: string,
  action: string,
  category: InternalClaimCategory | "customer",
  status: string,
  daysAgo: number,
  subType?: WarrantySubType,
): ClaimJourneyEntry {
  return {
    id: `seed-j-${claimId}`,
    claimId,
    serialNumber,
    action,
    claimCategory: category,
    claimType: subType,
    claimStatus: status,
    performedBy: "Operator User",
    performedAt: isoDateTime(daysAgo),
    notes: action,
  };
}

export function generateSeedSerials(): WarrantySerial[] {
  const serials: WarrantySerial[] = [];
  let globalIndex = 0;

  for (const product of products) {
    for (const batch of product.batches) {
      for (let seq = 1; seq <= product.perBatch; seq++) {
        if (globalIndex >= TOTAL_SERIALS) break;

        const serialNumber = buildSerialNumber(product.itemCode, batch, seq);
        const color = product.colors[seq % product.colors.length];
        const status = statusForIndex(globalIndex);
        const createdAt = isoDateTime(30 + (globalIndex % 20));
        const printDate = isoDate(25 + (globalIndex % 15));

        let warrantyStartDate = "";
        let warrantyEndDate = "";
        let dispatchedAt: string | undefined;
        let salesOrderNumber: string | undefined;
        let claimCount = 0;
        let claimHistory: ClaimJourneyEntry[] = [];

        if (status !== "available") {
          const dispatchDate =
            status === "dispatched" && globalIndex % 15 === 0
              ? isoDate(3)
              : isoDate(10 + (globalIndex % 12));
          warrantyStartDate = dispatchDate;
          warrantyEndDate = addMonthsToDate(dispatchDate, product.warrantyPeriod);
          dispatchedAt = isoDateTime(10 + (globalIndex % 12));
          salesOrderNumber =
            seedSalesOrdersHistory[globalIndex % seedSalesOrdersHistory.length].orderNumber;
        }

        if (["in-repair", "in-qc", "refunded", "rejected", "flagged"].includes(status) || (status === "dispatched" && globalIndex % 17 === 0 && globalIndex >= 112)) {
          claimCount = 1;
          const claimId = `CLM-2026-${String(globalIndex + 1).padStart(6, "0")}`;
          const subType: WarrantySubType =
            ["in-repair", "in-qc"].includes(status)
              ? "repair"
              : status === "refunded"
                ? "replace"
                : status === "rejected"
                  ? "refund"
                  : status === "flagged"
                    ? "refund"
                    : "repair";
          claimHistory = [
            journey(
              claimId,
              serialNumber,
              status === "in-qc"
                ? "Warranty repair — in QC"
                : status === "in-repair"
                  ? "Warranty repair — in repair"
                  : `${status} claim`,
              "warranty-claim",
              status === "in-qc"
                ? "in-qc"
                : status === "in-repair"
                  ? "in-repair"
                  : status === "refunded"
                    ? "replace"
                    : status === "flagged"
                      ? "refund"
                      : "refund",
              5,
              subType,
            ),
          ];
          if (status === "in-repair") {
            // activeClaimId set below after push — patched in map not needed
          }
        }

        const claimIdForActive =
          status === "in-repair" || status === "in-qc"
            ? `CLM-2026-${String(globalIndex + 1).padStart(6, "0")}`
            : undefined;

        const channel: DispatchChannel | undefined =
          status !== "available"
            ? globalIndex % 3 === 0
              ? "warehouse"
              : globalIndex % 3 === 1
                ? "outlet"
                : "ecommerce"
            : undefined;

        serials.push({
          id: `seed-s-${String(globalIndex + 1).padStart(4, "0")}`,
          serialNumber,
          itemCode: product.itemCode,
          itemName: product.itemName,
          batchNumber: batch,
          printDate,
          color,
          warrantyPeriod: product.warrantyPeriod,
          qrCode: buildQrCodePayload(
            serialNumber,
            product.itemName,
            product.itemCode,
            color,
            batch,
          ),
          status,
          ...(status === "flagged"
            ? {
                fraudLockout: {
                  riderId: "RDR-4421",
                  courierTrackingCode: `3PL-${9000 + globalIndex}`,
                  reportNote: "Seal broken — unit swapped during failed delivery return.",
                  lockedAt: isoDateTime(2),
                  lockedBy: "Warehouse User",
                },
              }
            : {}),
          claimCount,
          claimHistory,
          warrantyStartDate,
          warrantyEndDate,
          createdAt,
          dispatchedAt,
          salesOrderNumber,
          dispatchChannel: channel,
          shopifyOrderId:
            channel === "ecommerce" ? `SHOP-${10000 + (globalIndex % 500)}` : undefined,
          outletReference:
            channel === "outlet" ? `OUT-${2000 + (globalIndex % 100)}` : undefined,
          refreshCount: 0,
          activeClaimId: claimIdForActive,
        });

        globalIndex++;
      }
    }
  }

  return serials;
}

export function generateSeedDispatches(serials: WarrantySerial[]): WarrantyDispatchRecord[] {
  return serials
    .filter((s) => s.warrantyStartDate && s.salesOrderNumber)
    .map((s, i) => {
      const so = seedSalesOrders.find((o) => o.orderNumber === s.salesOrderNumber)!;
      return {
        id: `seed-wd-${String(i + 1).padStart(4, "0")}`,
        serialNumber: s.serialNumber,
        dispatchChannel: s.dispatchChannel ?? "warehouse",
        salesOrderNumber: so.orderNumber,
        salesOrderDate: so.orderDate,
        dispatchDate: s.warrantyStartDate,
        shopifyOrderId: s.shopifyOrderId,
        outletReference: s.outletReference,
        dispatchType: "initial",
      };
    });
}

export function generateSeedClaims(serials: WarrantySerial[]): WarrantyClaimRecord[] {
  const claimSerials = serials.filter((s) =>
    ["in-repair", "in-qc", "refunded", "rejected", "flagged"].includes(s.status) ||
    (s.claimHistory?.length && s.status === "dispatched"),
  );

  return claimSerials.map((s, i) => {
    const subType: WarrantySubType =
      ["in-repair", "in-qc"].includes(s.status) ||
      (s.status === "dispatched" && s.claimHistory?.length)
        ? "repair"
        : s.status === "refunded"
          ? "replace"
          : "refund";
    const claimStatus: InternalClaimStatus =
      s.status === "in-qc"
        ? "in-qc"
        : s.status === "in-repair"
          ? "in-repair"
          : s.status === "dispatched"
            ? "closed"
            : s.status === "refunded"
              ? "replace"
              : "refund";
    const claimId = s.claimHistory?.[0]?.claimId ?? `CLM-2026-${String(i + 1).padStart(6, "0")}`;

    return {
      id: `seed-c-${String(i + 1).padStart(4, "0")}`,
      claimId,
      partyType: "dealer",
      qrCode: s.qrCode,
      serialNumber: s.serialNumber,
      itemCode: s.itemCode,
      itemName: s.itemName,
      itemDescription: buildItemDescription(s),
      claimCategory: "warranty-claim",
      warrantySubType: subType,
      claimStatus,
      statusHistory: [
        {
          status: "received",
          changedBy: "Operator User",
          changedAt: isoDateTime(4 + i),
          notes: "Received",
        },
        {
          status: claimStatus,
          changedBy: "Operator User",
          changedAt: isoDateTime(3 + i),
          notes: `Seed ${subType}`,
        },
      ],
      creditNote: subType === "refund" ? `CN-${1001 + i}` : undefined,
      cardCode: `C0000${(i % 5) + 1}`,
      accessoryReplaced: subType === "repair" ? "Ear cushions" : undefined,
      warrantyStartDate: s.warrantyStartDate,
      warrantyEndDate: s.warrantyEndDate,
      remarks: `Seed ${subType} claim`,
      submittedAt: isoDateTime(3 + (i % 8)),
      submittedBy: "Operator User",
      closedAt: claimStatus === "closed" ? isoDateTime(2) : undefined,
    };
  });
}

export function generateSeedClaimRequests(serials: WarrantySerial[]): WarrantyClaimRequest[] {
  const eligible = serials.filter((s) => s.status === "dispatched");
  const count = Math.min(28, eligible.length);
  const purchaseFromOptions: PurchaseFrom[] = ["official-outlet", "market-retail", "online"];
  const statuses = [
    "submitted",
    "under-review",
    "accepted",
    "routed-after-sales",
    "routed-return-dept",
    "in-repair",
    "completed",
    "rejected",
  ] as const;

  const today = new Date();
  const recentDispatch = new Date(today);
  recentDispatch.setDate(recentDispatch.getDate() - 3);
  const recentDispatchStr = recentDispatch.toISOString().slice(0, 10);

  return eligible.slice(0, count).map((s, i) => {
    const claimId = `CLM-REQ-${String(i + 1).padStart(5, "0")}`;
    const status = statuses[i % statuses.length];
    const intake: RequestIntakeType = i % 4 === 0 ? "seven-day" : "warranty";
    const isSevenDay = intake === "seven-day";
    const purchaseFrom = isSevenDay
      ? (i % 2 === 0 ? "online" : "official-outlet")
      : purchaseFromOptions[i % 3];
    const warrantyStart = isSevenDay ? recentDispatchStr : s.warrantyStartDate;
    const warrantyEnd = isSevenDay
      ? addMonthsToDate(recentDispatchStr, s.warrantyPeriod)
      : s.warrantyEndDate;

    return {
      id: `seed-cr-${String(i + 1).padStart(4, "0")}`,
      claimId,
      requestIntakeType: intake,
      fullName: ["Ahmed Khan", "Sara Malik", "James Wilson"][i % 3],
      qrCode: s.qrCode,
      serialNumber: s.serialNumber,
      productName: s.itemName,
      itemCode: s.itemCode,
      itemDescription: buildItemDescription(s),
      purchaseFrom,
      shopifyOrderId: purchaseFrom === "online" ? `SHOP-${10000 + i}` : undefined,
      email: `customer${i + 1}@example.com`,
      contactNumber: `+92 300 ${String(1000000 + i).slice(-7)}`,
      claimType: "warranty-repair",
      problemDescription: isSevenDay
        ? "Product issue within 7 days — request replace or refund."
        : "Accessory (ear cushions) not working — request repair.",
      warrantyStartDate: warrantyStart,
      warrantyEndDate: warrantyEnd,
      warrantyStatusAtSubmit: isSevenDay ? "Within 7-day window" : "Within warranty",
      status,
      statusHistory: [
        {
          status: "submitted",
          changedBy: "Customer",
          changedAt: isoDateTime(2 + i),
          notes: "Customer submitted online",
        },
        ...(status !== "submitted"
          ? [
              {
                status: status as WarrantyClaimRequest["status"],
                changedBy: "Admin User",
                changedAt: isoDateTime(1),
                notes: `Status updated to ${status}`,
              },
            ]
          : []),
      ],
      submittedAt: isoDateTime(2 + i),
      reviewedBy: status !== "submitted" ? "Admin User" : undefined,
      reviewedAt: status !== "submitted" ? isoDateTime(1) : undefined,
      ...(status === "routed-return-dept"
        ? {
            routedResolution: (i % 2 === 0 ? "replace" : "refund") as "replace" | "refund",
            returnedUnitSaleable: i % 3 !== 0,
          }
        : {}),
    };
  });
}

export function generateSeedRefreshLog(serials: WarrantySerial[]): WarrantyRefreshLogEntry[] {
  const candidates = serials.filter(
    (s) => s.status === "dispatched" && s.warrantyStartDate && s.warrantyEndDate,
  );
  return candidates.slice(0, 6).map((s, i) => {
    const refreshDate = isoDate(1 + (i % 3));
    const { newEndDate, monthsExtended } = calculateWarrantyRefreshExtension(
      s.warrantyStartDate,
      s.warrantyEndDate,
      refreshDate,
    );
    return {
      id: `seed-wr-${String(i + 1).padStart(3, "0")}`,
      serialNumber: s.serialNumber,
      qrCode: s.qrCode,
      previousStartDate: s.warrantyStartDate,
      previousEndDate: s.warrantyEndDate,
      newEndDate,
      monthsExtended,
      warrantyPeriodMonths: s.warrantyPeriod,
      eligibilityNote: `Seed refresh +${monthsExtended} mo`,
      approvedBy: "Operator User",
      refreshAt: isoDateTime(1 + i),
      refreshCount: 1,
    };
  });
}

export function generateSeedAuditLogs(serials: WarrantySerial[]): AuditLog[] {
  return [
    {
      id: "seed-a-001",
      action: "SERIAL_GENERATED",
      module: "Serial Master",
      details: `Bulk seed: ${serials.length} serials`,
      performedBy: "Admin User",
      performedAt: isoDateTime(30),
    },
    {
      id: "seed-a-002",
      action: "CLAIM_SUBMITTED",
      module: "Warranty Claim",
      details: "Internal dealer claims seeded",
      performedBy: "Operator User",
      performedAt: isoDateTime(5),
    },
  ];
}

export function generateLegacyDispatches(serials: WarrantySerial[]): DispatchRecord[] {
  const bySo = new Map<string, string[]>();
  for (const s of serials.filter((x) => x.salesOrderNumber)) {
    const list = bySo.get(s.salesOrderNumber!) ?? [];
    list.push(s.serialNumber);
    bySo.set(s.salesOrderNumber!, list);
  }
  let i = 0;
  return Array.from(bySo.entries()).slice(0, 10).map(([so, serialNumbers]) => {
    i++;
    const first = serials.find((s) => s.serialNumber === serialNumbers[0])!;
    return {
      id: `seed-d-${String(i).padStart(4, "0")}`,
      dispatchChannel: first.dispatchChannel ?? "warehouse",
      salesOrderNumber: so,
      serialNumbers: serialNumbers.slice(0, 5),
      warrantyStartDate: first.warrantyStartDate,
      warrantyEndDate: first.warrantyEndDate,
      finalizedAt: first.dispatchedAt ?? isoDateTime(10),
      finalizedBy: "Operator User",
      shopifyOrderId: first.shopifyOrderId,
      outletReference: first.outletReference,
    };
  });
}

export function generateSeedCourierExceptions(
  serials: WarrantySerial[],
): CourierExceptionRecord[] {
  return serials
    .filter((s) => s.status === "flagged" && s.fraudLockout)
    .map((s) => ({
      id: `seed-c-${s.serialNumber}`,
      serialNumber: s.serialNumber,
      qrCode: s.qrCode,
      riderId: s.fraudLockout!.riderId,
      courierTrackingCode: s.fraudLockout!.courierTrackingCode,
      reportNote: s.fraudLockout!.reportNote,
      reportFileName: s.fraudLockout!.reportFileName,
      lockedAt: s.fraudLockout!.lockedAt,
      lockedBy: s.fraudLockout!.lockedBy,
    }));
}

export function buildFullSeedData() {
  const serials = generateSeedSerials();
  ensureDemoSerialPins(serials);

  const base = {
    serials,
    warrantyDispatches: generateSeedDispatches(serials),
    claims: generateSeedClaims(serials),
    claimRequests: generateSeedClaimRequests(serials),
    courierExceptions: generateSeedCourierExceptions(serials),
    auditLogs: generateSeedAuditLogs(serials),
    dispatches: generateLegacyDispatches(serials),
  };

  const enriched = enrichSeedWithScenarios({
    serials: base.serials,
    claims: base.claims,
    claimRequests: base.claimRequests,
    warrantyDispatches: base.warrantyDispatches,
    auditLogs: base.auditLogs,
  });

  return {
    ...base,
    serials: enriched.serials,
    claims: enriched.claims,
    claimRequests: enriched.claimRequests,
    warrantyDispatches: enriched.warrantyDispatches,
    auditLogs: enriched.auditLogs ?? base.auditLogs,
    dispatches: generateLegacyDispatches(enriched.serials),
  };
}
