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
  renderAdditionalInfo?: any;
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

export const CancelReject = ({ handleCancelRequest, applicantId }: any) => {
  return (
    <button
      type="button"
      onClick={() => handleCancelRequest(applicantId)}
      className="bg-transparent text-lynx-orange-700 border border-lynx-orange-700 w-36 h-7 rounded-md flex items-center justify-center"
    >
      Cancel Request{" "}
      <Image
        src="/assets/image/cancel.svg"
        alt="arrow_left"
        width={18}
        height={18}
      />
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
    <div className="flex justify-between gap-2 items-center">
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
  renderAdditionalInfo,
  setIsSuggestedProfessionals,
  fetchCandidateName,
  idNumber,
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
}: HomeHealthMedicalProps) {
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY ?? "";
  const columns: Column[] = [
    {
      label: "Organization Name",
      accessor: "orgName",
      render: (row) => decryptData(row?.orgName ?? "", secretKey),
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
    {
      label: "Status",
      accessor: "Status",
      render: (row: any) => <StatusBadge status={row?.status ?? 0} />,
    },
    {
      label: "Location",
      accessor: "orgLocation",
    },
    {
      label: "Specialty and qualifications",
      accessor: "speciality",
      render: (row) => decryptData(row?.speciality ?? "", secretKey),
    },
    {
      label: "Gender",
      accessor: "genderPreference",
      render: (row) => decryptData(row?.genderPreference ?? "", secretKey),
    },
    {
      label: "Language",
      accessor: "languagePreference",
      render: (row) => row?.languagePreference,
    },
    {
      label: "Time",
      accessor: "timePreference",
    },
    {
      label: "Additional Information",
      accessor: "additionalInformation",
      render: (row) => renderAdditionalInfo(row),
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
            location={decryptData(item?.orgLocation ?? "", secretKey)}
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
