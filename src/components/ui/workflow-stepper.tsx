"use client";

import { Check } from "lucide-react";

export type WorkflowStep = {
  id: string;
  label: string;
  description?: string;
};

export function WorkflowStepper({
  steps,
  currentStepId,
  variant = "horizontal",
}: {
  steps: WorkflowStep[];
  currentStepId: string;
  variant?: "horizontal" | "vertical";
}) {
  const currentIndex = steps.findIndex((s) => s.id === currentStepId);

  if (variant === "vertical") {
    return (
      <ol className="space-y-0">
        {steps.map((step, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          return (
            <li key={step.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <StepDot done={done} active={active} index={index + 1} />
                {index < steps.length - 1 && (
                  <div
                    className={`my-1 w-0.5 flex-1 min-h-[24px] ${
                      done ? "bg-orange-400" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
              <div className="pb-6">
                <p
                  className={`text-sm font-medium ${
                    active ? "text-orange-700" : done ? "text-slate-700" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="mt-0.5 text-xs text-slate-500">{step.description}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      {steps.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        return (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
                active
                  ? "bg-orange-100 text-orange-800 ring-1 ring-orange-200"
                  : done
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-slate-100 text-slate-500"
              }`}
            >
              <StepDot done={done} active={active} index={index + 1} compact />
              <span>{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <span className="mx-1 text-slate-300">→</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function StepDot({
  done,
  active,
  index,
  compact,
}: {
  done: boolean;
  active: boolean;
  index: number;
  compact?: boolean;
}) {
  const size = compact ? "h-5 w-5 text-[10px]" : "h-7 w-7 text-xs";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${size} ${
        active
          ? "bg-orange-600 text-white"
          : done
            ? "bg-emerald-600 text-white"
            : "bg-slate-200 text-slate-500"
      }`}
    >
      {done && !active ? <Check className={compact ? "h-3 w-3" : "h-4 w-4"} /> : index}
    </span>
  );
}
