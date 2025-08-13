import React from "react";
import Image from "next/image";
import { TableDataType, Column } from "../types";
import { decryptData } from "@/helper/dataEncrypt";
import DetailsFacility from "../detailsFacility/page";
import ResponsiveTableCard from "../tableCardResponsive";
import { StatusBadge } from "./statusBadge";
import { DataEmtpy } from "./homeCare(Non-Medical)";
import { acceptIcon } from "../../../../../public/assets/svgIcons/svgIcons";
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

export const CancelReject = ({
  handleCancelRequest,
  applicantId,
  status,
}: any) => {
  return (
    <button
      type="button"
      onClick={() => status === 0 && handleCancelRequest(applicantId)}
      className={`bg-transparent  border text-red-600  ${
        status === 0 ? " border-red-400 " : " cursor-not-allowed opacity-60"
      } w-36 h-7 rounded-md flex items-center justify-center`}
    >
      Cancel Request{" "}
    </button>
  );
};

export const AcceptAndCanel = ({
  isMyJobs,
  handleActionConfirm,
  applicantId,
}: {
  isMyJobs?: boolean;
  handleActionConfirm?: any;
  applicantId?: number;
}) => {
  return (
    <div className="flex justify-between gap-2 items-center iPadAir:justify-center">
      <button
        type="button"
        className={`disabled:opacity-40 disabled:bg-lynx-blue-100 disabled:cursor-not-allowed ${
          isMyJobs ? "w-72" : "w-36"
        } h-7  border border-lynx-blue-100 text-lynx-blue-100 rounded-md flex items-center justify-center`}
        onClick={() => {
          handleActionConfirm("accept", applicantId);
        }}
      >
        {isMyJobs ? "Mark as completed" : "Accept"} {acceptIcon}
      </button>

      <button
        type="button"
        onClick={() => handleActionConfirm("cancel", applicantId)}
        className={`disabled:opacity-40 disabled:bg-white disabled:cursor-not-allowed ${
          isMyJobs ? "w-48" : "w-36"
        } h-7  text-[#E86D65] border border-[#E86D65] rounded-md flex items-center justify-center`}
      >
        {isMyJobs ? "Cancel Job" : "Reject"}
        <Image
          src="/assets/image/cancel.svg"
          alt="arrow_left"
          width={18}
          height={18}
        />
      </button>
    </div>
  );
};

export default function StaffingNeedsMedical({
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
  handleCancelRequest,
  handleActionConfirm,
  isSuggested = false,
}: HomeHealthMedicalProps) {
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY ?? "";
  const columns: Column[] = [
    {
      label: "Organization Name",
      accessor: "orgName",
      render: (row) => decryptData(row?.orgName ?? "", secretKey),
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
      label: "Status",
      accessor: "status",
      render: (row: any) => <StatusBadge status={row?.status ?? 0} />,
    },
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
      label: "Location",
      accessor: "orgLocation",
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

      {decryptData(showDetails?.orgName, secretKey) ? (
        <DetailsFacility
          setShowDetails={setShowDetails}
          showDetails={showDetails}
          setIsSuggestedProfessionals={setIsSuggestedProfessionals}
          isStaffingNeeds={true}
        />
      ) : (
        data?.map((item: TableDataType, rowIndex: number) => (
          <ResponsiveTableCard
            key={rowIndex}
            rowIndex={rowIndex}
            patientFacilityName={decryptData(item?.orgName ?? "", secretKey)}
            location={item?.orgLocation ?? ""}
            speciality={decryptData(item?.speciality ?? "", secretKey)}
            date={""}
            schedule={item?.timePreference ?? ""}
            viewData={item}
            setIsSuggestedProfessionals={setIsSuggestedProfessionals}
            setShowDetails={setShowDetails}
            fetchCandidateName={fetchCandidateName}
            jobIDNumber={idNumber}
            setJobIDNumber={setJobIDNumber}
            isRequests={isRequests}
            handleCancelRequest={handleCancelRequest}
          />
        ))
      )}
    </div>
  );
}
