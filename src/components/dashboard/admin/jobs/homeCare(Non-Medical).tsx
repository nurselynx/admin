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
  isSuggested?: boolean;
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
  isSuggested = false,
}: HomeHealthMedicalProps) {
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY ?? "";
  const columns: Column[] = [
    {
      label: "Client Name",
      accessor: "clientName",
      render: (row) => decryptData(row?.clientName, secretKey),
    },
    ...(isSuggested
      ? [
          {
            label: "Suggested Matches",
            accessor: "suggestedProfessionals",
            render: (row: any) => renderSuggestedProfessionals?.(row) ?? null,
          },
        ]
      : []),
    // Conditionally add the "Action" column only if isRequests is true
    {
      label: "Action",
      accessor: "cancel",
      render: (row: any) => (
        <CancelReject
          applicantId={row}
          handleCancelRequest={handleCancelRequest}
          status={row?.status}
        />
      ),
    },
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
    {
      label: "Job Creator",
      accessor: "requestedBy",
      render: (row) => decryptData(row?.requestedBy ?? "", secretKey),
    },
    {
      label: "Assigned Professional",
      accessor: "status",
      render: (row: any) => (
        <button
          type="button"
          onClick={() => (row?.acceptedBy ? setShowDetails(row) : null)}
          className=" text-lynx-blue-100"
        >
          {row?.acceptedBy ? "User Details" : "N/A"}
        </button>
      ),
    },
    {
      label: "Status",
      accessor: "status",
      render: (row: any) => <StatusBadge status={row?.status ?? 0} />,
    },
    {
      label: "Full Details",
      accessor: "action",
      render: (row: any) => (
        <button
          type="button"
          onClick={() => setShowDetails(row)}
          className=" text-lynx-blue-100"
        >
          Details
        </button>
      ),
    },
    {
      label: "Client Address",
      accessor: "clientAddress",
    },
    {
      label: "Phone Number",
      accessor: "phoneNumber",
      render: (row) => decryptData(row?.phoneNumber ?? "", secretKey),
    },
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
            location={item?.clientAddress}
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
