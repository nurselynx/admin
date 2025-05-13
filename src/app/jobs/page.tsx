import { fetchData } from "@/helper/dataFetch";
import { cookies } from "next/headers";
import {
  GET_MEDICAL_JOBS,
  GET_NON_MEDICAL_JOB,
  GET_STAFFING_JOB,
} from "@/constants/api";
import DashboardJobsLayout from "@/components/dashboard/admin/jobs";

export default async function page({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  const jobId = params?.jobId ? Number(params.jobId) : null;
  const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value || "";
  const getMedicalData = await fetchData(
    `${apiBaseURL}${GET_MEDICAL_JOBS}`,
    token
  );

  const getNonMedicalData = await fetchData(
    `${apiBaseURL}${GET_NON_MEDICAL_JOB}`,
    token
  );

  const getStaffData = await fetchData(
    `${apiBaseURL}${GET_STAFFING_JOB}`,
    token
  );

  const filterJobData = (data: any, jobId: number | null) => {
    return jobId === null
      ? data?.items
      : data?.items?.filter((item: any) => item?.id === jobId);
  };

  const getMedical = filterJobData(getMedicalData, jobId);
  const getNonMedical = filterJobData(getNonMedicalData, jobId);
  const getStaff = filterJobData(getStaffData, jobId);

  return (
    <DashboardJobsLayout
      getMedicalData={getMedical}
      getNonMedicalData={getNonMedical}
      getStaffData={getStaff}
    />
  );
}
