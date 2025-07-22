"use client";

import { useState } from "react";
import Image from "next/image";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import HealthcareResponsiveTableCard from "../tableResponsive";
import { decryptData } from "@/helper/dataEncrypt";
import TableHeader from "./tableheader";
import HomeHealthMedical from "./homeHealthMedical";
import HomeCareMedical from "./homeCare(Non-Medical)";
import StaffingNeedsMedical from "./homeStaffingNeeds";
import { useSearchFilter } from "@/components/useSearchFilter/useSearchFilter";
import { SelectDropdown } from "./selectDropdown";
import { getFilteredData } from "@/helper";
import { JOB_CANCEL } from "@/constants/api";
import { toast } from "react-toastify";
import axios from "axios";

const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

export const DataEmtpy = () => {
  return (
    <div className=" flex justify-center items-center flex-col py-40">
      <Image
        src="/assets/image/data_empty.png"
        alt="data_empty"
        height={89}
        width={89}
        quality={100}
        className=""
      />
      <h1 className=" text-base text-lynx-grey-700">Data is empty</h1>
    </div>
  );
};

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

type Column = {
  label: string;
  accessor: keyof TableData | string;
  render?: (row: TableData) => React.ReactNode;
};

const tabs = [
  "Home Health Medical Services (includes DME)",
  "Home Care (Non-Medical)",
  "Staffing Needs",
];

const options = [
  { value: "All", label: "All" },
  { value: "progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "accepted", label: "Accepted but not completed" },
  { value: "invoice", label: "Pending Invoice" },
];

export default function DashboardJobsLayout({
  getMedicalData,
  getNonMedicalData,
  getStaffData,
  link,
}: any) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [showDetails, setShowDetails] = useState<TableData | null>(null);
  const activeTabData =
    activeTab === tabs[0]
      ? getMedicalData
      : activeTab === tabs[1]
      ? getNonMedicalData
      : getStaffData;

  let data = getFilteredData(activeTabData, selectedValue);
  const { searchQuery, setSearchQuery, filteredData } = useSearchFilter(data);

  data = filteredData;

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(data?.length / 10);

  const tabComponentMap: any = {
    "Home Health Medical Services (includes DME)": HomeHealthMedical,
    "Home Care (Non-Medical)": HomeCareMedical,
    "Staffing Needs": StaffingNeedsMedical,
  };

  const ActiveTabComponent = tabComponentMap[activeTab];

  const renderAdditionalInfo = (row: any) => {
    const decryptedInfo = decryptData(row?.additionalinformation, secretKey);
    const words = decryptedInfo?.split(" ");
    const previewText =
      Array.isArray(words) && words?.length > 0
        ? words?.slice(0, 4).join(" ") + (words?.length > 4 ? "..." : "")
        : "N/A";
    return (
      <div className="relative flex items-start">
        <span className="inline-block w-28 white-space">
          {expandedRows[row.id] ? decryptedInfo : previewText}
        </span>
        {words?.length > 4 && (
          <button
            onClick={() =>
              setExpandedRows((prevState) => ({
                ...prevState,
                [row.id]: !prevState[row.id],
              }))
            }
            className="text-lynx-blue-100 mt-0"
          >
            {expandedRows[row.id] ? "View Less" : "View More"}
          </button>
        )}
      </div>
    );
  };

  const tabOptions = [
    { value: "includes DME", label: tabs[0] },
    { value: "Non-Medical", label: tabs[1] },
    { value: "Staffing Needs", label: tabs[2] },
  ];

  const handleSelectChange = (event: any) => {
    setCurrentPage(1);
    const tab = tabOptions.find(
      (option) => option.value === event.target.value
    );
    setSelectedValue(event.target.value);
    if (tab) {
      setActiveTab(tab.label);
      setCurrentPage(1);
    }
  };
  const handleCancelRequest = async (data: any) => {
    setIsLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${JOB_CANCEL}/${data?.id}/${data?.jobType}`;

      const response = await axios.post(
        url,
        { status: 4 },
        {
          headers: {
            Authorization: `${getCookie("authToken")}`,
          },
        }
      );

      if (response?.status === 200) {
        router.refresh();
        toast.success("The job has been successfully cancelled.");
        setIsLoading(false);
      }
    } catch (error: any) {
      setIsLoading(false);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again."
      );
    }
  };
  return (
    <>
      {isLoading ? (
        <div className="w-full h-full fixed z-[999] left-0 top-0 bg-[#01010194]">
          <p className="flex items-center justify-center h-full text-white">
            Please wait...
          </p>
        </div>
      ) : (
        ""
      )}

      <div className="m-0 md:p-6">
        <div className="grid  p-6 bg-white font-medium text-lg rounded-t-3xl text-center md:text-left">
          Jobs Details
          <hr className="block mt-2 md:hidden" />
          <div className=" flex gap-3 xl:block items-center mt-4">
            <input
              type="text"
              placeholder="Search Client Name"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={`w-full p-2 text-gray-700 bg-white rounded-md  max-w-[310px] text-[15px] border  border-solid border-gray-700 xl:max-w-full`}
            />
            <SelectDropdown
              options={options || []}
              selectedValue={selectedValue || ""}
              handleSelectChange={handleSelectChange || (() => {})}
            />
          </div>
          <TableHeader
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            link={link}
            setCurrentPage={setCurrentPage}
            setSearchQuery={setSearchQuery}
          />
        </div>
        <div className=" bg-white">
          {data?.length > 0 ? (
            <>
              {ActiveTabComponent && (
                <ActiveTabComponent
                  data={data}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                  showDetails={showDetails}
                  setShowDetails={setShowDetails}
                  handleCancelRequest={handleCancelRequest}
                  {...(activeTab === "Staffing Needs" && {
                    renderAdditionalInfo,
                  })}
                />
              )}
              {data?.map((rowData: TableData, index: number) => (
                <HealthcareResponsiveTableCard
                  key={index}
                  patientFacilityName={decryptData(rowData?.name, secretKey)}
                  location={decryptData(rowData?.location, secretKey)}
                  date={rowData?.startDate}
                  userId={rowData?.id}
                  schedule={
                    rowData?.schedule === "00:00-24:00"
                      ? "24 Hours"
                      : rowData?.schedule
                  }
                  viewData={rowData}
                  rowIndex={index}
                  setShowDetails={setShowDetails}
                />
              ))}
            </>
          ) : (
            <DataEmtpy />
          )}
        </div>
      </div>
    </>
  );
}
