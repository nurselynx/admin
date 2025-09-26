import React from "react";
import dayjs from "dayjs";
import { format } from "date-fns";
import Modal from "../modal";
import { decryptData } from "@/helper/dataEncrypt";
import getOrdinalWeekday from "@/hooks/days";

interface RecurringDetailsModalProps {
  requestDetails: any;
  setRequestDetails: (details: any) => void;
}

// Reusable Detail Card
const DetailCard: React.FC<{
  label: string;
  value: React.ReactNode;
  className?: any;
}> = ({ label, value, className }) => (
  <div
    className={`text-left border border-lynx-grey-600 p-3 rounded-md bg-[#f5f5f5] mb-4 ${className} `}
  >
    <h3 className="font-semibold text-lynx-grey-500 text-base">{label}</h3>
    <div className="text-sm text-lynx-grey-400 font-medium mt-2">{value}</div>
  </div>
);

// Weekday badges component
const WeekDaysBadges: React.FC<{ days: string[] }> = ({ days }) => {
  if (!days || days.length === 0) return <span>-</span>;

  return (
    <div className="flex gap-2 flex-wrap justify-start">
      {days.map((day) => (
        <span
          key={day}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-lynx-blue-100 text-white font-semibold"
        >
          {day}
        </span>
      ))}
    </div>
  );
};

const RecurringDetailsModal: React.FC<RecurringDetailsModalProps> = ({
  requestDetails,
  setRequestDetails,
}) => {
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
  const isRecurring =
    decryptData(requestDetails?.isRecurring, secretKey) === "Yes";

  // Decrypted fields
  const recurrenceType = decryptData(
    requestDetails?.reoccurrenceData?.recurrenceType,
    secretKey
  );
  const repeatEvery = decryptData(
    requestDetails?.reoccurrenceData?.repeatEvery,
    secretKey
  );

  const startDate = requestDetails?.reoccurrenceData?.startDate
    ? dayjs(requestDetails?.reoccurrenceData?.startDate).format("MMMM D, YYYY")
    : "-";

  const endDate = requestDetails?.reoccurrenceData?.endDate
    ? dayjs(requestDetails?.reoccurrenceData?.endDate).format("MMMM D, YYYY")
    : "-";

  const weekDays: string[] = requestDetails?.reoccurrenceData?.weekDays
    ? requestDetails?.reoccurrenceData?.weekDays
    : [];
  // Monthly mode text
  const onDay = requestDetails?.reoccurrenceData?.onDay;
  const monthlyModeText = onDay
    ? requestDetails?.reoccurrenceData?.monthlyMode === "weekdayOfMonth"
      ? `Occurs on the ${getOrdinalWeekday(onDay)} Until ${endDate}`
      : `Occurs on Day ${onDay} Until ${endDate}`
    : "-";
  // Generated dates
  const generatedDates = requestDetails?.formattedDates || [];

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <Modal
        isOpen={!!requestDetails?.id || !!requestDetails?.clientName}
        onClose={() => setRequestDetails({})}
        title={isRecurring ? "Recurring Details" : "Single Request"}
        className="max-w-[796px]"
      >
        <div className="w-full mt-4">
          {isRecurring ? (
            <>
              <div className="grid grid-cols-2 iPadAir:grid-cols-1 gap-x-4">
                <DetailCard label="Repeat Every" value={repeatEvery} />
                <DetailCard label="Unit" value={recurrenceType} />
                <DetailCard label="Start Date" value={startDate} />
                <DetailCard label="End Date" value={endDate} />
                {onDay !== "N/A" && (
                  <DetailCard label="Monthly Mode" value={monthlyModeText} />
                )}
              </div>

              {/* {weekDays && weekDays.length > 0 && (
                <DetailCard
                  label="Week Days"
                  className="!bg-transparent border-none p-0"
                  value={<WeekDaysBadges days={weekDays} />}
                />
              )}

              {generatedDates?.length > 0 && (
                <DetailCard
                  label="Repeats On (Generated Dates)"
                  className=" p-0 border border-gray-300 !bg-gray-100"
                  value={
                    <div className="flex flex-col gap-2 max-h-[200px]  overflow-y-auto pr-1">
                      {generatedDates?.map(
                        (
                          item: {
                            date: string;
                            time: string;
                            isMarked: boolean;
                          },
                          idx: number
                        ) => {
                          const parsedDate = new Date(item?.date);
                          const dayName = format(parsedDate, "EEE"); // Wed
                          const dateLabel = format(parsedDate, "MMMM d, yyyy"); // September 11, 2025
                          const timeLabel = item?.time;
                          return (
                            <div
                              key={idx}
                              className={`flex justify-between items-center border border-gray-300 rounded-md px-4 py-3 ${
                                item?.isMarked
                                  ? "bg-lynx-blue-100 text-white"
                                  : "bg-white"
                              }`}
                            >
                              <span className="font-medium">
                                {dayName} {dateLabel}
                              </span>
                              <span>{timeLabel}</span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  }
                />
              )} */}
            </>
          ) : (
            <p className="text-sm text-lynx-orange-700 font-medium text-center">
              Please note that this request is a one-time requirement and will
              not recur.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default RecurringDetailsModal;
