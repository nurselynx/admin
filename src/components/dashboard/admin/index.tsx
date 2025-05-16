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
} from "../../../../public/assets/svgIcons/svgIcons";
import useAxios from "@/hooks/useAxios";
import { ACTION_ADMIN } from "@/constants/api";
import { decryptData } from "@/helper/dataEncrypt";
import ConfirmationModal from "./confirmationModal";
import HealthcareResponsiveTableCard from "./tableResponsive";
import DetalsHealthcareAdmin from "./detalsHealthcare";
import { formatPhoneNumber } from "@/helper/index";
import { useSearchFilter } from "@/components/useSearchFilter/useSearchFilter";

const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

interface TableData {
  userName: string;
  userEmail: string;
  userPrimaryNumber: string;
  location: string;
  experience: number;
  title: string;
  date: string;
  schedule: string;
  actions: any;
  language?: string;
  address: string;
  userCreatedAt: string;
  gender: string;
  weekdaySchedule: string;
  primaryContact: string;
  userId: string;
  certificateUrl: any;
  certificateNumber: string;
  preferredRate?: string;
}

type Column = {
  label: string;
  accessor: keyof TableData | string;
  render?: (row: TableData) => React.ReactNode;
};

export default function DashboardHealthLayout({ healthData }: any) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [applicantId, setApplicantId] = useState(0);
  const [acceptedTitle, setAcceptedTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDetails, setShowDetails] = useState<TableData | null>(null);

  const { makeRequest: updateHealth, loading } = useAxios({
    url: `${ACTION_ADMIN}/${applicantId}`,
    method: "post",
  });

  let data = healthData;
  const { searchQuery, setSearchQuery, filteredData } =
    useSearchFilter(healthData);

  data = filteredData;

  console.log(healthData, "healthData");

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

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
        toast.success(
          acceptedTitle === "accept"
            ? "The healthcare user's account has been approved successfully."
            : "The healthcare user's account has been rejected successfully."
        );
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong. Please try again.");
    }
  };

  const columns: Column[] = [
    {
      label: "User Name",
      accessor: "name",
      render: (row) => decryptData(row?.userName, secretKey),
    },
    {
      label: "Actions",
      accessor: "actions",
      render: (row: any) => (
        <div className="flex space-x-2">
          <button
            disabled={row?.userIsVerified === 1}
            onClick={() => {
              setIsModalOpen(true);
              setAcceptedTitle("accept");
              setApplicantId(row?.userId);
            }}
            className="text-lynx-blue-100 border border-solid border-lynx-blue-100 rounded-lg px-3 py-1 text-sm text-center"
          >
            <div className="flex justify-between gap-2">Accept{acceptIcon}</div>
          </button>
          <button
            disabled={row?.userIsVerified === 0}
            onClick={() => {
              setIsModalOpen(true);
              setAcceptedTitle("cancel");
              setApplicantId(row?.userId);
            }}
            className="text-lynx-orange-100 border border-solid border-lynx-orange-100 rounded-lg px-3 py-1 text-sm text-center"
          >
            <div className="flex justify-between gap-2">Cancel{rejectIcon}</div>
          </button>
        </div>
      ),
    },
    {
      label: "Email",
      accessor: "userEmail",
    },
    {
      label: "Title",
      accessor: "title",
      render: (row) => decryptData(row?.title, secretKey),
    },
    {
      label: "Desired Rate",
      accessor: "preferredRate",
      render: (row) =>
        row?.preferredRate
          ? decryptData(row?.preferredRate ?? "", secretKey)
          : "N/A",
    },
    {
      label: "Address",
      accessor: "address",
      render: (row) => decryptData(row?.address, secretKey),
    },
    {
      label: "Language",
      accessor: "language",
      render: (row: any) =>
        row?.language?.length > 1 ? row?.language?.join(", ") : row?.language,
    },
    {
      label: "Date",
      accessor: "date",
      render: (row: any) => format(new Date(row?.userCreatedAt), "MMM d, yyyy"),
    },
    {
      label: "Primary Number",
      accessor: "userPrimaryNumber",
      render: (row) => {
        const decryptedNumber = decryptData(row?.userPrimaryNumber, secretKey);
        return formatPhoneNumber(decryptedNumber);
      },
    },
    {
      label: "Gender",
      accessor: "gender",
      render: (row) => decryptData(row?.gender ?? "", secretKey),
    },
    {
      label: "Certificate Number",
      accessor: "certificateNumber",
      render: (row) => decryptData(row?.certificateNumber, secretKey),
    },
    {
      label: "Certificate",
      accessor: "certificateUrl",
      render: (row: any) => (
        <button
          type="button"
          onClick={() => {
            const url = row?.certificateUrl?.signed_url;
            if (url) {
              const link = document.createElement("a");
              link.href = url;
              link.download = "downloaded-image.png"; // Specify a default filename
              link.target = "_blank"; // Optional: Open the link in a new tab
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } else {
              console.error("No URL available for download.");
            }
          }}
          className="text-lynx-blue-100 border border-solid border-lynx-blue-100 rounded-lg px-3 py-1 text-sm text-center"
        >
          <div className="flex justify-between gap-2">View</div>
        </button>
      ),
    },
  ];

  const decryptedNumber = decryptData(
    showDetails?.userPrimaryNumber ?? "",
    secretKey
  );

  return (
    <div className="m-0 md:p-6">
      <div className="grid bg-white p-6 font-medium text-lg rounded-t-3xl text-center md:text-left">
        Healthcare User Details
        <hr className="block mt-2 md:hidden" />
        <input
          type="text"
          placeholder="Search User Name	"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className={`w-full p-2 text-gray-700 bg-white rounded-md  max-w-[310px] text-[15px] border mt-[13px] border-solid border-gray-700 xl:max-w-full`}
        />
      </div>
      {showDetails ? (
        <DetalsHealthcareAdmin
          setShowDetails={setShowDetails}
          facilityName={decryptData(showDetails?.userName, secretKey)}
          email={showDetails?.userEmail}
          title={decryptData(showDetails?.title, secretKey)}
          language={decryptData(showDetails?.language ?? "", secretKey)}
          date={showDetails?.userCreatedAt}
          primaryContact={formatPhoneNumber(decryptedNumber)}
          userId={showDetails?.userId}
          gender={decryptData(showDetails?.gender ?? "", secretKey)}
          handleModalClose={handleModalClose}
          handleConfirmAccept={handleConfirmAccept}
          setIsModalOpen={setIsModalOpen}
          jobAcceptedTitle={setAcceptedTitle}
          setApplicantId={setApplicantId}
          image={showDetails?.certificateUrl?.signed_url}
          certificateNumber={decryptData(
            showDetails?.certificateNumber ?? "",
            secretKey
          )}
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
                  patientFacilityName={decryptData(
                    rowData?.userName,
                    secretKey
                  )}
                  location={decryptData(rowData?.address, secretKey)}
                  date={rowData?.userCreatedAt}
                  schedule={rowData?.weekdaySchedule}
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
