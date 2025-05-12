import React from "react";
import Image from "next/image";
import { TableDataType, Column } from "../types";
import { format } from "date-fns";
import { decryptData } from "@/helper/dataEncrypt";
import DetailsFacility from "../detailsFacility/page";
import ResponsiveTableCard from "../tableCardResponsive";
import { StatusBadge } from "./statusBadge";
import { AcceptAndCanel, CancelReject } from "./homeStaffingNeeds";
import Table from "../../table/responsiveTable";

interface HomeHealthMedicalProps {
  data: TableDataType[];
  setIsSuggestedProfessionals?: any;
  fetchCandidateName: any;
  idNumber: number;
  renderSuggestedProfessionals?: any;
  currentPage: number;
  totalPages: number;
  setShowDetails: React.Dispatch<React.SetStateAction<TableDataType | null>>;
  setCurrentPage: (page: number) => void;
  showDetails: any;
  setJobIDNumber?: React.Dispatch<React.SetStateAction<number>>;
  isRequests?: boolean;
  isAvailable?: boolean;
  isMyJobs?: boolean;
  isStatus?: boolean;
  handleCancelRequest?: any;
  handleActionConfirm?: any;
}

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

export default function HomeCareMedical({
  data,
  setIsSuggestedProfessionals,
  fetchCandidateName,
  idNumber,
  renderSuggestedProfessionals,
  currentPage,
  totalPages,
  setShowDetails,
  setCurrentPage,
  showDetails,
  setJobIDNumber,
  isRequests = false,
  isAvailable = false,
  isMyJobs = false,
  isStatus = false,
  handleActionConfirm,
  handleCancelRequest,
}: HomeHealthMedicalProps) {
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY ?? "";
  const columns: Column[] = [
    {
      label: "Client Name",
      accessor: "clientName",
      render: (row) => decryptData(row?.clientName, secretKey),
    },
    // Conditionally add the "Action" column only if isRequests is true
    ...(isRequests
      ? [
          {
            label: "Action",
            accessor: "cancel",
            render: (row: any) => (
              <CancelReject
                applicantId={row?.applicantId}
                handleCancelRequest={handleCancelRequest}
              />
            ),
          },
        ]
      : []),
    ...(isAvailable
      ? [
          {
            label: "Action",
            accessor: "cancel",
            render: (row: any) => (
              <AcceptAndCanel
                isMyJobs={isMyJobs}
                applicantId={row?.applicantId}
                handleActionConfirm={handleActionConfirm}
              />
            ),
          },
        ]
      : []),
    ...(isStatus
      ? [
          {
            label: "Status",
            accessor: "status",
            render: (row: any) => <StatusBadge status={row?.status ?? 0} />,
          },
        ]
      : []),
    {
      label: "Client Address",
      accessor: "clientAddress",
    },
    {
      label: "Phone Number",
      accessor: "phoneNumber",
      render: (row) => decryptData(row?.phoneNumber ?? "", secretKey),
    },
    {
      label: "Insurance Type",
      accessor: "insuranceType",
      render: (row) => decryptData(row?.insuranceType ?? "", secretKey),
    },
    {
      label: "Insurance Provider Name",
      accessor: "insuranceProviderName",
      render: (row) => decryptData(row?.insuranceProviderName ?? "", secretKey),
    },
    {
      label: "Group Number",
      accessor: "groupNumber",
      render: (row) => decryptData(row?.groupNumber ?? "", secretKey),
    },

    {
      label: "Identification Number",
      accessor: "identificationNumber",
      render: (row) => decryptData(row?.identificationNumber ?? "", secretKey),
    },

    {
      label: "Service Type",
      accessor: "serviceNeeded",
      render: (row) => decryptData(row?.serviceNeeded ?? "", secretKey),
    },

    {
      label: "Schedule/Availability",
      accessor: "schedule",
      render: (row) =>
        row?.schedule === "00:00-24:00" ? "24 Hours" : row?.schedule,
    },
    {
      label: "Frequency Required",
      accessor: "frequencyRequired",
      render: (row) => decryptData(row?.frequencyRequired ?? "", secretKey),
    },
    ...(!isMyJobs
      ? [
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
                    link.download = "downloaded-image.png";
                    link.target = "_blank";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  } else {
                    console.error("No URL available for download.");
                  }
                }}
                disabled={!row?.documentUrl?.signed_url}
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
        ]
      : []),
  ];

  return (
    <div className="mt-4">
      {data?.length > 0 ? (
        <Table
          columns={columns}
          data={data?.slice((currentPage - 1) * 10, currentPage * 10)}
          pagination={{
            currentPage,
            totalPages,
            onPageChange: setCurrentPage,
          }}
        />
      ) : (
        <DataEmtpy />
      )}

      {decryptData(showDetails?.clientName, secretKey) ? (
        <DetailsFacility
          setShowDetails={setShowDetails}
          showDetails={showDetails}
          setIsSuggestedProfessionals={setIsSuggestedProfessionals}
          isHomeCare={true}
        />
      ) : (
        data?.map((item: TableDataType, rowIndex: number) => (
          <ResponsiveTableCard
            key={rowIndex}
            rowIndex={rowIndex}
            patientFacilityName={decryptData(item?.clientName ?? "", secretKey)}
            location={decryptData(item?.clientAddress, secretKey)}
            phoneNumber={decryptData(item?.phoneNumber ?? "", secretKey)}
            date={format(new Date(item?.startDate), "MMM d, yyyy")}
            schedule={
              item?.schedule === "00:00-24:00"
                ? "24 Hours"
                : item?.schedule ?? ""
            }
            viewData={item}
            setIsSuggestedProfessionals={setIsSuggestedProfessionals}
            setShowDetails={setShowDetails}
            fetchCandidateName={fetchCandidateName}
            jobIDNumber={idNumber}
            setJobIDNumber={setJobIDNumber}
            isPhoneNumber={true}
            isRequests={isRequests}
            handleCancelRequest={handleCancelRequest}
          />
        ))
      )}
    </div>
  );
}
