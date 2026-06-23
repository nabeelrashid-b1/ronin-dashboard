// // // import { SAP_DOCUMENT_STATUS } from "@/lib/sap/constants";
// // // import { SAPSalesOrder } from "./types";

// // // import type { SAPSalesOrder } from "@/features/sap/sales-orders/types";

// // // import type {sapsalesorder} from ".";

// // // export const DUMMY_SALES_ORDERS_SEED: SAPSalesOrder[] = [
// //     export const DUMMY_SALES_ORDERS_SEED:any[]  = [
// //   {
// //     DocEntry: 100,
// //     DocNum: 100,
// //     DocObjectCode: "oOrders",
// //     CardCode: "C00001",
// //     CardName: "Dummy Retailerd",
// //     DocDate: "2026-01-10",
// //     DocDueDate: "2026-01-25",
// //     TaxDate: "2026-01-10",
// //     DocCurrency: "USD",
// //     DocRate: 1,
// //     Series: 5,
// //     BPL_IDAssignedToInvoice: 1,
// //     BPLName: "Main Branch",
// //     SalesPersonCode: 1,
// //     DiscountPercent: 0,
// //     TotalDiscount: 0,
// //     DocTotal: 240,
// //     // DocumentStatus: SAP_DOCUMENT_STATUS.Open,
// //     Cancelled: "tNO",
// //     Comments: "Dummy order — full SL shape for local UI",
// //     NumAtCard: "CUST-PO-100",
// //     DocumentLines: [
// //       {
// //         LineNum: 0,
// //         ItemCode: "ITEM-01",
// //         ItemDescription: "Sample finished good",
// //         Quantity: 4,
// //         UnitPrice: 50,
// //         LineTotal: 200,
// //         WarehouseCode: "01",
// //       },
// //       {
// //         LineNum: 1,
// //         ItemCode: "ITEM-02",
// //         ItemDescription: "Sample component",
// //         Quantity: 2,
// //         UnitPrice: 20,
// //         LineTotal: 40,
// //         WarehouseCode: "01",
// //       },
// //     ],
// //   },
// //   {
// //     DocEntry: 101,
// //     DocNum: 101,
// //     DocObjectCode: "oOrders",
// //     CardCode: "C00002",
// //     CardName: "Dummy Wholesale",
// //     DocDate: "2026-02-01",
// //     DocDueDate: "2026-02-15",
// //     TaxDate: "2026-02-01",
// //     DocCurrency: "AUD",
// //     DocRate: 1,
// //     Series: 5,
// //     BPL_IDAssignedToInvoice: 1,
// //     BPLName: "Main Branch",
// //     SalesPersonCode: 1,
// //     DiscountPercent: 0,
// //     TotalDiscount: 0,
// //     DocTotal: 99.5,
// //     // DocumentStatus: SAP_DOCUMENT_STATUS.Open,
// //     Cancelled: "tNO",
// //     NumAtCard: "REF-5544",
// //     DocumentLines: [
// //       {
// //         LineNum: 0,
// //         ItemCode: "ITEM-01",
// //         ItemDescription: "Sample finished good",
// //         Quantity: 1,
// //         UnitPrice: 99.5,
// //         LineTotal: 99.5,
// //         WarehouseCode: "01",
// //       },
// //     ],
// //   },
// //   {
// //     DocEntry: 102,
// //     DocNum: 102,
// //     DocObjectCode: "oOrders",
// //     CardCode: "C00001",
// //     CardName: "Dummy Retailer",
// //     DocDate: "2025-12-01",
// //     DocDueDate: "2025-12-10",
// //     TaxDate: "2025-12-01",
// //     DocCurrency: "USD",
// //     DocRate: 1,
// //     Series: 5,
// //     BPL_IDAssignedToInvoice: 1,
// //     BPLName: "Main Branch",
// //     SalesPersonCode: 1,
// //     DiscountPercent: 0,
// //     TotalDiscount: 0,
// //     DocTotal: 10,
// //     // DocumentStatus: SAP_DOCUMENT_STATUS.Close,
// //     Cancelled: "tYES",
// //     Comments: "Cancelled row — hidden when includeCancelled is false",
// //     DocumentLines: [
// //       {
// //         LineNum: 0,
// //         ItemCode: "ITEM-02",
// //         ItemDescription: "Sample component",
// //         Quantity: 1,
// //         UnitPrice: 10,
// //         LineTotal: 10,
// //         WarehouseCode: "01",
// //       },
// //     ],
// //   },
// // ];




// // types.ts (or same file if you want inline)

// export interface SAPSalesOrderLine {
//   LineNum: number;
//   ItemCode: string;
//   ItemDescription: string;
//   Quantity: number;
//   UnitPrice: number;
//   LineTotal: number;
//   WarehouseCode: string;
// }

