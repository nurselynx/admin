import { fetchData } from "@/helper/dataFetch";
import { cookies } from "next/headers";
import { ADMIN_FACILITIES } from "@/constants/api";
import DashboardFacilityLayout from "@/components/dashboard/admin/facilityAdmin";

export default async function page({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  const facility = params?.facility ? Number(params.facility) : null;
  const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value || "";
  const getData = await fetchData(`${apiBaseURL}${ADMIN_FACILITIES}`, token);
  if (!getData) {
    return <div>Failed to fetch data</div>;
  }
  const data =
    facility === null
      ? getData?.items
      : getData?.items?.filter((item: any) => item?.facilityId === facility);

  return <DashboardFacilityLayout facilityData={data} />;
}
