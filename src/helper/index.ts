import { TableDataType } from "@/components/dashboard/admin/types";

export const formatPhoneNumber = (phoneNumber: string) => {
  const match = phoneNumber?.match(/^(\d{3})(\d{3})(\d{4})$/);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phoneNumber;
};

const filterDataByStatus = (data: TableDataType[], status: number | null) => {
  return data?.filter((item) => item?.status === status);
};


export const getFilteredData = (dataArray: any, selectedValue: string) => {
  switch (selectedValue) {
    case "progress":
      return dataArray?.filter(
        (item: any) => item?.status === 0 || item?.status === null
      );
    case "accepted":
      return filterDataByStatus(dataArray, 1);
    case "completed":
      return filterDataByStatus(dataArray, 3);
    case "invoice":
      return filterDataByStatus(dataArray, 5);
    case "cancelled":
      return filterDataByStatus(dataArray, 4);
    case "rejected":
      return filterDataByStatus(dataArray, 2);
    default:
      return dataArray;
  }
};