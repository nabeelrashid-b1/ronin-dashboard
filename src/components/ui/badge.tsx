import type { ReactNode } from "react";

const variants = {
  default: "bg-slate-100 text-slate-700",
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
  warning: "bg-amber-50 text-amber-800 ring-1 ring-amber-600/20",
  danger: "bg-red-50 text-red-700 ring-1 ring-red-600/20",
  info: "bg-sky-50 text-sky-700 ring-1 ring-sky-600/20",
  accent: "bg-orange-50 text-orange-800 ring-1 ring-orange-600/20",
} as const;

export function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
