"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FileText } from "lucide-react";
import { useAppDataContext } from "@/components/providers/app-data-provider";
import { generateClaimId } from "@/lib/claim-id";
import { REQUEST_INTAKE_TYPE } from "@/config/fields";
import { buildItemDescription, isWithinSevenDaysFromDispatch } from "@/lib/claim-utils";
import { findSerialByScan } from "@/lib/dispatch-utils";
import { generateId } from "@/lib/storage";
import type { PurchaseFrom, RequestIntakeType, WarrantyClaimRequest } from "@/lib/types";
import { saveWarrantyClaimRequest } from "@/lib/warranty-claim-request";
import { getNewClaimIneligibilityReason } from "@/lib/claim-utils";
import { canCustomerFileClaim, getWarrantyStatusView, warrantyStatusLabels } from "@/lib/warranty-status";

type FormState = {
  fullName: string;
  qrCode: string;
  productName: string;
  purchaseFrom: PurchaseFrom | "";
  requestIntakeType: RequestIntakeType | "";
  shopifyOrderId: string;
  email: string;
  contactNumber: string;
  problemDescription: string;
};

const purchaseOptions: { value: PurchaseFrom; label: string }[] = [
  { value: "official-outlet", label: "Official Brand Outlet" },
  { value: "market-retail", label: "Market / Retail Store" },
  { value: "online", label: "Online" },
];

