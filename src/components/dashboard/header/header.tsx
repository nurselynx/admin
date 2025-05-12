"use client";
import { useState, useEffect } from "react";
import { deleteCookie, getCookie } from "cookies-next";
import Link from "next/link";
import Image from "next/image";
import {
  mainLogo,
  bellIcon,
} from "../../../../public/assets/svgIcons/svgIcons";
import { decryptData } from "@/helper/dataEncrypt";
import { getMessaging, onMessage } from "firebase/messaging";
import useFcmToken from "@/components/firebase/useFcmToken";
import firebaseApp from "@/components/firebase/firebase";
import { GET_NOTIFICATION } from "@/constants/api";
import axios from "axios";
import NotificationPanel from "../notificationPanel/notificationPanel";
import UseTokenRefresher from "./useTokenRefresher";
const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
export default function Header() {
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
  const cookieValue: any = getCookie("dataUser");
  const userData = cookieValue ? JSON.parse(cookieValue) : null;
  const [isNotificationsNew, setIsNotificationsNew] = useState(false);
  const [notifications, setDataNotifications] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { fcmToken: token } = useFcmToken();
  const fetchNotificationData = async () => {
    try {
      const response = await axios.get(`${apiBaseURL}${GET_NOTIFICATION}`, {
        headers: {
          Authorization: getCookie("authToken") as string, // Ensure it's a string
        },
      });
      return setDataNotifications(response?.data?.items);
    } catch (err) {
      ["authToken", "dataUser", "refreshToken", "forgetUserEmail"].forEach(
        (cookieKey) => {
          deleteCookie(cookieKey);
        }
      );
      console.error(err); // Add error handling
      return null;
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const messaging = getMessaging(firebaseApp);
      const unsubscribe = onMessage(messaging, (payload) => {
        if (payload?.notification?.title) {
          setIsNotificationsNew(true);
        }
      });
      return () => {
        unsubscribe(); // Unsubscribe from the onMessage event
      };
    }
  }, []);

  return (
    <>
      <UseTokenRefresher />
      <header className="w-full h-16 flex items-center justify-between px-6 bg-[#9153A1]">
        <div className="flex justify-between items-center w-full md:hidden">
          <div className="flex justify-center w-full">
            <div className="h-8 w-auto mb-8 mt-2">
              <Link href="/">
                <Image
                  src="/assets/image/nurse_logo.png"
                  alt="nurse_logo"
                  width={110}
                  height={82}
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-4 ml-auto">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => {
                setIsOpen(true);
                setIsNotificationsNew(false);
                fetchNotificationData();
              }}
              aria-label="Notifications"
              className="text-gray-500 relative hidden"
            >
              {bellIcon}
              {isNotificationsNew && (
                <span className=" bg-red-500 h-3 w-3 rounded-full absolute top-0 right-0"></span>
              )}
            </button>
            <Image
              src="/assets/image/profileIcon.png"
              alt="Profile Icon"
              className="w-8 h-8 rounded-full"
              width={32}
              height={32}
            />
            <p className="text-sm font-medium text-white">
              {decryptData(userData?.fullName, secretKey)}
            </p>
          </div>
        </div>
      </header>
      <NotificationPanel notifications={notifications} />
    </>
  );
}
