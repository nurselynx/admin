import { useEffect } from "react";
import { setCookie, getCookie } from "cookies-next";
import { REFRESH_TOKEN } from "@/constants/api";
import axios from "axios";

const REFRESH_INTERVAL = (23 * 60 + 55) * 60 * 1000; // 23 hours 55 minutes in milliseconds
const inThirtyDays = new Date();
inThirtyDays.setDate(inThirtyDays?.getDate() + 30);
const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
const getRefreshToken:any = getCookie("refreshToken");
const UseTokenRefresher = () => {
  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const response = await axios.get(`${apiBaseURL}${REFRESH_TOKEN}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: getRefreshToken,
          },
        });
        if (response.data?.accessToken) {
          setCookie("authToken", response?.data?.accessToken, {
            expires: inThirtyDays,
          });
          console.log(response.data?.accessToken, 'response.data?.accessToken')
        //   location.reload();
          console.log("Token refreshed successfully");
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    };

    // Refresh token every 23 hours 55 minutes
    const interval = setTimeout(refreshAccessToken, REFRESH_INTERVAL);

    return () => clearTimeout(interval); // Cleanup function
  }, []);

  return null;
};

export default UseTokenRefresher;
