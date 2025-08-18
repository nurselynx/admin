import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { decryptData } from "@/helper/dataEncrypt";
import { DetailsFacilityProps } from "../types";
import { StatusBadge } from "../jobs/statusBadge";
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

const DetailsFacility: React.FC<DetailsFacilityProps> = ({
  setShowDetails,
  showDetails,
  isStaffingNeeds = false,
  isHomeCare = false,
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
    <div className="mb-4 mt-6 ">
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
    <div className="absolute top-0 w-full h-full md:absolute md:left-0 md:top-0 md:z-50">
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
            Details
          </h1>
        </div>
        <div className=" px-6 pb-3 w-full">
          {showDetails?.acceptedBy?.title && (
            <>
              <h2 className=" font-semibold">Assigned Professional </h2>
              {renderDetail(
                "Name",
                decryptData(showDetails?.acceptedBy?.name ?? "", secretKey)
              )}
              <hr />
              {renderDetail(
                "Title",
                decryptData(
                  showDetails?.acceptedBy?.title ?? "",
                  secretKey
                )?.toUpperCase()
              )}
              <hr />
              {renderDetail("Email", showDetails?.acceptedBy?.email ?? "")}
              <hr />

              {renderDetail(
                "Expertise",
                decryptData(
                  showDetails?.acceptedBy?.expertise ?? "",
                  secretKey
                ) || showDetails?.acceptedBy?.expertise
              )}
              <hr />

              {renderDetail(
                "Phone Number",
                decryptData(
                  showDetails?.acceptedBy?.phoneNumber ?? "",
                  secretKey
                )
              )}
              <hr />
            </>
          )}

          {isStaffingNeeds ? (
            <>
              {renderBoldField(
                "Organization Name",
                decryptData(showDetails?.orgName ?? "", secretKey)
              )}
              <hr />

              {renderDetail("Location", showDetails?.orgLocation)}
              <hr />

              {renderDetail(
                "Speciality and Qualifications",
                decryptData(showDetails?.speciality ?? "", secretKey)
              )}
              <hr />
              {renderDetail(
                "Allied Health",
                decryptData(showDetails?.alliedHealth ?? "", secretKey)
              )}
              <hr />

              {renderDetail(
                "Gender",
                decryptData(showDetails?.genderPreference ?? "", secretKey)
              )}
              <hr />

              {renderDetail("Language", showDetails?.languagePreference ?? "")}
              <hr />

              {showDetails &&
                renderDetail(
                  "Date",
                  `${format(
                    new Date(showDetails.startDate),
                    "yyyy-MM-dd"
                  )} - ${format(new Date(showDetails.endDate), "yyyy-MM-dd")}`
                )}
              <hr />

              {renderDetail("Time", showDetails?.timePreference)}
              <hr />

              {/* {renderDetail("Frequency Required", decryptData(showDetails?.frequencyRequired ?? "", secretKey))}
            <hr /> */}

              {renderDetail(
                "Additional Information",
                decryptData(showDetails?.additionalInformation ?? "", secretKey)
              )}
              <hr />
              <div className=" py-16 opacity-0"></div>
            </>
          ) : (
            <>
              {renderBoldField(
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
                  {renderDetail(
                    "Other Request",
                    decryptData(
                      showDetails?.other ?? showDetails?.otherInfo ?? "",
                      secretKey
                    )
                  )}
                  <hr />
                </>
              )}

              {renderDetail(
                "Pay Method",
                decryptData(showDetails?.longTermInsurance ?? "", secretKey) ===
                  "Yes"
                  ? "Insurance"
                  : "Private Pay"
              )}
              <hr />

              {renderDetail(
                "Desired Rate",
                decryptData(showDetails?.privatePay ?? "", secretKey)
                  ? `$${decryptData(showDetails?.privatePay ?? "", secretKey)}`
                  : "N/A"
              )}
              <hr />

              {renderDetail(
                "Insurance Name",
                decryptData(
                  showDetails?.insuranceProviderName ??
                    showDetails?.insuranceProvider ??
                    "",
                  secretKey
                )
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
                isHomeCare ? "Service Type" : "Service Needed",
                decryptData(showDetails?.serviceNeeded ?? "", secretKey)
              )}
              <hr />
              {!isHomeCare && (
                <>
                  {renderDetail(
                    "Other Request",
                    decryptData(showDetails?.other ?? "", secretKey)
                  )}
                  <hr />
                </>
              )}
              {showDetails &&
                renderDetail(
                  "Date",
                  `${format(
                    new Date(showDetails.startDate),
                    "yyyy-MM-dd"
                  )} - ${format(new Date(showDetails.endDate), "yyyy-MM-dd")}`
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

              <hr />
              <h2 className="text-sm  font-normal text-lynx-grey-700 mb-2 mt-6">
                Status
              </h2>
              <p className=" mb-4">
                {<StatusBadge status={showDetails?.status} />}
              </p>
              <hr />
              {renderDocumentField(
                "Document",
                showDetails?.documentUrl?.signed_url ?? ""
              )}
              <hr />
              {renderDetail(
                "Additional Information",
                decryptData(showDetails?.additionalInformation ?? "", secretKey)
              )}
              <div className=" my-20"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsFacility;
