/**
 * Centralized field keys & labels — update display names here only.
 */
export const FIELDS = {
  serialNumber: { key: "serialNumber", label: "Serial Number" },
  qrCode: { key: "qrCode", label: "QR Code / Warranty Sticker ID" },
  itemCode: { key: "itemCode", label: "Item Code" },
  itemName: { key: "itemName", label: "Item Name" },
  productName: { key: "productName", label: "Product Name" },
  batchNumber: { key: "batchNumber", label: "Batch reference" },
  batchRef: { key: "batchNumber", label: "Batch reference" },
  qrPrintDate: { key: "printDate", label: "QR code print date" },
  printDate: { key: "printDate", label: "QR code print date" },
  color: { key: "color", label: "Color" },
  riderId: { key: "riderId", label: "Rider ID" },
  courierTrackingCode: { key: "courierTrackingCode", label: "Courier tracking code" },
  fraudReportNote: { key: "fraudReportNote", label: "Investigation report" },
  managementApprovalToken: {
    key: "managementApprovalToken",
    label: "Management approval token",
  },
  salesOrderNumber: { key: "salesOrderNumber", label: "Sales Order No" },
  salesOrderDate: { key: "salesOrderDate", label: "Sales Order Date" },
  salesOrderQty: { key: "salesOrderQty", label: "Sales Order Qty" },
  dispatchChannel: { key: "dispatchChannel", label: "Dispatch channel" },
  outletReference: { key: "outletReference", label: "Outlet receipt no" },
  warrantyStartDate: { key: "warrantyStartDate", label: "Warranty Start Date" },
  warrantyEndDate: { key: "warrantyEndDate", label: "Warranty End Date" },
  warrantyPeriod: { key: "warrantyPeriod", label: "Warranty period (months)" },
  claimId: { key: "claimId", label: "Claim ID" },
  claimCategory: { key: "claimCategory", label: "Claim Category" },
  claimType: { key: "claimType", label: "Claim Type" },
  claimStatus: { key: "claimStatus", label: "Claim Status" },
  requestIntakeType: { key: "requestIntakeType", label: "Request type" },
  creditNote: { key: "creditNote", label: "Credit Note No" },
  cardCode: { key: "cardCode", label: "SAP Card Code (Dealer)" },
  customerCode: { key: "customerCode", label: "Customer Code" },
  shopifyOrderId: { key: "shopifyOrderId", label: "Shopify Order ID" },
  fullName: { key: "fullName", label: "Full Name" },
  contactNumber: { key: "contactNumber", label: "Contact Number" },
  email: { key: "email", label: "Email Address" },
  remarks: { key: "remarks", label: "Remarks" },
  problemDescription: { key: "problemDescription", label: "Describe Product Issue / Problem" },
  oldSerialNumber: { key: "oldSerialNumber", label: "Old Serial (scan)" },
  newSerialNumber: { key: "newSerialNumber", label: "New Serial (scan)" },
  accessoryReplaced: { key: "accessoryReplaced", label: "Accessory Replaced" },
  performedBy: { key: "performedBy", label: "Performed By" },
  performedAt: { key: "performedAt", label: "Performed At" },
  requestStatus: { key: "requestStatus", label: "Request Status" },
  partyType: { key: "partyType", label: "Party Type" },
  replacementChain: { key: "replacementChain", label: "Replacement chain" },
  saleable: { key: "saleable", label: "Saleable (returned unit)" },
  monthsExtended: { key: "monthsExtended", label: "Months extended" },
} as const;

export const SERIAL_STATUS = {
  available: { value: "available", label: "Available" },
  dispatched: { value: "dispatched", label: "Dispatched" },
  inRepair: { value: "in-repair", label: "In-Repair" },
  inQc: { value: "in-qc", label: "In-QC" },
  refunded: { value: "refunded", label: "Refunded (voided)" },
  rejected: { value: "rejected", label: "Rejected" },
  flagged: { value: "flagged", label: "Flagged (under investigation)" },
  /** Legacy — migrated to refunded */
  exchanged: { value: "exchanged", label: "Exchanged (legacy)" },
  onHold: { value: "on-hold", label: "On hold" },
} as const;

/** Demo management override for warranty refresh after 7-month window */
export const MANAGEMENT_APPROVAL_TOKEN = "RONIN-MGR-APPROVE";

export const DISPATCH_CHANNEL = {
  warehouse: { value: "warehouse", label: "Warehouse (dealer / SAP SO)" },
  outlet: { value: "outlet", label: "Outlet (walk-in)" },
  ecommerce: { value: "ecommerce", label: "E-commerce (Shopify)" },
} as const;

