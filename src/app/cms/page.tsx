import CMSInformation from '@/components/cms'
import { fetchData } from "@/helper/dataFetch";
import { cookies } from "next/headers";
import { GET_LANDING_DETAILS } from "@/constants/api";

export default async function page() {
  const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value || '';
  const getData = await fetchData(`${apiBaseURL}${GET_LANDING_DETAILS}`, token);
  if (!getData) {
    return <div>Failed to fetch data</div>;
  }
  return (
     <CMSInformation getData={getData}/>
  )
}
