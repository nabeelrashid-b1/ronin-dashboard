// import { defaultAppData, defaultClaimRequests, SEED_VERSION } from "./seed";
// import type { AppData } from "./types";
// import { STORAGE_KEY } from "./types";
// import { resetAllDemoData, SEED_VERSION_KEY } from "./reset-demo";
// import {
//   getWarrantyClaimRequests,
//   saveWarrantyClaimRequests,
// } from "./warranty-claim-request";
// import {
//   getWarrantyClaimTable,
//   saveWarrantyClaimTable,
// } from "./warranty-claim";
// import {
//   getWarrantyDispatchTable,
//   saveWarrantyDispatchTable,
// } from "./warranty-dispatch";
// import {
//   getWarrantyMasterTable,
//   saveWarrantyMasterTable,
// } from "./warranty-master";
// import axios from "axios";


// export const saleOrders = async () => {
//   try {
//     const res = await axios.get("http://192.168.19.16:9002/sales-orders");
//     return res.data;
//   }
//   catch (error) {
//     throw error
//   }
// };


// export const serial = async () => {
//   try {
//     const res = await axios.get("http://192.168.19.16:9002/sales-orders");
//     return res.data;
//   }
//   catch (error) {
//     throw error
//   }
// };








// export async function getAppData(): Promise<AppData> {
//   if (typeof window === "undefined") {
//     return defaultAppData;
//   }

//   try {
//     const storedVersion = localStorage.getItem(SEED_VERSION_KEY);
//     if (storedVersion !== SEED_VERSION) {
//       return resetAllDemoData();
//     }

//     const raw = localStorage.getItem(STORAGE_KEY);
//     const serials = getWarrantyMasterTable();
//     console.log('seriall',serials)
//     const warrantyDispatches = getWarrantyDispatchTable();
//     const claims = getWarrantyClaimTable();
//     getWarrantyClaimRequests();

//     if (!raw) {
//       return resetAllDemoData();
//     }
//     const data = JSON.parse(raw) as AppData;

//     console.log('response',data)
//     try {
//       // let data = JSON.parse(raw) as AppData;
//       // const response = await saleOrders()
//       //  data = { ...data, salesOrders: response } as any
//       //  const data={...JSON.parse(raw) as AppData,salesOrders: response}
//       data.serials = serials;
//       data.warrantyDispatches = warrantyDispatches;
//       data.claims = claims;
//       if (!data.salesOrders?.length || data.salesOrders.length < 10) {
//         data.salesOrders = defaultAppData.salesOrders;
//           console.log('response',data)
//           alert('asas')
//       }
//       if (!data.courierExceptions) {
//         data.courierExceptions = defaultAppData.courierExceptions ?? [];
//       }
//       console.log('response',data)
//       return data;
//     }
//     catch (error) {
//       throw error
//     }
//   } catch {
//     return resetAllDemoData();
//   }
// }

// export function saveAppData(data: AppData): void {
//   if (typeof window === "undefined") return;
//   saveWarrantyMasterTable(data.serials);
//   saveWarrantyDispatchTable(data.warrantyDispatches);
//   saveWarrantyClaimTable(data?.claims);
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
// }

// export function resetAppData(): AppData {
//   return resetAllDemoData();
// }

// export function generateId(): string {
//   return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
// }








import { defaultAppData, defaultClaimRequests, SEED_VERSION } from "./seed";
import type { AppData } from "./types";
import { STORAGE_KEY } from "./types";
import { resetAllDemoData, SEED_VERSION_KEY } from "./reset-demo";
import {
  getWarrantyClaimRequests,
  saveWarrantyClaimRequests,
} from "./warranty-claim-request";
import {
  getWarrantyClaimTable,
  saveWarrantyClaimTable,
} from "./warranty-claim";
import {
  getWarrantyDispatchTable,
  saveWarrantyDispatchTable,
} from "./warranty-dispatch";
import {
  getWarrantyMasterTable,
  saveWarrantyMasterTable,
} from "./warranty-master";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";


