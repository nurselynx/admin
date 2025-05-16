// hooks/useSearchFilter.ts
import { useState, useMemo } from "react";
import { decryptData } from "@/helper/dataEncrypt";

export const useSearchFilter = (data: any[]) => {
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const lowerQuery = searchQuery.toLowerCase();
    return data.filter((item) =>
      Object.values(item).some((val:any) =>
        decryptData(val, secretKey)?.toString()?.toLowerCase().includes(lowerQuery)
      )
    );
  }, [searchQuery, data, secretKey]);

  return {
    searchQuery,
    setSearchQuery,
    filteredData,
  };
};
