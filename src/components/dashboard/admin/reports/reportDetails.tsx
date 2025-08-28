import Image from "next/image";
import { format } from "date-fns";
import { decryptData } from "@/helper/dataEncrypt";
import { StatusBadge } from "../jobs/statusBadge";
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

const ReportDetails: React.FC<any> = ({ setShowDetails, showDetails }) => {
  const renderDetail = (
    label: string,
    value?: string | number,
    suffix: string = ""
  ) => (
    <div className="mb-4 mt-6">
      <h2 className="text-sm mb-2 font-normal text-lynx-grey-700">{label}</h2>
      <p className="text-lynx-blue-400 text-base font-normal break-words">
        {value ? `${value}${suffix}` : "N/A"}
      </p>
    </div>
  );

  return (
    <div className="xl:fixed xl:overflow-x-auto xl:z-50 xl:top-0 w-full xl:h-full  md:absolute md:left-0 md:top-0 md:z-50">
      <div className="bg-white min-h-screen ">
        <div className="flex items-start mb-9 sticky top-0 bg-white p-6 shadow-[0px_2px_6px_0px_#e8e4e4]">
          <button
            type="button"
            onClick={() => setShowDetails(null)}
            className=" w-8 h-8 bg-white rounded flex items-center justify-center shadow-[0px_2px_6px_0px_#e8e4e4]"
          >
            <Image
              src="/assets/image/arrow-grey.png"
              alt="arrow"
              height={4}
              width={8}
              quality={100}
            />
          </button>
          <h1 className="text-sm font-semibold text-lynx-blue-400 mx-auto">
            Report Details
          </h1>
        </div>

        <div className=" px-6 pb-3 w-full ">
          <>
            {renderDetail("Job ID", showDetails?.jobId)}
            <hr />

            {renderDetail(
              "Requestor Name",
              decryptData(showDetails?.requesterName ?? "", secretKey)
            )}
            <hr />

            {renderDetail(
              "Date to Creation",
              `${format(
                new Date(showDetails?.dateOfService ?? null),
                "yyyy-MM-dd"
              )}`
            )}
            <hr />

            {renderDetail(
              "Client Name",
              decryptData(showDetails?.clientName ?? "", secretKey)
            )}
            <hr />

            {renderDetail("Job Type", showDetails?.jobType)}
            <hr />

            {renderDetail(
              "Type of Service / Speciality",
              decryptData(showDetails?.typeOfService, secretKey)?.toUpperCase()
            )}
            <hr />

            {renderDetail(
              "Start Date",
              `${format(new Date(showDetails.startDate), "yyyy-MM-dd")}`
            )}
            <hr />

            {renderDetail(
              "End Date",
              `${format(new Date(showDetails.endDate), "yyyy-MM-dd")}`
            )}
            <hr />

            {renderDetail("Start Time", showDetails?.startTime)}
            <hr />

            {renderDetail("End Time", showDetails?.endTime)}
            <hr />

            {renderDetail(
              "Health Professional / Organization Name",
              decryptData(showDetails?.acceptedBy ?? "", secretKey)
            )}
            <hr />

            {renderDetail("Assigned To", showDetails?.assignedTo)}
            <hr />

            {renderDetail("Acceptor's Email", showDetails?.acceptedByEmail)}
            <hr />

            {renderDetail(
              "Acceptor's Phone",
              decryptData(showDetails?.acceptedByNumber ?? "", secretKey)
            )}
            <hr />

            {renderDetail(
              "Pay Rate / Insurance Name",
              decryptData(showDetails?.payRate ?? "", secretKey)
            )}
            <hr />

            <h2 className="text-sm  font-normal text-lynx-grey-700 mb-2 mt-6">
              Status
            </h2>
            <p className=" mb-4">
              {<StatusBadge status={showDetails?.status} />}
            </p>
            <hr />
            <hr />

            <div className=" py-16 opacity-0"></div>
          </>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
