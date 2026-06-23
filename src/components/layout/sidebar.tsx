"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, type NavItem } from "@/config/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { PermissionKey } from "@/config/fields";
import { ChevronDown, Shield } from "lucide-react";
import { useState } from "react";

function canSeeItem(item: NavItem, can: (p: PermissionKey) => boolean): boolean {
  if (item.href === "/dashboard") return true;
  if (item.permission) return can(item.permission);
  if (item.children?.length) {
    return item.children.some((c) => canSeeItem(c, can));
  }
  if (item.permissions?.length) {
    return item.permissions.some((p) => can(p));
  }
  return true;
}

function NavLink({
  item,
  depth = 0,
}: {
  item: NavItem;
  depth?: number;
}) {
  const pathname = usePathname();
  const isActive =
    item.href &&
    (item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.href));
  const Icon = item.icon;
  const pad = depth > 0 ? "pl-9" : "px-3";

  if (!item.href) return null;

  return (
    <Link
      href={item.href}
      className={`group flex items-start gap-3 rounded-lg py-2.5 transition-colors ${pad} ${
        isActive
          ? "bg-orange-600/15 text-white ring-1 ring-orange-500/30"
          : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
      }`}
    >
      <Icon
        className={`mt-0.5 h-4 w-4 shrink-0 ${
          isActive ? "text-orange-400" : "text-slate-500 group-hover:text-slate-300"
        }`}
      />
      <div className="min-w-0 flex-1">
        <span className="text-sm font-medium leading-none">{item.title}</span>
        {item.description && depth > 0 && (
          <p className="mt-1 truncate text-[10px] text-slate-500">{item.description}</p>
        )}
      </div>
    </Link>
  );
}

function NavGroup({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const childActive = item.children?.some(
    (c) => c.href && pathname.startsWith(c.href),
  );
  const [open, setOpen] = useState(childActive ?? true);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-slate-400 hover:bg-slate-900 hover:text-slate-100"
      >
        <item.icon className="h-4 w-4 shrink-0 text-slate-500" />
        <span className="flex-1 text-sm font-medium">{item.title}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="mt-0.5 space-y-0.5 border-l border-slate-800 ml-5 pl-1">
          {item.children?.map((child) => (
            <NavLink key={child.href ?? child.title} item={child} depth={1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const { can, user } = useCurrentUser();

  const visible = navItems.filter((item) => canSeeItem(item, can));

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-800/50 bg-slate-950 text-slate-300">
      <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-600 text-white shadow-lg shadow-orange-900/40">
          <Shield className="h-5 w-5" strokeWidth={2.25} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold tracking-wide text-white">RONIN</p>
          <p className="truncate text-[11px] uppercase tracking-wider text-slate-500">
            E-Warranty Portal
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          Menu
        </p>
        {visible.map((item) =>
          item.children?.length ? (
            <NavGroup key={item.title} item={item} />
          ) : (
            <NavLink key={item.href ?? item.title} item={item} />
          ),
        )}
      </nav>

      <div className="border-t border-slate-800 px-5 py-4">
        <p className="text-[11px] text-slate-600">Demo · localStorage</p>
      </div>
    </aside>
  );
}
