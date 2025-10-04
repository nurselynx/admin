"use client";

import useAxios from "@/hooks/useAxios";
import { yupResolver } from "@hookform/resolvers/yup";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ClientHistoryTable from "./table/ClientHistoryTable";
import Image from "next/image";
import LocationAutocomplete from "@/helper/LocationAutocomplete";
import { useLocationDetails } from "@/hooks/useLocationDetails";
import FacilityInputField from "../cms/inputField";
import { clientHistoryValidationSchema } from "./validation";
import { CLIENT_HISTORY, EXPORT_CLIENT_HISTORY } from "@/constants/api";
import { ClientHistoryData } from "../dashboard/admin/types";

export const LocationLoding = "Please wait, your location is being fetched.";

const ClientHistoryLayout = () => {
  const [fieldName, setFieldName] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [clientHistoryData, setClientHistoryData] = useState<{
    data: ClientHistoryData[];
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const token = getCookie("authToken");

  const { makeRequest: getClientHistory, loading } = useAxios({
    url: CLIENT_HISTORY,
    method: "get",
  });

  const { makeRequest: exportExcel, loading: exportExcelLoading } = useAxios({
    url: EXPORT_CLIENT_HISTORY,
    method: "get",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    getValues,
    setValue,
    reset,
    control,
  } = useForm({
    resolver: yupResolver(clientHistoryValidationSchema),
    defaultValues: {
      name: "",
    },
  });

  const {
    locationDetails,
    getLocation,
    loading: isLoding,
  } = useLocationDetails();

  const handleFieldChange = (fieldName: any) => clearErrors(fieldName);
  const handleGetLocation = async (fieldKey: string) => {
    getLocation(); // Fetch the location
    setFieldName(fieldKey);
  };

  useEffect(() => {
    if (locationDetails?.country && fieldName === "address") {
      setInputValue(locationDetails?.address_line ?? "");
      setValue("address", locationDetails?.address_line ?? "");
      setValue("city", locationDetails?.city ?? "");
      setValue("state", locationDetails?.state ?? "");
      setValue("pincode", locationDetails?.postcode ?? "");
    }
  }, [locationDetails]);

  useEffect(() => {
    if (inputValue.trim() === "") {
      setValue?.("address", "");
      setValue?.("city", "");
      setValue?.("state", "");
      setValue?.("pincode", "");
    }
  }, [inputValue, setValue]);

  const onSubmit = async (data: any) => {
    const clientHistoryData = await getClientHistory(
      { name: data.name, location: data.address, page: 1, limit: 10 },
      token
    );
    setClientHistoryData(clientHistoryData?.data);
    setHasSearched(true);
  };

  const handlePageChange = async (page: number) => {
    const data = getValues();
    const clientHistoryData = await getClientHistory(
      { name: data.name, location: data.address, page: page, limit: 10 },
      token
    );

    setClientHistoryData(clientHistoryData?.data);
  };

  const handleExcelExport = async () => {
    const data = getValues();
    try {
      // Make the request with responseType: 'blob'
      const response = await exportExcel(
        { name: data.name, location: data.address },
        token,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "client-history.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Excel export failed", error);
    }
  };

  return (
    <div className="m-0 md:6 bg-white rounded-2xl mx-0 md:mx-4 py-4">
      <div className="border-b pb-4">
        <h1 className="font-semibold w-full text-base text-lynx-blue-400 tablet:mb-4 tablet:text-center md:px-6">
          Client History
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 pt-4 px-4 md:px-6"
        >
          <div className="flex flex-col lg:flex-row gap-2">
            <FacilityInputField
              id="name"
              placeholder="Enter Client Name"
              type="text"
              register={register}
              errors={errors}
              validationKey="name"
              onChange={() => handleFieldChange("name")}
            />
            <div className="relative w-full">
              <LocationAutocomplete
                placeholder="Enter client address"
                onSelect={(location: any) => {
                  setValue("lat", location?.lat ?? "");
                  setValue("lon", location?.lon ?? "");
                  setValue("address", location?.formatted ?? "");
                  setValue("city", location?.city ?? "");
                  setValue("state", location?.state ?? "");
                  setValue("pincode", location?.zip ?? "");
                }}
                register={register}
                errors={errors}
                validationKey="address"
                onChange={() => handleFieldChange("address")}
                setInputValue={setInputValue}
                inputValue={inputValue}
              />
              <Image
                className={`absolute right-2.5 top-3 cursor-pointer bg-white`}
                onClick={() => {
                  handleGetLocation("address");
                }}
                src="/assets/image/loction.svg"
                alt="loction"
                width={20}
                height={20}
              />
            </div>
            <FacilityInputField
              label=""
              id="city"
              type="text"
              placeholder="Enter City"
              register={register}
              errors={errors}
              validationKey="city"
              onChange={() => handleFieldChange("city")}
              disable
            />

            <FacilityInputField
              label=""
              id="state"
              type="text"
              placeholder="Enter State"
              register={register}
              errors={errors}
              validationKey="state"
              onChange={() => handleFieldChange("state")}
              disable
            />

            <FacilityInputField
              label=""
              id="pincode"
              type="text"
              placeholder="Enter Zip Code"
              register={register}
              errors={errors}
              validationKey="pincode"
              onChange={() => handleFieldChange("pincode")}
              disable
            />
            <p className=" text-[#00BA34]">
              {isLoding && fieldName === "address" && LocationLoding}
            </p>
          </div>
          <div className="flex gap-2 w-fit">
            <button
              type="submit"
              className="w-full bg-lynx-blue-100 text-white py-2 px-4 rounded-md"
            >
              Search
            </button>
            <button
              type="button"
              className="w-full text-black border py-2 px-4 rounded-md"
              onClick={() => {
                reset();
                setInputValue("");
              }}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
      {hasSearched ? (
        <ClientHistoryTable
          data={clientHistoryData?.data}
          currentPage={clientHistoryData?.page || 1}
          setCurrentPage={handlePageChange}
          totalPages={clientHistoryData?.totalPages || 1}
          handleExcelExport={handleExcelExport}
        />
      ) : (
        <div className="flex justify-center items-center h-48 text-lynx-grey-700">
          <p>Please search by client name and address to get the history.</p>
        </div>
      )}
    </div>
  );
};

export default ClientHistoryLayout;