export const saleOrders = async () => {
  try {
    const res = await axios.get("http://192.168.19.16:9002/sales-orders");
    return res.data;
  }
  catch (error) {
    throw error
  }
};


export const serialItemData = async () => {
  try {
    const res = await axios.get("http://192.168.19.16:9002/items");

    console.log('ress', res)
    // return {...res.data , itemName:'printer'};
    // return res.data.map((cval)=>(itemName:"priter"})
    return res.data.map((cval: any) => {
      return { ...cval, itemName: 'printer' }
    })
  }
  catch (error) {
    throw error
  }
};











export async function saveSerialItemData(payload: any) {
 const data={
  "batchNumber": payload.batchNumber,
  "color": payload.color,
  "itemCode": payload.itemCode,
  "itemName": payload.itemName,
  "qty": payload.qty,
  "warrantyPeriod": payload.warrantyPeriod
 }
 
 console.log('kkkkpppppppppppk',data)
 
 try {
    const response = await axios.post(
      "http://192.168.19.16:9002/serial-masters",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
  catch (error) {
    throw error
  }
}

export function useSaveSerialItems() {
  return useMutation({
    mutationFn: async (serialArray: any[]) => {
      const results = [];

      for (let i = 0; i < serialArray.length; i++) {
        try {
          const res = await postSerialItem(serialArray[i]);

          results.push({
            index: i,
            success: true,
            data: res,
          });
        } catch (err: any) {
          results.push({
            index: i,
            success: false,
            error: err.message,
          });
        }
      }

      return results;
    },
  });
}


export async function getWarrantyMasterDataFromApi(page:any,pagesize:any,search:any){
  try {
    const response=await axios.get(`http://192.168.19.16:9002/serial-masters?page=${page}&pageSize=${pagesize}`)
 return response?.data
  }
  catch(error){
    throw error
  }
}





export async function getAppData(): Promise<AppData> {
  // alert('asas')
  if (typeof window === "undefined") {
    return defaultAppData;
  }

  try {
    // const response=await axios.get('http://192.168.19.16:9002/serial-masters?page=1&pageSize=20')
    const storedVersion = localStorage.getItem(SEED_VERSION_KEY);
    if (storedVersion !== SEED_VERSION) {
      return resetAllDemoData();
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    const serials = getWarrantyMasterTable();
    // const serials = response?.data

    const warrantyDispatches = getWarrantyDispatchTable();
    const claims = getWarrantyClaimTable();
    getWarrantyClaimRequests();

    if (!raw) {
      return resetAllDemoData();
    }
    const data = JSON.parse(raw) as AppData;

    console.log('response', data)
    try {
      // let data = JSON.parse(raw) as AppData;
      // const response = await saleOrders()
      //  data = { ...data, salesOrders: response } as any
      //  const data={...JSON.parse(raw) as AppData,salesOrders: response}
      data.serials = serials;
      data.warrantyDispatches = warrantyDispatches;
      data.claims = claims;
      if (!data.salesOrders?.length || data.salesOrders.length < 10) {
        data.salesOrders = defaultAppData.salesOrders;
        console.log('response', data)
        alert('asas')
      }
      if (!data.courierExceptions) {
        data.courierExceptions = defaultAppData.courierExceptions ?? [];
      }
      console.log('response', data.serials)
      return data;
    }
    catch (error) {
      throw error
    }
  } catch(error:any) {
    // throw error
    return resetAllDemoData();
  }
}

export function saveAppData(data: AppData): void {
  if (typeof window === "undefined") return;
  saveWarrantyMasterTable(data.serials);
  saveWarrantyDispatchTable(data.warrantyDispatches);
  saveWarrantyClaimTable(data?.claims);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetAppData(): AppData {
  return resetAllDemoData();
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
