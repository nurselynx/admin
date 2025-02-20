import { fetchData } from "@/helper/dataFetch";
import { cookies } from "next/headers";
import { GET_ALL_JOBS } from "@/constants/api";
import DashboardJobsLayout from "@/components/dashboard/admin/jobs";

export default async function page({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  const jobId = params?.jobId ? Number(params.jobId) : null;
  const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value || '';
  const getData = await fetchData(`${apiBaseURL}${GET_ALL_JOBS}`, token);
  if (!getData) {
    return <div>Failed to fetch data</div>;
  }
  const data =
  jobId === null
    ? getData?.items
    : getData?.items?.filter((item: any) => item?.id === jobId);
  return <DashboardJobsLayout data={data}  />;
}