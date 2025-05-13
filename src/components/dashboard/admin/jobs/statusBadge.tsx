import React from "react";

export type StatusType = 0 | 1 | 2 | 3 | 4 | 5 | null;

interface StatusProps {
  status: StatusType;
}

const STATUS_MAP: {
  [key in Exclude<StatusType, null>]: {
    text: string;
    bgColor: string;
    textColor: string;
    width: string;
  };
} = {
  0: {
    text: "In Progress",
    bgColor: "bg-[#F1F1F1]",
    textColor: "text-[#4F4F4F]",
    width: "w-[93px]",
  },
  1: {
    text: "Accepted but not completed",
    bgColor: "bg-[#FFF9F2]",
    textColor: "text-[#FF7700]",
    width: "w-[210px]",
  },
  2: {
    text: "Accepted",
    bgColor: "bg-[#FFEDED]",
    textColor: "text-[#FF4D4D]",
    width: "w-[96px]",
  },
  3: {
    text: "Completed",
    bgColor: "bg-[#EFFFF3]",
    textColor: "text-[#3EB666]",
    width: "w-[96px]",
  },
  4: {
    text: "Cancelled",
    bgColor: "bg-[#ffebeb]",
    textColor: "text-[#e30707]",
    width: "w-[96px]",
  },
  5: {
    text: "Pending invoice",
    bgColor: "bg-[#FFEDED]",
    textColor: "text-[#FF4D4D]",
    width: "w-[96px]",
  },
};

export const StatusBadge: React.FC<StatusProps> = ({ status }) => {
  const defaultStatus = STATUS_MAP[0];
  const currentStatus =
    status !== null ? STATUS_MAP[status] || defaultStatus : defaultStatus;

  const { text, bgColor, textColor, width } = currentStatus;

  return (
    <span
      className={`${bgColor} ${textColor} ${width} text-sm h-[29px] text-center flex justify-center items-center rounded-md`}
    >
      {text}
    </span>
  );
};
