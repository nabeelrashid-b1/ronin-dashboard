import type {
  CustomerRequestStatusValue,
  DispatchChannelValue,
  InternalClaimCategoryValue,
  InternalClaimStatusValue,
  PartyTypeValue,
  RequestIntakeTypeValue,
  SerialStatusValue,
  SevenDaySubTypeValue,
  WarrantySubTypeValue,
} from "@/config/fields";

export type SerialStatus = SerialStatusValue;
export type DispatchChannel = DispatchChannelValue;
export type WarrantyPeriodMonths = 14 | 24;
export type InternalClaimCategory = InternalClaimCategoryValue;
export type WarrantySubType = WarrantySubTypeValue;
export type SevenDaySubType = SevenDaySubTypeValue;
export type InternalClaimStatus = InternalClaimStatusValue;
export type CustomerRequestStatus = CustomerRequestStatusValue;
export type RequestIntakeType = RequestIntakeTypeValue;
export type PartyType = PartyTypeValue;

export type PurchaseFrom = "official-outlet" | "market-retail" | "online";

/** Journey entry — who claimed, when, how many times */
export interface ClaimJourneyEntry {
  id: string;
  claimId: string;
  serialNumber: string;
  action: string;
  claimCategory: InternalClaimCategory | "customer";
  claimType?: WarrantySubType | SevenDaySubType | "warranty-repair";
  claimStatus: string;
  performedBy: string;
  performedAt: string;
  notes: string;
  cardCode?: string;
  shopifyOrderId?: string;
  saleable?: boolean;
}

export interface WarrantySerial {
  id: string;
  serialNumber: string;
  itemCode: string;
  itemName: string;
  batchNumber: string;
  printDate: string;
  color: string;
  warrantyPeriod: WarrantyPeriodMonths;
  qrCode: string;
  qrCodeDataUrl?: string;
  status: SerialStatus;
  claimCount: number;
  claimStatus?:any,
  claimHistory: ClaimJourneyEntry[];
  warrantyStartDate: string;
  warrantyEndDate: string;
  createdAt: string;
  dispatchedAt?: string;
  dispatchChannel?: DispatchChannel;
  salesOrderNumber?: string;
  shopifyOrderId?: string;
  outletReference?: string;
  replacedBySerial?: string;
  replacedFromSerial?: string;
  activeClaimId?: string;
  refreshCount?: number;
  /** Courier fraud lockout — blocks dispatch and claims */
  fraudLockout?: CourierFraudLockout;
}

export interface CourierFraudLockout {
  riderId: string;
  courierTrackingCode: string;
  reportNote: string;
  reportFileName?: string;
  lockedAt: string;
  lockedBy: string;
}

export interface CourierExceptionRecord {
  id: string;
  serialNumber: string;
  qrCode: string;
  riderId: string;
  courierTrackingCode: string;
  reportNote: string;
  reportFileName?: string;
  lockedAt: string;
  lockedBy: string;
}

export interface SerialGenerationInput {
  itemCode: string;
  itemName: string;
  qty: number;
  batchNumber: string;
  printDate: string;
  color: string;
  warrantyPeriod: WarrantyPeriodMonths;
}

/** SAP B1 sales order line */
export interface SalesOrderLine {
  lineNum: number;
  itemCode: string;
  itemName: string;
  qty: number;
  quantity?:any
}

/** SAP B1 document status (demo) */
export type SalesOrderStatus = "open" | "closed";

export interface SalesOrder {
  docNum?:any
  quantity?:any
  orderNumber: string;
  orderDate: string;
  /** Total units — sum of line qty when `lines` present */
  qty: number;
  cardCode?: string;
  customerName?: string;
  lines?: SalesOrderLine[];
  /** Defaults to open when omitted */
  status?: SalesOrderStatus;
}

export interface WarrantyDispatchRecord {
  id: string;
  serialNumber: string;
  dispatchChannel: DispatchChannel;
  salesOrderNumber: string;
  salesOrderDate: string;
  dispatchDate: string;
  shopifyOrderId?: string;
  outletReference?: string;
  dispatchType?: "initial" | "replace-redispatch";
}

export interface DispatchRecord {
  id: string;
  dispatchChannel: DispatchChannel;
  salesOrderNumber: string;
  serialNumbers: string[];
  warrantyStartDate: string;
  warrantyEndDate: string;
  finalizedAt: string;
  finalizedBy: string;
  shopifyOrderId?: string;
  outletReference?: string;
}

/** Claim workflow history on Warranty_claim row */
export interface ClaimStatusHistoryEntry {
  status: InternalClaimStatus;
  changedBy: string;
  changedAt: string;
  notes: string;
}

