import React from "react";
import Image from "next/image";
import Link from "next/link";
import { format, isToday, isYesterday } from "date-fns";

type Notification = {
  id: number;
  message: string;
  title: string;
  createdAt: string;
  type: string; // Narrowed types for better type safety
  status: string;
  refId?: string;
};

type NotificationPanelProps = {
  notifications: Notification[] | null;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
};

const formatDate = (date: any) => {
  if (isToday(date)) {
    return `Today at ${format(date, "hh:mm a")}`;
  }
  if (isYesterday(date)) {
    return `Yesterday at ${format(date, "hh:mm a")}`;
  }
  return `${format(date, "MMMM d")} at ${format(date, "hh:mm a")}`;
};

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  setIsOpen,
  isOpen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0  w-80 tablet:w-full bg-white shadow-lg border border-gray-200 z-50 h-full overflow-auto">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-base font-semibold text-lynx-blue-400">
          Notifications
        </h1>
        <button
          aria-label="Close Notification Panel"
          onClick={() => setIsOpen(false)}
          className="text-gray-500"
        >
          <Image
            src="/assets/image/cross.png"
            alt="Close"
            width={24}
            height={24}
          />
        </button>
      </div>

      {(notifications?.length || 0) > 0 ? (
        <div className="space-y-4">
          {notifications?.map(
            ({ id, type, title, message, createdAt, status, refId }) => (
              <div
                key={id}
                className="p-3 border-b border-gray-200 bg-[#F6FAFF]"
              >
                <div className="flex items-start gap-3">
                  <Image
                    src={"/assets/image/accepted.png"}
                    alt={type}
                    width={24}
                    height={24}
                  />
                  <div>
                    <h1 className="font-semibold text-sm text-lynx-blue-400">
                      {title}
                    </h1>
                    <p
                      className="font-normal text-sm text-lynx-grey-700"
                      dangerouslySetInnerHTML={{ __html: message }}
                    />
                    {status !== "admin" && (
                      <Link
                        href={
                          type === "newJobAdded"
                            ? `/jobs?jobId=${refId}`
                            : type === "facility"
                            ? `/facility?facility=${refId}`
                            : type === "health" ? `/health-care?health=${refId}` : '#'
                        }
                        className="text-sm font-normal text-lynx-blue-100 my-2"
                        onClick={() => setIsOpen(false)}
                      >
                        View Details
                      </Link>
                    )}
                    <p className="text-sm font-normal text-[#A0A0A0]">
                      {formatDate(createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <h1 className="px-4 pb-6">Data is empty</h1>
      )}
    </div>
  );
};

export default NotificationPanel;
