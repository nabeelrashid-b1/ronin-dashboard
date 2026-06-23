// "use client";

// import { createContext, useContext, type ReactNode } from "react";
// import { useAppData } from "@/hooks/use-app-data";
// import type { AppData } from "@/lib/types";

// type AppDataContextValue = ReturnType<typeof useAppData>;

// const AppDataContext = createContext<AppDataContextValue | null>(null);

// export function AppDataProvider({ children }: { children: ReactNode }) {
//   const value = useAppData();
//   console.log('value',value)
//   return (
//     <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
//   );
// }

// export function useAppDataContext() {
//   const ctx = useContext(AppDataContext);
//   if (!ctx) {
//     throw new Error("useAppDataContext must be used within AppDataProvider");
//   }
//   return ctx;
// }

// export type { AppData };











// NEW 

"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useAppData } from "@/hooks/use-app-data";
import type { AppData } from "@/lib/types";
import { AppProvider } from "./app-data-new-providers"; 

type AppDataContextValue = ReturnType<typeof useAppData>;

// const AppDataContext = createContext<AppDataContextValue | null>(null);

const AppDataContext = createContext<any | null>(null);


export function AppDataProvider({ children }: { children: ReactNode }) {
  const appDataValue = useAppData();
  // console.log('kokokoko',value)
const newValue =AppProvider() as any // NEW CODE

const value={newValue,...appDataValue} as any
  // console.log('value===>',value)
  console.log('value===>',appDataValue)
  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppDataContext() {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error("useAppDataContext must be used within AppDataProvider");
  }
  return ctx;
}

export type { AppData };