/** Staging / dispatch steps recorded on the warranty claim document */
export interface ClaimStagingLogEntry {
  step: string;
  serialNumber?: string;
  newSerialNumber?: string;
  salesOrderNumber?: string;
  creditNote?: string;
  performedBy: string;
  performedAt: string;
  notes: string;
}

/** Internal / posted customer claim — Warranty_claim table */
export interface WarrantyClaimRecord {
  id: string;
  claimId: string;
  partyType: PartyType;
  qrCode: string;
  serialNumber: string;
  itemCode: string;
  itemName: string;
  itemDescription: string;
  claimCategory: InternalClaimCategory;
  warrantySubType?: WarrantySubType | SevenDaySubType;
  claimStatus: InternalClaimStatus;
  statusHistory: ClaimStatusHistoryEntry[];
  stagingLog?: ClaimStagingLogEntry[];
  oldSerialNumber?: string;
  newSerialNumber?: string;
  salesOrderNumber?: string;
  creditNote?: string;
  cardCode?: string;
  shopifyOrderId?: string;
  customerCode?: string;
  accessoryReplaced?: string;
  returnedUnitSaleable?: boolean;
  warrantyStartDate: string;
  warrantyEndDate: string;
  remarks: string;
  submittedAt: string;
  submittedBy: string;
  linkedRequestId?: string;
  closedAt?: string;
  reroutedTo?: WarrantySubType;
}

/** Customer request status history step */
export interface RequestStatusHistoryEntry {
  status: CustomerRequestStatus;
  changedBy: string;
  changedAt: string;
  notes: string;
}

/** Customer claim — Warranty_Claim_Request table */
export interface WarrantyClaimRequest {
  id: string;
  claimId: string;
  requestIntakeType: RequestIntakeType;
  fullName: string;
  qrCode: string;
  serialNumber: string;
  productName: string;
  itemCode: string;
  itemDescription: string;
  purchaseFrom: PurchaseFrom;
  email: string;
  contactNumber: string;
  shopifyOrderId?: string;
  /** @deprecated use requestIntakeType */
  claimType?: "warranty-repair";
  creditMemoNo?: string;
  problemDescription: string;
  accessoryReplaced?: string;
  warrantyStartDate: string;
  warrantyEndDate: string;
  warrantyStatusAtSubmit: string;
  status: CustomerRequestStatus;
  statusHistory: RequestStatusHistoryEntry[];
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  postedClaimId?: string;
  /** Set by Customer Support when routing replace/refund to Return */
  routedResolution?: "replace" | "refund";
  /** Saleable flag for returned unit — set only on CS routing */
  returnedUnitSaleable?: boolean;
}

/** Operator warranty refresh (approved extension) */
export interface WarrantyRefreshLogEntry {
  id: string;
  serialNumber: string;
  qrCode: string;
  previousStartDate: string;
  previousEndDate: string;
  newEndDate: string;
  monthsExtended: number;
  warrantyPeriodMonths: WarrantyPeriodMonths;
  eligibilityNote: string;
  approvedBy: string;
  refreshAt: string;
  refreshCount: number;
}

/** Manual admin date override (separate from refresh rules) */
export interface WarrantyResetLogEntry {
  id: string;
  serialNumber: string;
  qrCode: string;
  previousStartDate: string;
  previousEndDate: string;
  newStartDate: string;
  newEndDate: string;
  reason: string;
  resetBy: string;
  resetAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  module: string;
  details: string;
  performedBy: string;
  performedAt: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "operator" | "viewer";
  permissions: string[];
  isActive: boolean;
}

export interface AppData {
  serials: WarrantySerial[];
  dispatches: DispatchRecord[];
  warrantyDispatches: WarrantyDispatchRecord[];
  claims?: WarrantyClaimRecord[];
  courierExceptions?: CourierExceptionRecord[];
  auditLogs?: AuditLog[];
  users: AppUser[];
  salesOrders: SalesOrder[];
}

export const STORAGE_KEY = "ronin-ewarranty-data";
export const WARRANTY_MASTER_TABLE_KEY = "Warranty_Master_Table";
export const WARRANTY_DISPATCH_TABLE_KEY = "Warranty_Dispatch";
export const WARRANTY_CLAIM_TABLE_KEY = "Warranty_claim";
export const WARRANTY_CLAIM_REQUEST_TABLE_KEY = "Warranty_Claim_Request";
export const WARRANTY_RESET_LOG_KEY = "Warranty_Reset_Log";
export const WARRANTY_REFRESH_LOG_KEY = "Warranty_Refresh_Log";
