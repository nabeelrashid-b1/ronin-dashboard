// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { getAppData, resetAppData, saveAppData } from "@/lib/storage";
// import type { AppData } from "@/lib/types";

// export function useAppData() {
//   const [data, setData] = useState<AppData | null>(null);
//   const [isReady, setIsReady] = useState(false);

//   const loadData = useCallback(async () => {
//     setData( await getAppData());
//     setIsReady(true);
//   }, []);

//   useEffect(() => {
//     loadData();
//   }, [loadData]);

//   useEffect(() => {
//     const onDemoReset = () => loadData();
//     window.addEventListener("ronin-demo-reset", onDemoReset);
//     return () => window.removeEventListener("ronin-demo-reset", onDemoReset);
//   }, [loadData]);

//   const updateData = useCallback((updater: (prev: AppData) => AppData) => {
//     setData((prev) => {
//       if (!prev) return prev;
//       const next = updater(prev);
//       saveAppData(next);
//       return next;
//     });
//   }, []);

//   const reset = useCallback(() => {
//     const fresh = resetAppData();
//     setData(fresh);
//     setIsReady(true);
//     return fresh;
//   }, []);

//   return { data, isReady, updateData, reset, loadData };
// }


"use client";

import { useCallback, useEffect, useState } from "react";
import { getAppData, resetAppData, saveAppData } from "@/lib/storage";
import type { AppData } from "@/lib/types";

export function useAppData() {
  const [data, setData] = useState<AppData | null>(null);
  const [isReady, setIsReady] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const appData = await getAppData();
      setData(appData);
    } catch (error) {
      console.error("Failed to load app data:", error);
      setData(null);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const onDemoReset = () => loadData();
    window.addEventListener("ronin-demo-reset", onDemoReset);
    return () => window.removeEventListener("ronin-demo-reset", onDemoReset);
  }, [loadData]);

  const updateData = useCallback((updater: (prev: AppData) => AppData) => {
    setData((prev) => {
      if (!prev) return prev;

      const next = updater(prev);
      saveAppData(next);

      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const fresh = resetAppData();
    setData(fresh);
    setIsReady(true);
    return fresh;
  }, []);

  return { data, isReady, updateData, reset, loadData };
}