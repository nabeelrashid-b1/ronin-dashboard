import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const rules = [
  { rule: "Available only", desc: "Only Available serials can be dispatched" },
  { rule: "No duplicate dispatch", desc: "Dispatched serials cannot be dispatched again" },
  { rule: "Warranty activation", desc: "Warranty starts upon dispatch finalization" },
];

export function DispatchRules() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Warranty rules</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rules.map((r) => (
          <div key={r.rule} className="rounded-lg bg-slate-50 px-3 py-2.5">
            <p className="text-xs font-semibold text-slate-800">{r.rule}</p>
            <p className="mt-0.5 text-xs text-slate-500">{r.desc}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
