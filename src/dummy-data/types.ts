// /**
//  * SAP Sales Order — types.
//  *
//  * Read DTO and Create payload are explicitly separated:
//  *
//  *   - `SAPSalesOrder`             — what the proxy returns when reading
//  *                                   ORDR via `/api/orders` or `/api/order/{id}`.
//  *                                   Almost everything optional (Service
//  *                                   Layer omits null fields).
//  *
//  *   - `SAPSalesOrderCreatePayload` — what we POST to `/api/order`.
//  *                                   Required fields are the SAP minimum;
//  *                                   company-specific required fields are
//  *                                   enforced at the schema layer.
//  *
//  *   - `SAPSalesOrderLine`          — same separation, line-level.
//  *
//  * UDFs are deliberately NOT modeled here. Add a sibling `udfs.ts` once the
//  * customer provides exact UDF metadata; do not invent fields.
//  */

// import type {
//   SAPMarketingDocument,
//   SAPMarketingDocumentCreateBase,
//   SAPMarketingDocumentCreateLine,
//   SAPMarketingDocumentLine,
// } from "@/features/sap/documents/types";

// /* -------------------------------------------------------------------------
//  * Read DTO
//  * -----------------------------------------------------------------------*/

// /**
//  * Sales Order read DTO. Adds a few ORDR-specific fields on top of the
//  * Marketing Document base (most ORDR fields are already inherited).
//  */
// export interface SAPSalesOrder extends SAPMarketingDocument {
//   /** "oOrders" — narrowed for type safety on consumers. */
//   DocObjectCode?: "oOrders";

//   /**
//    * Required delivery date (typically equal to DocDueDate; SAP exposes
//    * both because some localizations distinguish them).
//    */
//   RequiredDate?: string;

//   /** Sum of GrossProfit on lines (informational on read). */
//   GrossProfit?: number;
//   GrossProfitTotalBasePrice?: number;
// }

// /**
//  * Sales Order line read DTO. Inherits all RDR1 line fields from the
//  * Marketing Document line base.
//  */
// export type SAPSalesOrderLine = SAPMarketingDocumentLine;

// /* -------------------------------------------------------------------------
//  * Create payload
//  *
//  * IMPORTANT: We do NOT set `DocObjectCode: "oOrders"` here as a required
//  * field — the proxy infers it from the URL (`POST /api/order`). If your
//  * proxy implementation requires it explicitly, set it via the schema's
//  * `transform()` step rather than forcing every form to fill it in.
//  * -----------------------------------------------------------------------*/

// /**
//  * Sales Order create line.
//  *
//  * Currently identical to the Marketing Document create line — exposed as a
//  * named alias so consumers (e.g. the form's row component) bind to a stable,
//  * document-specific symbol. When Sales Order ever needs line-level fields
//  * that no other document has (e.g. per-line ShipDate), upgrade this to an
//  * `interface SAPSalesOrderCreateLine extends SAPMarketingDocumentCreateLine`.
//  */
// export type SAPSalesOrderCreateLine = SAPMarketingDocumentCreateLine;

// export interface SAPSalesOrderCreatePayload
//   extends SAPMarketingDocumentCreateBase {
//   DocObjectCode?: "oOrders";
//   /** Optional: SAP RequiredDate; usually omitted (SAP defaults from DocDueDate). */
//   RequiredDate?: string;
//   DocumentLines: SAPSalesOrderCreateLine[];
// }

// /* -------------------------------------------------------------------------
//  * List query options (shared by `api.ts` and dummy adapter)
//  * -----------------------------------------------------------------------*/

// export interface QueryOrdersOptions {
//   search?: string;
//   cardCode?: string;
//   /** Default false — exclude cancelled orders from active lists. */
//   includeCancelled?: boolean;
//   top?: number;
//   skip?: number;
// }
