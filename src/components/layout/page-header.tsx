import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  phase,
  actions,
}: {
  title: string;
  description: string;
  phase?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        {phase && (
          <span className="mb-2 inline-block rounded-md bg-orange-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-orange-800">
            {phase}
          </span>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