export function CustomerClaimForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, isReady } = useAppDataContext();

  const serialParam =
    searchParams.get("sn") ??
    searchParams.get("serial") ??
    "";
  const qrParam = searchParams.get("qr") ?? "";

  const [submittedClaimId, setSubmittedClaimId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    fullName: "",
    qrCode: qrParam || serialParam,
    productName: "",
    purchaseFrom: "",
    requestIntakeType: "",
    shopifyOrderId: "",
    email: "",
    contactNumber: "",
    problemDescription: "",
  });

  const serial = useMemo(() => {
    if (!data || !form.qrCode.trim()) return undefined;
    return findSerialByScan(data.serials, form.qrCode);
  }, [data, form.qrCode]);

  const withinSevenDays = useMemo(
    () =>
      serial?.warrantyStartDate
        ? isWithinSevenDaysFromDispatch(serial.warrantyStartDate)
        : false,
    [serial],
  );

  const sevenDayLocked = Boolean(serial?.warrantyStartDate && !withinSevenDays);

  useEffect(() => {
    if (serial) {
      setForm((prev) => ({
        ...prev,
        productName: serial.itemName,
        qrCode: serial.qrCode,
      }));
    } else if (qrParam || serialParam) {
      setForm((prev) => ({
        ...prev,
        qrCode: qrParam || serialParam,
        productName: prev.productName,
      }));
    }
  }, [serial, qrParam, serialParam]);

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.fullName.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!form.qrCode.trim()) {
      setError("QR code / warranty sticker ID is required.");
      return;
    }
    if (!form.purchaseFrom) {
      setError("Please select where you purchased the product.");
      return;
    }
    if (!form.contactNumber.trim()) {
      setError("Contact number is required.");
      return;
    }
    if (!form.problemDescription.trim()) {
      setError("Please describe the product issue.");
      return;
    }
    if (!serial) {
      setError("Invalid QR code — product not found. Check warranty from Check Warranty tab.");
      return;
    }

    if (!form.requestIntakeType) {
      setError("Please select claim type (7-day or warranty).");
      return;
    }

    if (form.requestIntakeType === "seven-day") {
      if (form.purchaseFrom === "market-retail") {
        setError("7-day claims are for online or official outlet purchases only.");
        return;
      }
      if (!serial.warrantyStartDate || !isWithinSevenDaysFromDispatch(serial.warrantyStartDate)) {
        setError("7-day claim must be within 7 days of dispatch date.");
        return;
      }
    } else if (!canCustomerFileClaim(serial)) {
      setError(
        getNewClaimIneligibilityReason(serial) ??
          "This item is not eligible for a new warranty claim.",
      );
      return;
    }

    if (form.purchaseFrom === "online" && !form.shopifyOrderId.trim()) {
      setError("Shopify Order ID is required for online purchases.");
      return;
    }

    const statusView = getWarrantyStatusView(serial);
    const claimId = generateClaimId();
    const record: WarrantyClaimRequest = {
      id: generateId(),
      claimId,
      requestIntakeType: form.requestIntakeType as RequestIntakeType,
      fullName: form.fullName.trim(),
      qrCode: form.qrCode.trim(),
      serialNumber: serial.serialNumber,
      productName: serial.itemName,
      itemCode: serial.itemCode,
      itemDescription: buildItemDescription(serial),
      purchaseFrom: form.purchaseFrom as PurchaseFrom,
      shopifyOrderId:
        form.purchaseFrom === "online" ? form.shopifyOrderId.trim() : undefined,
      email: form.email.trim(),
      contactNumber: form.contactNumber.trim(),
      claimType: "warranty-repair",
      problemDescription: form.problemDescription.trim(),
      warrantyStartDate: serial.warrantyStartDate,
      warrantyEndDate: serial.warrantyEndDate,
      warrantyStatusAtSubmit: warrantyStatusLabels[statusView].label,
      status: "submitted",
      statusHistory: [
        {
          status: "submitted",
          changedBy: "Customer",
          changedAt: new Date().toISOString(),
          notes: "Customer submitted warranty repair request online",
        },
      ],
      submittedAt: new Date().toISOString(),
    };

    saveWarrantyClaimRequest(record);
    setSubmittedClaimId(claimId);
  }

  if (!isReady) {
    return (
      <p className="text-center text-sm text-slate-500">Loading warranty data…</p>
    );
  }

  if (submittedClaimId) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
          <FileText className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-slate-900">Claim submitted</h2>
        <p className="mt-2 font-mono text-sm text-emerald-800">{submittedClaimId}</p>
        <p className="mt-2 text-sm text-slate-600">
          Your warranty repair request has been saved. RONIN will review and update status.
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Reference stored in{" "}
          <code className="rounded bg-white px-1">Warranty_Claim_Request</code>
        </p>
        <button
          type="button"
          onClick={() => router.push("/check")}
          className="mt-6 text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back to warranty check
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-xl font-bold text-slate-900">File a Warranty Claim</h1>
      <p className="mt-1 text-sm text-slate-500">
        Please fill out the form below to submit your warranty claim.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              placeholder="John Doe"
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              QR Code/Warranty Sticker ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.qrCode}
              onChange={(e) => updateField("qrCode", e.target.value)}
              placeholder="RON-W-12345"
              className={inputClass}
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Product Name
          </label>
          <input
            type="text"
            readOnly
            value={form.productName}
            placeholder="Auto-filled from QR scan"
            className={`${inputClass} bg-slate-50`}
          />
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-slate-700">
            Purchase From <span className="text-red-500">*</span>
          </legend>
          <div className="flex flex-wrap gap-4">
            {purchaseOptions.map((opt) => (
              <label
                key={opt.value}
                className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700"
              >
                <input
                  type="radio"
                  name="purchaseFrom"
                  value={opt.value}
                  checked={form.purchaseFrom === opt.value}
                  onChange={() => updateField("purchaseFrom", opt.value)}
                  className="h-4 w-4 border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-slate-700">
            Claim type <span className="text-red-500">*</span>
          </legend>
          {sevenDayLocked && (
            <p className="mb-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
              More than 7 days since dispatch — 7-day refund/replace is locked. Submit as a warranty
              claim; support will route to after-sales.
            </p>
          )}
          <div className="flex flex-wrap gap-4">
            {Object.values(REQUEST_INTAKE_TYPE).map((opt) => {
              const disabled = opt.value === "seven-day" && sevenDayLocked;
              return (
                <label
                  key={opt.value}
                  className={`inline-flex items-center gap-2 text-sm ${
                    disabled ? "cursor-not-allowed text-slate-400" : "cursor-pointer text-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="requestIntakeType"
                    value={opt.value}
                    checked={form.requestIntakeType === opt.value}
                    disabled={disabled}
                    onChange={() => updateField("requestIntakeType", opt.value)}
                    className="h-4 w-4 border-slate-300 text-emerald-600 focus:ring-emerald-500 disabled:opacity-40"
                  />
                  {opt.label}
                </label>
              );
            })}
          </div>
          {form.requestIntakeType === "seven-day" && !sevenDayLocked && (
            <p className="mt-2 text-xs text-slate-500">
              7-day claims must be filed within 7 days of dispatch date (online or official outlet).
            </p>
          )}
        </fieldset>

        {form.purchaseFrom === "online" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Shopify Order ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.shopifyOrderId}
              onChange={(e) => updateField("shopifyOrderId", e.target.value)}
              placeholder="e.g. SHOP-10042"
              className={inputClass}
            />
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="john@example.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={form.contactNumber}
              onChange={(e) => updateField("contactNumber", e.target.value)}
              placeholder="+92 300 1234567"
              className={inputClass}
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Claim Type
          </label>
          <input readOnly value="Warranty Claim (Repair)" className={`${inputClass} bg-slate-50`} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Describe Product Issue / Problem <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.problemDescription}
            onChange={(e) => updateField("problemDescription", e.target.value)}
            rows={5}
            placeholder="Please describe the issue you're experiencing with the product in detail..."
            className={inputClass}
            required
          />
        </div>

        {serial && (
          <p className="text-xs text-slate-500">
            Linked serial: <span className="font-mono">{serial.serialNumber}</span> ·
            Warranty: {serial.warrantyStartDate || "—"} → {serial.warrantyEndDate || "—"}
          </p>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          <FileText className="h-4 w-4" />
          Submit Claim
        </button>
      </form>
    </div>
  );
}
