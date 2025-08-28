import Image from "next/image";

interface MobileCardProps {
  orgName: string;
  address: string;
  time: string;
  onClick: () => void;
}

const ReportMobileCard: React.FC<MobileCardProps> = ({
  orgName,
  address,
  time,
  onClick,
}) => {
  return (
    <div className="block md:hidden w-full">
      <div className="p-4 mb-4 w-full flex flex-col gap-y-2 relative">
        {/* Organization Name */}
        <h1 className="text-base text-lynx-blue-400 font-semibold">
          {orgName}
        </h1>

        {/* Address */}
        <div className="text-base text-lynx-grey-700 flex items-center mt-1 pr-5">
          <Image
            src="/assets/image/loction-grey.png"
            alt="location"
            height={20}
            width={20}
          />
          <span className="ml-2 text-sm">{address}</span>
        </div>

        {/* Phone + Time */}
        <div className="text-base text-lynx-grey-700 flex items-center mt-1">
          <Image
            src={`/assets/image/phone.png`}
            alt="phone"
            height={16}
            width={16}
          />
          <div className="text-base text-lynx-grey-700 flex items-center mt-1 ml-2">
            <span className="ml-2 flex gap-1 items-center text-sm">
              <Image
                src="/assets/image/clock-grey.png"
                alt="clock"
                height={16}
                width={16}
              />
              {time}
            </span>
          </div>
        </div>

        {/* Arrow */}
        <Image
          src="/assets/image/arrow_left_blue.png"
          alt="arrow_left_blue"
          height={6}
          width={10}
          className="absolute right-5 top-14 cursor-pointer"
          onClick={onClick}
        />

        <hr />
      </div>
    </div>
  );
};

export default ReportMobileCard;
