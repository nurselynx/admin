import React from "react";
import Image from "next/image";
import { decryptData } from "@/helper/dataEncrypt";
import { DetailsFacilityProps } from "../types";
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

const AssignedProfessional: React.FC<DetailsFacilityProps> = ({
  setShowDetails,
  showDetails,
}) => {
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
    <div className=" fixed bottom-0 top-0 w-full h-full md:absolute md:left-0 md:top-0 md:z-50">
      <div className="bg-white h-screen fixed bottom-0 w-full">
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
            Assigned Professional Details
          </h1>
        </div>
        <div className=" px-6 pb-3 w-full">
          {showDetails?.acceptedBy?.title && (
            <>
              {renderDetail(
                "Name",
                decryptData(
                  showDetails?.acceptedBy?.name ??
                    showDetails?.acceptedBy?.orgName,
                  secretKey
                )
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
        </div>
      </div>
    </div>
  );
};

export default AssignedProfessional;
