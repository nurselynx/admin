"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DatePicker from "react-multi-date-picker";
import { getFilteredData } from "@/helper";
import ReportHomeHealthMedical from "../reports/reportHomeHealthMedical";
import { DataEmtpy } from "../jobs";
import { DOWNLOAD_REPORTS } from "@/constants/api";
import axios from "axios";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

interface TableData {
  id: number;
  name: string;
  jobType: string;
  speciality: string;
  location: string;
  experience: number;
  languagePreference: string;
  genderPreference: string;
  actions: any;
  userId: string;
  date: string;
  schedule: string;
  immediateCare: number;
  qualification: string;
  medicalTitle: string;
  startDate: string;
  endDate: string;
}

export default function Reports({ getData }: any) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<any>([]);
  const [showDetails, setShowDetails] = useState<TableData | null>(null);
  const [loader, isLoader] = useState(false);

  let data = getFilteredData(getData, "");
  const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const totalPages = Math.ceil(data?.length / 10);
  const handleDownloadExcel = async () => {
    try {
      if (dateRange?.length !== 2) {
        toast.error("Please select a start and end date.");
        return;
      }

      const startDate = dateRange[0]?.format?.("YYYY-MM-DD");
      const endDate = dateRange[1]?.format?.("YYYY-MM-DD");

      const token = getCookie("authToken");
      const payload = {
        startDate,
        endDate,
      };
      isLoader(true);
      const response = await axios.post(
        `${apiBaseURL}${DOWNLOAD_REPORTS}`,
        payload,
        {
          headers: {
            Authorization: `${token}`,
          },
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data], {
        type:
          response.headers["content-type"] ||
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      isLoader(false);
      if (blob.type === "application/json") {
        const text = await blob.text();
        toast.error("Backend error: " + text);
        isLoader(false);
        return;
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report_${startDate}_to_${endDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Download error:", error.response || error.message);
      toast.error(
        error.response?.data?.message || "Download failed. Please try again."
      );
      isLoader(false);
    }
  };

  useEffect(() => {
    const startDate = dateRange[0]?.format?.("YYYY-MM-DD");
    const endDate = dateRange[1]?.format?.("YYYY-MM-DD");
    if (startDate && endDate) {
      router.push(`/reports?startDate=${startDate}&endDate=${endDate}`);
    }
  }, [dateRange]);

  return (
    <>
      <div className="m-0 md:p-6">
        <div className="grid p-6 bg-white font-medium text-lg rounded-t-3xl text-center md:text-left">
          Reports Details
          <hr className="block mt-2 md:hidden" />
          <div className="relative mt-4 w-full h-14 flex gap-4 items-center">
            <div className=" relative">
              <DatePicker
                range
                value={dateRange}
                onChange={setDateRange}
                format="DD/MM/YYYY"
                rangeHover
                placeholder="Select date range"
                editable={false}
                className="p-2 border border-gray-700 rounded-md text-sm bg-white w-full"
              />
              {dateRange?.[0] && (
                <button
                  type="button"
                  disabled={loader}
                  onClick={() => {
                    setDateRange([]);
                    router.push(`/reports`);
                  }}
                  className="absolute right-2 top-[14px] text-gray-500 hover:text-gray-700"
                >
                  <Image
                    src="/assets/image/cross-red.png"
                    alt="cross_red"
                    height={20}
                    width={20}
                    className=" cursor-pointer"
                  />
                </button>
              )}
            </div>
            <button
              type="button"
              disabled={loader || data?.length === 0}
              onClick={handleDownloadExcel}
              className="bg-lynx-blue-100 text-white px-4 py-2 rounded-md text-base h-12"
            >
              Download Excel
            </button>
          </div>
        </div>

        <div className="bg-white">
          <h1 className=" text-lynx-blue-400 text-base font-medium px-6">
            {data?.length} Reports Found
          </h1>
          {data?.length > 0 ? (
            <>
              <ReportHomeHealthMedical
                data={data}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                showDetails={showDetails}
                setShowDetails={setShowDetails}
              />
            </>
          ) : (
            <DataEmtpy />
          )}
        </div>
      </div>
    </>
  );
}
