import { fetchData } from "@/helper/dataFetch";
import { cookies } from "next/headers";
import { ADMIN_HEALTHCARE } from "@/constants/api";
import DashboardAdminLayout from "@/components/dashboard/admin";

export default async function page({ searchParams }: { searchParams: any }) {
  // Await searchParams to resolve it before using its properties
  const params = await searchParams;

  // Access and convert health value
  const health = params?.health ? Number(params.health) : null;
  const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value || "";

  const getData = await fetchData(`${apiBaseURL}${ADMIN_HEALTHCARE}`, token);

  if (!getData) {
    return <div>Failed to fetch data</div>;
  }

  const data =
    health === null
      ? getData?.items
      : getData?.items?.filter((item: any) => item?.healthcareId === health);

  return <DashboardAdminLayout healthData={data} />;
}
