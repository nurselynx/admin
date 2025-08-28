import { fetchData } from "@/helper/dataFetch";
import { cookies } from "next/headers";
import { GET_REPORTS } from "@/constants/api";
import Reports from "@/components/dashboard/admin/reports";

export default async function Page({ searchParams }: { searchParams: any }) {
  const startDate = Array.isArray(searchParams?.startDate)
    ? searchParams.startDate[0]
    : searchParams?.startDate;

  const endDate = Array.isArray(searchParams?.endDate)
    ? searchParams.endDate[0]
    : searchParams?.endDate;

  // Build query params only if they exist
  const queryParams = new URLSearchParams();
  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);

  const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value || "";
  const getReport = await fetchData(
    `${apiBaseURL}${GET_REPORTS}?${queryParams.toString()}`,
    token
  );

  return <Reports getData={getReport?.items ?? []} />;
}
