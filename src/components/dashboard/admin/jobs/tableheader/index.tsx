import React from "react";
import { useRouter } from "next/navigation";

const TableHeader: React.FC<{
  tabs: string[];
  onTabChange: (tab: string) => void;
  activeTab: string;
  icons?: React.ReactNode;
  setCurrentPage?: any;
  isTabCheck?: boolean;
  link?: string;
  setSearchQuery?: any;
}> = ({
  tabs,
  onTabChange,
  activeTab,
  icons,
  setCurrentPage,
  isTabCheck,
  link,
  setSearchQuery,
}) => {
  const router = useRouter();

  const handleTabClick = (tab: string) => {
    onTabChange(tab);
    setSearchQuery?.("");
    setCurrentPage?.(1);
    if (isTabCheck && setCurrentPage) {
      setCurrentPage(1);
    }
    const activeTab =
      tab === "Staffing Needs"
        ? "staff"
        : tab === "Home Care (Non-Medical)"
        ? "non-medical"
        : "medical";
    const query = new URLSearchParams({ activeTab }).toString();
    link && router.push(`${link}?${query}`);
  };

  return (
    <div className="flex w-full bg-white h-16 border-b-2 border-b-lynx-grey-1800  rounded-t-3xl justify-between md:justify-start xl:whitespace-pre custom-scrollbar xl:overflow-x-auto">
      <div className="flex space-x-4">
        {tabs?.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-4 py-2 text-base font-medium ${
              activeTab === tab
                ? "text-lynx-blue-100 border-b-2 border-lynx-blue-100 font-semibold"
                : "text-[#1A1A1A] font-normal"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex justify-between items-end cursor-pointer ml-auto">
        {icons}
      </div>
    </div>
  );
};

export default TableHeader;
