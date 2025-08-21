import React from "react";
import Image from "next/image";
import { format } from "date-fns";

const HealthcareResponsiveTableCard: React.FC<any> = ({
  patientFacilityName,
  location,
  date,
  schedule,
  viewData,
  rowIndex,
  setShowDetails,
  setIsModalOpen,
  setApplicantId,
  jobAcceptedTitle,
  userId,
}) => {
  return (
    <div className="hidden md:hidden w-full">
      <div
        key={rowIndex}
        className="p-4 mb-4 w-full flex flex-col gap-y-2 relative"
      >
        <h1 className="text-base text-lynx-blue-400 font-semibold">
          {patientFacilityName}
        </h1>
        <div className="text-base text-lynx-grey-700 flex items-center mt-1">
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
            src="/assets/image/date-grey.png"
            alt="date"
            height={16}
            width={16}
          />
          <div className="text-base text-lynx-grey-700 flex items-center mt-1 ml-2">
            <span className="material-icons text-sm">
              {format(new Date(date), "MMM d, yyyy")}
            </span>
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
        <div className="flex justify-between gap-10">
          <button
            type="button"
            className="w-full bg-lynx-blue-100 text-white py-2 px-4 rounded-md mt-4"
            onClick={() => {
              setIsModalOpen(true);
              jobAcceptedTitle("accept");
              setApplicantId(userId ? userId : viewData?.userId);
            }}
          >
            Accept
          </button>

          <button
            type="button"
            className="w-full text-lynx-blue-100 border border-lynx-blue-100 py-2 px-4 rounded-md mt-4"
            onClick={() => {
              setIsModalOpen(true);
              jobAcceptedTitle("cancel");
              setApplicantId(viewData?.userId);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthcareResponsiveTableCard;
