// helper/dataFetch.js
import { deleteCookie } from "cookies-next";
export async function fetchData(url: string, token: any) {
  try {
    const response: any = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!response?.ok) {
      console.log("Filed to fetch data");
    }
    if (response?.statusText?.includes("Unauthorized")) {
      ["authToken", "dataUser", "refreshToken", "forgetUserEmail"].forEach(
        (cookieKey) => {
          deleteCookie(cookieKey);
        }
      );
      window.location.href = "/";
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
