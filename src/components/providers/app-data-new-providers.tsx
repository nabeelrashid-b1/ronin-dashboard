"use client";

//  import { createContext, useContext, type ReactNode } from "react";
// import { useAppData } from "@/hooks/use-app-data";
//  import type { AppData } from "@/lib/types";

//  type AppDataContextValue = ReturnType<typeof useAppData>;

//  const AppDataContext = createContext<AppDataContextValue | null>(null);

//  export function AppDataProvider({ children }: { children: ReactNode }) {
//    const value = useAppData();
//    return (
//      <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
//    );
//  }

//  export function useAppDataContext() {
//    const ctx = useContext(AppDataContext);
//    if (!ctx) {
//      throw new Error("useAppDataContext must be used within AppDataProvider");
//    }
//    return ctx;
//  }

// export type { AppData };






// "use client";

// import { createContext, useContext, useMemo, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// // import { fetchUsers, fetchItems, fetchSerials } from "@/lib/api";
// import { fetchUsers,fetchSerials,fetchItems } from "@/lib/apis";



// const AppContext = createContext<any>(null);

// export const AppProvider = ({ children }: any) => {
//   // =========================
//   // USERS PAGINATION
//   // =========================
//   const [usersPage, setUsersPage] = useState(1);
//   const [usersSize, setUsersSize] = useState(5);

//   // =========================
//   // ITEMS PAGINATION
//   // =========================
//   const [itemsPage, setItemsPage] = useState(1);
//   const [itemsSize, setItemsSize] = useState(5);

//   // =========================
//   // SERIALS PAGINATION
//   // =========================
//   const [serialsPage, setSerialsPage] = useState(1);
//   const [serialsSize, setSerialsSize] = useState(5);

//   // =========================
//   // USERS QUERY
//   // =========================
//   const usersQuery = useQuery({
//     queryKey: ["users", usersPage, usersSize],
//     queryFn: () => fetchUsers({ page: usersPage, pageSize: usersSize }),
//   });

//   // =========================
//   // ITEMS QUERY
//   // =========================
//   const itemsQuery = useQuery({
//     queryKey: ["items", itemsPage, itemsSize],
//     queryFn: () => fetchItems({ page: itemsPage, pageSize: itemsSize }),
//   });

//   // =========================
//   // SERIALS QUERY
//   // =========================
//   const serialsQuery = useQuery({
//     queryKey: ["serials", serialsPage, serialsSize],
//     queryFn: () => fetchSerials({ page: serialsPage, pageSize: serialsSize }),
//   });

//   const value = useMemo(
//     () => ({
//       data: {
//         users: usersQuery.data || [],
//         items: itemsQuery.data || [],
//         serials: serialsQuery.data || [],
//       },

//       status: {
//         users: {
//           loading: usersQuery.isLoading,
//           error: usersQuery.error,
//         },
//         items: {
//           loading: itemsQuery.isLoading,
//           error: itemsQuery.error,
//         },
//         serials: {
//           loading: serialsQuery.isLoading,
//           error: serialsQuery.error,
//         },
//       },

//       pagination: {
//         users: {
//           page: usersPage,
//           pageSize: usersSize,
//           setPage: setUsersPage,
//           setPageSize: setUsersSize,
//         },
//         items: {
//           page: itemsPage,
//           pageSize: itemsSize,
//           setPage: setItemsPage,
//           setPageSize: setItemsSize,
//         },
//         serials: {
//           page: serialsPage,
//           pageSize: serialsSize,
//           setPage: setSerialsPage,
//           setPageSize: setSerialsSize,
//         },
//       },
//     }),
//     [
//       usersQuery.data,
//       itemsQuery.data,
//       serialsQuery.data,

//       usersQuery.isLoading,
//       itemsQuery.isLoading,
//       serialsQuery.isLoading,

//       usersQuery.error,
//       itemsQuery.error,
//       serialsQuery.error,

