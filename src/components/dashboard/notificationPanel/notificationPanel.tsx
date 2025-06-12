import React from "react";
import Image from "next/image";
import Link from "next/link";

type Notification = {
  id: number;
  message: string;
  title: string;
  createdAt: string;
  type: string; // Narrowed types for better type safety
  status: string;
  refId?: string;
  date?: string;
};

type NotificationPanelProps = {
  notifications: Notification[] | null;
};

const getStatusIcon = (status: Notification["status"]) => {
  const icons: Record<Notification["status"], string> = {
    accepted: "/assets/image/accepted.png",
    payment: "/assets/image/payment.png",
    cancelled: "/assets/image/cancelled.png",
    shiftreminder: "/assets/image/accepted.png",
    jobopportunity: "/assets/image/accepted.png",
  };
  return icons[status?.toLowerCase()?.trim()] || "/assets/image/accepted.png";
};

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
}) => {
  return (
    <div className=" bg-white rounded-2xl m-0 md:6  mx-0 md:mx-4">
      {(notifications?.length || 0) > 0 ? (
        <div className="space-y-4 bg-white p-4 max-h-[700px] overflow-y-auto custom-scrollbar">
          {notifications?.map(
            ({ id, type, title, message, status, refId, date }) => (
              <div
                key={id}
                className="p-3 border-b border-gray-200 bg-[#F6FAFF]"
              >
                <div className="flex items-start gap-3">
                  <Image
                    src={getStatusIcon(type)}
                    alt={type}
                    width={24}
                    height={24}
                  />
                  <div className=" xl:w-72">
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
                          type === "newJobAdded" || type === "shiftReminder"
                            ? `/jobs?jobId=${refId}`
                            : type === "facility"
                            ? `/facility?facility=${refId}`
                            : type === "health"
                            ? `/health-care?health=${refId}`
                            : "#"
                        }
                        className="text-sm font-normal text-lynx-blue-100 my-2"
                      >
                        View Details
                      </Link>
                    )}
                    <p className="text-sm font-normal text-[#A0A0A0]">{date}</p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default NotificationPanel;
