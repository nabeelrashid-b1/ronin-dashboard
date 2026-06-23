import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PlaceholderPanel({
  title,
  description,
  fields,
}: {
  title: string;
  description: string;
  fields: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field}>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                {field}
              </label>
              <input
                type="text"
                disabled
                placeholder={`${field} — coming soon`}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400"
              />
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Form logic will be wired in the next iteration. Data persists in localStorage for testing.
        </p>
      </CardContent>
    </Card>
  );
}
