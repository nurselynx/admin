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
import { ACTION_ADMIN } from "@/constants/api";
import DetailsAdmin from "./detals";
import ConfirmationModal from "../confirmationModal";
import HealthcareResponsiveTableCard from "../tableResponsive";
import { decryptData } from "@/helper/dataEncrypt";
import { formatPhoneNumber } from "@/helper/index";

const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

interface TableData {
  userName: string;
  userEmail: string;
  facilityType: string;
  licenseNumber: string;
  experience: number;
  primaryContact: string;
  date: string;
  actions: any;
  facilityName: string;
  facilityAddress: string;
  userCreatedAt: string;
  weekdaySchedule: string;
  userId: string;
  licenseUrl: any;
  address: string;
  licenseExpiryDate: string;
}

type Column = {
  label: string;
  accessor: keyof TableData | string;
  render?: (row: TableData) => React.ReactNode;
};

export default function DashboardFacilityLayout({ data }: any) {
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
            ? "The organization user's account has been approved successfully."
            : "The organization user's account has been rejected successfully."
        );
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong. Please try again.");
    }
  };

  const columns: Column[] = [
    {
      label: "Organization Name",
      accessor: "facilityName",
      render: (row) => decryptData(row?.facilityName, secretKey),
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
              setApplicantId(row?.userId);
            }}
            disabled={row?.userIsVerified === 1}
            className="text-lynx-blue-100 border border-solid border-lynx-blue-100 rounded-lg px-3 py-1 text-sm text-center"
          >
            <div className="flex justify-between gap-2">Accept{acceptIcon}</div>
          </button>
          <button
            type="button"
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
      label: "Type",
      accessor: "facilityType",
      render: (row) => decryptData(row?.facilityType, secretKey),
    },
    {
      label: "Date",
      accessor: "date",
      render: (row: any) => format(new Date(row?.userCreatedAt), "MMM d, yyyy"),
    },
    {
      label: "Address",
      accessor: "address",
      render: (row) => decryptData(row?.facilityAddress, secretKey),
    },
    {
      label: "Primary Number",
      accessor: "primaryContact",
      render: (row) => {
        const decryptedNumber = decryptData(row?.primaryContact, secretKey);
        return formatPhoneNumber(decryptedNumber);
      },
    },
    {
      label: "License Number",
      accessor: "licenseNumber",
      render: (row) => decryptData(row?.licenseNumber, secretKey),
    },
    {
      label: "License Expiration Date",
      accessor: "licenseExpiryDate",
      render: (row: any) =>
        format(new Date(row?.licenseExpiryDate), "MMM d, yyyy"),
    },
    {
      label: "License Url",
      accessor: "licenseUrl",
      render: (row: any) => (
        <button
          type="button"
          onClick={() => {
            const url = row?.licenseUrl?.signed_url;
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
    showDetails?.primaryContact ?? "",
    secretKey
  );

  return (
    <div className="m-0 md:p-6">
      <div className="grid  p-6 bg-white font-medium text-lg rounded-t-3xl text-center md:text-left">
        Organization User Details
        <hr className="block mt-2 md:hidden" />
      </div>
      {showDetails ? (
        <DetailsAdmin
          setShowDetails={setShowDetails}
          facilityName={decryptData(showDetails?.facilityName, secretKey)}
          email={showDetails?.userEmail}
          type={decryptData(showDetails?.facilityType, secretKey)}
          licenseNumber={decryptData(showDetails?.licenseNumber, secretKey)}
          date={showDetails?.userCreatedAt}
          primaryContact={formatPhoneNumber(decryptedNumber)}
          userId={showDetails?.userId}
          handleModalClose={handleModalClose}
          handleConfirmAccept={handleConfirmAccept}
          setIsModalOpen={setIsModalOpen}
          jobAcceptedTitle={setAcceptedTitle}
          setApplicantId={setApplicantId}
          image={showDetails?.licenseUrl?.signed_url}
          licenseExpiryDate={format(
            new Date(showDetails?.licenseExpiryDate),
            "MMM d, yyyy"
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
                    rowData?.facilityName,
                    secretKey
                  )}
                  location={decryptData(rowData?.facilityAddress, secretKey)}
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
