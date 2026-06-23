import {
  buildFullSeedData,
  seedSalesOrders,
} from "./generate-seed-data";
import { DEMO_USERS_SEED } from "./permissions";
import type { AppData } from "./types";

/** Bump when seed structure changes — triggers demo data reload */
export const SEED_VERSION = "6.3.1";

export { DEMO_SERIAL_PINS } from "./seed-scenarios";

const seed = buildFullSeedData();

export const defaultAppData: AppData = {
  salesOrders: seedSalesOrders,
  serials: seed.serials,
  warrantyDispatches: seed.warrantyDispatches,
  dispatches: seed.dispatches,
  claims: seed.claims,
  courierExceptions: seed.courierExceptions,
  auditLogs: seed.auditLogs,
  users: DEMO_USERS_SEED.map((u) => ({ ...u, permissions: [...u.permissions] })),
};

/** Customer claim requests — stored in Warranty_Claim_Request */
export const defaultClaimRequests = seed.claimRequests;