export const INTERNAL_CLAIM_CATEGORY = {
  sevenDay: { value: "seven-day", label: "7 Days Claim" },
  counterClaim: { value: "counter-claim", label: "Counter Claim" },
  warrantyRefresh: { value: "warranty-refresh", label: "Warranty Refresh" },
  warrantyClaim: { value: "warranty-claim", label: "Warranty Claim" },
  courierFailed: { value: "courier-failed", label: "Courier delivery failed" },
} as const;

export const WARRANTY_SUB_TYPE = {
  repair: { value: "repair", label: "Repair" },
  replace: { value: "replace", label: "Replace" },
  refund: { value: "refund", label: "Refund" },
} as const;

export const SEVEN_DAY_SUB_TYPE = {
  replace: { value: "replace", label: "Replace" },
  refund: { value: "refund", label: "Refund" },
} as const;

export const INTERNAL_CLAIM_STATUS = {
  received: { value: "received", label: "Received" },
  inRepair: { value: "in-repair", label: "In repair" },
  inQc: { value: "in-qc", label: "In QC" },
  repaired: { value: "repaired", label: "Repaired" },
  rerouted: { value: "rerouted", label: "Rerouted" },
  closed: { value: "closed", label: "Closed / returned" },
  counterClaim: { value: "counter-claim", label: "Counter Claim" },
  replace: { value: "replace", label: "Replace" },
  refund: { value: "refund", label: "Refund" },
  pendingApproval: { value: "pending-approval", label: "Pending approval" },
  approved: { value: "approved", label: "Approved" },
} as const;

export const CUSTOMER_REQUEST_STATUS = {
  submitted: { value: "submitted", label: "Submitted" },
  underReview: { value: "under-review", label: "Under Review" },
  accepted: { value: "accepted", label: "Claim Accepted" },
  rejected: { value: "rejected", label: "Rejected" },
  routedAfterSales: { value: "routed-after-sales", label: "Routed to after-sales" },
  routedReturnDept: { value: "routed-return-dept", label: "Routed to Return (After-sales)" },
  inRepair: { value: "in-repair", label: "In Repair" },
  completed: { value: "completed", label: "Completed" },
  closed: { value: "closed", label: "Closed" },
} as const;

export const REQUEST_INTAKE_TYPE = {
  sevenDay: { value: "seven-day", label: "7 Days claim" },
  warranty: { value: "warranty", label: "Warranty claim" },
} as const;

export const PARTY_TYPE = {
  dealer: { value: "dealer", label: "Dealer (SAP B1)" },
  customer: { value: "customer", label: "Customer (Shopify / outlet)" },
} as const;

/** WMS permission keys — assign on AppUser.permissions */
export const PERMISSIONS = {
  serialMaster: "serial-master",
  dispatchWarehouse: "dispatch-warehouse",
  dispatchOutlet: "dispatch-outlet",
  dispatchEcommerce: "dispatch-ecommerce",
  warrantyCheck: "warranty-check",
  claimsAfterSales: "claims-after-sales",
  claimsCustomerSupport: "claims-customer-support",
  /** @deprecated use claimsAfterSales — Return screen is after-sales */
  returnDept: "return-dept",
  warrantyRefresh: "warranty-refresh",
  warrantyReset: "warranty-reset",
  adminUsers: "admin-users",
  adminAudit: "admin-audit",
  /** @deprecated migrated in storage */
  dispatch: "dispatch",
  claims: "claims",
  claimRequests: "claim-requests",
  courierExceptions: "courier-exceptions",
  admin: "admin",
} as const;

export type SerialStatusValue =
  (typeof SERIAL_STATUS)[keyof typeof SERIAL_STATUS]["value"];
export type DispatchChannelValue =
  (typeof DISPATCH_CHANNEL)[keyof typeof DISPATCH_CHANNEL]["value"];
export type InternalClaimCategoryValue =
  (typeof INTERNAL_CLAIM_CATEGORY)[keyof typeof INTERNAL_CLAIM_CATEGORY]["value"];
export type WarrantySubTypeValue =
  (typeof WARRANTY_SUB_TYPE)[keyof typeof WARRANTY_SUB_TYPE]["value"];
export type SevenDaySubTypeValue =
  (typeof SEVEN_DAY_SUB_TYPE)[keyof typeof SEVEN_DAY_SUB_TYPE]["value"];
export type InternalClaimStatusValue =
  (typeof INTERNAL_CLAIM_STATUS)[keyof typeof INTERNAL_CLAIM_STATUS]["value"];
export type CustomerRequestStatusValue =
  (typeof CUSTOMER_REQUEST_STATUS)[keyof typeof CUSTOMER_REQUEST_STATUS]["value"];
export type RequestIntakeTypeValue =
  (typeof REQUEST_INTAKE_TYPE)[keyof typeof REQUEST_INTAKE_TYPE]["value"];
export type PartyTypeValue =
  (typeof PARTY_TYPE)[keyof typeof PARTY_TYPE]["value"];
export type PermissionKey =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
