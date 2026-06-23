/** Demo SAP Business One — Business Partners (Card Code) for WMS documents */

export type SapCustomer = {
  cardCode: string;
  customerName: string;
  region: string;
  /** Optional SAP payment terms label for demo */
  paymentTerms?: string;
};

export const sapCustomers: SapCustomer[] = [
  { cardCode: "C00001", customerName: "Metro Audio Distributors", region: "UAE", paymentTerms: "Net 30" },
  { cardCode: "C00002", customerName: "Pacific Retail Group", region: "KSA", paymentTerms: "Net 45" },
  { cardCode: "C00003", customerName: "SoundWave Trading Co.", region: "UAE", paymentTerms: "Net 30" },
  { cardCode: "C00004", customerName: "Elite Gadgets Ltd", region: "Qatar", paymentTerms: "Net 15" },
  { cardCode: "C00005", customerName: "North Star Electronics", region: "Bahrain", paymentTerms: "Net 30" },
  { cardCode: "C00006", customerName: "Vertex Supply Chain", region: "UAE", paymentTerms: "Net 60" },
  { cardCode: "C00007", customerName: "Horizon Wholesale", region: "Oman", paymentTerms: "Net 30" },
  { cardCode: "C00008", customerName: "Summit Tech Partners", region: "KSA", paymentTerms: "Net 45" },
  { cardCode: "C00009", customerName: "Gulf Premium Outlets", region: "UAE", paymentTerms: "Net 30" },
  { cardCode: "C00010", customerName: "National Tech Resellers", region: "KSA", paymentTerms: "Net 30" },
];

export const DEFAULT_SAP_CARD_CODE = sapCustomers[0]?.cardCode ?? "C00001";

export function getSapCustomer(cardCode: string): SapCustomer | undefined {
  return sapCustomers.find((c) => c.cardCode === cardCode);
}

export function formatSapCardCodeLabel(cardCode: string): string {
  const c = getSapCustomer(cardCode);
  if (!c) return cardCode;
  return `${c.cardCode} — ${c.customerName} (${c.region})`;
}

export type SapCardCodeSelectOption = {
  value: string;
  label: string;
};

/** Options for &lt;select&gt; — SAP card codes only (no legacy CUST-* ids) */
export function getSapCardCodeSelectOptions(includePlaceholder = false): SapCardCodeSelectOption[] {
  const rows = sapCustomers.map((c) => ({
    value: c.cardCode,
    label: `${c.cardCode} — ${c.customerName} (${c.region})`,
  }));
  if (!includePlaceholder) return rows;
  return [{ value: "", label: "Select SAP card code" }, ...rows];
}
