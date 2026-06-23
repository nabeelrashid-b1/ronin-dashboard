// "use client";

// import { useState } from "react";
// import { Loader2 } from "lucide-react";
// import { useAppDataContext } from "@/components/providers/app-data-provider";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { generateStickerQrDataUrls } from "@/lib/qr";
// import { createSerialRecords } from "@/lib/serial-generator";
// import { generateId } from "@/lib/storage";
// import type { SerialGenerationInput, WarrantyPeriodMonths } from "@/lib/types";
// import { saveWarrantyMasterTable } from "@/lib/warranty-master";
// import { ITEMS_MASTER_DATA } from "@/dummy-data/items";
// const MAX_QTY = 500;

// const emptyForm = {
//   itemCode: "",
//   itemName: "",
//   qty: "",
//   batchNumber: "",
//   printDate: new Date().toISOString().slice(0, 10),
//   color: "",
//   warrantyPeriod: "24" as "" | "14" | "24",
// };

// type FormState = typeof emptyForm;

// function validate(form: FormState): string | null {
//   if (!form.itemCode.trim()) return "Item code is required.";
//   if (!form.itemName.trim()) return "Item name is required.";
//   if (!form.batchNumber.trim()) return "Batch number is required.";
//   if (!form.printDate) return "Print date is required.";
//   if (!form.color.trim()) return "Color is required.";
//   if (!form.warrantyPeriod) return "Warranty period is required.";

//   const qty = Number(form.qty);
//   if (!Number.isInteger(qty) || qty < 1) return "Quantity must be at least 1.";
//   if (qty > MAX_QTY) return `Quantity cannot exceed ${MAX_QTY}.`;

//   return null;
// }

// export function SerialMasterForm({
//   onGenerated,
// }: {
//   onGenerated?: (records: import("@/lib/types").WarrantySerial[], batchLabel: string) => void;
// }) {
//   const { data, updateData } = useAppDataContext();
//   const [form, setForm] = useState<FormState>(emptyForm);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
//   console.log('payload', form) 
//     setForm((prev) => ({ ...prev, [key]: value }));
//     setError(null);
//     setSuccess(null);
//   }


//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);

//     const validationError = validate(form);
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     if (!data) return;

//     setIsSubmitting(true);

//     try {
//       const input: SerialGenerationInput = {
//         itemCode: form.itemCode.trim(),
//         itemName: form.itemName.trim(),
//         qty: Number(form.qty),
//         batchNumber: form.batchNumber.trim(),
//         printDate: form.printDate,
//         color: form.color.trim(),
//         warrantyPeriod: Number(form.warrantyPeriod) as WarrantyPeriodMonths,
//       };

//       const draftRecords = createSerialRecords(input, data.serials, []);
//       const qrDataUrls = await generateStickerQrDataUrls(
//         draftRecords.map((r) => r.serialNumber),
//       );

//       const newRecords = draftRecords.map((record, i) => ({
//         ...record,
//         qrCodeDataUrl: qrDataUrls[i],
//       }));

//       const updatedSerials = [...data.serials, ...newRecords];
//       saveWarrantyMasterTable(updatedSerials);

//       updateData((prev) => ({
//         ...prev,
//         serials: updatedSerials,
//         auditLogs: [
//           {
//             id: generateId(),
//             action: "SERIAL_GENERATED",
//             module: "Serial Master",
//             details: `Generated ${input.qty} serial(s) for ${input.itemCode} / ${input.batchNumber}`,
//             performedBy: "Admin User",
//             performedAt: new Date().toISOString(),
//           },
//           ...prev.auditLogs,
//         ],
//       }));

//       setSuccess(
//         `Successfully generated ${newRecords.length} serial number(s) with QR codes. Saved to Warranty_Master_Table.`,
//       );
//       setForm({ ...emptyForm, printDate: new Date().toISOString().slice(0, 10) });
//       onGenerated?.(
//         newRecords,
//         `${input.itemCode} / ${input.batchNumber} / ${input.color}`,
//       );
//     } catch {
//       setError("Failed to generate serials or QR codes. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   }