// export interface SAPSalesOrder {
//   DocEntry: number;
//   DocNum: number;
//   DocObjectCode: string;
//   CardCode: string;
//   CardName: string;
//   DocDate: string;
//   DocDueDate: string;
//   TaxDate: string;
//   DocCurrency: string;
//   DocRate: number;
//   Series: number;
//   BPL_IDAssignedToInvoice: number;
//   BPLName: string;
//   SalesPersonCode: number;
//   DiscountPercent: number;
//   TotalDiscount: number;
//   DocTotal: number;

//   DocumentStatus?: string; // optional because commented in data
//   Cancelled: "tYES" | "tNO";

//   Comments?: string;
//   NumAtCard?: string;

//   DocumentLines: SAPSalesOrderLine[];
// }









// sales-orders.seed.ts

export interface SAPSalesOrderLine {
  LineNum: number;
  ItemCode: string;
  ItemDescription: string;
  Quantity: number;
  UnitPrice: number;
  LineTotal: number;
  WarehouseCode: string;
}

export type CancelledStatus = "tYES" | "tNO";

export interface SAPSalesOrder {
  DocEntry: number;
  DocNum: number;
  DocObjectCode: string;
  CardCode: string;
  CardName: string;

  DocDate: string;
  DocDueDate: string;
  TaxDate: string;

  DocCurrency: string;
  DocRate: number;

  Series: number;
  BPL_IDAssignedToInvoice: number;
  BPLName: string;

  SalesPersonCode: number;
  DiscountPercent: number;
  TotalDiscount: number;

  DocTotal: number;

  DocumentStatus?: string; // optional (because you commented it in seed)
  Cancelled: CancelledStatus;

  Comments?: string;
  NumAtCard?: string;

  DocumentLines: SAPSalesOrderLine[];
}

export const DUMMY_SALES_ORDERS_SEED: SAPSalesOrder[] = [
  {
    DocEntry: 100,
    DocNum: 100,
    DocObjectCode: "oOrders",
    CardCode: "C00001",
    CardName: "Dummy Retailerd",
    DocDate: "2026-01-10",
    DocDueDate: "2026-01-25",
    TaxDate: "2026-01-10",
    DocCurrency: "USD",
    DocRate: 1,
    Series: 5,
    BPL_IDAssignedToInvoice: 1,
    BPLName: "Main Branch",
    SalesPersonCode: 1,
    DiscountPercent: 0,
    TotalDiscount: 0,
    DocTotal: 240,
    Cancelled: "tNO",
    Comments: "Dummy order — full SL shape for local UI",
    NumAtCard: "CUST-PO-100",
    DocumentLines: [
      {
        LineNum: 0,
        ItemCode: "ITEM-01",
        ItemDescription: "Sample finished good",
        Quantity: 4,
        UnitPrice: 50,
        LineTotal: 200,
        WarehouseCode: "01",
      },
      {
        LineNum: 1,
        ItemCode: "ITEM-02",
        ItemDescription: "Sample component",
        Quantity: 2,
        UnitPrice: 20,
        LineTotal: 40,
        WarehouseCode: "01",
      },
    ],
  },

  {
    DocEntry: 101,
    DocNum: 101,
    DocObjectCode: "oOrders",
    CardCode: "C00002",
    CardName: "Dummy Wholesale",
    DocDate: "2026-02-01",
    DocDueDate: "2026-02-15",
    TaxDate: "2026-02-01",
    DocCurrency: "AUD",
    DocRate: 1,
    Series: 5,
    BPL_IDAssignedToInvoice: 1,
    BPLName: "Main Branch",
    SalesPersonCode: 1,
    DiscountPercent: 0,
    TotalDiscount: 0,
    DocTotal: 99.5,
    Cancelled: "tNO",
    NumAtCard: "REF-5544",
    DocumentLines: [
      {
        LineNum: 0,
        ItemCode: "ITEM-01",
        ItemDescription: "Sample finished good",
        Quantity: 1,
        UnitPrice: 99.5,
        LineTotal: 99.5,
        WarehouseCode: "01",
      },
    ],
  },

  {
    DocEntry: 102,
    DocNum: 102,
    DocObjectCode: "oOrders",
    CardCode: "C00001",
    CardName: "Dummy Retailer",
    DocDate: "2025-12-01",
    DocDueDate: "2025-12-10",
    TaxDate: "2025-12-01",
    DocCurrency: "USD",
    DocRate: 1,
    Series: 5,
    BPL_IDAssignedToInvoice: 1,
    BPLName: "Main Branch",
    SalesPersonCode: 1,
    DiscountPercent: 0,
    TotalDiscount: 0,
    DocTotal: 10,
    Cancelled: "tYES",
    Comments: "Cancelled row — hidden when includeCancelled is false",
    DocumentLines: [
      {
        LineNum: 0,
        ItemCode: "ITEM-02",
        ItemDescription: "Sample component",
        Quantity: 1,
        UnitPrice: 10,
        LineTotal: 10,
        WarehouseCode: "01",
      },
    ],
  },
];