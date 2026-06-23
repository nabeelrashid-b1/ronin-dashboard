"use client";

import { useState } from "react";
import { useAppDataContext } from "@/components/providers/app-data-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PERMISSION_MODULES } from "@/config/permission-modules";
import { PERMISSIONS, type PermissionKey } from "@/config/fields";
import { normalizeUserPermissions } from "@/lib/permissions";
import { saveAppData } from "@/lib/storage";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { AppData, AppUser } from "@/lib/types";

export function UsersTable() {
  const { data, updateData } = useAppDataContext();
  const { can, user: current } = useCurrentUser();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftPerms, setDraftPerms] = useState<PermissionKey[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const canEdit = can(PERMISSIONS.adminUsers);

  if (!data) return null;

  function startEdit(user: AppUser) {
    setEditingId(user.id);
    setDraftPerms(normalizeUserPermissions(user));
    setMessage(null);
  }

  function togglePerm(key: PermissionKey) {
    setDraftPerms((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key],
    );
  }

  function saveUser(userId: string) {
    if (!data) return;
    const next: AppData = {
      ...data,
      users: data.users.map((u) =>
        u.id === userId ? { ...u, permissions: [...draftPerms] } : u,
      ),
    };
    saveAppData(next);
    updateData(() => next);
    setEditingId(null);
    setMessage("Permissions saved.");
    window.dispatchEvent(new Event("ronin-user-changed"));
  }

  const grouped = PERMISSION_MODULES.reduce(
    (acc, m) => {
      (acc[m.group] ??= []).push(m);
      return acc;
    },
    {} as Record<string, typeof PERMISSION_MODULES>,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users & module permissions</CardTitle>
        <p className="text-xs text-slate-500">
          Assign document/module access per user. Dispatch channels, after-sales, and customer
          support are separate roles.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>
        )}

        {data.users.map((user) => {
          const isEditing = editingId === user.id;
          const effective = normalizeUserPermissions(user);

          return (
            <div
              key={user.id}
              className="rounded-lg border border-slate-200 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <Badge variant="default" className="capitalize">
                      {user.role}
                    </Badge>
                    <Badge variant={user.isActive ? "success" : "danger"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {user.id === current?.id && (
                      <Badge variant="info">Signed in</Badge>
                    )}
                  </div>
                </div>
                {canEdit && user.role !== "admin" && (
                  <button
                    type="button"
                    onClick={() => (isEditing ? saveUser(user.id) : startEdit(user))}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                  >
                    {isEditing ? "Save permissions" : "Edit permissions"}
                  </button>
                )}
              </div>

              {!isEditing && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {effective.map((p) => (
                    <Badge key={p} variant="default">
                      {PERMISSION_MODULES.find((m) => m.key === p)?.label ?? p}
                    </Badge>
                  ))}
                </div>
              )}

              {isEditing && (
                <div className="mt-4 space-y-4">
                  {Object.entries(grouped).map(([group, modules]) => (
                    <div key={group}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {group}
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {modules.map((m) => (
                          <label
                            key={m.key}
                            className="flex cursor-pointer items-start gap-2 rounded border border-slate-100 bg-slate-50/80 p-2 text-xs"
                          >
                            <input
                              type="checkbox"
                              checked={draftPerms.includes(m.key)}
                              onChange={() => togglePerm(m.key)}
                              className="mt-0.5"
                            />
                            <span>
                              <span className="font-medium text-slate-800">{m.label}</span>
                              <span className="block text-slate-500">{m.description}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {user.role === "admin" && (
                <p className="mt-2 text-xs text-slate-400">Admin has all modules by default.</p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