//   const inputClass =
//     "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20";


//   const items = Array.isArray(ITEMS_MASTER_DATA?.[0]?.value) ? ITEMS_MASTER_DATA?.[0]?.value : []


//   console.log('serial',data?.serials)
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Generate warranty serials</CardTitle>
//         <CardDescription>
//           Enter item details and quantity. The system generates unique serial numbers and QR
//           codes (serial + item description for scanners), then saves to{" "}
//           <code className="rounded bg-slate-100 px-1 text-xs">Warranty_Master_Table</code>.
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div className="grid gap-4 sm:grid-cols-2">
//             <div>

//               <label className="mb-1.5 block text-xs font-medium text-slate-600">
//                 Item code <span className="text-red-500">*</span>
//               </label>
//               <select
//                 value={form.itemCode}
//                 onChange={(e) => {
//                   const selectedItem = items.find((item:any) => item.ItemCode === e.target.value);
//                   updateField("itemCode", e.target.value || "");
//                   updateField("itemName", selectedItem?.ItemName || "")
//                 }}
//                 className={`${inputClass}`}
//               >
//                 <option value="">Select Item code</option>
//                 {
//                   items.length > 0 ? (
//                     <>
//                       {items.map((item : any, index : any) => (
//                         <option
//                           key={index}
//                           value={item.ItemCode}
//                         >
//                           {item.ItemCode}
//                         </option>
//                       ))}
//                     </>
//                   ) : (
//                     <option disabled>No data</option>
//                   )
//                 }
//               </select>


//               {/* <label className="mb-1.5 block text-xs font-medium text-slate-600">
//                 Item code <span className="text-red-500">*</span>
//               </label> */}



//               {/* <input
//                 type="text"
//                 value={form.itemCode}
//                 onChange={(e) => updateField("itemCode", e.target.value)}
//                 placeholder="e.g. ITM-A100"
//                 className={inputClass}
//               /> */}
//             </div>
//             <div>
//               <label className="mb-1.5 block text-xs font-medium text-slate-600">
//                 Item name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 readOnly
//                 type="text"
//                 value={form.itemName}
//                 // onChange={(e) => updateField("itemName", e.target.value)}
//                 placeholder="e.g. Ronin Pro Headset"
//                 className={inputClass}
//               />
//             </div>
//             <div>
//               <label className="mb-1.5 block text-xs font-medium text-slate-600">
//                 Quantity <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="number"
//                 min={1}
//                 max={MAX_QTY}
//                 value={form.qty}
//                 onChange={(e) => updateField("qty", e.target.value)}
//                 placeholder="e.g. 10"
//                 className={inputClass}
//               />
//             </div>
//             <div>
//               <label className="mb-1.5 block text-xs font-medium text-slate-600">
//                 Batch no <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={form.batchNumber}
//                 onChange={(e) => updateField("batchNumber", e.target.value)}
//                 placeholder="e.g. BATCH-001"
//                 className={inputClass}
//               />
//             </div>
//             <div>
//               <label className="mb-1.5 block text-xs font-medium text-slate-600">
//                 Print date <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="date"
//                 value={form.printDate}
//                 onChange={(e) => updateField("printDate", e.target.value)}
//                 className={inputClass}
//               />
//             </div>
//             <div>
//               <label className="mb-1.5 block text-xs font-medium text-slate-600">
//                 Color <span className="text-red-500">*</span>
//               </label>
//               {/* <input
//                 type="text"
//                 value={form.color}
//                 onChange={(e) => updateField("color", e.target.value)}
//                 placeholder="e.g. Black"
//                 className={inputClass}
//               /> */}
//               {/* update to select with preset options  */}
//               <select
//                 // value={form.color}
//                 onChange={(e) => updateField("color", e.target.value)}
//                 className={`${inputClass} mt-2`}
//               >
//                 <option value="">Select color</option>
//                 <option value="Black">Black</option>
//                 <option value="White">White</option>
//                 <option value="Red">Red</option>
//                 <option value="Blue">Blue</option>
//               </select>
//             </div>
//             <div className="sm:col-span-2">
//               <label className="mb-1.5 block text-xs font-medium text-slate-600">
//                 Warranty period <span className="text-red-500">*</span>
//               </label>
//               <select
//                 value={form.warrantyPeriod}
//                 onChange={(e) =>
//                   updateField("warrantyPeriod", e.target.value as FormState["warrantyPeriod"])
//                 }
//                 className={inputClass}
//               >
//                 <option value="">Select period</option>
//                 <option value="14">14 months</option>
//                 <option value="24">24 months</option>
//               </select>
//             </div>
//           </div>

