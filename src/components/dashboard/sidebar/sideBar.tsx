"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteCookie } from "cookies-next";
import Image from "next/image";
import {
  dashboardSelected,
  availableJobs,
  signOut,
  hamBurger,
  myJobs,
  bellIcon,
  clientHistoryIcon,
} from "../../../../public/assets/svgIcons/svgIcons";
import { decryptData } from "@/helper/dataEncrypt";
import { usePathname } from "next/navigation";

// Define types for the user data
type UserData = {
  id: number;
  fullName: string; // Encrypted full name
  email: string;
  password: string; // Hashed password
  resetPasswordToken: string | null;
  resetPasswordExpires: string | null;
  primaryNumber: string; // Encrypted primary number
  isVerified: boolean | null;
  role: "healthcare_professional" | "facility_manager" | "admin";
  isDeleted: 0 | 1;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

type SidebarProps = {
  userData: UserData;
};

const navItems = [
  { href: "/dashboard", icon: dashboardSelected, label: "Dashboard" },
  { href: "/health-care", icon: availableJobs, label: "Health-care" },
  { href: "/facility", icon: availableJobs, label: "Organization" },
  { href: "/jobs", icon: myJobs, label: "Jobs" },
  { href: "/reports", icon: availableJobs, label: "Reports" },
  { href: "/cms", icon: dashboardSelected, label: "CMS" },
  { href: "/notification", icon: bellIcon, label: "Notifications" },
  {
    href: "/client-history",
    icon: clientHistoryIcon,
    label: "Client History",
  },
];

export default function Sidebar({ userData }: SidebarProps) {
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const getActiveRoute = () => {
    if (!pathname) return "/dashboard";
    const lastSegment = pathname.split("/").filter(Boolean).pop();
    return (
      navItems.find(
        (item) => item.href.split("/").filter(Boolean).pop() === lastSegment
      )?.href ||
      navItems[0]?.href ||
      "/dashboard"
    );
  };

  const activeRoute = getActiveRoute();

  const renderNavItems = () =>
    navItems.map(({ href, icon, label }) => (
      <li key={href}>
        <Link href={href}>
          <p
            className={`flex items-center px-6 py-3 gap-2 font-normal hover:bg-white hover:text-lynx-blue-100 hover:font-semibold ${
              activeRoute === href
                ? "bg-white text-lynx-blue-100 font-semibold"
                : "text-white"
            }`}
          >
            {icon}
            {label}
          </p>
        </Link>
      </li>
    ));

  const handleSignOut = () => {
    ["authToken", "dataUser", "refreshToken"]?.forEach((cookieKey) => {
      deleteCookie(cookieKey); // Pass only the key
    });
    window.location.href = "/";
  };

  const decryptedFullName =
    userData?.fullName && secretKey
      ? decryptData(userData.fullName, secretKey)
      : "Anonymous User";

  return (
    <div className="overflow-auto">
      <button
        className="md:hidden p-4 text-lynx-blue-100 absolute left-0 top-0"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
        aria-expanded={isOpen}
        aria-controls="sidebar"
      >
        {hamBurger}
      </button>

      <div
        id="sidebar"
        className={`fixed h-screen bg-[#9153A1] flex flex-col w-64 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="hidden md:flex items-center px-6 py-4">
          <Link href="/dashboard">
            <Image
              src="/assets/image/nurse_logo.png"
              alt="nurse_logo"
              width={160}
              height={82}
            />
          </Link>
        </div>
        <div className="flex items-center px-6 py-4 md:hidden mb-2">
          <Image
            src="/assets/image/profileIcon.png"
            alt="Profile Picture"
            className="w-12 h-12 rounded-full"
            width={60}
            height={60}
          />
          <div className="ml-4">
            <p className="text-lynx-grey-1100 font-medium">
              {decryptedFullName}
            </p>
          </div>
        </div>
        <nav className="flex-grow">
          <ul>{renderNavItems()}</ul>
        </nav>
        <div className="px-6 py-4">
          <button
            onClick={handleSignOut}
            type="button"
            className="flex items-center text-white gap-2 mb-8 bg-transparent border-none"
          >
            {signOut}
            Sign Out
          </button>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}
