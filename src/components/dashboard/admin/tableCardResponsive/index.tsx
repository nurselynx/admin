import React from "react";
import Image from "next/image";
import { ResponsiveTableCardProps } from "../types";

const ResponsiveTableCard: React.FC<ResponsiveTableCardProps> = ({
  patientFacilityName,
  location,
  date,
  schedule,
  viewData,
  rowIndex,
  setIsSuggestedProfessionals,
  setShowDetails,
  isRequests,
  fetchCandidateName,
  isJobType,
  setJobIDNumber,
  phoneNumber,
  isPhoneNumber,
  speciality,
  handleCancelRequest,
  applicantId,
}) => {
  return (
    <div className="block md:hidden w-full">
      <div
        key={rowIndex}
        className="p-4 mb-4 w-full flex flex-col gap-y-2 relative"
      >
        <h1 className="text-base text-lynx-blue-400 font-semibold">
          {patientFacilityName}
        </h1>
        <div className="text-base text-lynx-grey-700 flex items-center mt-1 pr-5">
          <Image
            src="/assets/image/loction-grey.png"
            alt="location"
            height={20}
            width={20}
          />
          <span className="ml-2 text-sm">{location}</span>
        </div>
        <div className="text-base text-lynx-grey-700 flex items-center mt-1">
          <Image
            src={`/assets/image/phone.png`}
            alt="phone"
            height={16}
            width={16}
          />
          <div className="text-base text-lynx-grey-700 flex items-center mt-1 ml-2">
            {isPhoneNumber ? (
              <span className="material-icons text-sm">{phoneNumber}</span>
            ) : (
              <span className="material-icons text-sm">{speciality}</span>
            )}

            <span className="bg-[#B0BDD2] rounded-lg w-2 h-2 ml-2"></span>
            <span className="ml-2 flex gap-1 items-center text-sm">
              <Image
                src="/assets/image/clock-grey.png"
                alt="clock"
                height={16}
                width={16}
              />
              {schedule}
            </span>
          </div>
        </div>
        <Image
          src="/assets/image/arrow_left_blue.png"
          alt="arrow_left_blue"
          height={6}
          width={10}
          className="absolute right-5 top-14"
          onClick={() => setShowDetails(viewData)}
        />
        <hr />
        <button
          type="button"
          className={`w-full hidden ${
            isRequests
              ? "text-lynx-orange-700 border border-lynx-orange-700 bg-transparent "
              : "bg-lynx-blue-100 text-white"
          }   py-2 px-4 rounded-md mt-4`}
          onClick={() => {
            if (isRequests) {
              handleCancelRequest(viewData);
            } else {
              setIsSuggestedProfessionals?.(true);
              fetchCandidateName(isJobType ? viewData?.healthId : viewData?.id);
              // jobIDNumber(viewData?.id);
              setJobIDNumber && setJobIDNumber(viewData?.id);
            }
          }}
        >
          {isRequests ? "Cancel Request" : "View Professionals"}
        </button>
      </div>
    </div>
  );
};

export default ResponsiveTableCard;
