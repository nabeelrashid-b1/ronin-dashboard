import type { AppUser } from "./types";

export const CURRENT_USER_KEY = "ronin-current-user-id";

export function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(CURRENT_USER_KEY);
}

export function setCurrentUserId(userId: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CURRENT_USER_KEY, userId);
}

export function resolveCurrentUser(users: AppUser[]): AppUser | undefined {
  const id = getCurrentUserId();
  console.log('users',users)
  console.log('users',id)
  
  const found = id ? users?.find((u) => u.id === id && u.isActive) : undefined;
  return found ?? users?.find((u) => u.role === "admin" && u.isActive) ?? users?.find((u) => u.isActive);
}
