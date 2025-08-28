import React from "react";
import { decryptData } from "@/helper/dataEncrypt";
import Table from "../../table/responsiveTable";
import ReportDetails from "./reportDetails";
import ReportMobileCard from "./reportMobileCard";
import { DataEmtpy } from "../jobs";
import { StatusBadge } from "../jobs/statusBadge";

interface HomeHealthMedicalProps {
  data: any;
  currentPage: number;
  totalPages: number;
  setShowDetails: any;
  setCurrentPage: (page: number) => void;
  showDetails: any;
}

export default function Report({
  data,
  currentPage,
  totalPages,
  setShowDetails,
  setCurrentPage,
  showDetails,
}: HomeHealthMedicalProps) {
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY ?? "";
  const columns: any = [
    {
      label: "Job ID",
      accessor: "jobId",
    },
    {
      label: "Job Type",
      accessor: "jobType",
    },
    {
      label: "Requestor Name",
      accessor: "requester",
      render: (row: any) => decryptData(row?.requesterName ?? "", secretKey),
    },
    {
      label: "Status",
      accessor: "status",
      render: (row: any) => <StatusBadge status={row?.status ?? 0} />,
    },
    {
      label: "Report Details",
      accessor: "action",
      render: (row: any) => (
        <button
          type="button"
          onClick={() => setShowDetails(row)}
          className=" text-lynx-blue-100"
        >
          Report Details
        </button>
      ),
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

      {showDetails?.jobId ? (
        <>
          <ReportDetails
            setShowDetails={setShowDetails}
            showDetails={showDetails}
          />
        </>
      ) : (
        data?.map((item: any, rowIndex: number) => (
          <ReportMobileCard
            key={rowIndex}
            orgName={item?.requester?.name ?? "N/A"}
            address={decryptData(item?.acceptedBy ?? "N/A", secretKey)}
            time={item?.startDate}
            onClick={() => setShowDetails(item)}
          />
        ))
      )}
    </div>
  );
}
