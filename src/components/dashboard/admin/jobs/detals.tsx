import React from "react";
import Image from "next/image";

const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
// Define the type for the props
interface DetailsHealthcareProps {
  setShowDetails: (value: null) => void;
  name: string;
  jobType: string;
  speciality: string;
  schedule: string;
  primaryContact?: any;
  languagePreference?: string;
  date: string;
  genderPreference: string;
  applicantId?: number;
  location: string;
  experience: number;
  handleModalClose: () => void;
  handleConfirmAccept: () => void;
  setIsModalOpen: (value: boolean) => void;
  jobAcceptedTitle: (status: string) => void; // Corrected this line
  setApplicantId?: any;
  userId: number;
  immediateCare: string;
}

const DetailsAdmin: React.FC<DetailsHealthcareProps> = ({
  setShowDetails,
  name,
  jobType,
  speciality,
  schedule,
  date,
  languagePreference,
  genderPreference,
  location,
  experience,
  jobAcceptedTitle,
  setIsModalOpen,
  setApplicantId,
  userId,
  immediateCare,
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

        {renderDetail("Name", name)}
        <hr />
        {renderDetail("Job Type", jobType)}
        <hr />
        {renderDetail("Speciality", speciality)}
        <hr />
        {renderDetail("Date", date)}
        <hr />
        {renderDetail(
          "Schedule/Availability",
          schedule === "00:00-24:00" ? "24 Hours" : schedule
        )}
        <hr />
        {renderDetail("Language", languagePreference)}
        <hr />
        {renderDetail("Gender", genderPreference)}
        <hr />
        {renderDetail("Experience", experience)}
        <hr />
        {renderDetail("Location", location)}
        <hr />
        {renderDetail("Date", date)}
        <hr />
        {renderDetail("Immediate Care", immediateCare)}
        <hr />
        <div className="flex justify-between gap-10">
          <button
            type="button"
            className="w-full bg-lynx-blue-100 text-white py-2 px-4 rounded-md mt-4"
            onClick={() => {
              setIsModalOpen(true);
              jobAcceptedTitle("accept");
              setApplicantId(userId)
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
              setApplicantId(userId)
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsAdmin;
