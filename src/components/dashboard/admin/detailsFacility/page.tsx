import React from "react";
import Image from "next/image";
import { decryptData } from "@/helper/dataEncrypt";
import { DetailsFacilityProps } from "../types";
import { StatusBadge } from "../jobs/statusBadge";
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

const DetailsFacility: React.FC<DetailsFacilityProps> = ({
  setShowDetails,
  showDetails,
  setIsSuggestedProfessionals,
  isStaffingNeeds = false,
  isHomeCare = false,
  isRequests = false,
  handleCancelRequest,
}) => {
  const renderDetail = (
    label: string,
    value?: string | number,
    suffix: string = ""
  ) => (
    <div className="mb-4 mt-6">
      <h2 className="text-sm mb-2 font-normal text-lynx-grey-700">{label}</h2>
      <p className="text-lynx-blue-400 text-base font-normal">
        {value ? `${value}${suffix}` : "N/A"}
      </p>
    </div>
  );

  const renderBoldField = (
    label: string,
    value?: string | number,
    suffix: string = ""
  ) => (
    <div className="mb-4 mt-6">
      <h2 className="text-sm mb-2 font-normal text-lynx-grey-700">{label}</h2>
      <p className="font-semibold text-base leading-[110%] tracking-normal">
        {value ? `${value}${suffix}` : "N/A"}
      </p>
    </div>
  );

  const renderDocumentField = (label: string, url?: string) => (
    <div className="mb-4 mt-6">
      <h2 className="text-sm mb-2 font-normal text-lynx-grey-700">{label}</h2>
      <button
        type="button"
        onClick={() => {
          if (url) {
            const link = document.createElement("a");
            link.href = url;
            link.download = "document";
            link.target = "_blank";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            console.error("No URL available for download.");
          }
        }}
        disabled={!url}
        className={`border border-solid rounded-lg px-3 py-1 text-sm text-center ${
          url
            ? "text-lynx-blue-100 border-lynx-blue-100"
            : "!bg-white border-gray-600 cursor-not-allowed"
        }`}
      >
        <div className="flex justify-between gap-2">View</div>
      </button>
    </div>
  );

  return (
    <div className="absolute top-0 w-full min-h-screen">
      <div className="bg-white min-h-screen p-6">
        <div className="flex items-start mb-9">
          <Image
            src="/assets/image/arrow-grey.png"
            alt="arrow"
            height={4}
            width={8}
            quality={100}
            onClick={() => setShowDetails(null)}
          />
          <h1 className="text-sm font-semibold text-lynx-blue-400 mx-auto">
            Details
          </h1>
        </div>

        {isStaffingNeeds ? (
          <>
            {renderBoldField(
              "Organization Name",
              decryptData(showDetails?.orgName ?? "", secretKey)
            )}
            <hr />

            {renderDetail(
              "Location",
              decryptData(showDetails?.orgLocation ?? "", secretKey)
            )}
            <hr />

            {renderDetail(
              "Speciality and qualifications",
              decryptData(showDetails?.speciality ?? "", secretKey)
            )}
            <hr />

            {renderDetail(
              "Gender",
              decryptData(showDetails?.genderPreference ?? "", secretKey)
            )}
            <hr />

            {renderDetail("Language", showDetails?.languagePreference ?? "")}
            <hr />

            {renderDetail(
              "Time",
              decryptData(showDetails?.timePreference ?? "", secretKey)
            )}
            <hr />

            {/* {renderDetail("Frequency Required", decryptData(showDetails?.frequencyRequired ?? "", secretKey))}
            <hr /> */}
            {renderDetail(
              "Additional Information",
              decryptData(showDetails?.additionalInformation ?? "", secretKey)
            )}
            <hr />
          </>
        ) : (
          <>
            {renderBoldField(
              "Service Type",
              decryptData(showDetails?.serviceNeeded ?? "", secretKey)
            )}
            <hr />
            {renderDetail(
              "Client Name",
              decryptData(showDetails?.clientName ?? "", secretKey)
            )}
            <hr />
            {renderDetail("Client Address", showDetails?.clientAddress)}
            <hr />
            {renderDetail(
              "Phone Number",
              decryptData(showDetails?.phoneNumber ?? "", secretKey)
            )}
            <hr />

            {isHomeCare && (
              <>
                {renderDetail(
                  "Insurance Type",
                  decryptData(showDetails?.insuranceType ?? "", secretKey)
                )}
                <hr />
              </>
            )}
            {renderDetail(
              "Insurance Provider Name",
              decryptData(showDetails?.insuranceProviderName ?? "", secretKey)
            )}
            <hr />
            {renderDetail(
              "Group Number",
              decryptData(showDetails?.groupNumber ?? "", secretKey)
            )}
            <hr />
            {renderDetail(
              "Identification Number",
              decryptData(showDetails?.identificationNumber ?? "", secretKey)
            )}
            <hr />
            {renderDetail(
              "Schedule/Availability",
              showDetails?.schedule === "00:00-24:00"
                ? "24 Hours"
                : showDetails?.schedule
            )}
            <hr />

            {renderDetail(
              "Frequency Required",
              decryptData(showDetails?.frequencyRequired ?? "", secretKey)
            )}
            <hr />
          </>
        )}

        <h2 className="text-sm  font-normal text-lynx-grey-700 mb-2 mt-6">
          Status
        </h2>
        <p className=" mb-4">
          {showDetails?.status && (
            <StatusBadge status={showDetails?.status ?? 0} />
          )}
        </p>
        <hr />

        {renderDocumentField(
          "Document",
          showDetails?.documentUrl?.signed_url ?? ""
        )}
        <hr />

        <button
          type="button"
          className={`w-full ${
            isRequests
              ? "text-lynx-orange-700 border border-lynx-orange-700 bg-transparent "
              : "bg-lynx-blue-100 text-white"
          }   py-2 px-4 rounded-md mt-4`}
          onClick={() => {
            if (isRequests) {
              handleCancelRequest(showDetails?.applicantId ?? "");
            } else {
              setIsSuggestedProfessionals(true);
            }
          }}
        >
          {isRequests ? "Cancel Request" : "View Professionals"}
        </button>
      </div>
    </div>
  );
};

export default DetailsFacility;
