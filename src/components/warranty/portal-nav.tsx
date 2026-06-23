"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  PackageCheck,
  ScanLine,
  Tags,
} from "lucide-react";

const tabs = [
  {
    label: "Warranty Entry",
    href: "/dashboard/serial-master",
    icon: Tags,
    external: false,
  },
  {
    label: "Dispatch",
    href: "/dashboard/dispatch",
    icon: PackageCheck,
    external: false,
  },
  {
    label: "File Claim",
    href: "/warranty/claim",
    icon: ClipboardList,
    external: false,
  },
  {
    label: "Check Warranty",
    href: "/check",
    icon: ScanLine,
    external: false,
  },
];

export function PortalNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 border-b border-slate-200 pb-1">
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/warranty/claim"
            ? pathname.startsWith("/warranty/claim")
            : pathname === tab.href || pathname.startsWith(tab.href + "/");
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`inline-flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "border border-b-0 border-slate-200 bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Icon
              className={`h-4 w-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`}
            />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
