"use client";

import { useState } from "react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Table from "@/components/dashboard/table/responsiveTable";
import {
  acceptIcon,
  rejectIcon,
} from "../../../../../public/assets/svgIcons/svgIcons";
import useAxios from "@/hooks/useAxios";
import { ADMIN_APPORVE } from "@/constants/api";
import DetailsAdmin from "./detals";
import ConfirmationModal from "../confirmationModal";
import HealthcareResponsiveTableCard from "../tableResponsive";
import { decryptData } from "@/helper/dataEncrypt";

const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

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


export default function DashboardJobsLayout({ data }: any) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [applicantId, setApplicantId] = useState(0);
  const [acceptedTitle, setAcceptedTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDetails, setShowDetails] = useState<TableData | null>(null);
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>(
    {}
  );

  const { makeRequest: updateHealth, loading } = useAxios({
    url: `${ADMIN_APPORVE}/${applicantId}`,
    method: "post",
  });
  const totalPages = Math.ceil(data?.length / 10);
  const handleModalClose = () => setIsModalOpen(false);

  const handleConfirmAccept = async () => {
    const formattedData = {
      status: acceptedTitle === "accept" ? 1 : 0,
    };

    try {
      const response = await updateHealth(
        formattedData,
        getCookie("authToken") as string
      );
      if (response?.status === 200) {
        router.refresh();
        setIsModalOpen(false);
        toast.success(acceptedTitle === "accept" ? "The job has been accepted successfully!" : "The Job has been cancelled successfully!");
      }
    } catch (error:any) {
      toast.error(error?.message || "Something went wrong. Please try again.");
    }
  };

  const renderAdditionalInfo = (row: TableData) => {
    const decryptedInfo = decryptData(row?.location, secretKey);
    const words = decryptedInfo.split(" ");
    const previewText =
      words?.slice(0, 3).join(" ") + (words.length > 3 ? "..." : "");

    return (
      <div className="relative flex items-start">
        <span className="inline-block w-48 cursor-pointer white-space">
          {expandedRows[row.id] ? decryptedInfo : previewText}
        </span>
        {words.length > 3 && (
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

  const columns: Column[] = [
    {
      label: "Job Request Title",
      accessor: "name",
      render: (row) => decryptData(row?.name, secretKey),
    },
    {
      label: "Job Type",
      accessor: "jobType",
      render: (row) => decryptData(row?.jobType, secretKey),
    },
    {
      label: "Specialty",
      accessor: "qualification",
      render: (row) => decryptData(row?.qualification ?? '', secretKey),
    },
    {
      label: "Area of Expertise",
      accessor: "speciality",
      render: (row) => decryptData(row?.speciality, secretKey),
    },
    {
      label: "Location",
      accessor: "location",
      render: (row) => decryptData(row?.location, secretKey),
    },
    { label: "Experience", accessor: "experience" },
    { label: "Medical Title",
      accessor: "medicalTitle",
      render: (row) => decryptData(row?.medicalTitle ?? '', secretKey),
    },
    { label: "Language", accessor: "languagePreference" },
    {
      label: "Date",
      accessor: "date",
      render: (row) => {
        const startDate = format(new Date(row?.startDate), "MMM d, yyyy");
        const endDate = row?.endDate ? format(new Date(row?.endDate), "MMM d, yyyy") : 'N/A'; // Use 'N/A' if endDate is not available
        return `${startDate} - ${endDate}`;
      },
    },
    { label: "Schedule/Availability", accessor: "schedule",
      render: (row) => row?.schedule === "00:00-24:00" ? "24 Hours" : row?.schedule,
    },
    { label: "Gender", 
      accessor: "genderPreference",
      render: (row) => decryptData(row?.genderPreference ?? '', secretKey),
    },
    {
      label: "Document",
      accessor: "documentUrl",
      render: (row: any) => (
        <button
        type="button"
        onClick={() => {
          const url = row?.documentUrl?.signed_url;
          if (url) {
            const link = document.createElement("a");
            link.href = url;
            link.download = "downloaded-image.png"; // Default filename
            link.target = "_blank"; // Open in new tab
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            console.error("No URL available for download.");
          }
        }}
        disabled={!row?.documentUrl?.signed_url} // Disable button if URL is empty
        className={`border border-solid rounded-lg px-3 py-1 text-sm text-center ${
          row?.documentUrl?.signed_url
            ? "text-lynx-blue-100 border-lynx-blue-100"
            : "!bg-white border-gray-600 cursor-not-allowed"
        }`}
      >
        <div className="flex justify-between gap-2">View</div>
      </button>
      ),
    },
    {
      label: "Additional Information",
      accessor: "information",
      render: (row) => renderAdditionalInfo(row),
    },
     {
      label: "Immediate Care",
      accessor: "immediateCare",
      render: (row) => (
        <div>{row?.immediateCare === 1 ? <span className="text-[#00BA34] font-se">Yes</span> : <span className=" text-red-600">No</span>}</div>
      ),
    },
    {
      label: "Actions",
      accessor: "actions",
      render: (row: any) => (
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(true);
              setAcceptedTitle("accept");
              setApplicantId(row?.id);
            }}
            disabled={row?.isVerified === 1}
            className="text-lynx-blue-100 border border-solid border-lynx-blue-100 rounded-lg px-3 py-1 text-sm text-center"
          >
            <div className="flex justify-between gap-2">Accept{acceptIcon}</div>
          </button>
          <button
            type="button"
            disabled={row?.isVerified === 0}
            onClick={() => {
              setIsModalOpen(true);
              setAcceptedTitle("cancel");
              setApplicantId(row?.id);
            }}
            className="text-lynx-orange-100 border border-solid border-lynx-orange-100 rounded-lg px-3 py-1 text-sm text-center"
          >
            <div className="flex justify-between gap-2">Cancel{rejectIcon}</div>
          </button>
        </div>
      ),
    },
  ];
  const startDate = showDetails?.startDate ? format(new Date(showDetails?.startDate), "MMM d, yyyy") : 'N/A';
  const endDate = showDetails?.endDate ? format(new Date(showDetails?.endDate), "MMM d, yyyy") : 'N/A';
  const date = `${startDate} - ${endDate}`;
  return (
    <div className="m-0 md:p-6">
      <div className="grid  p-6 bg-white font-medium text-lg rounded-t-3xl text-center md:text-left">
        Jobs Details
        <hr className="block mt-2 md:hidden" />
      </div>
      {showDetails ? (
        <DetailsAdmin
          setShowDetails={setShowDetails}
          name={decryptData(showDetails?.name, secretKey)}
          jobType={decryptData(showDetails?.jobType, secretKey)}
          speciality={decryptData(showDetails?.speciality, secretKey)}
          date={date}
          schedule={showDetails?.schedule}
          experience={showDetails?.experience}
          location={decryptData(showDetails?.location, secretKey)}
          languagePreference={showDetails?.languagePreference}
          genderPreference={decryptData(showDetails?.genderPreference, secretKey)}
          userId={showDetails?.id}
          handleModalClose={handleModalClose}
          handleConfirmAccept={handleConfirmAccept}
          setIsModalOpen={setIsModalOpen}
          jobAcceptedTitle={setAcceptedTitle}
          setApplicantId={setApplicantId}
          immediateCare={showDetails?.immediateCare === 1 ? "Yes" : "No"}
        />
      ) : (
        <div className=" bg-white">
          {data?.length > 0 ? (
            <>
              <Table
                columns={columns}
                data={data?.slice((currentPage - 1) * 10, currentPage * 10)}
                pagination={{
                  currentPage,
                  totalPages,
                  onPageChange: setCurrentPage,
                }}
              />
              {data?.map((rowData: TableData, index: number) => (
                <HealthcareResponsiveTableCard
                  key={index}
                  patientFacilityName={decryptData(rowData?.name, secretKey)}
                  location={decryptData(rowData?.location, secretKey)}
                  date={rowData?.startDate}
                  userId={rowData?.id}
                  schedule={rowData?.schedule === "00:00-24:00" ? "24 Hours" : rowData?.schedule}
                  viewData={rowData}
                  rowIndex={index}
                  setShowDetails={setShowDetails}
                  setIsModalOpen={setIsModalOpen}
                  jobAcceptedTitle={setAcceptedTitle}
                  setApplicantId={setApplicantId}
                />
              ))}
            </>
          ) : (
            <h1 className="p-4">Data is empty</h1>
          )}
        </div>
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleConfirmAccept}
        title={acceptedTitle}
        loading={loading}
      />
    </div>
  );
}
