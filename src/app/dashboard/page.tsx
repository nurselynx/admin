import React from "react";
import Image from 'next/image';
import { fetchData } from "@/helper/dataFetch";
import { cookies } from "next/headers";
import { GET_DASHBOARD } from "@/constants/api";

// Define the data structure using a TypeScript interface
interface DashboardCard {
  title: string;
  value: string | number;
  image: string;
}

const DashboardPage: React.FC = async () => {
  const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value || "";
  const getData = await fetchData(`${apiBaseURL}${GET_DASHBOARD}`, token);
  if (!getData) {
    return <div>Failed to fetch data</div>;
  }
  const dashboardData: DashboardCard[] = [
    {
      title: "Registered Healthcare Professionals",
      value: getData?.item?.totalHealth?.count || 0,
      image: "/assets/image/facility_managers.png",
    },
    {
      title: "Registered Organization Managers",
      value: getData?.item?.totalFacility?.count || 0,
      image: "/assets/image/facility_managers.png",
    },
    {
      title: "Pending Approvals for Organization Certifications",
      value: getData?.item?.isFacilityApproval?.count || 0,
      image: "/assets/image/approvals.png",
    },
    {
      title: "Pending Approvals for Health Certifications",
      value: getData?.item?.isHealthApproval?.count || 0,
      image: "/assets/image/approvals.png",
    },
  ];

  return (
    <div className=" m-0 md:p-6">
      <div className="p-6 bg-white font-medium text-lg rounded-t-3xl">
        <h2 className="mb-5">Dashboard</h2>
        <div className="grid md:grid-cols-2 gap-3 grid-cols-1">
          {dashboardData?.map((card, index) => (
            <div
              key={index}
              className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 "
            >
          <div className=" flex items-start justify-between gap-6">
              <h5 className="mb-2 text-base font-bold tracking-tight text-lynx-blue-100">
                {card.title}
              </h5>
              <Image width={50} height={50} src={card?.image} alt={card.title}/>
              </div>
              <p className="font-semibold text-gray-700 text-sm">
                {card?.value} User{card.value !== 1 ? "s" : ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
