"use client";

import { useMemo } from "react";
import { FIELDS } from "@/config/fields";
import {
  DEFAULT_SAP_CARD_CODE,
  getSapCardCodeSelectOptions,
  getSapCustomer,
} from "@/lib/sap-customers";

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20";

type Props = {
  value: string;
  onChange: (cardCode: string) => void;
  required?: boolean;
  showHint?: boolean;
  includePlaceholder?: boolean;
  className?: string;
  id?: string;
};

/** SAP B1 Card Code dropdown — shared across WMS documents */
export function SapCardCodeSelect({
  value,
  onChange,
  required,
  showHint = true,
  includePlaceholder = false,
  className = inputClass,
  id,
}: Props) {
  const options = useMemo(
    () => getSapCardCodeSelectOptions(includePlaceholder),
    [includePlaceholder],
  );
  const customer = useMemo(() => getSapCustomer(value), [value]);

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-slate-600">
        {FIELDS.cardCode.label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <select
        id={id}
        value={value || DEFAULT_SAP_CARD_CODE}
        onChange={(e) => onChange(e.target.value)}
        className={className}
        required={required}
      >
        {options.map((o) => (
          <option key={o.value || "placeholder"} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {showHint && customer && (
        <p className="mt-1 text-xs text-slate-500">
          SAP BP: {customer.customerName}
          {customer.paymentTerms ? ` · ${customer.paymentTerms}` : ""}
        </p>
      )}
    </div>
  );
}
