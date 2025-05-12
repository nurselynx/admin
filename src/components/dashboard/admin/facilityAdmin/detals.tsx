import React from "react";
import Image from "next/image";
import { format } from "date-fns";

const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
// Define the type for the props
interface DetailsHealthcareProps {
  setShowDetails: (value: null) => void;
  facilityName?: string;
  email?: string;
  type?: string;
  licenseNumber?: string;
  primaryContact?: any;
  languagePreference?: string;
  date?: string;
  schedule?: string;
  genderPreference?: string;
  applicantId?: number;
  handleModalClose: () => void;
  handleConfirmAccept: () => void;
  setIsModalOpen: (value: boolean) => void;
  jobAcceptedTitle: (status: string) => void; // Corrected this line
  setApplicantId?: any;
  userId: string;
  image?: any;
  licenseExpiryDate: string;
}

const DetailsAdmin: React.FC<DetailsHealthcareProps> = ({
  setShowDetails,
  facilityName,
  email,
  type,
  licenseNumber,
  date,
  primaryContact,
  jobAcceptedTitle,
  setIsModalOpen,
  setApplicantId,
  userId,
  image,
  licenseExpiryDate,
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

        {renderDetail("Organization Name", facilityName)}
        <hr />
        {renderDetail("Email", email)}
        <hr />
        {renderDetail("Type", type)}
        <hr />
        {renderDetail(
          "Date",
          date ? format(new Date(date), "MMM d, yyyy") : "N/A"
        )}
        <hr />
        {renderDetail("Primary Number", primaryContact)}
        <hr />
        {renderDetail("License Number", licenseNumber)}
        <hr />
        {renderDetail("License Expiration Date", licenseExpiryDate)}
        <hr />
        <h2 className="text-sm mb-2 font-normal text-lynx-grey-700 mt-2">
          License Url
        </h2>
        <button
          type="button"
          onClick={() => {
            const url = image;
            if (document) {
              const link = document.createElement("a");
              link.href = url;
              link.download = "downloaded-image.png"; // Specify a default filename
              link.target = "_blank"; // Optional: Open the link in a new tab
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } else {
              console.error("No URL available for download.");
            }
          }}
          className="text-lynx-blue-100 border mb-3 border-solid border-lynx-blue-100 rounded-lg px-3 py-1 text-sm text-center"
        >
          <div className="flex justify-between gap-2">View</div>
        </button>
        <hr />
        <div className="flex justify-between gap-10">
          <button
            type="button"
            className="w-full bg-lynx-blue-100 text-white py-2 px-4 rounded-md mt-4"
            onClick={() => {
              setIsModalOpen(true);
              jobAcceptedTitle("accept");
              setApplicantId(userId);
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
              setApplicantId(userId);
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