//           <div className="rounded-lg bg-slate-50 px-4 py-3 text-xs text-slate-600">
//             <p className="font-medium text-slate-700">On submit, each record includes:</p>
//             <ul className="mt-2 list-inside list-disc space-y-0.5">
//               <li>Auto-generated serial number (per item code + batch)</li>
//               <li>Warranty start / end date (empty until dispatch)</li>
//               <li>Claim count = 0, status = Available</li>
//               <li>Sticker QR = warranty check URL with serial (Ronin 17×20 mm layout)</li>
//               <li>Master record keeps serial + description payload for internal scanners</li>
//               <li>Print-ready label sheet shown after generation</li>
//             </ul>
//           </div>

//           {error && (
//             <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
//           )}
//           {success && (
//             <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
//               {success}
//             </p>
//           )}

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 Generating…
//               </>
//             ) : (
//               "Generate serials & QR codes"
//             )}
//           </button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }






"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAppDataContext } from "@/components/providers/app-data-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateStickerQrDataUrls } from "@/lib/qr";
import { createSerialRecords } from "@/lib/serial-generator";
import { generateId } from "@/lib/storage";
import type { SerialGenerationInput, WarrantyPeriodMonths } from "@/lib/types";
import { saveWarrantyMasterTable } from "@/lib/warranty-master";
import { ITEMS_MASTER_DATA } from "@/dummy-data/items";
import { serialItemData } from "@/lib/storage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Combobox } from "@headlessui/react";
// import { Loader2 } from "lucide-react";
import { saveSerialItemData } from "@/lib/storage";



type SerialPayload = {
  itemCode: string;
  itemName: string;
  qty: number;
  batchNumber: string;
  printDate: string;
  color: string;
};

type ApiResponse = {
  message: string;
  success: boolean;
};


const MAX_QTY = 500;

const emptyForm = {
  itemCode: "",
  itemName: "",
  qty: "",
  batchNumber: "",
  printDate: new Date().toISOString().slice(0, 10),
  color: "",
  warrantyPeriod: "24" as "" | "14" | "24",
};

type FormState = typeof emptyForm;

function validate(form: FormState): string | null {
  if (!form.itemCode.trim()) return "Item code is required.";
  if (!form.itemName.trim()) return "Item name is required.";
  if (!form.batchNumber.trim()) return "Batch number is required.";
  if (!form.printDate) return "Print date is required.";
  if (!form.color.trim()) return "Color is required.";
  if (!form.warrantyPeriod) return "Warranty period is required.";

  const qty = Number(form.qty);
  if (!Number.isInteger(qty) || qty < 1) return "Quantity must be at least 1.";
  if (qty > MAX_QTY) return `Quantity cannot exceed ${MAX_QTY}.`;

  return null;
}