//       usersPage,
//       usersSize,
//       itemsPage,
//       itemsSize,
//       serialsPage,
//       serialsSize,
//     ]
//   );

//   return (
//     <AppContext.Provider value={value}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useAppContext = () => {
//   const context = useContext(AppContext);
//   if (!context) throw new Error("useAppContext must be used inside Provider");
//   return context;
// };


"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
// import { fetchUsers, fetchItems, fetchSerials } from "@/lib/api";
import { fetchUsers,fetchSerials,fetchItems } from "@/lib/apis";
import { AppData } from "@/lib/types";
import { getAppData, resetAppData, saveAppData } from "@/lib/storage";



// const AppContext = createContext<any>(null);

export const AppProvider = () => {
  // =========================
  // USERS PAGINATION
  // =========================
  const [usersPage, setUsersPage] = useState(1);
  const [usersSize, setUsersSize] = useState(5);
 const [data, setData] = useState<AppData | null>(null);
  const [isReady, setIsReady] = useState(false);
  // =========================
  // ITEMS PAGINATION
  // =========================
  const [itemsPage, setItemsPage] = useState(1);
  const [itemsSize, setItemsSize] = useState(5);

  // =========================
  // SERIALS PAGINATION
  // =========================
  const [serialsPage, setSerialsPage] = useState(1);
  const [serialsSize, setSerialsSize] = useState(20);

  // =========================
  // USERS QUERY
  // =========================

    const usersQuery = useQuery({
    queryKey: ["users", usersPage, usersSize],
    queryFn: () => fetchUsers({ page: usersPage, pageSize: usersSize }),
  });
  // =========================
  // ITEMS QUERY
  // =========================
  // const itemsQuery = useQuery({
  //   queryKey: ["items", itemsPage, itemsSize],
  //   queryFn: () => fetchItems({ page: itemsPage, pageSize: itemsSize }),
  // });

  // =========================
  // SERIALS QUERY
  // =========================
  const serialsQuery = useQuery({
    queryKey: ["serials", serialsPage, serialsSize],
    queryFn: () => fetchSerials({ page: serialsPage, pageSize: serialsSize }),
  });


  // =========================
  // SERIALS QUERY
  // =========================



  ////////// START OLD WORK ///////////////


    const loadData = useCallback( async () => {
      setData(await getAppData());
      setIsReady(true);
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

  const reset  = useCallback(() => {
    const fresh = resetAppData();
    setData(fresh);
    setIsReady(true);
    return fresh;
  }, []); 




  /////////////END OF OLD WORK////////////////




  const value = useMemo(
    () => ({
      data: {
        users: usersQuery.data || [],
        // items: itemsQuery.data || [],
        serials: serialsQuery.data || [],
        reset:reset,
        updatedData:updateData,
        data:data,
        isReady:isReady
      },

      status: {
        users: {
          loading: usersQuery.isLoading,
          error: usersQuery.error,
        },
        items: {
          // loading: itemsQuery.isLoading,
          // error: itemsQuery.error,
        },
        serials: {
          loading: serialsQuery.isLoading,
          error: serialsQuery.error,
        },
      },

      pagination: {
        users: {
          page: usersPage,
          pageSize: usersSize,
          setPage: setUsersPage,
          setPageSize: setUsersSize,
        },
        items: {
          page: itemsPage,
          pageSize: itemsSize,
          setPage: setItemsPage,
          setPageSize: setItemsSize,
        },
        serials: {
          page: serialsPage,
          pageSize: serialsSize,
          setPage: setSerialsPage,
          setPageSize: setSerialsSize,
        },
      },
    }),
    [
      usersQuery.data,
      // itemsQuery.data,
      serialsQuery.data,

      usersQuery.isLoading,
      // itemsQuery.isLoading,
      serialsQuery.isLoading,

      usersQuery.error,
      // itemsQuery.error,
      serialsQuery.error,

      usersPage,
      usersSize,
      itemsPage,
      itemsSize,
      serialsPage,
      serialsSize,
    ]
  );

return {value}
}

