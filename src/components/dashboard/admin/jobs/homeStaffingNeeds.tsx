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
import JobCreator from "../jobCreator/page";
import AssignedProfessional from "../assignedProfessional/page";
import RecurringDetailsModal from "../../recurringDetailsModal";
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
  setShowProfessionalDetails?: any;
  showProfessionalDetails?: any;
  showJobCreatorDetails?: any;
  setShowJobCreatorDetails?: any;
  setRequestDetails?: any;
  requestDetails?: any;
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
  setShowProfessionalDetails,
  showProfessionalDetails,
  showJobCreatorDetails,
  setShowJobCreatorDetails,
  setRequestDetails,
  requestDetails,
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
      render: (row: any) => (
        <button
          type="button"
          onClick={() =>
            row?.requestedBy ? setShowJobCreatorDetails(row) : null
          }
          className={`${
            row?.requestedBy
              ? "text-lynx-blue-100"
              : " text-lynx-blue-400 cursor-not-allowed"
          }`}
        >
          {row?.requestedBy ? "View Job Creator" : "No Job Creator"}
        </button>
      ),
    },
    {
      label: "Assigned Professional",
      accessor: "status",
      render: (row: any) => (
        <button
          type="button"
          onClick={() =>
            row?.acceptedBy ? setShowProfessionalDetails(row) : null
          }
          className={`${
            row?.acceptedBy
              ? "text-lynx-blue-100"
              : " text-red-400 cursor-not-allowed"
          }`}
        >
          {row?.acceptedBy ? "View Assigned Job Details" : "Job Not Assigned"}
        </button>
      ),
    },
    {
      label: "Job Details",
      accessor: "action",
      render: (row: any) => (
        <div className=" flex gap-2">
          <button
            type="button"
            onClick={() => setShowDetails(row)}
            className=" text-lynx-blue-100"
          >
            View Job Details
          </button>
          <button
            type="button"
            title={
              decryptData(row?.isRecurring, secretKey) === "Yes"
                ? "Recurring"
                : "Single Request"
            }
            onClick={() => setRequestDetails(row)}
            className={` ${
              decryptData(row?.isRecurring, secretKey) === "Yes"
                ? "bg-lynx-blue-100"
                : "bg-lynx-orange-100 "
            }  rounded-full h-8 w-8 text-white text-xs font-normal flex items-center justify-center`}
          >
            {decryptData(row?.isRecurring, secretKey) === "Yes" ? "RE" : "S"}
          </button>
        </div>
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
      <RecurringDetailsModal
        requestDetails={requestDetails}
        setRequestDetails={setRequestDetails}
      />
      {decryptData(showJobCreatorDetails?.requestedBy, secretKey) && (
        <>
          <JobCreator
            setShowDetails={setShowJobCreatorDetails}
            showDetails={showJobCreatorDetails}
            setIsSuggestedProfessionals={setIsSuggestedProfessionals}
          />
        </>
      )}
      {decryptData(showProfessionalDetails?.orgName, secretKey) && (
        <>
          <AssignedProfessional
            setShowDetails={setShowProfessionalDetails}
            showDetails={showProfessionalDetails}
            setIsSuggestedProfessionals={setIsSuggestedProfessionals}
          />
        </>
      )}
      {decryptData(showDetails?.orgName, secretKey) ? (
        <>
          <DetailsFacility
            setShowDetails={setShowDetails}
            showDetails={showDetails}
            setIsSuggestedProfessionals={setIsSuggestedProfessionals}
            isStaffingNeeds={true}
            showProfessionalDetails={showProfessionalDetails}
          />
        </>
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
