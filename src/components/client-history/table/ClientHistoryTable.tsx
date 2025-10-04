import DetailsFacility from "@/components/dashboard/admin/detailsFacility/page";
import { DataEmtpy } from "@/components/dashboard/admin/jobs";
import { StatusBadge } from "@/components/dashboard/admin/jobs/statusBadge";
import ResponsiveTableCard from "@/components/dashboard/admin/tableCardResponsive";
import { ClientHistoryColumn, ClientHistoryData } from "@/components/dashboard/admin/types";
import RecurringDetailsModal from "@/components/dashboard/recurringDetailsModal";
import Table from "@/components/dashboard/table/responsiveTable";
import { decryptData } from "@/helper/dataEncrypt";
import { format } from "date-fns";
import dayjs from "dayjs";
import { useState } from "react";


interface ClientHistoryTableProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  data?: ClientHistoryData[] | null;
  handleExcelExport: () => void;
}

const ClientHistoryTable = ({
  currentPage,
  setCurrentPage,
  totalPages,
  data,
  handleExcelExport,
}: ClientHistoryTableProps) => {
  const [showDetails, setShowDetails] = useState<any>(null);
  const [requestDetails, setRequestDetails] = useState<any>(null);
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY ?? "";
  const columns: ClientHistoryColumn[] = [
    {
      label: "Client Name",
      accessor: "job",
      render: (row) =>
        decryptData(row?.job?.orgName || row?.job?.clientName || "", secretKey),
    },
    {
      label: "Date Created",
      accessor: "job",
      render: (row) => dayjs(row?.job?.createdAt).format("MMMM D, YYYY"),
    },
    {
      label: "Current Status",
      accessor: "status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      label: "Accepted By",
      accessor: "acceptedByName",
      render: (row) => decryptData(row?.acceptedByName ?? "", secretKey),
    },
    {
      label: "Service Type",
      accessor: "jobType",
    },
    {
      label: "Full Details",
      accessor: "action",
      render: (row: any) => (
        <div className=" flex gap-2">
          <button
            type="button"
            onClick={() =>
              setShowDetails({
                ...row?.job,
                jobType: row?.jobType,
                acceptedByName: row?.acceptedByName,
                status: row?.status,
                requestedBy: row?.requester?.user?.fullName,
                acceptedBy: row?.acceptedBy,
              })
            }
            className=" text-lynx-blue-100"
          >
            Details
          </button>
          <button
            type="button"
            title={
              decryptData(row?.isRecurring, secretKey) === "Yes"
                ? "Recurring"
                : "Single Request"
            }
            onClick={() => setRequestDetails(row?.job)}
            className={` ${
              decryptData(row?.job?.isRecurring, secretKey) === "Yes"
                ? "bg-lynx-blue-100"
                : "bg-lynx-orange-700 "
            }  rounded-full h-8 w-8 text-white text-xs font-normal flex items-center justify-center`}
          >
            {decryptData(row?.job?.isRecurring, secretKey) === "Yes"
              ? "RE"
              : "S"}
          </button>
        </div>
      ),
    },
  ];

  const handleExport = () => {
    handleExcelExport();
  };
  return (
    <div className="mt-4">
      {data && data?.length > 0 ? (
        <div className="flex flex-col items-end px-6 gap-4">
          <button
            type="button"
            className="text-lynx-blue-100 py-2 px-4 rounded-md mb-2 justify-end border"
            onClick={handleExport}
          >
            Export as excel
          </button>
          <Table
            columns={columns}
            data={data}
            pagination={{
              currentPage,
              totalPages,
              onPageChange: setCurrentPage,
            }}
            // isModifiedActionsWidth={false}
          />
        </div>
      ) : (
        <DataEmtpy />
      )}
      <RecurringDetailsModal
        requestDetails={requestDetails}
        setRequestDetails={setRequestDetails}
      />
      {decryptData(
        showDetails?.clientName || showDetails?.orgName,
        secretKey
      ) ? (
        <DetailsFacility
          setShowDetails={setShowDetails}
          showDetails={showDetails}
          isHomeHealth={true}
        //   isAvailable={false}
          isStaffingNeeds={showDetails?.jobType === "staff"}
          isHomeCare={showDetails?.jobType === "non-medical"}
        />
      ) : (
        data?.map((item: ClientHistoryData, rowIndex: number) => (
          <ResponsiveTableCard
            key={rowIndex}
            rowIndex={rowIndex}
            patientFacilityName={decryptData(
              item?.job?.clientName ?? "",
              secretKey
            )}
            location={item?.job?.clientAddress}
            date={format(new Date(item?.job?.startDate), "MMM d, yyyy")}
            schedule={
              item?.job?.schedule === "00:00-24:00"
                ? "24 Hours"
                : item?.job?.schedule ?? ""
            }
            viewData={item?.job}
            phoneNumber={decryptData(item?.job?.phoneNumber ?? "", secretKey)}
            applicantId={item?.job?.applicantId}
            setShowDetails={setShowDetails}
            isPhoneNumber={true}
            isRequests={false}
            // isAvailable={false}
            // isMyJobs={false}
            // isSuggested={false}
          />
        ))
      )}
    </div>
  );
};

export default ClientHistoryTable;
