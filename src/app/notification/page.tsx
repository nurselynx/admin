import { fetchData } from "@/helper/dataFetch";
import { cookies } from "next/headers";
import { GET_NOTIFICATION } from "@/constants/api";
import NotificationPanel from "@/components/dashboard/notificationPanel/notificationPanel";

export default async function page() {
  const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value || "";
  const getData = await fetchData(`${apiBaseURL}${GET_NOTIFICATION}`, token);
  if (!getData) {
    return <div>Failed to fetch data</div>;
  }
  return <NotificationPanel notifications={getData?.items} />;
}