export function SerialMasterForm({
  onGenerated,
}: {
  onGenerated?: (records: import("@/lib/types").WarrantySerial[], batchLabel: string) => void;
}) {
  const { data, updateData } = useAppDataContext();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //  const { mutate, isPending, data:savedSerial } = useSaveSerialItems();

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    console.log('payload', form)
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
    setSuccess(null);
  }

  const {
    mutateAsync,
    isPending,
    error: apiError,
  } = useMutation<ApiResponse, Error, SerialPayload>({
    mutationFn: saveSerialItemData,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validate(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!data) return;

    setIsSubmitting(true);

    try {
      const input: SerialGenerationInput = {
        itemCode: form.itemCode.trim(),
        itemName: form.itemName.trim(),
        qty: Number(form.qty),
        batchNumber: form.batchNumber.trim(),
        printDate: form.printDate,
        color: form.color.trim(),
        warrantyPeriod: Number(form.warrantyPeriod) as WarrantyPeriodMonths,
      };

      // 1️⃣ API CALL (WAIT for response)
      const response = await mutateAsync(input as any);
      const draftRecords = createSerialRecords(input, data.serials, []);

      const qrDataUrls = await generateStickerQrDataUrls(
        draftRecords.map((r) => r.serialNumber),
      );


      const newRecords = draftRecords.map((record, i) => ({
        ...record,
        qrCodeDataUrl: qrDataUrls[i],
      }));
      //// 

      const updatedSerials = [...data.serials, ...newRecords];
      saveWarrantyMasterTable(updatedSerials);

      updateData((prev) => ({
        ...prev,
        serials: updatedSerials,
        auditLogs: [
          {
            id: generateId(),
            action: "SERIAL_GENERATED",
            module: "Serial Master",
            details: `Generated ${input.qty} serial(s) for ${input.itemCode} / ${input.batchNumber}`,
            performedBy: "Admin User",
            performedAt: new Date().toISOString(),
          },
          ...prev.auditLogs,
        ],
      }));

      // setSuccess(
      //   `Successfully generated ${newRecords.length} serial number(s) with QR codes. Saved to Warranty_Master_Table.`,
      // );
      // 3️⃣ SUCCESS MESSAGE (ONLY HERE)
      setSuccess(
        response?.message ||
        `Successfully generated ${newRecords.length} serial number(s) with QR codes. Saved to Warranty_Master_Table.`
      );
      setForm({ ...emptyForm, printDate: new Date().toISOString().slice(0, 10) });
      onGenerated?.(
        newRecords,
        `${input.itemCode} / ${input.batchNumber} / ${input.color}`,
      );
    } catch (err: any) {
      //  setError("Failed to generate serials or QR codes. Please try again.");
      setError(
        err?.message
        ||
        apiError?.message ||
        "Failed to generate serials or QR codes. Please try again"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20";


  // const items = Array.isArray(ITEMS_MASTER_DATA?.[0]?.value) ? ITEMS_MASTER_DATA?.[0]?.value : []


  console.log('serial', data?.serials)

  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ["items"],
    queryFn: serialItemData,
  });

  console.log('item', items)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate warranty serials</CardTitle>
        <CardDescription>
          Enter item details and quantity. The system generates unique serial numbers and QR
          codes (serial + item description for scanners), then saves to{" "}
          <code className="rounded bg-slate-100 px-1 text-xs">Warranty_Master_Table</code>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Item code <span className="text-red-500">*</span>
              </label>
              <select
                disabled={isLoading || isError || items.length === 0}
                value={form.itemCode}
                onChange={(e) => {
                  const selectedItem = items.find(
                    (item: any) => item.itemCode === e.target.value
                  );

                  updateField("itemCode", e.target.value || "");
                  updateField("itemName", selectedItem?.itemName || "");
                }}
                className={inputClass}
              >
                {/* LOADING STATE */}
                {isLoading && (
                  <option value="" disabled>
                    Loading items...
                  </option>
                )}

                {/* ERROR STATE */}
                {!isLoading && isError && (
                  <option value="" disabled>
                    Failed to load items
                  </option>
                )}

                {/* EMPTY STATE */}
                {!isLoading && !isError && items.length === 0 && (
                  <option value="" disabled>
                    No items available
                  </option>
                )}

                {/* DEFAULT PLACEHOLDER */}
                {!isLoading && !isError && items.length > 0 && (
                  <option value="">Select Item Code</option>
                )}

                {/* ITEMS LIST */}
                {!isLoading &&
                  !isError &&
                  items.length > 0 &&
                  items.map((item: any) => (
                    <option key={item.itemCode} value={item.itemCode}>
                      {item.itemCode}
                    </option>
                  ))}
              </select>



              {/* <select
                value={form.itemCode}
                onChange={(e) => {
                  const selectedItem = items.find((item:any) => item.ItemCode === e.target.value);
                  updateField("itemCode", e.target.value || "");
                  updateField("itemName", selectedItem?.ItemName || "")
                }}
                className={`${inputClass}`}
              >
                <option value="">Select Item code</option>
                {
                  items.length > 0 ? (
                    <>
                      {items.map((item : any, index : any) => (
                        <option
                          key={index}
                          value={item.ItemCode}
                        >
                          {item.ItemCode}
                        </option>
                      ))}
                    </>
                  ) : (
                    <option disabled>No data</option>
                  )
                }
              </select> */}


              {/* <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Item code <span className="text-red-500">*</span>
              </label> */}



              {/* <input
                type="text"
                value={form.itemCode}
                onChange={(e) => updateField("itemCode", e.target.value)}
                placeholder="e.g. ITM-A100"
                className={inputClass}
              /> */}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Item name <span className="text-red-500">*</span>
              </label>
              <input
                readOnly
                type="text"
                value={form.itemName}
                // onChange={(e) => updateField("itemName", e.target.value)}
                placeholder="e.g. Ronin Pro Headset"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={MAX_QTY}
                value={form.qty}
                onChange={(e) => updateField("qty", e.target.value)}
                placeholder="e.g. 10"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Batch no <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.batchNumber}
                onChange={(e) => updateField("batchNumber", e.target.value)}
                placeholder="e.g. BATCH-001"
                className={inputClass}
              />
            </div>
            {/* <div> */}
              {/* <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Print date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.printDate}
                onChange={(e) => updateField("printDate", e.target.value)}
                className={inputClass}
              />
            </div> */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Color <span className="text-red-500">*</span>
              </label>
              {/* <input
                type="text"
                value={form.color}
                onChange={(e) => updateField("color", e.target.value)}
                placeholder="e.g. Black"
                className={inputClass}
              /> */}
              {/* update to select with preset options  */}
              <select
                // value={form.color}
                onChange={(e) => updateField("color", e.target.value)}
                className={`${inputClass} mt-2`}
              >
                <option value="">Select color</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Red">Red</option>
                <option value="Blue">Blue</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Warranty period <span className="text-red-500">*</span>
              </label>
              <select
                value={form.warrantyPeriod}
                onChange={(e) =>
                  updateField("warrantyPeriod", e.target.value as FormState["warrantyPeriod"])
                }
                className={inputClass}
              >
                <option value="">Select period</option>
                <option value="14">14 months</option>
                <option value="24">24 months</option>
              </select>
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 px-4 py-3 text-xs text-slate-600">
            <p className="font-medium text-slate-700">On submit, each record includes:</p>
            <ul className="mt-2 list-inside list-disc space-y-0.5">
              <li>Auto-generated serial number (per item code + batch)</li>
              <li>Warranty start / end date (empty until dispatch)</li>
              <li>Claim count = 0, status = Available</li>
              <li>Sticker QR = warranty check URL with serial (Ronin 17×20 mm layout)</li>
              <li>Master record keeps serial + description payload for internal scanners</li>
              <li>Print-ready label sheet shown after generation</li>
            </ul>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
          {success && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {success}
            </p>
          )}


          {/* {isSuccess && apiResponse && (
        <p style={{ color: "green" }}>
          { success ||  apiResponse.message }
        </p>
      )}

      {apiisError && apiError && (
        <p style={{ color: "red" }}>
          { error ||  apiError.message}
        </p>
      )} */}

          {/* <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              "Generate serials & QR codes"
            )}
          </button> */}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              "Generate serials & QR codes"
            )}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}

